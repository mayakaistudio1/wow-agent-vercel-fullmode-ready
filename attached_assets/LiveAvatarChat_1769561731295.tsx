/**
 * LiveAvatarChat Component - Universal Template
 * 
 * Универсальный компонент для интеграции HeyGen LiveAvatar в ваши проекты.
 * Поддерживает полноэкранный видеозвонок с AI-аватаром с автоматическим управлением микрофоном.
 * 
 * @version 1.0.0
 * @author Based on goodwinteam architecture
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, VideoOff, Mic, MicOff, X, Loader2, Phone, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Room,
  RoomEvent,
  Track,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  ConnectionState,
  Participant,
  DataPacket_Kind,
} from "livekit-client";

// ============================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// ============================================

interface LiveAvatarChatProps {
  /** Показывать ли компонент */
  isOpen: boolean;
  /** Callback при закрытии */
  onClose: () => void;
  /** Язык аватара (например: 'ru', 'en', 'de') */
  language?: string;
  /** Дополнительные CSS классы */
  className?: string;
  /** Контекст/направление для передачи на сервер (опционально) */
  context?: string;
  /** Конфигурация UI */
  config?: LiveAvatarConfig;
}

interface LiveAvatarConfig {
  /** Имя аватара для отображения */
  avatarName?: string;
  /** Инициалы для аватара */
  avatarInitials?: string;
  /** Цвета градиента аватара */
  avatarGradient?: string;
  /** Текст кнопки старта */
  startButtonText?: string;
  /** Текст при подключении */
  connectingText?: string;
  /** Текст при ожидании */
  waitingText?: string;
  /** Текст при завершении */
  endedTitle?: string;
  /** Текст описания при завершении */
  endedDescription?: string;
  /** Показывать ли индикатор "аватар говорит" */
  showSpeakingIndicator?: boolean;
  /** Показывать ли индикатор "ваш ход" */
  showYourTurnIndicator?: boolean;
  /** Callback при завершении сессии */
  onSessionEnd?: (sessionId: string, duration: number) => void;
}

type SessionState = "idle" | "connecting" | "waiting_avatar" | "connected" | "error" | "ended";

// ============================================
// КОНФИГУРАЦИЯ ПО УМОЛЧАНИЮ
// ============================================

const DEFAULT_CONFIG: Required<LiveAvatarConfig> = {
  avatarName: "AI Assistant",
  avatarInitials: "AI",
  avatarGradient: "from-purple-500 to-pink-500",
  startButtonText: "Start Call",
  connectingText: "Connecting...",
  waitingText: "Waiting for avatar...",
  endedTitle: "Call Ended",
  endedDescription: "Thank you for the conversation!",
  showSpeakingIndicator: true,
  showYourTurnIndicator: true,
  onSessionEnd: () => {},
};

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================

export function LiveAvatarChat({
  isOpen,
  onClose,
  language = "en",
  className,
  context,
  config: userConfig,
}: LiveAvatarChatProps) {
  // Объединяем пользовательскую конфигурацию с дефолтной
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  // ============================================
  // STATE
  // ============================================
  
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [isMuted, setIsMuted] = useState(true);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  
  // ============================================
  // REFS
  // ============================================
  
  const sessionStartTimeRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContainerRef = useRef<HTMLDivElement>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const roomRef = useRef<Room | null>(null);
  const sessionDataRef = useRef<{
    sessionId: string;
    sessionToken: string;
  } | null>(null);

  // ============================================
  // ОБРАБОТЧИКИ LIVEKIT СОБЫТИЙ
  // ============================================

  /**
   * Обработка подписки на трек (видео или аудио)
   */
  const handleTrackSubscribed = useCallback(
    (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log("Track subscribed:", track.kind, "from:", participant.identity);
      setSessionState("connected");
      
      if (track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
        console.log("Video track attached to video element");
      } else if (track.kind === Track.Kind.Audio && audioContainerRef.current) {
        const trackId = `${participant.identity}-${track.sid}`;
        
        let audioEl = audioElementsRef.current.get(trackId);
        if (!audioEl) {
          audioEl = document.createElement("audio");
          audioEl.autoplay = true;
          audioEl.setAttribute("playsinline", "true");
          audioEl.id = trackId;
          audioContainerRef.current.appendChild(audioEl);
          audioElementsRef.current.set(trackId, audioEl);
          console.log("Created new audio element for:", trackId);
        }
        
        track.attach(audioEl);
        console.log("Audio track attached for:", trackId);
        
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio autoplay succeeded for:", trackId);
              setAudioUnlocked(true);
            })
            .catch((err) => {
              console.log("Audio autoplay blocked for:", trackId, err.message);
              setShowUnlockPrompt(true);
            });
        }
      }
    },
    []
  );

  /**
   * Обработка отписки от трека
   */
  const handleTrackUnsubscribed = useCallback(
    (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      track.detach();
      
      if (track.kind === Track.Kind.Audio) {
        const trackId = `${participant.identity}-${track.sid}`;
        const audioEl = audioElementsRef.current.get(trackId);
        if (audioEl) {
          audioEl.remove();
          audioElementsRef.current.delete(trackId);
          console.log("Removed audio element for:", trackId);
        }
      }
    },
    []
  );

  /**
   * Обработка отключения от комнаты
   */
  const handleDisconnected = useCallback(() => {
    console.log("Room disconnected");
    setSessionState("idle");
  }, []);

  /**
   * Обработка изменения состояния подключения
   */
  const handleConnectionStateChanged = useCallback((state: ConnectionState) => {
    console.log("Connection state changed:", state);
    if (state === ConnectionState.Disconnected) {
      setSessionState("idle");
    }
  }, []);

  /**
   * Обработка подключения участника
   */
  const handleParticipantConnected = useCallback((participant: RemoteParticipant) => {
    console.log("Participant connected:", participant.identity);
    setSessionState("connected");
    
    participant.trackPublications.forEach((publication) => {
      if (publication.track && publication.isSubscribed) {
        if (publication.track.kind === Track.Kind.Video && videoRef.current) {
          publication.track.attach(videoRef.current);
        } else if (publication.track.kind === Track.Kind.Audio && audioContainerRef.current) {
          const track = publication.track;
          const trackId = `${participant.identity}-${track.sid}`;
          
          let audioEl = audioElementsRef.current.get(trackId);
          if (!audioEl) {
            audioEl = document.createElement("audio");
            audioEl.autoplay = true;
            audioEl.setAttribute("playsinline", "true");
            audioEl.id = trackId;
            audioContainerRef.current.appendChild(audioEl);
            audioElementsRef.current.set(trackId, audioEl);
          }
          
          track.attach(audioEl);
          
          const playPromise = audioEl.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Audio autoplay succeeded (participant connected):", trackId);
                setAudioUnlocked(true);
              })
              .catch((err) => {
                console.log("Audio autoplay blocked (participant connected):", trackId, err.message);
                setShowUnlockPrompt(true);
              });
          }
        }
      }
    });
  }, []);

  /**
   * Обработка получения данных (события от HeyGen API)
   * ОСНОВНОЙ МЕХАНИЗМ управления микрофоном
   */
  const handleDataReceived = useCallback(
    (payload: Uint8Array, participant?: RemoteParticipant, kind?: DataPacket_Kind) => {
      try {
        const message = new TextDecoder().decode(payload);
        console.log("Data received:", message, "from:", participant?.identity);
        
        const data = JSON.parse(message);
        
        // Аватар начал говорить - выключаем микрофон пользователя
        if (data.type === "avatar_start_talking" || data.type === "agent_start_talking") {
          console.log("Avatar started talking - muting user");
          setIsAvatarSpeaking(true);
          if (roomRef.current) {
            roomRef.current.localParticipant.setMicrophoneEnabled(false);
            setIsMuted(true);
          }
        } 
        // Аватар закончил говорить - включаем микрофон пользователя
        else if (data.type === "avatar_stop_talking" || data.type === "agent_stop_talking") {
          console.log("Avatar stopped talking - unmuting user");
          setIsAvatarSpeaking(false);
          if (roomRef.current) {
            roomRef.current.localParticipant.setMicrophoneEnabled(true);
            setIsMuted(false);
          }
        }
      } catch (e) {
        console.log("Non-JSON data received");
      }
    },
    []
  );

  /**
   * Обработка изменения активных говорящих (РЕЗЕРВНЫЙ МЕХАНИЗМ)
   * Срабатывает если события от HeyGen API не приходят
   */
  const handleActiveSpeakersChanged = useCallback(
    (speakers: Participant[]) => {
      if (!roomRef.current) return;
      
      const localIdentity = roomRef.current.localParticipant.identity;
      const avatarIsSpeaking = speakers.some(
        (speaker) => speaker.identity !== localIdentity
      );
      
      console.log("Active speakers changed, avatar speaking:", avatarIsSpeaking);
      
      setIsAvatarSpeaking((prevSpeaking) => {
        if (avatarIsSpeaking && !prevSpeaking) {
          console.log("Avatar started speaking (via ActiveSpeakers) - muting user mic");
          if (roomRef.current) {
            roomRef.current.localParticipant.setMicrophoneEnabled(false);
            setIsMuted(true);
          }
          return true;
        } else if (!avatarIsSpeaking && prevSpeaking) {
          console.log("Avatar stopped speaking (via ActiveSpeakers) - unmuting user mic");
          if (roomRef.current) {
            roomRef.current.localParticipant.setMicrophoneEnabled(true);
            setIsMuted(false);
          }
          return false;
        }
        return prevSpeaking;
      });
    },
    []
  );

  // ============================================
  // УПРАВЛЕНИЕ СЕССИЕЙ
  // ============================================

  /**
   * Запуск сессии с LiveAvatar
   */
  const startSession = useCallback(async () => {
    if (sessionState === "connecting" || sessionState === "connected") {
      return;
    }
    
    try {
      setSessionState("connecting");
      setError(null);

      // Шаг 1: Получить токен сессии от вашего сервера
      const tokenRes = await fetch("/api/liveavatar/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, context }),
      });

      if (!tokenRes.ok) {
        const errData = await tokenRes.json();
        throw new Error(errData.details || "Failed to get session token");
      }

      const tokenData = await tokenRes.json();
      sessionDataRef.current = {
        sessionId: tokenData.session_id,
        sessionToken: tokenData.session_token,
      };
      sessionStartTimeRef.current = Date.now();

      // Шаг 2: Сохранить сессию в БД (опционально)
      fetch("/api/liveavatar/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: tokenData.session_id,
          context,
        }),
      }).catch(console.error);

      // Шаг 3: Запустить LiveAvatar сессию
      const startRes = await fetch("/api/liveavatar/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_token: tokenData.session_token }),
      });

      if (!startRes.ok) {
        const errData = await startRes.json();
        throw new Error(errData.details || "Failed to start session");
      }

      const startData = await startRes.json();
      const { livekit_url, livekit_client_token } = startData.data || startData;

      if (!livekit_url || !livekit_client_token) {
        throw new Error("Missing LiveKit connection data");
      }

      // Шаг 4: Подключиться к LiveKit комнате
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Регистрация всех обработчиков событий
      room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.on(RoomEvent.Disconnected, handleDisconnected);
      room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
      room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.on(RoomEvent.DataReceived, handleDataReceived);
      room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);

      await room.connect(livekit_url, livekit_client_token);
      
      // Изначально микрофон выключен - аватар говорит первым
      await room.localParticipant.setMicrophoneEnabled(false);
      setIsMuted(true);

      roomRef.current = room;
      
      // Проверка наличия удаленных участников
      const hasRemoteParticipants = room.remoteParticipants.size > 0;
      if (hasRemoteParticipants) {
        room.remoteParticipants.forEach((participant) => {
          participant.trackPublications.forEach((publication) => {
            if (publication.track && publication.isSubscribed) {
              handleTrackSubscribed(
                publication.track as RemoteTrack,
                publication as RemoteTrackPublication,
                participant
              );
            }
          });
        });
        setSessionState("connected");
      } else {
        setSessionState("waiting_avatar");
      }

    } catch (err: any) {
      console.error("LiveAvatar session error:", err);
      setError(err.message || "Connection failed");
      setSessionState("error");
    }
  }, [language, context, sessionState, handleTrackSubscribed, handleTrackUnsubscribed, 
      handleDisconnected, handleConnectionStateChanged, handleParticipantConnected, 
      handleDataReceived, handleActiveSpeakersChanged]);

  /**
   * Остановка сессии
   */
  const stopSession = useCallback(async (showEnded: boolean = true) => {
    const sessionId = sessionDataRef.current?.sessionId;
    const duration = sessionStartTimeRef.current 
      ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000) 
      : 0;

    try {
      // Отключение от LiveKit
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }

      // Остановка LiveAvatar сессии на сервере
      if (sessionDataRef.current) {
        await fetch("/api/liveavatar/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionDataRef.current.sessionId,
            session_token: sessionDataRef.current.sessionToken,
          }),
        });
        
        // Сохранение завершения сессии в БД
        if (sessionId) {
          fetch(`/api/liveavatar/sessions/${sessionId}/end`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ duration }),
          }).catch(console.error);
        }
        
        sessionDataRef.current = null;
      }

      // Callback при завершении
      if (sessionId && config.onSessionEnd) {
        config.onSessionEnd(sessionId, duration);
      }
    } catch (err) {
      console.error("Error stopping session:", err);
    } finally {
      // Очистка аудио элементов
      audioElementsRef.current.forEach((audioEl) => {
        audioEl.remove();
      });
      audioElementsRef.current.clear();
      
      // Сброс состояния
      setSessionState(showEnded ? "ended" : "idle");
      setAudioUnlocked(false);
      setShowUnlockPrompt(false);
      setIsAvatarSpeaking(false);
      setIsMuted(true);
      sessionStartTimeRef.current = 0;
    }
  }, [config]);

  /**
   * Разблокировка аудио (для браузеров с autoplay policy)
   */
  const unlockAudio = useCallback(async () => {
    const audioElements = audioElementsRef.current;
    if (audioElements.size === 0) {
      console.log("No audio elements to unlock");
      return;
    }
    
    try {
      const playPromises: Promise<void>[] = [];
      audioElements.forEach((audioEl, id) => {
        audioEl.muted = false;
        console.log("Unlocking audio for:", id);
        playPromises.push(audioEl.play());
      });
      
      await Promise.all(playPromises);
      setAudioUnlocked(true);
      setShowUnlockPrompt(false);
      console.log("All audio elements unlocked successfully");
    } catch (err) {
      console.error("Failed to unlock audio:", err);
      setShowUnlockPrompt(true);
    }
  }, []);

  /**
   * Переключение микрофона (mute/unmute)
   */
  const toggleMute = useCallback(async () => {
    if (isAvatarSpeaking) {
      console.log("Cannot toggle mute while avatar is speaking");
      return;
    }
    
    if (roomRef.current) {
      const newMuteState = !isMuted;
      await roomRef.current.localParticipant.setMicrophoneEnabled(!newMuteState);
      setIsMuted(newMuteState);
    }
  }, [isMuted, isAvatarSpeaking]);

  /**
   * Закрытие компонента
   */
  const handleClose = useCallback(() => {
    stopSession(false);
    onClose();
  }, [stopSession, onClose]);

  // ============================================
  // EFFECTS
  // ============================================

  /**
   * Cleanup при размонтировании компонента
   */
  useEffect(() => {
    return () => {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }
      if (sessionDataRef.current) {
        fetch("/api/liveavatar/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionDataRef.current.sessionId,
            session_token: sessionDataRef.current.sessionToken,
          }),
        }).catch(console.error);
        sessionDataRef.current = null;
      }
    };
  }, []);

  // ============================================
  // RENDER
  // ============================================

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-50 bg-black/90 flex flex-col overflow-hidden",
          "max-h-[100dvh]",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center",
              config.avatarGradient
            )}>
              <span className="text-white font-bold text-sm">{config.avatarInitials}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">{config.avatarName}</h3>
              <p className="text-white/60 text-xs">
                {sessionState === "connected" ? "Online" : 
                 sessionState === "connecting" ? config.connectingText :
                 sessionState === "waiting_avatar" ? config.waitingText :
                 "Click to call"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            data-testid="button-close-avatar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Idle State */}
          {sessionState === "idle" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className={cn(
                "w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br flex items-center justify-center",
                config.avatarGradient
              )}>
                <Video className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-white text-xl font-semibold mb-2">
                Video Call with {config.avatarName}
              </h2>
              <p className="text-white/60 text-sm mb-6 max-w-xs mx-auto">
                Click the button below to start a conversation with AI assistant
              </p>
              <button
                onClick={startSession}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold flex items-center gap-3 mx-auto hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/30"
                data-testid="button-start-call"
              >
                <Phone className="w-5 h-5" />
                {config.startButtonText}
              </button>
            </motion.div>
          )}

          {/* Connecting State */}
          {sessionState === "connecting" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <Loader2 className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-white text-lg">{config.connectingText}</p>
              <p className="text-white/60 text-sm mt-2">Please wait</p>
            </motion.div>
          )}

          {/* Waiting Avatar State */}
          {sessionState === "waiting_avatar" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className={cn(
                  "absolute inset-0 rounded-full bg-gradient-to-br animate-pulse",
                  config.avatarGradient
                )} />
                <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
                  <Video className="w-8 h-8 text-white" />
                </div>
              </div>
              <p className="text-white text-lg">{config.waitingText}</p>
              <p className="text-white/60 text-sm mt-2">Avatar is connecting, this may take a few seconds</p>
            </motion.div>
          )}

          {/* Error State */}
          {sessionState === "error" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-white text-lg mb-2">Connection Error</p>
              <p className="text-white/60 text-sm mb-4 max-w-xs mx-auto">{error}</p>
              <button
                onClick={startSession}
                className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                data-testid="button-retry-call"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Connected State - Video */}
          {sessionState === "connected" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full max-h-[calc(100dvh-120px)] overflow-hidden flex items-center justify-center"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full max-h-[calc(100dvh-120px)] object-cover"
                data-testid="video-avatar"
              />
              <div 
                ref={audioContainerRef} 
                className="hidden"
                data-testid="audio-container"
              />
            </motion.div>
          )}

          {/* Ended State */}
          {sessionState === "ended" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center px-6"
            >
              <div className={cn(
                "w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br flex items-center justify-center",
                config.avatarGradient
              )}>
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-white text-2xl font-semibold mb-2">
                {config.endedTitle}
              </h2>
              <p className="text-white/70 text-sm mb-8 max-w-xs mx-auto">
                {config.endedDescription}
              </p>
              
              <button
                onClick={() => setSessionState("idle")}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
              >
                New Call
              </button>
            </motion.div>
          )}
        </div>

        {/* Audio Unlock Prompt (Overlay) */}
        {showUnlockPrompt && (sessionState === "connected" || sessionState === "waiting_avatar") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/70 z-30"
          >
            <button
              onClick={unlockAudio}
              className="flex flex-col items-center gap-3 px-8 py-6 bg-purple-600 hover:bg-purple-700 rounded-2xl text-white transition-colors shadow-xl"
              data-testid="button-unlock-audio"
            >
              <Volume2 className="w-12 h-12" />
              <span className="text-lg font-medium">Enable Sound</span>
              <span className="text-sm text-white/70">Click to hear {config.avatarName}</span>
            </button>
          </motion.div>
        )}

        {/* Bottom Controls */}
        {(sessionState === "connected" || sessionState === "waiting_avatar") && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20"
          >
            {/* Speaking Indicators */}
            {config.showSpeakingIndicator && isAvatarSpeaking && (
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  {config.avatarName} is speaking...
                </span>
              </div>
            )}
            {config.showYourTurnIndicator && !isAvatarSpeaking && !isMuted && sessionState === "connected" && (
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Your turn — speak now
                </span>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              {/* Audio Unlock Button (small) */}
              {!audioUnlocked && sessionState === "connected" && (
                <button
                  onClick={unlockAudio}
                  className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center animate-pulse"
                  data-testid="button-unlock-audio-small"
                >
                  <VolumeX className="w-6 h-6" />
                </button>
              )}
              
              {/* Mute/Unmute Button */}
              <div className="relative">
                <button
                  onClick={toggleMute}
                  disabled={isAvatarSpeaking}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                    isAvatarSpeaking
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : isMuted
                        ? "bg-red-500 text-white"
                        : "bg-white/20 text-white hover:bg-white/30"
                  )}
                  data-testid="button-toggle-mute"
                >
                  {isMuted ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* End Call Button */}
              <button
                onClick={() => stopSession()}
                className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                data-testid="button-end-call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================
// EXPORT
// ============================================

export type { LiveAvatarChatProps, LiveAvatarConfig, SessionState };

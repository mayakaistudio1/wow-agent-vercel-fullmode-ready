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

interface LiveAvatarChatProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
  className?: string;
  context?: string;
  config?: LiveAvatarConfig;
}

interface LiveAvatarConfig {
  avatarName?: string;
  avatarInitials?: string;
  avatarGradient?: string;
  startButtonText?: string;
  connectingText?: string;
  waitingText?: string;
  endedTitle?: string;
  endedDescription?: string;
  showSpeakingIndicator?: boolean;
  showYourTurnIndicator?: boolean;
  onSessionEnd?: (sessionId: string, duration: number) => void;
}

type SessionState = "idle" | "connecting" | "waiting_avatar" | "connected" | "error" | "ended";

const DEFAULT_CONFIG: Required<LiveAvatarConfig> = {
  avatarName: "Wow Agent",
  avatarInitials: "WA",
  avatarGradient: "from-black to-gray-800",
  startButtonText: "Начать звонок",
  connectingText: "Подключение...",
  waitingText: "Ожидание аватара...",
  endedTitle: "Звонок завершён",
  endedDescription: "Спасибо за диалог!",
  showSpeakingIndicator: true,
  showYourTurnIndicator: true,
  onSessionEnd: () => {},
};

export function LiveAvatarChat({
  isOpen,
  onClose,
  language = "ru",
  className,
  context,
  config: userConfig,
}: LiveAvatarChatProps) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };

  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [isMuted, setIsMuted] = useState(true);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  
  const sessionStartTimeRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContainerRef = useRef<HTMLDivElement>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const roomRef = useRef<Room | null>(null);
  const sessionDataRef = useRef<{
    sessionId: string;
    sessionToken: string;
  } | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const SPEAKING_TIMEOUT_MS = 40000;

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

  const handleDisconnected = useCallback(() => {
    console.log("Room disconnected");
    setSessionState("idle");
  }, []);

  const handleConnectionStateChanged = useCallback((state: ConnectionState) => {
    console.log("Connection state changed:", state);
    if (state === ConnectionState.Disconnected) {
      setSessionState("idle");
    }
  }, []);

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

  const handleDataReceived = useCallback(
    (payload: Uint8Array, participant?: RemoteParticipant, kind?: DataPacket_Kind) => {
      try {
        const message = new TextDecoder().decode(payload);
        console.log("Data received:", message, "from:", participant?.identity);
        
        const data = JSON.parse(message);
        
        if (data.type === "avatar_start_talking" || data.type === "agent_start_talking") {
          console.log("Avatar started talking - muting user");
          setIsAvatarSpeaking(true);
          if (roomRef.current) {
            roomRef.current.localParticipant.setMicrophoneEnabled(false);
            setIsMuted(true);
          }
          if (speakingTimeoutRef.current) {
            clearTimeout(speakingTimeoutRef.current);
          }
          speakingTimeoutRef.current = setTimeout(() => {
            console.log("Fallback timeout - avatar speaking too long, enabling mic");
            setIsAvatarSpeaking(false);
            if (roomRef.current) {
              roomRef.current.localParticipant.setMicrophoneEnabled(true);
              setIsMuted(false);
            }
          }, SPEAKING_TIMEOUT_MS);
        } 
        else if (data.type === "avatar_stop_talking" || data.type === "agent_stop_talking") {
          console.log("Avatar stopped talking - unmuting user");
          if (speakingTimeoutRef.current) {
            clearTimeout(speakingTimeoutRef.current);
            speakingTimeoutRef.current = null;
          }
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

  const handleActiveSpeakersChanged = useCallback(
    (speakers: Participant[]) => {
      if (!roomRef.current) return;
      
      const localIdentity = roomRef.current.localParticipant.identity;
      const avatarIsSpeaking = speakers.some(
        (speaker) => speaker.identity !== localIdentity
      );
      
      console.log("Active speakers changed, local:", localIdentity, "avatar speaking:", avatarIsSpeaking);
      
      setIsAvatarSpeaking((prevSpeaking) => {
        if (avatarIsSpeaking && !prevSpeaking) {
          console.log("Avatar started speaking (via ActiveSpeakers) - muting user mic");
          roomRef.current?.localParticipant.setMicrophoneEnabled(false);
          setIsMuted(true);
          if (speakingTimeoutRef.current) {
            clearTimeout(speakingTimeoutRef.current);
          }
          speakingTimeoutRef.current = setTimeout(() => {
            console.log("Fallback timeout (ActiveSpeakers) - enabling mic");
            setIsAvatarSpeaking(false);
            roomRef.current?.localParticipant.setMicrophoneEnabled(true);
            setIsMuted(false);
          }, SPEAKING_TIMEOUT_MS);
          return true;
        } else if (!avatarIsSpeaking && prevSpeaking) {
          console.log("Avatar stopped speaking (via ActiveSpeakers) - unmuting user mic");
          if (speakingTimeoutRef.current) {
            clearTimeout(speakingTimeoutRef.current);
            speakingTimeoutRef.current = null;
          }
          roomRef.current?.localParticipant.setMicrophoneEnabled(true);
          setIsMuted(false);
          return false;
        }
        return prevSpeaking;
      });
    },
    []
  );

  const startSession = useCallback(async () => {
    if (sessionState === "connecting" || sessionState === "connected") {
      return;
    }
    
    try {
      setSessionState("connecting");
      setError(null);

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

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);
      room.on(RoomEvent.Disconnected, handleDisconnected);
      room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
      room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.on(RoomEvent.DataReceived, handleDataReceived);
      room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged);

      await room.connect(livekit_url, livekit_client_token);
      
      await room.localParticipant.setMicrophoneEnabled(false);
      setIsMuted(true);

      roomRef.current = room;
      
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

  const stopSession = useCallback(async (showEnded: boolean = true) => {
    const sessionId = sessionDataRef.current?.sessionId;
    const duration = sessionStartTimeRef.current 
      ? Math.floor((Date.now() - sessionStartTimeRef.current) / 1000) 
      : 0;

    try {
      if (roomRef.current) {
        roomRef.current.disconnect();
        roomRef.current = null;
      }

      if (sessionDataRef.current) {
        await fetch("/api/liveavatar/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionDataRef.current.sessionId,
            session_token: sessionDataRef.current.sessionToken,
          }),
        });
        
        sessionDataRef.current = null;
      }

      if (sessionId && config.onSessionEnd) {
        config.onSessionEnd(sessionId, duration);
      }
    } catch (err) {
      console.error("Error stopping session:", err);
    } finally {
      audioElementsRef.current.forEach((audioEl) => {
        audioEl.remove();
      });
      audioElementsRef.current.clear();
      
      setSessionState(showEnded ? "ended" : "idle");
      setAudioUnlocked(false);
      setShowUnlockPrompt(false);
      setIsAvatarSpeaking(false);
      setIsMuted(true);
      sessionStartTimeRef.current = 0;
    }
  }, [config]);

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

  const toggleMute = useCallback(async () => {
    if (roomRef.current) {
      const newMuteState = !isMuted;
      await roomRef.current.localParticipant.setMicrophoneEnabled(!newMuteState);
      setIsMuted(newMuteState);
      if (!newMuteState) {
        setIsAvatarSpeaking(false);
        if (speakingTimeoutRef.current) {
          clearTimeout(speakingTimeoutRef.current);
          speakingTimeoutRef.current = null;
        }
      }
    }
  }, [isMuted]);

  const handleClose = useCallback(() => {
    stopSession(false);
    onClose();
  }, [stopSession, onClose]);

  useEffect(() => {
    return () => {
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
        speakingTimeoutRef.current = null;
      }
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-50 bg-black/95 flex flex-col overflow-hidden",
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
              <h3 className="text-white font-semibold" data-testid="text-avatar-name">{config.avatarName}</h3>
              <p className="text-white/60 text-xs" data-testid="text-session-status">
                {sessionState === "connected" ? (language === 'ru' ? 'В сети' : language === 'en' ? 'Online' : language === 'de' ? 'Online' : 'En línea') : 
                 sessionState === "connecting" ? config.connectingText :
                 sessionState === "waiting_avatar" ? config.waitingText :
                 (language === 'ru' ? 'Нажмите, чтобы позвонить' : language === 'en' ? 'Click to call' : language === 'de' ? 'Klicken zum Anrufen' : 'Haz clic para llamar')}
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
        <div className="flex-1 flex items-center justify-center relative bg-black">
          {/* Video element - adapted for vertical mobile-recorded avatar */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500",
                sessionState === "connected" ? "opacity-100" : "opacity-0"
              )}
              data-testid="video-avatar"
            />
          </div>
          {/* Idle State */}
          {sessionState === "idle" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center px-6 relative z-10"
            >
              <div className={cn(
                "w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br flex items-center justify-center",
                config.avatarGradient
              )}>
                <Video className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-white text-xl font-semibold mb-2" data-testid="text-idle-title">
                {language === 'ru' ? `Видеозвонок с ${config.avatarName}` : 
                 language === 'en' ? `Video call with ${config.avatarName}` :
                 language === 'de' ? `Videoanruf mit ${config.avatarName}` :
                 `Videollamada con ${config.avatarName}`}
              </h2>
              <p className="text-white/60 text-sm mb-6 max-w-xs mx-auto" data-testid="text-idle-description">
                {language === 'ru' ? 'Нажмите кнопку ниже, чтобы начать живой разговор с AI-ассистентом' : 
                 language === 'en' ? 'Click the button below to start a live conversation with the AI assistant' :
                 language === 'de' ? 'Klicken Sie auf die Schaltfläche unten, um ein Live-Gespräch mit dem KI-Assistenten zu beginnen' :
                 'Haga clic en el botón de abajo para iniciar una conversación en vivo con el asistente de IA'}
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
              <Loader2 className="w-16 h-16 text-gray-400 animate-spin mx-auto mb-4" data-testid="icon-loading" />
              <p className="text-white text-lg" data-testid="text-connecting-status">{config.connectingText}</p>
              <p className="text-white/60 text-sm mt-2" data-testid="text-connecting-description">
                {language === 'ru' ? 'Пожалуйста, подождите' : 
                 language === 'en' ? 'Please wait' :
                 language === 'de' ? 'Bitte warten' :
                 'Por favor, espere'}
              </p>
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
              <p className="text-white text-lg" data-testid="text-waiting-status">{config.waitingText}</p>
              <p className="text-white/60 text-sm mt-2" data-testid="text-waiting-description">
                {language === 'ru' ? 'Аватар подключается, это может занять несколько секунд' : 
                 language === 'en' ? 'Avatar is connecting, this may take a few seconds' :
                 language === 'de' ? 'Avatar verbindet sich, das kann einige Sekunden dauern' :
                 'El avatar se está conectando, esto puede tardar unos segundos'}
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {sessionState === "error" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center px-6"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-white text-lg mb-2" data-testid="text-error-title">
                {language === 'ru' ? 'Ошибка подключения' : 
                 language === 'en' ? 'Connection error' :
                 language === 'de' ? 'Verbindungsfehler' :
                 'Error de conexión'}
              </p>
              <p className="text-white/60 text-sm mb-4 max-w-xs mx-auto" data-testid="text-error-message">{error}</p>
              <button
                onClick={startSession}
                className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
                data-testid="button-retry-call"
              >
                {language === 'ru' ? 'Попробовать снова' : 
                 language === 'en' ? 'Try again' :
                 language === 'de' ? 'Erneut versuchen' :
                 'Intentar de nuevo'}
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
              <h2 className="text-white text-2xl font-semibold mb-2" data-testid="text-ended-title">
                {config.endedTitle}
              </h2>
              <p className="text-white/70 text-sm mb-8 max-w-xs mx-auto" data-testid="text-ended-description">
                {config.endedDescription}
              </p>
              
              <button
                onClick={() => setSessionState("idle")}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg"
                data-testid="button-new-call"
              >
                {language === 'ru' ? 'Новый звонок' : 
                 language === 'en' ? 'New call' :
                 language === 'de' ? 'Neuer Anruf' :
                 'Nueva llamada'}
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
              className="flex flex-col items-center gap-3 px-8 py-6 bg-gray-800 hover:bg-gray-700 rounded-2xl text-white transition-colors shadow-xl"
              data-testid="button-unlock-audio"
            >
              <Volume2 className="w-12 h-12" />
              <span className="text-lg font-medium">
                {language === 'ru' ? 'Включить звук' : 
                 language === 'en' ? 'Enable sound' :
                 language === 'de' ? 'Ton einschalten' :
                 'Activar sonido'}
              </span>
              <span className="text-sm text-white/70">
                {language === 'ru' ? `Нажмите, чтобы услышать ${config.avatarName}` : 
                 language === 'en' ? `Click to hear ${config.avatarName}` :
                 language === 'de' ? `Klicken, um ${config.avatarName} zu hören` :
                 `Haz clic para escuchar a ${config.avatarName}`}
              </span>
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
              <div className="text-center mb-4" data-testid="indicator-avatar-speaking">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-300 rounded-full text-sm">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  {config.avatarName} {language === 'ru' ? 'говорит...' : 
                                       language === 'en' ? 'is speaking...' :
                                       language === 'de' ? 'spricht...' :
                                       'está hablando...'}
                </span>
              </div>
            )}
            {config.showYourTurnIndicator && !isAvatarSpeaking && !isMuted && sessionState === "connected" && (
              <div className="text-center mb-4" data-testid="indicator-your-turn">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {language === 'ru' ? 'Ваша очередь — говорите' : 
                   language === 'en' ? 'Your turn — speak now' :
                   language === 'de' ? 'Du bist dran — sprich jetzt' :
                   'Tu turno — habla ahora'}
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

export type { LiveAvatarChatProps, LiveAvatarConfig, SessionState };

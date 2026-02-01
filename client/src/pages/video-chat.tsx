import { useState } from "react";
import { MobileContainer } from "@/components/layout/mobile-container";
import { LiveAvatarChat } from "@/components/LiveAvatarChat";
import { Link } from "wouter";
import { ArrowLeft, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import avatarPhoto from "@/assets/avatar-photo.png";

export default function VideoChatPage() {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const { t, language } = useLanguage();

  const config = {
    avatarName: "Wow Agent",
    avatarInitials: "WA",
    avatarGradient: "from-black to-gray-800",
    startButtonText: t.videoChat.startCall,
    connectingText: t.videoChat.connecting,
    waitingText: t.videoChat.waiting,
    endedTitle: t.videoChat.endedTitle,
    endedDescription: t.videoChat.endedDescription,
  };

  return (
    <>
      <MobileContainer className="flex flex-col h-screen">
        <header className="p-4 flex items-center justify-between z-20 shrink-0 bg-white/50 backdrop-blur-md sticky top-0">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 -ml-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors" data-testid="button-back">
                <ArrowLeft size={22} />
              </button>
            </Link>
            <h3 className="font-display font-semibold text-gray-900 text-lg">{t.videoChat.title}</h3>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl ring-4 ring-white">
              <img src={avatarPhoto} alt="WOW Agent" className="w-full h-full object-cover" />
            </div>
            
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-3">
              {language === 'ru' ? `Видеозвонок с ${config.avatarName}` : 
               language === 'en' ? `Video call with ${config.avatarName}` :
               language === 'de' ? `Videoanruf mit ${config.avatarName}` :
               `Videollamada con ${config.avatarName}`}
            </h1>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
              {language === 'ru' ? 'Нажмите кнопку ниже, чтобы начать живой разговор с AI-ассистентом' : 
               language === 'en' ? 'Click the button below to start a live conversation with the AI assistant' :
               language === 'de' ? 'Klicken Sie auf die Schaltfläche unten, um ein Live-Gespräch mit dem KI-Assistenten zu beginnen' :
               'Haga clic en el botón de abajo para iniciar una conversación en vivo con el asistente de IA'}
            </p>

            <button
              onClick={() => setIsAvatarOpen(true)}
              className="px-8 py-4 bg-black text-white rounded-full font-bold flex items-center gap-3 mx-auto hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-[0.98]"
              data-testid="button-start-video-call"
            >
              <Phone className="w-5 h-5" />
              {t.videoChat.startCall}
            </button>

            <p className="text-[11px] text-gray-400 mt-6 px-8">
              {t.videoChat.micRequired}
            </p>
          </motion.div>
        </div>
      </MobileContainer>

      <LiveAvatarChat
        isOpen={isAvatarOpen}
        onClose={() => setIsAvatarOpen(false)}
        language={language}
        config={{
          avatarName: "Wow Agent",
          avatarInitials: "WA",
          avatarGradient: "from-black to-gray-800",
          startButtonText: t.videoChat.startCall,
          connectingText: t.videoChat.connecting,
          waitingText: t.videoChat.waiting,
          endedTitle: t.videoChat.endedTitle,
          endedDescription: t.videoChat.endedDescription,
        }}
      />
    </>
  );
}

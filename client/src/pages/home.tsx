import { MobileContainer } from "@/components/layout/mobile-container";
import { DialogNav } from "@/components/dialog-nav";
import { TypingEffect } from "@/components/ui/typing-effect";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, LANGUAGES } from "@/lib/language-context";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ChevronUp, ChevronRight } from "lucide-react";

function WelcomeScreen() {
  const { selectLanguage } = useLanguage();
  const [index, setIndex] = useState(0);
  const [showLanguageList, setShowLanguageList] = useState(false);

  const greetings = [
    { text: "Привет, я Wow Agent", code: "ru" },
    { text: "Hello, I'm Wow Agent", code: "en" },
    { text: "Hallo, ich bin Wow Agent", code: "de" },
    { text: "Hola, soy Wow Agent", code: "es" },
  ];

  useEffect(() => {
    if (showLanguageList) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [showLanguageList]);

  return (
    <MobileContainer className="relative flex flex-col bg-gradient-to-b from-white via-gray-50 to-gray-100 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-100/20 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 flex flex-col p-6 z-10 justify-center items-center">
        <AnimatePresence mode="wait">
          {!showLanguageList ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center space-y-12 text-center"
            >
              <div className="h-20 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={index}
                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="text-4xl md:text-5xl font-display font-semibold text-gray-900 leading-tight tracking-tight"
                  >
                    {greetings[index].text}
                  </motion.h1>
                </AnimatePresence>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={() => setShowLanguageList(true)}
                className="mt-12 group flex flex-col items-center gap-4 text-gray-400 hover:text-black transition-colors"
                data-testid="button-show-languages"
              >
                <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <ChevronUp className="w-6 h-6 animate-bounce" />
                </div>
                <span className="text-sm font-medium uppercase tracking-widest">Select Language</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="languages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-sm space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">Choose Language</h2>
                <p className="text-gray-500">Pick your preferred language to continue</p>
              </div>

              <div className="grid gap-3">
                {LANGUAGES.map((lang, idx) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => selectLanguage(lang.code)}
                    className="flex items-center justify-between p-5 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all group"
                    data-testid={`button-language-${lang.code}`}
                  >
                    <span className="font-medium text-lg text-gray-900 group-hover:translate-x-1 transition-transform">{lang.name}</span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>

              <button 
                onClick={() => setShowLanguageList(false)}
                className="w-full py-4 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
              >
                Go Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MobileContainer>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="absolute top-4 right-4 z-30 flex gap-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${
            language === lang.code 
              ? 'bg-white shadow-md scale-110 ring-2 ring-black/10' 
              : 'bg-white/50 hover:bg-white/80 hover:scale-105'
          }`}
          data-testid={`button-switch-language-${lang.code}`}
          title={lang.name}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
}

function MainHome() {
  const { t } = useLanguage();

  return (
    <MobileContainer className="relative flex flex-col">
      <LanguageSwitcher />
      <main className="flex-1 flex flex-col p-6 z-10 overflow-y-auto no-scrollbar justify-center">
        <div className="space-y-6 text-center mb-12 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-white/40 border border-white/50 text-xs font-semibold text-gray-500 tracking-wider uppercase shadow-sm"
          >
            {t.home.badge}
          </motion.div>
          
          <h1 className="text-4xl font-display font-medium text-gray-900 leading-tight">
            <TypingEffect text={t.home.greeting} speed={40} />
          </h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center max-w-[90%] mx-auto mb-8"
        >
          <p className="text-gray-500 text-lg leading-relaxed font-light">
            {t.home.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="flex justify-center mb-12"
        >
          <Link href="/chat">
            <button className="px-12 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-black/80 transition-all active:scale-[0.98] shadow-xl shadow-black/10">
              {t.home.readyButton}
            </button>
          </Link>
        </motion.div>

        <div className="mt-auto">
          <DialogNav hideChat />
        </div>
      </main>
    </MobileContainer>
  );
}

export default function Home() {
  const { isLanguageSelected } = useLanguage();

  return (
    <AnimatePresence mode="wait">
      {!isLanguageSelected ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <WelcomeScreen />
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MainHome />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

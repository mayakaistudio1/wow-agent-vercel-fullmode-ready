import { useState, useRef, useEffect } from "react";
import { MobileContainer } from "@/components/layout/mobile-container";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { TypingEffect } from "@/components/ui/typing-effect";
import { useLanguage } from "@/lib/language-context";
import { useTelegram } from "@/hooks/use-telegram";

type Message = {
  id: string;
  role: 'agent' | 'user';
  content: string;
};

const CHAT_STORAGE_KEY = 'wow-agent-chat-history';

function loadMessages(): Message[] | null {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load chat history:', e);
  }
  return null;
}

function saveMessages(messages: Message[]) {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat history:', e);
  }
}

export default function ChatPage() {
  const { t, language } = useLanguage();
  const { isTelegram, getUserName } = useTelegram();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      
      const savedMessages = loadMessages();
      if (savedMessages && savedMessages.length > 0) {
        setMessages(savedMessages);
      } else {
        const userName = getUserName();
        let greeting: string;
        
        if (userName) {
          const greetings: Record<string, string> = {
            ru: `Привет, ${userName}! 🙂 Чем могу помочь?`,
            en: `Hello, ${userName}! 🙂 How can I help you?`,
            de: `Hallo, ${userName}! 🙂 Wie kann ich dir helfen?`,
            es: `¡Hola, ${userName}! 🙂 ¿En qué puedo ayudarte?`,
          };
          greeting = greetings[language] || greetings.en;
        } else {
          // Fallback to localized initial messages from translations
          greeting = t.chat.initialMessages[0];
        }
        
        setMessages([
          { id: '1', role: 'agent', content: greeting },
        ]);
      }
    }
  }, [t, getUserName, language]);

  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAgentTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isAgentTyping) return;

    const userMessage = text.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setShowSuggestions(false);
    setIsAgentTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'agent' ? 'assistant' : 'user',
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language,
          history
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: data.reply
      };
      setMessages(prev => {
        const newMessages = [...prev, agentMsg];
        const reply = data.reply.toLowerCase();
        
        if (reply.includes('сфер') || reply.includes('шаг') || 
            reply.includes('сайт') || reply.includes('telegram') ||
            reply.includes('field') || reply.includes('step') ||
            reply.includes('website')) {
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
        
        return newMessages;
      });
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: language === 'ru' 
          ? 'Извините, произошла ошибка. Попробуйте ещё раз.'
          : 'Sorry, an error occurred. Please try again.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAgentTyping(false);
    }
  };

  const handleSend = () => sendMessage(inputValue);
  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === t.chat.suggestedReplies[3]) {
      window.location.href = '/video-chat';
      return;
    }
    sendMessage(suggestion);
  };

  const clearHistory = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY);
    setMessages([
      { id: '1', role: 'agent', content: t.chat.initialMessages[0] },
    ]);
  };

  return (
    <MobileContainer className="flex flex-col h-[100dvh] bg-[#FDFCFB]">
      <header className="p-4 flex items-center justify-between z-20 shrink-0 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="p-2 -ml-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors">
              <ArrowLeft size={22} />
            </button>
          </Link>
          <h3 className="font-display font-semibold text-gray-900 text-lg">{t.chat.title}</h3>
        </div>
        <div className="flex gap-2">
          <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full tracking-wider border border-green-200">
            {t.chat.online}
          </div>
        </div>
      </header>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-48"
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-black text-white rounded-br-none shadow-md' 
                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-black/5'}
                `}
              >
                {msg.role === 'agent' ? (
                  <TypingEffect text={msg.content} speed={15} />
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isAgentTyping && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center shadow-sm border border-black/5">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 pb-[env(safe-area-inset-bottom,16px)] pt-3 bg-gradient-to-t from-[#FDFCFB] via-[#FDFCFB] to-transparent z-30">
        <div className="max-w-[400px] mx-auto">
          <Link href="/video-chat">
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full py-3 mb-3 bg-white border border-black/10 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              {language === 'ru' ? 'Попробовать пообщаться вживую' : 'Try live video chat'}
            </motion.button>
          </Link>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center shadow-xl shadow-black/10 rounded-[2rem] bg-white border border-black/5 transition-all focus-within:shadow-2xl focus-within:scale-[1.01]"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.chat.placeholder}
              disabled={isAgentTyping}
              className="flex-1 bg-transparent border-none py-4 px-5 text-gray-900 text-[16px] placeholder:text-gray-400 focus:outline-none focus:ring-0 disabled:opacity-50"
            />
            
            <button 
              type="submit"
              disabled={!inputValue.trim() || isAgentTyping}
              className="p-2 mr-2 bg-black rounded-full text-white hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isAgentTyping ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      </div>
    </MobileContainer>
  );
}

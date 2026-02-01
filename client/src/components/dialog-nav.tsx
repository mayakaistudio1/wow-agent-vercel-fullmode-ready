import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Sparkles, 
  ChevronRight,
  Video 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

export function DialogNav({ hideChat = false }: { hideChat?: boolean }) {
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { id: 'video-chat', label: t.nav.videoChat, icon: Video, path: '/video-chat', color: 'text-gray-800' },
    { id: 'chat', label: t.nav.textChat, icon: MessageSquare, path: '/chat', color: 'text-gray-800' },
    { id: 'presentation', label: t.nav.howItWorks, icon: Sparkles, path: '/presentation', color: 'text-gray-800' },
  ].filter(item => !(hideChat && item.id === 'chat'));

  return (
    <div className="w-full flex flex-col gap-3 mt-6">
      {NAV_ITEMS.map((item, index) => (
        <Link key={item.id} href={item.path}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            className="group cursor-pointer"
          >
            <div className="glass-panel p-4 rounded-2xl flex items-center justify-between hover:bg-white/80 transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-full bg-black/5 group-hover:bg-black/10 transition-colors", item.color)}>
                  <item.icon size={20} />
                </div>
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <ChevronRight className="text-black/20 group-hover:text-black/60 transition-colors" size={18} />
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

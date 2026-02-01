import { useRef } from "react";
import { MobileContainer } from "@/components/layout/mobile-container";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { X, ArrowDown, Check, Sparkles, Zap, Users, Clock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

function Section({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function PresentationPage() {
  const { t } = useLanguage();

  return (
    <MobileContainer className="flex flex-col min-h-screen">
      <header className="sticky top-0 p-4 flex items-center justify-between z-20 bg-gradient-to-b from-white via-white to-transparent">
        <Link href="/">
          <button 
            data-testid="button-close-presentation"
            className="p-2 -ml-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </Link>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          How it works
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 px-6 pb-32 space-y-16 overflow-y-auto">
        {/* Hero Section */}
        <Section className="pt-8 text-center" delay={0}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700"
          >
            <Sparkles size={14} />
            {t.presentation.slides.hero.badge}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-display font-bold text-gray-900 leading-tight mb-4"
          >
            {t.presentation.slides.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-base leading-relaxed mb-8"
          >
            {t.presentation.slides.hero.subtitle}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {t.presentation.slides.hero.badges.map((badge, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white border border-black/5 rounded-full text-xs font-semibold text-gray-700 shadow-sm"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex justify-center"
          >
            <ArrowDown size={20} className="text-gray-300 animate-bounce" />
          </motion.div>
        </Section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Included Section */}
        <Section delay={0.1}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Check size={20} className="text-emerald-600" />
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
              {t.presentation.slides.included.badge}
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 leading-tight mb-2">
            {t.presentation.slides.included.title}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {t.presentation.slides.included.subtitle}
          </p>
          
          <div className="space-y-3">
            {t.presentation.slides.included.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-black/5 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Roles Section */}
        <Section delay={0.1}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Users size={20} className="text-amber-600" />
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700">
              {t.presentation.slides.roles.badge}
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 leading-tight mb-2">
            {t.presentation.slides.roles.title}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {t.presentation.slides.roles.subtitle}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {t.presentation.slides.roles.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-black/5 p-4 rounded-2xl shadow-sm flex items-center justify-center text-center hover:shadow-md transition-shadow"
              >
                <span className="text-xs font-semibold text-gray-800 leading-tight">{item}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-[11px] text-gray-400 text-center uppercase tracking-widest">
            {t.presentation.slides.roles.note}
          </p>
        </Section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Launch Section */}
        <Section delay={0.1}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center">
              <Zap size={20} className="text-sky-600" />
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-700">
              {t.presentation.slides.launch.badge}
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 leading-tight mb-2">
            {t.presentation.slides.launch.title}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {t.presentation.slides.launch.subtitle}
          </p>

          <div className="space-y-0">
            {t.presentation.slides.launch.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="flex gap-4 items-center p-4 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold shrink-0 text-sm shadow-lg shadow-sky-200">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{step.title}</h4>
                    {step.desc && <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>}
                  </div>
                </div>
                {i < 2 && (
                  <div className="flex justify-center py-2">
                    <div className="w-0.5 h-4 bg-gradient-to-b from-sky-200 to-transparent rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 text-sm text-center text-amber-800"
          >
            <Clock size={16} className="inline-block mr-2 mb-0.5" />
            {t.presentation.slides.launch.fomo}
          </motion.div>
        </Section>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* CTA Section */}
        <Section className="text-center pb-8" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700">
            <Sparkles size={14} />
            {t.presentation.slides.cta.badge}
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 leading-tight mb-3">
            {t.presentation.slides.cta.title}
          </h2>
          <p className="text-gray-500 text-base mb-8 max-w-xs mx-auto">
            {t.presentation.slides.cta.subtitle}
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            <Link href="/chat">
              <button
                data-testid="button-show-in-action"
                className="w-full bg-black text-white px-6 py-4 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-all shadow-xl shadow-black/20"
              >
                {t.presentation.showInAction}
              </button>
            </Link>
            <Link href="/video-chat">
              <button
                data-testid="button-talk-live"
                className="w-full bg-white border border-black/10 text-gray-900 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
              >
                {t.presentation.talkLive}
              </button>
            </Link>
          </div>

          <div className="mt-6">
            <Link href="/contact">
              <span className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-4">
                {t.presentation.leaveContact}
              </span>
            </Link>
          </div>
        </Section>
      </main>
    </MobileContainer>
  );
}

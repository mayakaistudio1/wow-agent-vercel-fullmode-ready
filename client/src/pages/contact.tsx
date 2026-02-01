import { useState } from "react";
import { MobileContainer } from "@/components/layout/mobile-container";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { InsertLead } from "@shared/schema";
import { useLanguage } from "@/lib/language-context";

export default function ContactPage() {
  const { t } = useLanguage();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    businessGoal: ""
  });

  const submitLead = useMutation({
    mutationFn: async (data: InsertLead) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setFormState('success');
    },
    onError: (error) => {
      console.error("Error submitting lead:", error);
      setFormState('error');
      setTimeout(() => setFormState('idle'), 3000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    submitLead.mutate({
      name: formData.name,
      contact: formData.contact,
      businessGoal: formData.businessGoal || t.contact.goals[0],
    });
  };

  return (
    <MobileContainer className="flex flex-col h-screen">
      <header className="p-4 z-20">
        <Link href="/">
          <button className="p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
        </Link>
      </header>

      <div className="flex-1 p-6 flex flex-col z-10 overflow-y-auto no-scrollbar">
        <div className="text-center mb-10 mt-4">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">{t.contact.title}</h1>
          <p className="text-gray-500 text-base">{t.contact.subtitle}</p>
        </div>

        {formState === 'success' ? (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-white border border-black/5 shadow-xl p-8 rounded-3xl text-center flex flex-col items-center justify-center flex-1 mb-8"
           >
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
               <Check size={32} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-3">{t.contact.successTitle}</h3>
             <p className="text-gray-500 text-sm mb-8">{t.contact.successMessage}</p>
             <Link href="/">
               <button className="text-black font-semibold text-sm hover:underline">{t.contact.backToAgent}</button>
             </Link>
           </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t.contact.nameLabel}</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.contact.namePlaceholder}
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t.contact.contactLabel}</label>
              <input 
                required
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder={t.contact.contactPlaceholder}
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t.contact.goalLabel}</label>
              <div className="relative">
                <select 
                  value={formData.businessGoal}
                  onChange={(e) => setFormData({ ...formData, businessGoal: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none"
                >
                  {t.contact.goals.map((goal, index) => (
                    <option key={index} value={goal}>{goal}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
              </div>
            </div>

            {formState === 'error' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 text-center">
                {t.contact.error}
              </div>
            )}

            <button 
              type="submit"
              disabled={formState === 'submitting'}
              className="w-full bg-black text-white font-bold py-5 rounded-2xl mt-6 shadow-xl shadow-black/10 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {formState === 'submitting' ? (
                t.contact.submitting
              ) : (
                <>
                  <Sparkles size={20} /> {t.contact.submit}
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-gray-400 mt-4 px-8 leading-tight">
              {t.contact.disclaimer}
            </p>
          </form>
        )}
      </div>
    </MobileContainer>
  );
}

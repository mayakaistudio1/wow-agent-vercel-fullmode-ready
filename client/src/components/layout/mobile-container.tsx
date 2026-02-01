import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

declare const window: Window & {
  Telegram?: {
    WebApp?: {
      ready: () => void;
      expand: () => void;
    };
  };
};

interface MobileContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function MobileContainer({ children, className, ...props }: MobileContainerProps) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-0 md:p-8 pt-[env(safe-area-inset-top,0px)]">
      <div 
        className={cn(
          "w-full h-[100dvh] md:h-[800px] md:max-w-[400px] md:rounded-[2rem] overflow-hidden relative shadow-2xl bg-background/50 backdrop-blur-sm border-x border-white/5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}


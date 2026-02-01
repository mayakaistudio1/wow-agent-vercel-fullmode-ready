import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        onEvent: (eventType: string, callback: () => void) => void;
        offEvent: (eventType: string, callback: () => void) => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          setText: (text: string) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
      };
    };
  }
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      setIsTelegram(true);
      
      tg.ready();
      tg.expand();
      
      try {
        tg.setHeaderColor('#FDFCFB');
        tg.setBackgroundColor('#FDFCFB');
      } catch (e) {
        console.log('Could not set theme colors');
      }
      
      setIsReady(true);
    } else {
      setIsReady(true);
    }
  }, []);

  const getUserId = () => {
    return window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 'anonymous';
  };

  const getUserName = () => {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (user) {
      return user.first_name + (user.last_name ? ' ' + user.last_name : '');
    }
    return null;
  };

  const getLanguage = () => {
    return window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  };

  return {
    isReady,
    isTelegram,
    getUserId,
    getUserName,
    getLanguage,
    webApp: window.Telegram?.WebApp
  };
}

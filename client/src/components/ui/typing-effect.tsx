import { useState, useEffect } from "react";

interface TypingEffectProps {
  text: string;
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypingEffect({ 
  text, 
  speed = 30, 
  startDelay = 0, 
  onComplete,
  className 
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [startDelay]);

  useEffect(() => {
    if (!isStarted) return;

    let i = 0;
    const intervalId = setInterval(() => {
      if (text) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(intervalId);
          onComplete?.();
        }
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, isStarted, onComplete]);

  return <span className="font-bold">{displayedText}</span>;
}

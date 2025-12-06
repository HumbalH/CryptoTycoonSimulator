import { useState, useEffect } from 'react';

interface TutorialCharacterProps {
  message: string;
  position?: 'left' | 'right';
  onMessageComplete?: () => void;
  autoAdvance?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export default function TutorialCharacter({ 
  message, 
  position = 'left',
  onMessageComplete,
  autoAdvance = false,
  dismissible = false,
  onDismiss
}: TutorialCharacterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30); // Typing speed

      return () => clearTimeout(timeout);
    } else if (currentIndex === message.length && !isComplete) {
      setIsComplete(true);
      if (autoAdvance && onMessageComplete) {
        setTimeout(() => onMessageComplete(), 2000);
      }
    }
  }, [currentIndex, message, isComplete, autoAdvance, onMessageComplete]);

  // Reset when message changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [message]);

  const skipTyping = () => {
    setDisplayedText(message);
    setCurrentIndex(message.length);
    setIsComplete(true);
  };

  return (
    <div 
      className={`fixed top-20 z-[10002] flex items-start gap-4 ${
        position === 'left' ? 'left-4' : 'right-4'
      } animate-in slide-in-from-${position === 'left' ? 'left' : 'right'}-8 duration-500`}
      style={{ pointerEvents: 'auto' }}
    >
      {position === 'left' && (
        <div className="relative">
          {/* Character Image */}
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border-4 border-primary flex items-center justify-center text-6xl shadow-lg">
            🤖
          </div>
          {/* Pixel corner */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
        </div>
      )}
      
      {/* Dialog Box */}
      <div 
        className="relative max-w-md"
        onClick={currentIndex < message.length ? skipTyping : undefined}
      >
        {/* Pixel-style dialog box */}
        <div className="bg-background border-4 border-primary rounded-none shadow-2xl p-6 relative"
          style={{
            imageRendering: 'pixelated',
            boxShadow: '8px 8px 0 rgba(0,0,0,0.3)'
          }}
        >
          {/* Corner pixels */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-primary" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-primary" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary" />
          
          {/* Speaker name */}
          <div className="mb-2 flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary animate-pulse" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider"
                style={{ fontFamily: 'monospace' }}>
                AI Guide - BitAI
              </span>
            </div>
            {/* Mobile minimize button */}
            {dismissible && onDismiss && (
              <button
                onClick={onDismiss}
                className="lg:hidden text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 border border-primary/30 rounded"
                style={{ fontFamily: 'monospace' }}
              >
                [HIDE]
              </button>
            )}
          </div>
          
          {/* Message text */}
          <p className="text-sm leading-relaxed mb-4"
            style={{ 
              fontFamily: 'monospace',
              textShadow: '1px 1px 0 rgba(0,0,0,0.2)'
            }}>
            {displayedText}
            {!isComplete && <span className="animate-pulse">▊</span>}
          </p>
          
          {/* Continue indicator */}
          {isComplete && !autoAdvance && onMessageComplete && (
            <button
              onClick={onMessageComplete}
              className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
              style={{ fontFamily: 'monospace' }}
            >
              <span>PRESS TO CONTINUE</span>
              <span className="animate-bounce">→</span>
            </button>
          )}
          
          {/* Click to skip indicator */}
          {!isComplete && (
            <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground opacity-50"
              style={{ fontFamily: 'monospace' }}>
              [CLICK TO SKIP]
            </div>
          )}
        </div>
        
        {/* Speech bubble pointer */}
        {position === 'left' && (
          <div className="absolute left-0 top-8 -ml-3 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-r-primary" />
        )}
        {position === 'right' && (
          <div className="absolute right-0 top-8 -mr-3 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[16px] border-l-primary" />
        )}
      </div>

      {position === 'right' && (
        <div className="relative">
          {/* Character Image */}
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border-4 border-primary flex items-center justify-center text-6xl shadow-lg">
            🤖
          </div>
          {/* Pixel corner */}
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-primary" style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
        </div>
      )}
    </div>
  );
}

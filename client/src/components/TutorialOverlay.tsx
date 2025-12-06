import { useEffect, useState, useRef } from 'react';

interface TutorialOverlayProps {
  highlightElement?: string; // data-tutorial-id to highlight
  darkenRest?: boolean;
  showArrow?: boolean;
  arrowPosition?: 'top' | 'bottom' | 'left' | 'right';
  unlockElements?: string[]; // array of data-tutorial-id values to unlock
}

export default function TutorialOverlay({ 
  highlightElement, 
  darkenRest = true,
  showArrow = true,
  arrowPosition = 'top',
  unlockElements = []
}: TutorialOverlayProps) {
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [unlockRects, setUnlockRects] = useState<DOMRect[]>([]);
  
  // Track which elements we've already calculated positions for
  const calculatedKeyRef = useRef<string>('');
  const unlockElementsKey = unlockElements.join(',');
  
  // Manage unlocking/locking elements based on tutorial step
  useEffect(() => {
    // Remove all previous unlock/flicker attributes
    document.querySelectorAll('[data-tutorial-unlock]').forEach(el => {
      el.removeAttribute('data-tutorial-unlock');
    });
    document.querySelectorAll('[data-tutorial-flicker]').forEach(el => {
      el.removeAttribute('data-tutorial-flicker');
    });

    // Add unlock attribute to specified elements
    unlockElements.forEach(elementId => {
      const elements = document.querySelectorAll(`[data-tutorial-id="${elementId}"]`);
      elements.forEach(el => {
        el.setAttribute('data-tutorial-unlock', 'true');
        
        // Add flicker to buttons
        if (elementId.includes('buy') || elementId.includes('button')) {
          el.setAttribute('data-tutorial-flicker', 'true');
        }
      });
    });

    return () => {
      // Cleanup on unmount
      document.querySelectorAll('[data-tutorial-unlock]').forEach(el => {
        el.removeAttribute('data-tutorial-unlock');
      });
      document.querySelectorAll('[data-tutorial-flicker]').forEach(el => {
        el.removeAttribute('data-tutorial-flicker');
      });
    };
  }, [unlockElements]);

  // Calculate positions of all unlocked elements - ONLY ONCE per step
  useEffect(() => {
    // Skip if we've already calculated for this exact set of elements
    if (calculatedKeyRef.current === unlockElementsKey) {
      return;
    }

    const updatePositions = () => {
      const rects: DOMRect[] = [];
      unlockElements.forEach(elementId => {
        const elements = document.querySelectorAll(`[data-tutorial-id="${elementId}"]`);
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          // Create a frozen copy that won't change
          const frozenRect = {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y,
            toJSON: () => ({})
          } as DOMRect;
          rects.push(frozenRect);
        });
      });
      setUnlockRects(rects);
      
      // Mark this set of elements as calculated
      calculatedKeyRef.current = unlockElementsKey;
    };

    // Wait for elements to render after tab switch
    const timeout = setTimeout(updatePositions, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [unlockElementsKey]);

  // Calculate position of highlighted element - ONCE when element changes
  useEffect(() => {
    if (!highlightElement) {
      setHighlightRect(null);
      return;
    }

    const updatePosition = () => {
      const element = document.querySelector(`[data-tutorial-id="${highlightElement}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Create a frozen copy that won't update
        const frozenRect = {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
          toJSON: () => ({})
        } as DOMRect;
        setHighlightRect(frozenRect);
      }
    };

    // Calculate position after element renders
    const timeout = setTimeout(updatePosition, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [highlightElement]);

  if (!darkenRest) return null;

  // Combine all unlock rects into one large rect for click blocking
  const combinedRect = unlockRects.length > 0 
    ? unlockRects.reduce((acc, rect) => {
        if (!acc) return rect;
        return {
          left: Math.min(acc.left, rect.left),
          top: Math.min(acc.top, rect.top),
          right: Math.max(acc.right, rect.right),
          bottom: Math.max(acc.bottom, rect.bottom),
          width: 0, height: 0, x: 0, y: 0, toJSON: () => ({})
        } as DOMRect;
      }, null as DOMRect | null)
    : null;

  // Use combined rect for click blocking, or highlighted rect if no unlocks
  const cutoutRect = combinedRect || highlightRect;

  return (
    <>
      {/* Dark overlay with cutout - visual only, no click blocking */}
      <svg className="fixed inset-0 w-full h-full z-[9998] pointer-events-none">
        <defs>
          <mask id="tutorial-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Cutout for all unlocked elements - with minimal padding */}
            {unlockRects.map((rect, index) => (
              <rect 
                key={index}
                x={rect.left} 
                y={rect.top} 
                width={rect.width} 
                height={rect.height} 
                fill="black"
                rx="4"
              />
            ))}
            {/* Cutout for highlighted element if different */}
            {highlightRect && !unlockRects.some(r => 
              Math.abs(r.left - highlightRect.left) < 5 && 
              Math.abs(r.top - highlightRect.top) < 5
            ) && (
              <rect 
                x={highlightRect.left} 
                y={highlightRect.top} 
                width={highlightRect.width} 
                height={highlightRect.height} 
                fill="black"
                rx="4"
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0.8)" mask="url(#tutorial-mask)" />
      </svg>
      
      {/* Click blocker - blocks everything except the cutout area */}
      {cutoutRect && (
        <>
          {/* Top blocker */}
          <div 
            className="fixed left-0 right-0 bg-transparent z-[9999] pointer-events-auto"
            style={{ top: 0, height: `${cutoutRect.top}px` }}
          />
          {/* Bottom blocker */}
          <div 
            className="fixed left-0 right-0 bg-transparent z-[9999] pointer-events-auto"
            style={{ top: `${cutoutRect.bottom}px`, bottom: 0 }}
          />
          {/* Left blocker */}
          <div 
            className="fixed bg-transparent z-[9999] pointer-events-auto"
            style={{ 
              top: `${cutoutRect.top}px`, 
              left: 0, 
              width: `${cutoutRect.left}px`,
              height: `${cutoutRect.bottom - cutoutRect.top}px`
            }}
          />
          {/* Right blocker */}
          <div 
            className="fixed bg-transparent z-[9999] pointer-events-auto"
            style={{ 
              top: `${cutoutRect.top}px`, 
              left: `${cutoutRect.right}px`,
              right: 0,
              height: `${cutoutRect.bottom - cutoutRect.top}px`
            }}
          />
        </>
      )}
      
      {/* Full screen blocker when no highlight */}
      {!cutoutRect && (
        <div className="fixed inset-0 bg-transparent z-[9999] pointer-events-auto" />
      )}

      <style>{`
        /* Elements with unlock attribute can be clicked */
        [data-tutorial-unlock="true"] {
          pointer-events: auto !important;
          position: relative;
          z-index: 10001 !important;
        }

        /* Boost parent containers when they contain unlocked elements */
        :has(> [data-tutorial-unlock="true"]) {
          z-index: 10000 !important;
        }

        /* Ensure Radix Dialog/Sheet portals are above tutorial overlay when containing unlocked elements */
        [data-radix-portal]:has([data-tutorial-unlock="true"]) {
          z-index: 10000 !important;
        }

        /* Boost Sheet content when it contains unlocked elements */
        [data-radix-portal]:has([data-tutorial-unlock="true"]) > [role="dialog"] {
          z-index: 10000 !important;
        }

        /* Also boost the Sheet overlay/backdrop */
        [data-radix-portal]:has([data-tutorial-unlock="true"]) > [data-radix-dialog-overlay] {
          z-index: 10000 !important;
        }

        /* Make sure unlocked Sheet content and all its children are clickable */
        [data-tutorial-unlock="true"] * {
          pointer-events: auto !important;
        }

        /* Flickering animation for buttons */
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 20px rgba(139, 92, 246, 0.6); }
          50% { opacity: 0.9; transform: scale(1.05); box-shadow: 0 0 30px rgba(139, 92, 246, 0.9); }
        }
        
        [data-tutorial-flicker="true"] {
          animation: flicker 0.8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

import { useState, useRef, useCallback } from 'react';

interface HoldButtonProps {
  onComplete: () => void;
  holdDuration?: number;
  children: React.ReactNode;
  disabled?: boolean;
}

const HoldButton = ({ 
  onComplete, 
  holdDuration = 2000, 
  children,
  disabled = false 
}: HoldButtonProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const handleStart = useCallback(() => {
    if (disabled || isComplete) return;
    
    setIsHolding(true);
    startTimeRef.current = Date.now();
    
    timerRef.current = setTimeout(() => {
      setIsComplete(true);
      setIsHolding(false);
      onComplete();
    }, holdDuration);
  }, [disabled, isComplete, holdDuration, onComplete]);

  const handleEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHolding(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  return (
    <button
      className={`hold-button ${isComplete ? 'hold-button-complete' : ''}`}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      disabled={disabled}
      style={{ '--hold-duration': `${holdDuration}ms` } as React.CSSProperties}
    >
      {isHolding && !isComplete && (
        <div className="hold-button-progress animate-progress" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default HoldButton;

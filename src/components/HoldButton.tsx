import { useState, useRef, useCallback, useEffect } from 'react';

interface HoldButtonProps {
  onComplete: () => void;
  holdDuration?: number;
  children: React.ReactNode;
  disabled?: boolean;
}

const HoldButton = ({ 
  onComplete, 
  holdDuration = 1200, 
  children,
  disabled = false 
}: HoldButtonProps) => {
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const btnRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const updateProgress = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const pct = Math.min(elapsed / holdDuration, 1);
    setProgress(pct);

    if (pct >= 1) {
      setState('done');
      spawnParticles();
      onComplete();
    } else {
      animRef.current = requestAnimationFrame(updateProgress);
    }
  }, [holdDuration, onComplete]);

  const handleStart = useCallback(() => {
    if (disabled || state !== 'idle') return;
    setState('running');
    setProgress(0);
    startTimeRef.current = Date.now();
    animRef.current = requestAnimationFrame(updateProgress);
  }, [disabled, state, updateProgress]);

  const handleEnd = useCallback(() => {
    if (state !== 'running') return;
    cancelAnimationFrame(animRef.current);
    setState('idle');
    setProgress(0);
  }, [state]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const spawnParticles = () => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    container.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      p.className = 'hold-particle';
      const angle = (i / 16) * 360;
      const dist = 40 + Math.random() * 50;
      const tx = Math.cos((angle * Math.PI) / 180) * dist;
      const ty = Math.sin((angle * Math.PI) / 180) * dist;
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.left = '50%';
      p.style.top = '50%';
      container.appendChild(p);
    }
  };

  const pctDisplay = Math.round(progress * 100);

  // Convert children to array to get the idle label
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div 
      ref={btnRef}
      className={`hold-btn-wrap ${state}`}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <button
        className="hold-btn"
        disabled={disabled}
      >
        {/* Track */}
        <div className="hold-btn-track" />
        
        {/* Progress fill */}
        <div 
          className="hold-btn-fill"
          style={{ transform: `scaleX(${progress})` }}
        />
        
        {/* Shimmer on fill */}
        {state === 'running' && (
          <div 
            className="hold-btn-shimmer"
            style={{ transform: `scaleX(${progress})` }}
          />
        )}
        
        {/* Border ring */}
        <div className="hold-btn-ring" />
        
        {/* Labels */}
        <div className="hold-btn-labels">
          <span className="hold-lbl hold-lbl-idle">
            {childArray}
          </span>
          <span className="hold-lbl hold-lbl-run">
            Verifying
            <span className="hold-pct">{pctDisplay}%</span>
          </span>
          <span className="hold-lbl hold-lbl-done">
            ✓ Done
          </span>
        </div>
      </button>

      {/* Particles container */}
      <div ref={particlesRef} className="hold-particles" />
    </div>
  );
};

export default HoldButton;

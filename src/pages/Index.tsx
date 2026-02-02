import { useState, useCallback } from 'react';
import DigitalClock from '@/components/DigitalClock';
import HoldButton from '@/components/HoldButton';

const Index = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleLogin = useCallback(() => {
    if (!email.trim()) return;
    
    setStatus('processing');
    
    // Simulate authentication
    setTimeout(() => {
      setStatus('success');
    }, 800);
  }, [email]);

  const isValidEmail = email.includes('@') && email.includes('.');

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      {/* Geometric background pattern */}
      <div className="fixed inset-0 bg-geometric pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-sm">
        <div className="card-ritual">
          {/* Clock */}
          <div className="flex justify-center mb-12">
            <DigitalClock />
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="input-minimal"
                disabled={status !== 'idle'}
                autoComplete="email"
                autoFocus
              />
            </div>

            <HoldButton 
              onComplete={handleLogin}
              holdDuration={2000}
              disabled={!isValidEmail || status !== 'idle'}
            >
              {status === 'idle' && 'Hold to authenticate'}
              {status === 'processing' && 'Verifying...'}
              {status === 'success' && 'Access granted'}
            </HoldButton>

            {/* Microcopy */}
            <p className="text-center text-sm text-whisper leading-relaxed">
              {status === 'idle' && 'Take a moment. Timing matters.'}
              {status === 'processing' && 'One moment, please.'}
              {status === 'success' && 'Welcome back.'}
            </p>
          </div>
        </div>

        {/* Footer whisper */}
        <p className="text-center text-xs text-whisper mt-8 opacity-60">
          Designed for humans
        </p>
      </div>
    </div>
  );
};

export default Index;

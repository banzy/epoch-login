import { useState, useCallback } from 'react';
import { Mail, Info, ShieldCheck } from 'lucide-react';
import DigitalClock from '@/components/DigitalClock';
import HoldButton from '@/components/HoldButton';
import ThemeToggle from '@/components/ThemeToggle';

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
      {/* Geometric light background / Gradient waves (dark) */}
      <div className="fixed inset-0 z-0 pointer-events-none dark:hidden bg-geometric-hex" />
      <div className="fixed inset-0 z-0 hidden dark:block pointer-events-none bg-dark-waves">
        <div className="dark-boot-scan" />
        <div className="dark-matrix-chars" />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <div className="card-ritual">
          <ThemeToggle />
          {/* Clock */}
          <div className="flex justify-center mb-3">
            <DigitalClock />
          </div>

          {/* System status */}
          <p className="text-center text-xs font-medium tracking-[0.25em] text-whisper mb-12 uppercase">
            {status === 'idle' && 'System Ready'}
            {status === 'processing' && 'Verifying'}
            {status === 'success' && 'Access Granted'}
          </p>

          {/* Form */}
          <div className="space-y-8">
            {/* Email input with icon */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <Mail className="w-5 h-5 text-whisper flex-shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Identity"
                className="input-underline"
                disabled={status !== 'idle'}
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Microcopy - above button */}
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-whisper flex-shrink-0 mt-0.5" />
              <p className="text-sm text-whisper leading-relaxed">
                {status === 'idle' && 'Secure logging system'}
                {status === 'processing' && 'Temporal verification in progress.'}
                {status === 'success' && 'Identity confirmed. Welcome back.'}
              </p>
            </div>

            <HoldButton 
              onComplete={handleLogin}
              holdDuration={2000}
              disabled={!isValidEmail || status !== 'idle'}
            >
              {status === 'idle' && 'Log in'}
              {status === 'processing' && 'Verifying...'}
              {status === 'success' && 'Access Granted'}
            </HoldButton>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-8 opacity-50">
          <ShieldCheck className="w-4 h-4 text-whisper" />
          <p className="text-xs text-whisper font-medium tracking-[0.2em] uppercase">
            Secure Enclave
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

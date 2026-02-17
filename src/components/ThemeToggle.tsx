import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="absolute top-[14px] right-[14px] z-50 p-2.5 rounded-full bg-card border border-border shadow-soft transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={18} className="text-foreground transition-transform duration-300 rotate-0" />
      ) : (
        <Moon size={18} className="text-foreground transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
};

export default ThemeToggle;

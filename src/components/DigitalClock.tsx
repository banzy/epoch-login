import { useState, useEffect } from 'react';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  return (
    <div className="font-clock font-medium tracking-tight select-none flex items-baseline justify-center clock-enter">
      <span className="clock-digit text-clock-primary md:text-6xl font-mono text-4xl">{hours}</span>
      <span className="clock-separator md:text-6xl mx-1 text-4xl">:</span>
      <span className="clock-digit text-clock-primary md:text-6xl font-mono text-4xl">{minutes}</span>
      <span className="clock-separator md:text-3xl mx-1.5 self-end mb-1.5 text-4xl">:</span>
      <span className="clock-digit clock-seconds md:text-3xl self-end mb-1.5 text-2xl font-mono">{seconds}</span>
    </div>);

};

export default DigitalClock;
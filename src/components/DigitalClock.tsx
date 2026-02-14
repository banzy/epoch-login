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
    <div className="font-clock font-medium tracking-tight select-none flex items-baseline justify-center">
      <span className="clock-digit text-clock-primary text-6xl md:text-7xl">{hours}</span>
      <span className="clock-separator text-6xl md:text-7xl mx-1">:</span>
      <span className="clock-digit text-clock-primary text-6xl md:text-7xl">{minutes}</span>
      <span className="clock-separator text-2xl md:text-3xl mx-1.5 self-end mb-1.5">:</span>
      <span className="clock-digit clock-seconds text-2xl md:text-3xl self-end mb-1.5">{seconds}</span>
    </div>
  );
};

export default DigitalClock;

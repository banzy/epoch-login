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
    <div className="font-clock text-6xl md:text-7xl font-medium tracking-tight select-none">
      <span className="clock-digit text-clock-primary">{hours}</span>
      <span className="clock-separator mx-1">:</span>
      <span className="clock-digit text-clock-primary">{minutes}</span>
      <span className="clock-separator mx-1">:</span>
      <span className="clock-digit clock-seconds">{seconds}</span>
    </div>
  );
};

export default DigitalClock;

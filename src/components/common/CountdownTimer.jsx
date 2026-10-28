import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({ targetDate, initialMinutes = 60, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    if (targetDate) {
      const diff = Math.max(0, Math.floor((new Date(targetDate).getTime() - Date.now()) / 1000));
      return diff;
    }
    return initialMinutes * 60;
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onExpire]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isLow = timeLeft < 300; // Less than 5 mins

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium border ${
      isLow
        ? 'bg-red-50 text-red-700 border-red-200'
        : 'bg-amber-50 text-amber-800 border-amber-200'
    }`}>
      <Clock className="w-3.5 h-3.5" />
      <span>Expires in: </span>
      <span className="font-bold">
        {hours > 0 ? `${hours}h ` : ''}
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

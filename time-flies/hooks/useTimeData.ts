import { useState, useEffect } from 'react';
import type { TimeData } from '@/types';
import { getTimeData } from '@/utils/time';
import { useSettings } from '@/contexts/SettingsContext';

export interface ClockParts {
  hours: string;
  minutes: string;
  seconds: string;
}

export function useTimeData() {
  const { settings } = useSettings();
  const [data, setData] = useState<TimeData>(() => getTimeData(settings));
  const [currentTime, setCurrentTime] = useState('');
  const [clockParts, setClockParts] = useState<ClockParts>({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const tick = () => {
      setData(getTimeData(settings));
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          ...(settings.showSeconds ? { second: '2-digit' } : {}),
        })
      );
      setClockParts({
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [settings]);

  return { data, currentTime, clockParts };
}

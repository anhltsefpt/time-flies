import { useState, useEffect } from 'react';
import type { TimeData } from '@/types';
import { getTimeData } from '@/utils/time';
import { useSettings } from '@/contexts/SettingsContext';

export function useTimeData() {
  const { settings } = useSettings();
  const [data, setData] = useState<TimeData>(() => getTimeData(settings));
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () => {
      setData(getTimeData(settings));
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          ...(settings.showSeconds ? { second: '2-digit' } : {}),
        })
      );
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [settings]);

  return { data, currentTime };
}

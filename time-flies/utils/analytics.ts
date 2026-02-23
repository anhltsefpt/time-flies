import * as Amplitude from '@amplitude/analytics-react-native';

const AMPLITUDE_API_KEY = '78b0eee09fd12cf22fefa6e01e458bbc';

export function init() {
  Amplitude.init(AMPLITUDE_API_KEY, undefined, {
    flushIntervalMillis: 15000,
    minIdLength: 1,
  });
}

export function track(eventName: string, properties?: Record<string, unknown>) {
  Amplitude.track(eventName, properties);
}

export function setUserProperties(props: Record<string, unknown>) {
  const identify = new Amplitude.Identify();
  for (const [key, value] of Object.entries(props)) {
    identify.set(key, value as string | number | boolean);
  }
  Amplitude.identify(identify);
}

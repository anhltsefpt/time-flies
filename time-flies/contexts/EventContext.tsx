import type { FiniteEvent } from "@/types";
import { track } from "@/utils/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "finite-events";

interface EventContextType {
  events: FiniteEvent[];
  addEvent: (event: Omit<FiniteEvent, "id">) => void;
  updateEvent: (event: FiniteEvent) => void;
  deleteEvent: (id: number) => void;
  isLoaded: boolean;
}

const EventContext = createContext<EventContextType>({
  events: [],
  addEvent: () => {},
  updateEvent: () => {},
  deleteEvent: () => {},
  isLoaded: false,
});

let nextId = Date.now();

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<FiniteEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              setEvents(parsed);
              const maxId = parsed.reduce(
                (max: number, e: FiniteEvent) => Math.max(max, e.id),
                0,
              );
              nextId = maxId + 1;
            }
          } catch {}
        }
        setIsLoaded(true);
      })
      .catch(() => {
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    }
  }, [events, isLoaded]);

  const addEvent = useCallback((event: Omit<FiniteEvent, "id">) => {
    const newEvent = {
      ...event,
      id: nextId++,
      created: new Date().toISOString().slice(0, 10),
    };
    setEvents((prev) => [...prev, newEvent]);
    track("event_created", { color: event.color });
  }, []);

  const updateEvent = useCallback((event: FiniteEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
    track("event_updated", { id: event.id });
  }, []);

  const deleteEvent = useCallback((id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    track("event_deleted", { id });
  }, []);

  return (
    <EventContext.Provider
      value={{ events, addEvent, updateEvent, deleteEvent, isLoaded }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}

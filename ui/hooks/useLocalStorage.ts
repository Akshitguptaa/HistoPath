import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [initialized, setInitialized] = useState(false);

  // Load from LocalStorage 
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
    } finally {
      setInitialized(true);
    }
  }, [key]);

  // Sync to LocalStorage 
  useEffect(() => {
    if (initialized) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error("Error setting localStorage key:", key, error);
      }
    }
  }, [key, storedValue, initialized]);

  const clearValue = () => {
      setStoredValue(initialValue);
      try {
        window.localStorage.removeItem(key);
      } catch (e) { console.error(e); }
  };

  return [storedValue, setStoredValue, clearValue] as const;
}
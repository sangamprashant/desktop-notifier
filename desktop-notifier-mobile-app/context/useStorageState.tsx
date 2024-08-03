import * as SecureStore from "expo-secure-store";
import * as React from "react";
import { Platform } from "react-native";

type UseStateHook<T> = [T | null, (value: T | null) => void];

function useAsyncState<T>(initialValue: T | null = null): UseStateHook<T> {
  return React.useReducer(
    (state: T | null, action: T | null): T | null => action,
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
  try {
    if (Platform.OS === "web") {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } else {
      if (value === null) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    }
  } catch (e) {
    console.error("Error accessing storage:", e);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  const [state, setState] = useAsyncState<string>();

  React.useEffect(() => {
    async function fetchStoredValue() {
      try {
        if (Platform.OS === "web") {
          const storedValue = localStorage.getItem(key);
          setState(storedValue);
        } else {
          const storedValue = await SecureStore.getItemAsync(key);
          setState(storedValue);
        }
      } catch (e) {
        console.error("Error fetching from storage:", e);
      }
    }

    fetchStoredValue();
  }, [key]);

  const setValue = React.useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}

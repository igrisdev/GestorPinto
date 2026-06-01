import { Alert } from "react-native";

export async function safeFetch<T>(url: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }
    return (await response.json()) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error de red";
    Alert.alert("Error", message);
    throw error;
  }
}

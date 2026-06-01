import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

const STORAGE_KEY = "GESTOR_PINTO_USER";

export async function saveUser(user: User) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export async function loadUser(): Promise<User | null> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? (JSON.parse(json) as User) : null;
}

export async function clearUser() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

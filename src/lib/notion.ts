import { safeFetch } from "./api";
import type { LoginResponse, Resource } from "../types";

const baseUrl = "https://api.notion.com/v1";

export async function loginNotion(email: string, password: string): Promise<LoginResponse> {
  return safeFetch<LoginResponse>(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
}

export async function getResources(clase: string): Promise<{ resources: Resource[] }> {
  return safeFetch<{ resources: Resource[] }>(`${baseUrl}/resources?clase=${encodeURIComponent(clase)}`);
}

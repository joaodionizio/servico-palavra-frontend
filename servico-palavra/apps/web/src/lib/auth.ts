import { api } from "@/lib/api";
import type { AuthResponse, LoginPayload, RegisterPayload, Usuario } from "@/types/auth";

export async function login(payload: LoginPayload) {
  return api.post<AuthResponse, LoginPayload>("/api/auth/login", payload);
}

export async function register(payload: RegisterPayload) {
  return api.post<AuthResponse, RegisterPayload>("/api/auth/register", payload);
}

export async function getMe() {
  return api.get<Usuario>("/api/auth/me");
}

export async function logout() {
  return api.post<void>("/api/auth/logout");
}

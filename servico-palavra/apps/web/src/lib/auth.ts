import { api } from "@/lib/api";
import type {
  ApiEnvelope,
  ApiMessageResponse,
  AuthResponse,
  BackendAuthResponse,
  BackendUsuario,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  Usuario
} from "@/types/auth";

function normalizeUsuario(usuario: BackendUsuario): Usuario {
  const roles = Array.isArray(usuario.roles) ? usuario.roles.filter((role): role is string => typeof role === "string") : [];
  const isAdmin = roles.some((role) => ["admin", "administrador"].includes(role.trim().toLowerCase()));

  return {
    id: usuario.id ?? "",
    nome: usuario.nome ?? "",
    email: usuario.email ?? "",
    roles,
    perfil: isAdmin ? "admin" : "aluno"
  };
}

function normalizeAuthResponse(response: BackendAuthResponse): AuthResponse {
  const usuario = response.data.usuario ?? response.data;

  return {
    usuario: normalizeUsuario(usuario)
  };
}

export async function login(payload: LoginPayload) {
  const response = await api.post<BackendAuthResponse, LoginPayload>("/api/auth/login", payload, { skipAuthExpiredHandler: true });
  return normalizeAuthResponse(response);
}

export async function register(payload: RegisterPayload) {
  const response = await api.post<BackendAuthResponse, RegisterPayload>("/api/auth/register", payload, { skipAuthExpiredHandler: true });
  return normalizeAuthResponse(response);
}

export async function requestPasswordReset(payload: ForgotPasswordPayload) {
  return api.post<ApiMessageResponse, ForgotPasswordPayload>("/api/auth/password/forgot", payload, { skipAuthExpiredHandler: true });
}

export async function resetPassword(payload: ResetPasswordPayload) {
  return api.post<ApiMessageResponse, ResetPasswordPayload>("/api/auth/password/reset", payload, { skipAuthExpiredHandler: true });
}

export async function getMe() {
  const response = await api.get<ApiEnvelope<BackendUsuario>>("/api/auth/me");
  return normalizeUsuario(response.data);
}

export async function updateMe(payload: UpdateProfilePayload) {
  const response = await api.put<ApiEnvelope<BackendUsuario>, UpdateProfilePayload>("/api/auth/me", payload);
  return normalizeUsuario(response.data);
}

export async function logout() {
  return api.post<void>("/api/auth/logout", undefined, { skipAuthExpiredHandler: true });
}

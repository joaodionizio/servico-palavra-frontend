export type PerfilUsuario = "aluno" | "admin";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  roles: string[];
  perfil: PerfilUsuario;
};

export type BackendUsuario = {
  id?: string;
  nome?: string;
  email?: string;
  roles?: string[];
};

export type LoginPayload = {
  email: string;
  senha: string;
};

export type RegisterPayload = {
  nome: string;
  email: string;
  senha: string;
};

export type AuthResponse = {
  usuario: Usuario;
};

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[] | null;
};

export type BackendAuthResponse = ApiEnvelope<BackendUsuario & { usuario?: BackendUsuario }>;

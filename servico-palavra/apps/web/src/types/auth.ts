export type PerfilUsuario = "aluno" | "admin";

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
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

export type User = {
  id: string;
  name: string;
  email: string;
};

export type Resource = {
  id: string;
  title: string;
  clase: string;
  status: "Disponible" | "En progreso" | "Archivado";
  url?: string;
};

export type LoginResponse = {
  success: boolean;
  user: User;
  token?: string;
};

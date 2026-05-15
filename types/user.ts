export interface User {
  nombre: string;
  clase: string;
  estado: string;
}

export interface LoginSuccess extends User {
  success: true;
}

export interface LoginError {
  success: false;
  error: string;
}

export type LoginResponse = LoginSuccess | LoginError;

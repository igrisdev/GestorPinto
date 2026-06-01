import { LoginResponse, User } from "../types";

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  if (!/^[\d]+$/.test(password)) {
    throw new Error("La contraseña debe ser numérica");
  }

  const user: User = {
    id: email,
    name: email.split("@")[0] || "Usuario",
    email
  };

  return {
    success: true,
    user
  };
}

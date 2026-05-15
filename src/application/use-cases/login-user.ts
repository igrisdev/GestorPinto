import type { AuthRepository } from "@/domain/repositories/auth-repository";

export async function loginUserUseCase(
  email: string,
  password: string,
  authRepository: AuthRepository
) {
  return authRepository.login(email, password);
}

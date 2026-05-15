import type { User } from "@/domain/entities/user";
import type { Result } from "@/domain/shared/result";

export interface AuthRepository {
  login(email: string, password: string): Promise<Result<User, string>>;
}

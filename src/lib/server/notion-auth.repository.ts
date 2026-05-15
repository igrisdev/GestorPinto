import type { AuthRepository } from "@/domain/repositories/auth-repository";
import type { Result } from "@/domain/shared/result";
import type { User } from "@/domain/entities/user";
import { notionRequest } from "@/lib/server/notion-client";
import { mapUser } from "@/lib/server/notion-mappers";

type NotionQueryResponse = {
  results: Array<{ id: string; properties: Record<string, unknown> }>;
};

export class NotionAuthRepository implements AuthRepository {
  async login(email: string, password: string): Promise<Result<User, string>> {
    try {
      const databaseId = process.env.DATABASE_USUARIOS_ID;
      if (!databaseId) {
        return { ok: false, error: "DATABASE_USUARIOS_ID no configurada" };
      }

      const parsedPassword = Number.parseInt(password, 10);
      if (Number.isNaN(parsedPassword)) {
        return { ok: false, error: "Credenciales incorrectas" };
      }

      const url = `https://api.notion.com/v1/databases/${databaseId}/query`;
      const response = await notionRequest<NotionQueryResponse>(url, {
        filter: {
          and: [
            { property: "Correo", email: { equals: email } },
            { property: "Contraseña", number: { equals: parsedPassword } },
          ],
        },
      });

      if (!response.results || response.results.length === 0) {
        return { ok: false, error: "Credenciales incorrectas" };
      }

      return { ok: true, value: mapUser(response.results[0]) };
    } catch {
      return { ok: false, error: "Error de conexion" };
    }
  }
}

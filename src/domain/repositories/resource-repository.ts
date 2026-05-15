import type { Resource } from "@/domain/entities/resource";

export interface ResourceRepository {
  getByClass(claseUsuario: string): Promise<Resource[]>;
}

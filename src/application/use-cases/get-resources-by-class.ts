import type { ResourceRepository } from "@/domain/repositories/resource-repository";

export async function getResourcesByClassUseCase(
  claseUsuario: string,
  resourceRepository: ResourceRepository
) {
  return resourceRepository.getByClass(claseUsuario);
}

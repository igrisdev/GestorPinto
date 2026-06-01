import { Resource } from "../types";

const placeholderResources: Resource[] = [
  {
    id: "1",
    title: "Guía rápida de álgebra",
    clase: "Matemáticas",
    status: "Disponible",
    url: "https://example.com/algebra"
  },
  {
    id: "2",
    title: "Tarea de física: cinemática",
    clase: "Física",
    status: "En progreso",
    url: "https://example.com/fisica"
  },
  {
    id: "3",
    title: "Resumen de historia universal",
    clase: "Historia",
    status: "Archivado",
    url: "https://example.com/historia"
  }
];

export async function fetchResourcesByClass(clase: string): Promise<Resource[]> {
  return placeholderResources.filter((resource) => resource.clase === clase || clase === "");
}

import type { Resource } from "@/domain/entities/resource";
import type { User } from "@/domain/entities/user";

type NotionPage = {
  id: string;
  properties: Record<string, unknown>;
};

export function mapUser(page: NotionPage): User {
  const user = page.properties as {
    Nombre?: { title?: Array<{ plain_text?: string }> };
    Clase?: { select?: { name?: string } };
    Estado?: { status?: { name?: string } };
  };

  return {
    nombre: user.Nombre?.title?.[0]?.plain_text ?? "",
    clase: user.Clase?.select?.name ?? "",
    estado: user.Estado?.status?.name,
  };
}

export function mapResource(page: NotionPage, content: string): Resource {
  const properties = page.properties as {
    Titulo?: { title?: Array<{ plain_text?: string }> };
    URL?: { url?: string };
    Comentarios?: { rich_text?: Array<{ plain_text?: string }> };
    Clase?: { select?: { name?: string } };
  };

  return {
    id: page.id,
    title: properties.Titulo?.title?.[0]?.plain_text ?? "Sin titulo",
    link: properties.URL?.url ?? "#",
    description:
      content || properties.Comentarios?.rich_text?.[0]?.plain_text || "Sin descripcion",
    clase: properties.Clase?.select?.name,
  };
}

type NotionParagraphBlock = {
  type: string;
  paragraph?: { rich_text?: Array<{ plain_text?: string }> };
};

export function getParagraphTextFromBlockResponse(response: {
  results?: NotionParagraphBlock[];
}): string {
  if (!response.results) return "";

  return response.results
    .map((block) => {
      if (block.type === "paragraph") {
        return block.paragraph?.rich_text?.[0]?.plain_text ?? "";
      }
      return "";
    })
    .join(" ");
}

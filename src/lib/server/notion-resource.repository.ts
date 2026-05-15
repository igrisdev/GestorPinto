import { notionRequest } from "@/lib/server/notion-client";
import {
  getParagraphTextFromBlockResponse,
  mapResource,
} from "@/lib/server/notion-mappers";
import type { Resource } from "@/domain/entities/resource";
import type { ResourceRepository } from "@/domain/repositories/resource-repository";

type NotionPage = { id: string; properties: Record<string, unknown> };
type NotionQueryResponse = { results: NotionPage[] };
type NotionBlockResponse = {
  results?: Array<{
    type: string;
    paragraph?: { rich_text?: Array<{ plain_text?: string }> };
  }>;
};

export class NotionResourceRepository implements ResourceRepository {
  async getByClass(claseUsuario: string): Promise<Resource[]> {
    try {
      const databaseId = process.env.NOTION_LINK_ID;
      if (!databaseId) {
        return [];
      }

      const queryUrl = `https://api.notion.com/v1/databases/${databaseId}/query`;
      const response = await notionRequest<NotionQueryResponse>(queryUrl, {
        filter: {
          and: [
            { property: "Estado", status: { equals: "Listo" } },
            { property: "Clase", select: { equals: claseUsuario } },
          ],
        },
      });

      const links = await Promise.all(
        response.results.map(async (page) => {
          const blocksUrl = `https://api.notion.com/v1/blocks/${page.id}/children`;
          const blockResponse = await notionRequest<NotionBlockResponse>(blocksUrl);
          const content = getParagraphTextFromBlockResponse(blockResponse);
          return mapResource(page, content);
        })
      );

      return links;
    } catch {
      return [];
    }
  }
}

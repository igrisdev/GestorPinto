import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async () => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    // Opcional: Ordenar por fecha o nombre
    sorts: [
      {
        property: "Nombre", // Cambia esto al nombre de tu columna en Notion
        direction: "ascending",
      },
    ],
  });

  return response.results.map((page) => {
    return {
      id: page.id,
      title: page.properties.Nombre?.title[0]?.plain_text || "Sin título",
      url: page.properties.URL?.url || "#", // Asumiendo que tienes una columna tipo URL
      description: page.properties.Descripcion?.rich_text[0]?.plain_text || "",
    };
  });
};
"use server";

// Tu función base usando fetch
export async function notion(url: string, body?: any) {
  const token = process.env.NOTION_TOKEN;

  const response = await fetch(url, {
    // Si hay body es POST (query), si no, es GET (blocks)
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    // Solo enviamos body si existe
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate: 60 },
  });

  return response.json();
}

export const getPageContent = async (pageId: string) => {
  try {
    const url = `https://api.notion.com/v1/blocks/${pageId}/children`;
    const response = await notion(url);

    if (!response.results) return "";

    return response.results
      .map((block: any) => {
        if (block.type === "paragraph") {
          return block.paragraph.rich_text[0]?.plain_text || "";
        }
        return "";
      })
      .join(" ");
  } catch (error) {
    return "";
  }
};

// Función para traer los links
export const getLinks = async (claseUsuario: string) => {
  try {
    const databaseId = process.env.NOTION_LINK_ID;
    const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

    const response = await notion(url, {
      filter: {
        and: [
          { property: "Estado", status: { equals: "Listo" } },
          { property: "Clase", select: { equals: claseUsuario } }
        ]
      },
    });

    const links = await Promise.all(
      response.results.map(async (page: any) => {
        // Traemos el contenido interno ("Hola 222")
        const content = await getPageContent(page.id);

        return {
          id: page.id,
          title: page.properties.Titulo?.title[0]?.plain_text || "Sin título",
          link: page.properties.URL?.url || "#",
          // Priorizamos el contenido interno sobre los comentarios
          description: content || page.properties.Comentarios?.rich_text[0]?.plain_text || "Sin descripción",
          clase: page.properties.Clase?.select?.name
        };
      })
    );

    return links;
  } catch (error) {
    return [];
  }
};

// Función para el Login
export const loginUser = async (email: string, password: string) => {
  try {
    const databaseId = process.env.DATABASE_USUARIOS_ID;
    const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

    // Pasamos el filtro en el body según la estructura de la API de Notion
    const response = await notion(url, {
      filter: {
        and: [
          { property: "Correo", email: { equals: email } },
          { property: "Contraseña", number: { equals: parseInt(password) } },
        ],
      },
    });

    if (response.results && response.results.length > 0) {
      const user = response.results[0].properties;
      return {
        success: true,
        nombre: user.Nombre.title[0]?.plain_text,
        clase: user.Clase.select?.name,
        estado: user.Estado.status?.name,
      };
    }
    return { success: false, error: "Credenciales incorrectas" };
  } catch (error) {
    return { success: false, error: "Error de conexión" };
  }
};

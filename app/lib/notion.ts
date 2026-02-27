"use server";

// Tu función base usando fetch
export async function notion(url: string, body?: any) {
  const token = process.env.NOTION_TOKEN;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    next: { revalidate: 60 },
  });

  return response.json();
}

// Función para traer los links
export const getLinks = async () => {
  try {
    const databaseId = process.env.NOTION_LINK_ID;
    const url = `https://api.notion.com/v1/databases/${databaseId}/query`;

    // Llamamos a la función pasándole la URL y un body vacío (o con sorts)
    const response = await notion(url, {
      filter: {
        property: "Estado",
        status: {
          equals: "Listo",
        },
      },
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Titulo?.title[0]?.plain_text || "Sin título",
      link: page.properties.URL?.url || "#",
      description:
        page.properties.Comentarios?.rich_text[0]?.plain_text ||
        "Sin descripción",
    }));
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

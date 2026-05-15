const NOTION_API_VERSION = "2022-06-28";

export async function notionRequest<T>(url: string, body?: unknown): Promise<T> {
  const token = process.env.NOTION_TOKEN;

  if (!token) {
    throw new Error("NOTION_TOKEN is not configured");
  }

  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_API_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Notion request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

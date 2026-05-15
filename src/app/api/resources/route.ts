import { NextResponse } from "next/server";
import { NotionResourceRepository } from "@/lib/server/notion-resource.repository";
import { getResourcesByClassUseCase } from "@/application/use-cases/get-resources-by-class";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clase = searchParams.get("clase");

  if (!clase) {
    return NextResponse.json({ resources: [] }, { status: 200 });
  }

  const repository = new NotionResourceRepository();
  const resources = await getResourcesByClassUseCase(clase, repository);

  return NextResponse.json({ resources });
}

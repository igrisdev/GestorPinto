import { NextResponse } from "next/server";
import { loginUserUseCase } from "@/application/use-cases/login-user";
import { NotionAuthRepository } from "@/lib/server/notion-auth.repository";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = body?.email;
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email y contrasena son requeridos" },
      { status: 400 }
    );
  }

  const authRepository = new NotionAuthRepository();
  const result = await loginUserUseCase(email, password, authRepository);

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, user: result.value });
}

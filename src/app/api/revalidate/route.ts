import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const REVALIDATE_SECRET_HEADER = "x-revalidate-secret";

export async function POST(request: Request) {
  const expectedSecret = process.env.REVALIDATE_SECRET;
  const providedSecret = request.headers.get(REVALIDATE_SECRET_HEADER);

  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret." },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path : undefined;

  if (!path) {
    return NextResponse.json(
      { revalidated: false, message: "Missing path." },
      { status: 400 },
    );
  }

  revalidatePath(path);
  return NextResponse.json({ revalidated: true, path, now: Date.now() });
}

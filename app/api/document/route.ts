import { NextResponse } from "next/server";
import prisma from "@/lib/generated/prisma/prisma";

export async function POST(req: Request) {
  const { id, content, title } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "No Id Provided " }, { status: 400 });
  }

  const doc = await prisma.document.upsert({
    where: {
      id,
    },
    update: { content, title },
    create: {
      title: title || "Untitled Document",
      id: id,
      content: content || "",
    },
  });

  return NextResponse.json(doc);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "No Id Provided " }, { status: 400 });
  }

  const doc = await prisma.document.findUnique({
    where: { id: id },
  });
  console.log(doc);
  return NextResponse.json(doc);
}

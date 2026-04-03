import { NextResponse } from "next/server";
import prisma from "@/lib/generated/prisma/prisma";

//request to get all the document
export async function GET() {
  const docs = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(docs);
}

// Request to post a new doc in the storage
export async function POST(req: Request) {
  try {
    const { id, content, title } = await req.json();

    // If there is no ID, it's a brand new document
    if (!id) {
      const newDoc = await prisma.document.create({
        data: {
          title: title || "Untitled Document",
          content: content || "",
        },
      });
      return NextResponse.json(newDoc);
    }

    // If there IS an ID, we update or create (upsert)
    const doc = await prisma.document.upsert({
      where: { id: id },
      update: {
        title: title ?? "Untitled Document",
        content: content ?? "",
      },
      create: {
        id: id,
        title: title || "Untitled Document",
        content: content || "",
      },
    });

    return NextResponse.json(doc);
  } catch (error) {
    console.error("Request Error", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 },
    );
  }
}

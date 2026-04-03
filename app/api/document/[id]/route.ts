import prisma from "@/lib/generated/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const docs = await prisma.document.findUnique({
    where: { id },
  });
  console.log(docs);
  return NextResponse.json(docs);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const body = await req.json();
  const updatedDoc = await prisma.document.update({
    where: {
      id,
    },
    data: {
      title: body.title,
    },
  });

  return NextResponse.json(updatedDoc);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  await prisma.document.delete({
    where: {
      id: id,
    },
  });

  return NextResponse.json("deleted");
}

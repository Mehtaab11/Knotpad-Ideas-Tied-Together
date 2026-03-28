import { NextResponse } from "next/server";

let content = "";

export async function POST(request: Request) {

  const body = await request.json();
  content = body.content;

  return NextResponse.json({ success: true });
}

export async function GET() {
    console.log(content)
  return NextResponse.json({ content });
}

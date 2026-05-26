import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const isAnalystOrAbove =
    session.user.role === "ADMIN" ||
    session.user.role === "EXECUTIVE" ||
    session.user.role === "ANALYST";

  const documents = await prisma.document.findMany({
    where: isAdmin
      ? {}
      : isAnalystOrAbove
      ? {}
      : { isConfidential: false },
    orderBy: { createdAt: "desc" },
    include: {
      uploader: { select: { id: true, name: true, role: true } },
    },
  });

  return NextResponse.json(documents);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role === "VIEWER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, category, isConfidential, tags } = body;

  if (!title || !category) {
    return NextResponse.json(
      { error: "Title and category are required" },
      { status: 400 }
    );
  }

  const document = await prisma.document.create({
    data: {
      title,
      description,
      category,
      isConfidential: isConfidential ?? false,
      tags,
      uploadedBy: session.user.id,
    },
  });

  return NextResponse.json(document, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "VIEWER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reports = await prisma.financialReport.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !["ADMIN", "EXECUTIVE"].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, period, type, totalAssets, totalRevenue, netIncome, data } = body;

  if (!title || !period || !type) {
    return NextResponse.json(
      { error: "Title, period, and type are required" },
      { status: 400 }
    );
  }

  const report = await prisma.financialReport.create({
    data: {
      title,
      period,
      type,
      totalAssets: totalAssets ?? 0,
      totalRevenue: totalRevenue ?? 0,
      netIncome: netIncome ?? 0,
      data: typeof data === "string" ? data : JSON.stringify(data ?? {}),
    },
  });

  return NextResponse.json(report, { status: 201 });
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const companies = await prisma.portfolioCompany.findMany({
    orderBy: { valuation: "desc" },
  });
  return NextResponse.json(companies);
}

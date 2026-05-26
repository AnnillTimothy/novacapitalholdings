import { PrismaClient } from "../app/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbUrl = process.env.DATABASE_URL ?? "file:" + path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@novacapital.com" },
    update: {},
    create: {
      email: "admin@novacapital.com",
      name: "Alex Nova",
      password: adminPassword,
      role: "ADMIN",
      department: "Executive Office",
    },
  });

  // Create executive user
  const execPassword = await bcrypt.hash("exec123!", 12);
  await prisma.user.upsert({
    where: { email: "executive@novacapital.com" },
    update: {},
    create: {
      email: "executive@novacapital.com",
      name: "Sarah Chen",
      password: execPassword,
      role: "EXECUTIVE",
      department: "Investment",
    },
  });

  // Create analyst user
  const analystPassword = await bcrypt.hash("analyst123!", 12);
  await prisma.user.upsert({
    where: { email: "analyst@novacapital.com" },
    update: {},
    create: {
      email: "analyst@novacapital.com",
      name: "James Wright",
      password: analystPassword,
      role: "ANALYST",
      department: "Research",
    },
  });

  console.log("✅ Users created");

  // Create portfolio companies
  const portfolioData = [
    {
      name: "NovaTech Systems",
      ticker: "NTS",
      sector: "Technology",
      description: "AI-powered enterprise software solutions",
      ownership: 67.5,
      valuation: 4200000000,
      invested: 850000000,
      status: "Active",
      employees: 2400,
      founded: 2018,
      headquarters: "San Francisco, CA",
      website: "https://novatech.example.com",
    },
    {
      name: "Quantum Energy Corp",
      ticker: "QEC",
      sector: "Clean Energy",
      description: "Next-generation fusion and solar energy",
      ownership: 42.0,
      valuation: 8700000000,
      invested: 1200000000,
      status: "Active",
      employees: 5600,
      founded: 2015,
      headquarters: "Houston, TX",
    },
    {
      name: "BioNova Pharmaceuticals",
      ticker: "BNP",
      sector: "Healthcare",
      description: "Gene therapy and precision medicine",
      ownership: 31.2,
      valuation: 3100000000,
      invested: 620000000,
      status: "Active",
      employees: 1800,
      founded: 2019,
      headquarters: "Boston, MA",
    },
    {
      name: "MetaVerse Realty",
      ticker: "MVR",
      sector: "Real Estate",
      description: "Digital and physical real estate convergence",
      ownership: 55.8,
      valuation: 1900000000,
      invested: 310000000,
      status: "Active",
      employees: 890,
      founded: 2021,
      headquarters: "Miami, FL",
    },
    {
      name: "Arctic Logistics",
      ticker: "ARL",
      sector: "Logistics",
      description: "Autonomous supply chain and last-mile delivery",
      ownership: 78.4,
      valuation: 2600000000,
      invested: 450000000,
      status: "Active",
      employees: 7200,
      founded: 2017,
      headquarters: "Chicago, IL",
    },
    {
      name: "DeepSea Mining Inc",
      ticker: "DSM",
      sector: "Resources",
      description: "Sustainable deep-sea mineral extraction",
      ownership: 23.9,
      valuation: 950000000,
      invested: 180000000,
      status: "Developing",
      employees: 340,
      founded: 2022,
      headquarters: "Seattle, WA",
    },
  ];

  for (const company of portfolioData) {
    const existing = await prisma.portfolioCompany.findFirst({ where: { name: company.name } });
    if (!existing) await prisma.portfolioCompany.create({ data: company });
  }

  console.log("✅ Portfolio companies created");

  // Create financial reports
  const financialData = [
    {
      title: "Q4 2024 Annual Report",
      period: "Q4 2024",
      type: "Annual",
      totalAssets: 24500000000,
      totalRevenue: 4800000000,
      netIncome: 1200000000,
      data: JSON.stringify({
        quarters: ["Q1", "Q2", "Q3", "Q4"],
        revenue: [1050000000, 1150000000, 1200000000, 1400000000],
        profit: [260000000, 295000000, 310000000, 335000000],
      }),
    },
    {
      title: "Q3 2024 Report",
      period: "Q3 2024",
      type: "Quarterly",
      totalAssets: 23100000000,
      totalRevenue: 1200000000,
      netIncome: 310000000,
      data: JSON.stringify({
        revenue: 1200000000,
        expenses: 890000000,
        profit: 310000000,
      }),
    },
    {
      title: "Q2 2024 Report",
      period: "Q2 2024",
      type: "Quarterly",
      totalAssets: 21800000000,
      totalRevenue: 1150000000,
      netIncome: 295000000,
      data: JSON.stringify({
        revenue: 1150000000,
        expenses: 855000000,
        profit: 295000000,
      }),
    },
  ];

  for (const report of financialData) {
    const existing = await prisma.financialReport.findFirst({ where: { title: report.title } });
    if (!existing) await prisma.financialReport.create({ data: report });
  }

  console.log("✅ Financial reports created");

  // Create banking accounts
  const bankingData = [
    {
      accountName: "Nova Capital Primary Operating",
      bankName: "Goldman Sachs",
      accountType: "Checking",
      currency: "USD",
      balance: 145000000,
      maskedNumber: "****7842",
      swiftCode: "GSCOUSS",
      routingNumber: "021000089",
      isActive: true,
    },
    {
      accountName: "Investment Reserve Fund",
      bankName: "JPMorgan Chase",
      accountType: "Investment",
      currency: "USD",
      balance: 870000000,
      maskedNumber: "****3291",
      swiftCode: "CHASUS33",
      routingNumber: "021000021",
      isActive: true,
    },
    {
      accountName: "European Operations",
      bankName: "Deutsche Bank",
      accountType: "Checking",
      currency: "EUR",
      balance: 52000000,
      maskedNumber: "****9104",
      swiftCode: "DEUTDEDB",
      isActive: true,
    },
    {
      accountName: "Asia-Pacific Fund",
      bankName: "HSBC",
      accountType: "Investment",
      currency: "USD",
      balance: 310000000,
      maskedNumber: "****5567",
      swiftCode: "HSBCHKHH",
      isActive: true,
    },
  ];

  for (const account of bankingData) {
    const existing = await prisma.bankingAccount.findFirst({ where: { accountName: account.accountName } });
    if (!existing) await prisma.bankingAccount.create({ data: account });
  }

  console.log("✅ Banking accounts created");

  // Create sample documents
  const documentData = [
    {
      title: "Articles of Incorporation",
      description: "Nova Capital Holdings founding documents",
      category: "Legal",
      isConfidential: true,
      uploadedBy: admin.id,
      tags: "incorporation,legal,founding",
    },
    {
      title: "Q4 2024 Investor Relations Pack",
      description: "Annual investor relations presentation",
      category: "Investor Relations",
      isConfidential: false,
      uploadedBy: admin.id,
      tags: "investor,q4,2024",
    },
    {
      title: "NovaTech Acquisition Agreement",
      description: "Full acquisition agreement for NovaTech Systems",
      category: "M&A",
      isConfidential: true,
      uploadedBy: admin.id,
      tags: "acquisition,novatech,agreement",
    },
    {
      title: "Employee Stock Option Plan",
      description: "ESOP documentation for key executives",
      category: "HR",
      isConfidential: true,
      uploadedBy: admin.id,
      tags: "esop,hr,compensation",
    },
    {
      title: "Risk Management Framework",
      description: "Enterprise risk management guidelines",
      category: "Compliance",
      isConfidential: false,
      uploadedBy: admin.id,
      tags: "risk,compliance,framework",
    },
  ];

  for (const doc of documentData) {
    const existing = await prisma.document.findFirst({ where: { title: doc.title } });
    if (!existing) await prisma.document.create({ data: doc });
  }

  console.log("✅ Documents created");
  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Demo Credentials:");
  console.log("  Admin:     admin@novacapital.com / admin123!");
  console.log("  Executive: executive@novacapital.com / exec123!");
  console.log("  Analyst:   analyst@novacapital.com / analyst123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

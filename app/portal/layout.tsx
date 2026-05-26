import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PortalSidebar from "@/components/portal/Sidebar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <PortalSidebar user={session.user} />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

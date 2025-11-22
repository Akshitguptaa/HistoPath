import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { Header } from "@/components/Header";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/");

  const chats = await prisma.chat.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
  });

  const userName = user.firstName || user.username || "User";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <DashboardClient chats={chats} userName={userName} />
      </main>
    </div>
  );
}

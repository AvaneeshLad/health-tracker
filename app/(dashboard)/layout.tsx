import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppHeader } from "@/components/layout/AppHeader";
import { Navigation } from "@/components/layout/Navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-8">
      <AppHeader />
      <Navigation />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }
  return session.user as { id: string; name?: string | null; email?: string | null };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

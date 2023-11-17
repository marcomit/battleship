"use client";

import { getServerAuthSession } from "@/lib/auth";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  return <>{session?.user.email}</>;
}

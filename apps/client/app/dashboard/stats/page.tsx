"use client";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page.header";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <main>
      <PageHeader>
        <PageHeaderHeading>Home</PageHeaderHeading>
        <PageHeaderDescription>
          You can find your ELO and recent games
        </PageHeaderDescription>
      </PageHeader>
      {mounted && JSON.stringify(session?.user)}
    </main>
  );
}

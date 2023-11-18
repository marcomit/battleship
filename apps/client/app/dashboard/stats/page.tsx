"use client";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page.header";
import { useKeys } from "@/store/use-keys";
import { useEffect, useState } from "react";

export default function Page() {
  const [keys] = useKeys();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <main>
      <PageHeader>
        <PageHeaderHeading>Home</PageHeaderHeading>
        <PageHeaderDescription>
          You can find your ELO and recent games
        </PageHeaderDescription>
      </PageHeader>
      {mounted && JSON.stringify(keys)}
    </main>
  );
}

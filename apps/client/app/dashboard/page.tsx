"use client";

import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page.header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  return (
    <main>
      <PageHeader>
        <PageHeaderHeading>Welcome</PageHeaderHeading>
        <PageHeaderDescription>{session?.user.name}</PageHeaderDescription>
      </PageHeader>
      <Avatar>
        <AvatarFallback>
          <Icons.logo className="w-8 h-8" />
        </AvatarFallback>
        <AvatarImage src={session?.user.image!} />
      </Avatar>
    </main>
  );
}

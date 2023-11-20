"use client";

import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitialLetter } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function UserAvatar({ user }: { user?: Partial<User> }) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);
  return (
    <Avatar>
      <AvatarImage src={user?.image!} />
      <AvatarFallback>
        {mounted && user ? getInitialLetter(user?.name!) : "XX"}
      </AvatarFallback>
    </Avatar>
  );
}

"use client";

import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn, getInitialLetter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ClassArray, ClassValue } from "clsx";

type UserAvatarProps = { user: Partial<User>; className?: string };

export default function UserAvatar({ user, className }: UserAvatarProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={user?.image!} />
      <AvatarFallback>
        {mounted && user ? getInitialLetter(user?.name!) : "XX"}
      </AvatarFallback>
    </Avatar>
  );
}

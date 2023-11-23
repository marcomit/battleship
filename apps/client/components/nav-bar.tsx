"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import LogOut from "./log-out";
import { useSession } from "next-auth/react";
import { useNavBar } from "@/store/use-navbar";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { ThemeCustomizer } from "./theme/customizer";
import { useEffect, useState } from "react";
import UserAvatar from "./user-avatar";
import { navBarItems } from "@/config/navbar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function NavBar() {
  const { data: session } = useSession();
  const { currentNavBar, setCurrentNavBar, resetNotification, notifications } =
    useNavBar();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <aside className="max-sm:hidden sticky top-0 h-screen md:w-56 max-sm:w-24 bg-accent p-4">
      <div className="flex items-center mb-4 space-x-2 justify-between">
        <UserAvatar user={session?.user!} className="max-md:mx-auto" />
        <p className="whitespace-pre max-md:hidden">{session?.user.username}</p>
        <ThemeCustomizer />
      </div>
      <Separator />
      <nav className="space-y-2 mt-2">
        {navBarItems.map(
          (item, index) =>
            mounted && (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      setCurrentNavBar(index);
                      resetNotification(index);
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      currentNavBar === index && "bg-background/80",
                      "w-full flex items-center justify-start max-md:justify-center hover:bg-background space-x-2 py-2 px-4 relative"
                    )}
                  >
                    {item.icon}
                    <span className="text-sm font-medium max-md:hidden">
                      {item.label}
                    </span>
                    {notifications[index] > 0 && (
                      <Badge
                        className="absolute top-1/2 -translate-y-1/2 right-1"
                        variant={"destructive"}
                      >
                        {notifications[index]}
                      </Badge>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            )
        )}
        <LogOut />
      </nav>
    </aside>
  );
}

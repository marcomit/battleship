"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import LogOut from "./log-out";
import { useSession } from "next-auth/react";
import { useNavBar } from "@/store/use-navbar";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button";
import { ThemeCustomizer } from "./theme/customizer";
import { useEffect } from "react";
import UserAvatar from "./user-avatar";

export default function NavBar() {
  const { data: session } = useSession();
  const { navBarItems, currentNavBar, setCurrentNavBar, resetNotification } =
    useNavBar();
  useEffect(() => {}, [currentNavBar]);
  return (
    <aside className="sticky top-0 h-screen w-56 bg-accent p-4">
      <div className="flex items-center mb-4 space-x-2 justify-between">
        <UserAvatar user={session?.user!} />
        <p className="whitespace-pre">{session?.user.username}</p>
        <ThemeCustomizer />
      </div>
      <Separator />
      <nav className="space-y-2 mt-2">
        {navBarItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => {
              setCurrentNavBar(index);
              resetNotification(index);
              console.log(currentNavBar);
            }}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              currentNavBar === index && "bg-background/80",
              "w-full flex items-center justify-start hover:bg-background space-x-2 py-2 px-4 relative"
            )}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
            {item.notifications > 0 && (
              <Badge
                className="absolute top-1/2 -translate-y-1/2 right-1"
                variant={"destructive"}
              >
                {item.notifications}
              </Badge>
            )}
          </Link>
        ))}
        <LogOut />
      </nav>
    </aside>
  );
}

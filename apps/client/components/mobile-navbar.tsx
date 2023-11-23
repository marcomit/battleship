"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useSession } from "next-auth/react";
import { navBarItems } from "@/config/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useNavBar } from "@/store/use-navbar";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import UserAvatar from "./user-avatar";

export default function MobileNavbar() {
  const { data: session } = useSession();
  const { setCurrentNavBar, resetNotification, currentNavBar, notifications } =
    useNavBar();
  const [open, setOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => setMounted(true), []);

  return (
    <Sheet onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="sm:hidden mt-1 ml-1"
        >
          <HamburgerMenuIcon className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <UserAvatar user={session?.user!} className="w-10 h-10" />
            <p>{session?.user.username}</p>
          </SheetTitle>
        </SheetHeader>
        {navBarItems.map(
          (item, index) =>
            mounted && (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setCurrentNavBar(index);
                  resetNotification(index);
                  setOpen(false);
                }}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  currentNavBar === index && "bg-background/80",
                  "w-full flex items-center justify-start hover:bg-background space-x-2 py-2 mb-2 px-4 relative"
                )}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
                {notifications[index] > 0 && (
                  <Badge
                    className="absolute top-1/2 -translate-y-1/2 right-1"
                    variant={"destructive"}
                  >
                    {notifications[index]}
                  </Badge>
                )}
              </Link>
            )
        )}
        <SheetFooter>
          <Button
            variant={"destructive"}
            className="w-full flex items-center justify-start space-x-2"
          >
            <LogOutIcon className="w-4 h-4" />
            <p>Logout</p>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

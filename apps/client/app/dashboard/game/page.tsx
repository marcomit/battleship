"use client";

import { PlayIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <Link
        href={"/dashboard/game/search"}
        className={buttonVariants({
          variant: "outline",
          className: "flex items-center space-x-2",
        })}
      >
        <PlayIcon className="w-4 h-4" />
        <p>Play</p>
      </Link>
    </main>
  );
}

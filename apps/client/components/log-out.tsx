"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { Icons } from "./icons";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
} from "./ui/alert-dialog";

export default function LogOut() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function signOutEvent() {
    setIsLoading(true);
    await signOut()
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"destructive"}
          className="bg-destructive/75 w-full flex items-center justify-start py-2 px-4"
        >
          {isLoading ? (
            <Icons.spinner className="w-4 h-4 animate-spin mr-4" />
          ) : (
            <LogOutIcon className="w-4 h-4 mr-2" />
          )}
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Logout</AlertDialogTitle>
        <AlertDialogDescription>Logout ???</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={"ghost"}>Close</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={signOutEvent} asChild>
            <Button variant={"destructive"}>Logout</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateSession } from "@/lib/utils";
import { useKeys } from "@/store/use-keys";
import { User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();
  const { privateKey, publicKey, generateKey } = useKeys();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    generateKey();
  }, []);

  return (
    <main className="flex w-screen h-screen">
      <Card className="my-auto mx-auto">
        <CardHeader>
          <CardTitle>You can change your username</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="pippo@777"
            onChange={(e) => setUsername(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Link
            className={buttonVariants()}
            href={"/dashboard"}
            onClick={async (e) => {
              try {
                await generateKey();
                console.log(JSON.stringify(session));
                await axios
                  .put("/api/user?redirect=true", {
                    id: session?.user.id!,
                    publicKey,
                    username,
                  } as Partial<User>)
                  .then((res) => res.data);
                await updateSession({
                  ...session?.user,
                  publicKey,
                  username,
                }).then(() => router.push("/dashboard"));
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Submit
          </Link>
          {JSON.stringify(session?.user.username)}
        </CardFooter>
      </Card>
    </main>
  );
}

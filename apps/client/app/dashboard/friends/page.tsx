import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { AlertDialogAddFriend } from "@/components/add-friend";

export default async function Page() {
  const session = await getServerAuthSession();
  const requestSent = await db.friendRequest.findMany({
    where: { senderId: session?.user.id, status: "IN_PROGRESS" },
    select: { receiver: true },
  });
  const receivedRequest = await db.friendRequest.findMany({
    where: { receiverId: session?.user.id, status: "ACCEPTED" },
    select: { sender: true },
  });
  const friends = await db.friendRequest.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ senderId: session?.user.id }, { receiverId: session?.user.id }],
    },
    include: { sender: true, receiver: true },
  });
  return (
    <main className="space-y-4">
      <AlertDialogAddFriend />
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          {receivedRequest.map(({ sender }) => {
            return (
              <Card key={sender.id}>
                <CardHeader>
                  <CardTitle>{sender.name}</CardTitle>
                  <CardDescription>{sender.email}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="friends">
          {friends.map(({ receiver, sender }) => {
            const friend = session?.user.id === receiver.id ? sender : receiver;
            return (
              <Card key={friend.id}>
                <CardHeader>
                  <CardTitle>{friend.name}</CardTitle>
                  <CardDescription>{friend.email}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="sent">
          {requestSent.map(({ receiver }) => {
            return (
              <Card key={receiver.id}>
                <CardHeader>
                  <CardTitle>{receiver.name}</CardTitle>
                  <CardDescription>{receiver.email}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </main>
  );
}

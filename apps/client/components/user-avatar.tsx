import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function UserAvatar({ user }: { user: Partial<User> }) {
  return (
    <Avatar>
      <AvatarImage src={user.image!} />
      <AvatarFallback>{getInitialLetter(user.name!)}</AvatarFallback>
    </Avatar>
  );
}
function getInitialLetter(name: string): string {
  var initialLetter = "";
  name
    .split(" ")
    .forEach((word, index) =>
      index < 2 ? (initialLetter += word[0].toUpperCase()) : null
    );
  return initialLetter;
}

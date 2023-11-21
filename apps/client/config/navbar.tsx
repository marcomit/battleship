import { HomeIcon, PlayIcon } from "@radix-ui/react-icons";
import { Settings2Icon, Table2Icon, Users2Icon } from "lucide-react";

export const navBarItems = [
  {
    icon: <HomeIcon className="w-4 h-4" />,
    label: "Home",
    href: "/dashboard",
  },
  {
    icon: <PlayIcon className="w-4 h-4" />,
    label: "Play",
    href: "/dashboard/game",
  },
  {
    icon: <Users2Icon className="w-4 h-4" />,
    label: "Friends",
    href: "/dashboard/friends",
  },
  {
    icon: <Table2Icon className="w-4 h-4" />,
    label: "Statistic",
    href: "/dashboard/stats",
  },
  {
    icon: <Settings2Icon className="w-4 h-4" />,
    label: "Settings",
    href: "/dashboard/settings",
  },
];

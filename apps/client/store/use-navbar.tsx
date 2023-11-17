import { HomeIcon, PlayIcon, Table2Icon, Users2Icon } from "lucide-react";
import { create } from "zustand";

export type NavBarItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  notifications: number;
};

type UseNavBar = {
  navBarItems: NavBarItem[];
  currentNavBar: number;
  setCurrentNavBar: (newCurrent: number) => void;
  addNotification: (index: number) => void;
  resetNotification: (index: number) => void;
};

export const useNavBar = create<UseNavBar>()((set) => ({
  navBarItems: [
    {
      icon: <HomeIcon className="w-4 h-4" />,
      label: "Home",
      href: "/dashboard",
      notifications: 0,
    },
    {
      icon: <PlayIcon className="w-4 h-4" />,
      label: "Play",
      href: "/dashboard/game",
      notifications: 0,
    },
    {
      icon: <Users2Icon className="w-4 h-4" />,
      label: "Friends",
      href: "/dashboard/friends",
      notifications: 0,
    },
    {
      icon: <Table2Icon className="w-4 h-4" />,
      label: "Statistic",
      href: "/dashboard/stats",
      notifications: 0,
    },
  ],
  currentNavBar: 0,
  setCurrentNavBar(newCurrent) {
    set({ currentNavBar: newCurrent });
  },
  notifications: [0, 0, 0, 0],
  addNotification(index) {
    set((value) => ({
      navBarItems: value.navBarItems.map((item, i) =>
        i === index ? { ...item, notifications: item.notifications + 1 } : item
      ),
    }));
  },
  resetNotification(index) {
    set((value) => ({
      navBarItems: value.navBarItems.map((item, i) =>
        i === index ? { ...item, notifications: 0 } : item
      ),
    }));
  },
}));

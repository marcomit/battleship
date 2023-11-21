import { HomeIcon, PlayIcon, Table2Icon, Users2Icon } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NavBarItem = {
  icon: React.ReactNode;
  label: string;
  href: string;
  notifications: number;
};

type UseNavBar = {
  currentNavBar: number;
  notifications: number[];
  setCurrentNavBar: (newCurrent: number) => void;
  addNotification: (index: number) => void;
  resetNotification: (index: number) => void;
};

export const useNavBar = create<UseNavBar>()(
  persist(
    (set) => ({
      currentNavBar: 0,
      notifications: [0, 0, 0, 0],
      setCurrentNavBar(newCurrent) {
        set({ currentNavBar: newCurrent });
      },
      addNotification(index) {
        set((state) => ({
          notifications: state.notifications.map((notification, i) =>
            i === index ? notification + 1 : notification
          ),
        }));
      },
      resetNotification(index) {
        set((state) => ({
          notifications: state.notifications.map((notification, i) =>
            i === index ? 0 : notification
          ),
        }));
      },
    }),
    { name: "navbar" }
  )
);

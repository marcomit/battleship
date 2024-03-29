import MobileNavbar from "@/components/mobile-navbar";
import NavBar from "@/components/nav-bar";
import KeysProvider from "@/providers/keys";
import UserEvents from "@/providers/user-events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-sm:block">
      <NavBar />
      <MobileNavbar />
      <UserEvents>
        <aside className="w-full container mt-2">{children}</aside>
      </UserEvents>
    </div>
  );
}

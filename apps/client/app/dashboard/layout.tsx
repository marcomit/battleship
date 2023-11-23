import MobileNavbar from "@/components/mobile-navbar";
import NavBar from "@/components/nav-bar";
import SocketProvider from "@/providers/socket";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-sm:block">
      <NavBar />
      <MobileNavbar />
      <SocketProvider />
      <aside className="w-full container mt-2">{children}</aside>
    </div>
  );
}

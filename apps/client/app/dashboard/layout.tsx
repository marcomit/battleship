import NavBar from "@/components/nav-bar";
import EncryptionProvider from "@/providers/encryption";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <NavBar />
      <EncryptionProvider />
      <aside className="w-full container mt-2">{children}</aside>
    </div>
  );
}

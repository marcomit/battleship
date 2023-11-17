import NavBar from "@/components/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <NavBar />
      <aside className="w-full container mt-2">{children}</aside>
    </div>
  );
}

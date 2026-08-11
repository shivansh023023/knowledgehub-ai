import Sidebar from "@/components/layout/Sidebar";
import Workspace from "@/components/workspace/Workspace";

export default function Page() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-black">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Workspace />
      </main>
    </div>
  );
}
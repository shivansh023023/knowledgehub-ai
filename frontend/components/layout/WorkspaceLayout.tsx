import Sidebar from "./Sidebar";
import Header from "./Header";
import WorkspaceContent from "@/components/workspace/WorkspaceContent";

export default function WorkspaceLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden">
          <WorkspaceContent />
        </main>
      </div>
    </div>
  );
}
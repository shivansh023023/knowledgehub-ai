import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-border bg-card flex flex-col">
      <div className="p-5">
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-5">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase">
          Documents
        </h2>

        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition">
            <FileText className="h-4 w-4" />
            <span className="text-sm">
              No documents uploaded
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
import { GitBranch, Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h1 className="text-xl font-semibold">
          KnowledgeHub AI
        </h1>

        <p className="text-sm text-muted-foreground">
          AI-powered knowledge workspace
        </p>
      </div>

      <div className="flex items-center gap-4">
        <GitBranch className="h-5 w-5 cursor-pointer text-muted-foreground transition hover:text-foreground" />
        <Settings className="h-5 w-5 cursor-pointer text-muted-foreground transition hover:text-foreground" />
      </div>
    </header>
  );
}
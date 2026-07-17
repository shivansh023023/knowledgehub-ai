import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800/60 bg-black/50 px-8 py-5 backdrop-blur-md">

      <h1 className="text-2xl font-bold tracking-tight">
        KnowledgeHub AI
      </h1>

      <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
        <a href="#">Features</a>
        <a href="#">Docs</a>
        <a href="#">GitHub</a>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost">
          Sign In
        </Button>

        <Button>
          Start Building →
        </Button>
      </div>

    </nav>
  );
}
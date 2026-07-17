import { Button } from "@/components/ui/button";
import WorkspacePreview from "./WorkspacePreview";
import CursorGrid from "@/components/reactbits/CursorGrid";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-28">
        <div className="absolute inset-0 opacity-40">
<CursorGrid
  color="#3B82F6"
  cellSize={70}
  radius={180}
  gridOpacity={0.18}
  maxOpacity={1}
  fillOpacity={0}
  lineWidth={1.8}
/>
</div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row">

        {/* Left Side */}
        <div className="flex-1">

          <div className="mb-6 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            🚀 AI Operating System for Knowledge
          </div>

            <h1 className="text-5xl font-extrabold leading-tight lg:text-7xl">
            Turn Your
            <br />
            Knowledge
            <br />
            Into <span className="text-blue-500">Intelligence.</span>
            </h1>

          <p className="mt-8 max-w-2xl text-lg text-zinc-400">
            Build an AI workspace that understands your documents,
            remembers context, and helps you work smarter using
            Retrieval-Augmented Generation and AI Agents.
          </p>

          <div className="mt-10 flex gap-4">

            <Button size="lg">
              Start Building →
            </Button>

            <Button
            size="lg"
            className="border border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
            >
            View GitHub
            </Button>

          </div>

        </div>

        {/* Right Side */}
        <div className="flex flex-1 justify-center">
          <WorkspacePreview />
        </div>

      </div>

    </section>
  );
}
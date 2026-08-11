"use client";

import { useRef } from "react";
import MagicBento from "@/components/reactbits/MagicBento";
import { workspaceCards } from "./WorkspaceBento";

export default function Workspace() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden px-3 py-3 lg:px-4 lg:py-4"
    >
      <MagicBento
  cards={workspaceCards}
  enableMagnetism={false}
  enableTilt={false}
/>
    </div>
  );
}
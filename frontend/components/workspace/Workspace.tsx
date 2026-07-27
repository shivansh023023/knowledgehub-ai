"use client";

import { useRef } from "react";
import MagicBento from "@/components/reactbits/MagicBento";
import { workspaceCards } from "./WorkspaceBento";

export default function Workspace() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden p-8"
    >
      <MagicBento
  cards={workspaceCards}
  enableMagnetism={false}
  enableTilt={false}
/>
    </div>
  );
}
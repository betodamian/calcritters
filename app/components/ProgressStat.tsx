"use client";

import { useFound } from "@/lib/progress";
import { CRITTERS } from "@/lib/critters";

export default function ProgressStat() {
  const found = useFound();

  return (
    <div className="stat">
      <div className="num">
        {found.length}
        <span style={{ color: "var(--faint)" }}> / {CRITTERS.length}</span>
      </div>
      <div className="label">Critters met</div>
    </div>
  );
}

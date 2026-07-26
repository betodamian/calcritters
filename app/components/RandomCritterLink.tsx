"use client";

import { useState } from "react";
import Link from "next/link";
import { CRITTERS } from "@/lib/critters";

/**
 * Links to a critter picked at random on mount. Kept as a small client
 * component so the pick happens fresh per page view, even though the page
 * that renders it (like not-found.tsx) is otherwise static.
 */
export default function RandomCritterLink() {
  const [critter] = useState(
    () => CRITTERS[Math.floor(Math.random() * CRITTERS.length)],
  );

  return (
    <Link href={`/critter/${critter.slug}`} className="btn btn-ghost">
      Meet {critter.name} instead
    </Link>
  );
}

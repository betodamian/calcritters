"use client";

import { CRITTERS } from "@/lib/critters";
import { useFound, useHydrated } from "@/lib/progress";
import CritterCard from "@/app/components/CritterCard";

export default function CritterdexPage() {
  const found = useFound();
  const hydrated = useHydrated();

  return (
    <>
      <section className="hero" style={{ gap: 16 }}>
        <span className="eyebrow">Critterdex</span>
        <h1>Every critter on campus</h1>
        <p className="lede">
          {hydrated
            ? `You've met ${found.length} of ${CRITTERS.length}. Discover the rest by finding their QR codes around campus.`
            : `${CRITTERS.length} critters are hiding around campus.`}
        </p>
      </section>

      <section className="section" style={{ marginTop: 40 }}>
        <div className="critter-grid">
          {CRITTERS.map((critter) => (
            <CritterCard
              key={critter.slug}
              critter={critter}
              found={found.includes(critter.slug)}
            />
          ))}
        </div>
      </section>
    </>
  );
}

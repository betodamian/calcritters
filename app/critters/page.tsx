"use client";

import { useState } from "react";
import { CRITTERS } from "@/lib/critters";
import { resetFound, useFound, useHydrated } from "@/lib/progress";
import CritterCard from "@/app/components/CritterCard";

export default function CritterdexPage() {
  const found = useFound();
  const hydrated = useHydrated();
  const [confirming, setConfirming] = useState(false);

  function handleReset() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    resetFound();
    setConfirming(false);
  }

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
        {hydrated && found.length > 0 && (
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: "fit-content" }}
            onClick={handleReset}
            onBlur={() => setConfirming(false)}
          >
            {confirming ? "Click again to confirm reset" : "Reset Critterdex"}
          </button>
        )}
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

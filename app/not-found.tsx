import type { Metadata } from "next";
import Link from "next/link";
import RandomCritterLink from "@/app/components/RandomCritterLink";

export const metadata: Metadata = {
  title: "Critter not found · CalCritters",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="center-state">
      <h1>This critter wandered off</h1>
      <p>
        We couldn&apos;t find what you were looking for. It may not exist yet, or
        the trail went cold.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/critters" className="btn btn-primary">
          Open the Critterdex
        </Link>
        <RandomCritterLink />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CRITTERS, getCritter } from "@/lib/critters";
import CritterChat from "./CritterChat";
import ShareLink from "@/app/components/ShareLink";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CRITTERS.map((critter) => ({ slug: critter.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const critter = getCritter(slug);
  if (!critter) {
    return { title: "Unknown critter · CalCritters" };
  }
  return {
    title: `${critter.name} · CalCritters`,
    description: `${critter.tagline} Meet ${critter.name}, the ${critter.species.toLowerCase()} living at ${critter.location}.`,
  };
}

export default async function CritterPage({ params }: PageProps) {
  const { slug } = await params;
  const critter = getCritter(slug);

  if (!critter) {
    notFound();
  }

  const accentStyle = {
    ["--accent" as string]: critter.colors.primary,
  } as React.CSSProperties;

  return (
    <div style={accentStyle}>
      <Link href="/critters" className="back-link">
        ← Back to Critterdex
      </Link>

      <section className="critter-hero">
        <span className="big-avatar" aria-hidden="true">
          {critter.emoji}
        </span>
        <div>
          <h1>{critter.name}</h1>
          <div className="species">{critter.species}</div>
          <div className="trait-row">
            {critter.traits.map((trait) => (
              <span key={trait} className="chip">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </section>

      <p className="bio">{critter.bio}</p>

      <div className="location-card">
        <span className="pin" aria-hidden="true">
          📍
        </span>
        <div>
          <div className="loc-name">{critter.location}</div>
          <div className="loc-hint">{critter.locationHint}</div>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <ShareLink slug={critter.slug} name={critter.name} />
      </div>

      <CritterChat critter={critter} />
    </div>
  );
}

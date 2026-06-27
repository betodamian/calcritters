import Link from "next/link";
import type { Critter } from "@/lib/critters";

interface Props {
  critter: Critter;
  found: boolean;
}

export default function CritterCard({ critter, found }: Props) {
  const style = {
    ["--card-accent" as string]: critter.colors.primary,
  } as React.CSSProperties;

  return (
    <Link
      href={`/critter/${critter.slug}`}
      className={`critter-card${found ? "" : " locked"}`}
      style={style}
    >
      <span className="glow" aria-hidden="true" />
      {found && <span className="badge-found">Met</span>}
      <span className="critter-avatar" aria-hidden="true">
        {critter.emoji}
      </span>
      <div>
        <span className="critter-species">{critter.species}</span>
        <h3>{found ? critter.name : "???"}</h3>
      </div>
      <p className="critter-tagline">
        {found ? critter.tagline : "Not yet discovered. Find the QR code on campus."}
      </p>
      <span className="critter-meta">
        <span aria-hidden="true">📍</span>
        {critter.location}
      </span>
    </Link>
  );
}

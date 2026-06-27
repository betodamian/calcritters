import Link from "next/link";

export default function NotFound() {
  return (
    <div className="center-state">
      <h1>This critter wandered off</h1>
      <p>
        We couldn&apos;t find what you were looking for. It may not exist yet, or
        the trail went cold.
      </p>
      <Link href="/critters" className="btn btn-primary">
        Open the Critterdex
      </Link>
    </div>
  );
}

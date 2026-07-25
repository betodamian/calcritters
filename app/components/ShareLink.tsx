"use client";

import { useState } from "react";

interface Props {
  slug: string;
  name: string;
}

/** Copies this critter's direct URL to the clipboard so players can share it. */
export default function ShareLink({ slug, name }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = `${window.location.origin}/critter/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be blocked (permissions, insecure context); fail quietly.
    }
  }

  return (
    <button
      type="button"
      className="btn btn-ghost"
      style={{ width: "fit-content" }}
      onClick={handleClick}
    >
      {copied ? "Link copied!" : `Share ${name}'s page`}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CRITTERS } from "@/lib/critters";

export default function QrPage() {
  const [origin, setOrigin] = useState("");
  const [codes, setCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    async function build() {
      const base = window.location.origin;
      const entries = await Promise.all(
        CRITTERS.map(async (critter) => {
          const url = `${base}/critter/${critter.slug}`;
          const dataUrl = await QRCode.toDataURL(url, {
            width: 240,
            margin: 1,
            color: { dark: "#0b0d12", light: "#ffffff" },
          });
          return [critter.slug, dataUrl] as const;
        }),
      );
      if (!cancelled) {
        setOrigin(base);
        setCodes(Object.fromEntries(entries));
      }
    }
    build();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero" style={{ gap: 16 }}>
        <span className="eyebrow">For organizers</span>
        <h1>Printable critter codes</h1>
        <p className="lede">
          Print these QR codes and place each one at its critter&apos;s campus
          location. When a player scans a code, it opens that critter&apos;s page
          and adds it to their Critterdex.
        </p>
      </section>

      <section className="section" style={{ marginTop: 36 }}>
        <div className="notice">
          Codes point at <strong>{origin || "this site"}</strong>. Deploy the app
          and reload this page so the codes encode your live URL before printing.
        </div>

        <div className="qr-grid">
          {CRITTERS.map((critter) => {
            const url = origin ? `${origin}/critter/${critter.slug}` : "";
            return (
              <div className="qr-card" key={critter.slug}>
                {codes[critter.slug] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={codes[critter.slug]}
                    alt={`QR code for ${critter.name}`}
                    width={120}
                    height={120}
                  />
                ) : (
                  <div style={{ width: 120, height: 120 }} aria-hidden="true" />
                )}
                <div>
                  <h3>
                    {critter.emoji} {critter.name}
                  </h3>
                  <div className="loc">{critter.location}</div>
                  <div className="url">{url}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

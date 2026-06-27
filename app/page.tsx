import Link from "next/link";
import { CRITTERS } from "@/lib/critters";
import CritterCard from "@/app/components/CritterCard";
import ProgressStat from "@/app/components/ProgressStat";

export default function Home() {
  const preview = CRITTERS.slice(0, 3);

  return (
    <>
      <section className="hero">
        <span className="eyebrow">Campus Alternate Reality Game</span>
        <h1>Scan a code. Meet a critter. Explore campus.</h1>
        <p className="lede">
          CalCritters hides characters around campus behind QR codes. Find one,
          scan it, and strike up a conversation with a creature that has its own
          personality, home, and stories to tell.
        </p>
        <div className="hero-actions">
          <Link href="/critters" className="btn btn-primary">
            Open the Critterdex
          </Link>
          <Link href="/qr" className="btn btn-ghost">
            I&apos;m running an event
          </Link>
        </div>
        <div className="hero-stats">
          <ProgressStat />
          <div className="stat">
            <div className="num">{CRITTERS.length}</div>
            <div className="label">Critters on campus</div>
          </div>
          <div className="stat">
            <div className="num">150+</div>
            <div className="label">Players reached</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>How it works</h2>
        </div>
        <div className="steps">
          <div className="step">
            <span className="num">01</span>
            <h3>Find a QR code</h3>
            <p>
              Organizers place critter codes at real campus landmarks, from the
              bell tower to the creek.
            </p>
          </div>
          <div className="step">
            <span className="num">02</span>
            <h3>Meet the critter</h3>
            <p>
              Scanning opens that critter&apos;s page and adds it to your
              Critterdex. Each one is unlocked by visiting in person.
            </p>
          </div>
          <div className="step">
            <span className="num">03</span>
            <h3>Have a chat</h3>
            <p>
              Talk with the critter in real time. Every character responds in its
              own voice, powered by a language model.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>A few of the locals</h2>
          <Link href="/critters" className="chip">
            See all {CRITTERS.length} →
          </Link>
        </div>
        <div className="critter-grid">
          {preview.map((critter) => (
            <CritterCard key={critter.slug} critter={critter} found />
          ))}
        </div>
      </section>
    </>
  );
}

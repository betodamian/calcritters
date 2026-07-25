// Shown automatically by Next.js while a critter page's data/streaming
// content is being prepared. Mirrors the page's layout with simple pulsing
// placeholders so navigation doesn't feel like a blank flash.
export default function LoadingCritter() {
  return (
    <div aria-busy="true" aria-label="Loading critter">
      <div className="skeleton" style={{ width: 140, height: 16, marginBottom: 24 }} />

      <section className="critter-hero">
        <span className="skeleton" style={{ width: 64, height: 64, borderRadius: "50%" }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: "60%", height: 28, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: "40%", height: 16 }} />
        </div>
      </section>

      <div className="skeleton" style={{ width: "100%", height: 60, marginTop: 20 }} />
      <div className="skeleton" style={{ width: "100%", height: 80, marginTop: 20 }} />
    </div>
  );
}

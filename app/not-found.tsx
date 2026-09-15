import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b0b0c", color: "#fff", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, color: "#d50f23", letterSpacing: ".12em", textTransform: "uppercase", fontSize: ".72rem", fontWeight: 700 }}>404</p>
        <h1 style={{ margin: "1rem 0", fontFamily: "Georgia, serif", fontSize: "clamp(2.5rem, 8vw, 5rem)", letterSpacing: "-.06em", fontWeight: 400 }}>Page introuvable</h1>
        <p style={{ margin: "0 0 1.5rem", color: "rgba(255,255,255,.7)" }}>La page demandée n’existe pas ou a été déplacée.</p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "999px", background: "#d50f23", color: "#fff", padding: ".8rem 1.2rem", fontWeight: 700, textDecoration: "none" }}>
          Revenir à l’accueil
        </Link>
      </div>
    </main>
  );
}

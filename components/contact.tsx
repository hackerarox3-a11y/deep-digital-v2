"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/constants/site";

const contacts = [
  ["WhatsApp", "WhatsApp Business", "Disponible 7 j/7 • Réponse sous 15 min", `https://wa.me/${site.whatsappNumber}`],
  ["Instagram", site.instagram, "Galerie et coulisses", "https://www.instagram.com/deep_digital/"],
  ["Commandes", site.whatsappDisplay, "Du lundi au vendredi • 9 h–19 h", `tel:${site.whatsappDisplay.replace(/\s/g, "")}`],
  ["Courriel", site.email, "Partenariats et demandes professionnelles", `mailto:${site.email}`],
] as const;

export function Contact() {
  const [copied, setCopied] = useState("");
  const [copyError, setCopyError] = useState("");
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setCopyError("");
      window.setTimeout(() => setCopied(""), 1800);
    } catch (error) {
      console.error("Impossible de copier les coordonnées.", error);
      setCopied("");
      setCopyError("La copie a échoué. Sélectionnez les coordonnées pour les copier.");
    }
  }

  return (
    <section id="contact" className="contact section-shell">
      <SectionHeading eyebrow="Votre commande | Contact" title="Finalisons votre commande." description="Notre équipe confirme avec vous la disponibilité, les tailles, les couleurs, le montant total et les modalités de livraison directement par WhatsApp." />
      <div className="contact__layout">
        <div className="contact__cards">
          {contacts.map(([label, value, note, href]) => (
            <article key={label} className="contact-card">
              <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"><span>{label}</span><strong>{value}</strong><small>{note}</small></a>
              <button type="button" onClick={() => copy(value)} aria-label={`Copier ${value}`}>{copied === value ? "Copié" : "Copier"}</button>
            </article>
          ))}
          {copyError && <p className="contact__copy-error" role="status">{copyError}</p>}
        </div>
        <div className="map-card">
          <iframe title="Atelier Deep Digital à Abidjan" loading="lazy" src="https://www.google.com/maps?q=5.3285069,-4.0139607&z=14&output=embed" />
          <div className="map-card__details"><span>Nous trouver</span><strong>Abidjan, Côte d&apos;Ivoire</strong><a className="button button--dark" href={site.mapUrl} target="_blank" rel="noreferrer">Ouvrir dans Google Maps <span aria-hidden>↗</span></a></div>
        </div>
      </div>
    </section>
  );
}

import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__intro"><BrandMark /><p>Atelier de personnalisation textile à Abidjan. Nous donnons vie à vos idées grâce à la broderie et à l’impression haute définition.</p></div>
      <div><p>Navigation</p><a href="#modeles">Voir les modèles</a><a href="#realisations">Nos réalisations</a></div>
      <div><p>Informations</p><a href="#contact">Contact et commandes</a><a href="#contact">Demander un devis</a></div>
      <div className="site-footer__back"><a href="#top">Retour en haut <span aria-hidden>↑</span></a></div>
      <div className="site-footer__bottom"><p>© 2026 Deep Digital. Tous droits réservés.</p><p>Fait avec <span aria-hidden>♥</span> pour un style unique.</p></div>
    </footer>
  );
}

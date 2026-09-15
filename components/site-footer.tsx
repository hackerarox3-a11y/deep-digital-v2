import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__intro"><BrandMark /><p>Atelier de personnalisation textile haut de gamme. Nous donnons vie à vos idées en broderie ou impression haute définition pour des vêtements uniques à votre image.</p></div>
      <div><p>Navigation</p><a href="#modeles">Modèles</a><a href="#studio">Studio Créatif</a></div>
      <div><p>Légal &amp; B2B</p><a href="#contact">Mentions Légales</a><a href="#contact">CGV &amp; CGU</a></div>
      <div className="site-footer__back"><a href="#top">Retour en haut <span aria-hidden>↑</span></a></div>
      <div className="site-footer__bottom"><p>© 2026 Deep Digital. Tous droits réservés.</p><p>Fait avec <span aria-hidden>♥</span> pour un style unique.</p></div>
    </footer>
  );
}

# Audit de référence — Deep Digital

Source analysée : `https://deep-digit.vercel.app` le 13 juillet 2026.

## Pages et routes

Le site public est une **page unique**. Les ancres de navigation du site de référence sont :

- `#modeles` — catalogue ;
- `#contact` — contacts et carte.

Dans l'évolution V2, la navigation ajoute également `#realisations`.

Il n’expose pas de tunnel de paiement : le passage à la commande est une discussion WhatsApp avec l’atelier.

## Sections et contenus conservés

| Section | Textes / informations relevés | Interaction existante |
| --- | --- | --- |
| Header | `DEEP DIGITAL`, `Modèles`, `Contact`, `Commander` | Ancres vers les sections |
| Hero | `PERSONNALISEZ VOTRE IDENTITÉ`, `T-shirts, hoodies, polos et accessoires créés à votre image.` | CTA vers le catalogue et WhatsApp direct |
| Catalogue | `Des supports textiles sélectionnés pour leur tenue irréprochable.`, `No cheap fabrics No basic prints`, `Seulement le meilleur pour votre vêtement personnalisé d'exception.` | Cartes produits et commandes WhatsApp |
| Avis | `Ceux qui créent avec nous.` et les trois témoignages | Cartes témoignages |
| Contact | `Finalisons votre commande.` et les modalités de confirmation | WhatsApp, Instagram, téléphone, email, Google Maps |
| Footer | Présentation de l’atelier, Navigation, Légal & B2B, copyright | Ancres et retour en haut |

## Catalogue existant

Les cartes visibles portent les caractéristiques suivantes :

1. **T-Shirts** — `240 g/m² Premium`, coton biologique haut de gamme, `DTF ou Sérigraphie`.
2. **Hoodies** — `400 g/m² Ultra-Lourd`, molletonné et coupe boxy rétro, `Broderie ou DTF`.
3. **Tote Bags** — `340 g/m² Toile Robuste`, toile rigide et coutures renforcées, `DTF ou Impression Numérique`.

Le brief métier impose également la conservation des **Polos**, **Casquettes**, **Sweatshirts**, et des techniques **Impression DTF**, **Sérigraphie**, **Broderie**, **Impression Numérique**. Ils sont intégrés au catalogue V2 avec grammage, description, technique, aperçu et fiche détaillée.

## Composants et boutons existants

- Header et logo typographique ; navigation d’ancres ; CTA `Commander`.
- Hero à visuel textile.
- Cartes catalogue avec prix indicatif et commande directe via WhatsApp.
- Cartes contact : WhatsApp Business, `@deep_digital`, `+225 01 41 45 16 20`, `contact@deepdigital.studio`.
- Carte Google et bouton `Ouvrir dans Google Maps`.
- Footer : commande d’un modèle, contact, informations légales et retour en haut.

## Formulaires et logique métier

Il n’y a pas de paiement en ligne. Chaque modèle ouvre WhatsApp avec une demande de commande préremplie ; le client précise la taille, la couleur et la quantité puis confirme le prix final, le délai et la livraison avec l’atelier.

## Parcours utilisateur conservé

1. L’utilisateur découvre le positionnement premium depuis le hero.
2. Il consulte les supports et leurs caractéristiques techniques.
3. Il choisit un modèle et ouvre le message de commande correspondant dans WhatsApp.
4. Il envoie sa demande puis finalise taille, couleur, quantité, prix et livraison avec l’atelier.
5. Il peut alternativement contacter Deep Digital, consulter Instagram ou localiser l’atelier à Abidjan.

## Proposition V2 sans changement d’identité

- Conserver le noir, blanc, rouge Deep Digital, l’éditorial ample et l’imagerie textile.
- Garder la page vitrine à forte direction artistique, sans bascule vers un dashboard ou une interface SaaS.
- Ajouter un motion discret : reveals, hover, zoom image, header glassmorphism, slider d’avis et feedback de contact.
- Préserver WhatsApp comme étape commerciale de commande et ne pas introduire de paiement en ligne.

## Évolutions livrées en V2

- Le Studio a été retiré ; chaque carte produit lance le parcours de commande WhatsApp.
- Le diaporama Réalisations contient dix images locales du dossier `public/`.
- Le T-shirt possède trois vues sélectionnables. La vue choisie est identifiée dans le message et son image précise est partagée quand le navigateur le permet ; le lien direct de l'image sert de solution de repli.
- Le catalogue et les visuels sont des données de l'application, pas des enregistrements SQLite. La base SQLite persiste uniquement les demandes de `POST /api/quote` ; le parcours WhatsApp n'enregistre pas les commandes dans cette base.

# Audit de référence — Deep Digital

Source analysée : `https://deep-digit.vercel.app` le 13 juillet 2026.

## Pages et routes

Le site public est une **page unique**. Les ancres de navigation sont :

- `#modeles` — catalogue ;
- `#studio` — configurateur ;
- `#contact` — contacts et carte.

Il n’expose pas de tunnel de paiement : le passage à la commande est une discussion WhatsApp avec l’atelier.

## Sections et contenus conservés

| Section | Textes / informations relevés | Interaction existante |
| --- | --- | --- |
| Header | `DEEP DIGITAL`, `Modèles`, `Studio`, `Contact`, `Personnaliser` | Ancres vers les sections |
| Hero | `PERSONNALISEZ VOTRE IDENTITÉ`, `T-shirts, hoodies, polos et accessoires créés à votre image.` | CTA `Personnaliser` |
| Catalogue | `Des supports textiles sélectionnés pour leur tenue irréprochable.`, `No cheap fabrics No basic prints`, `Seulement le meilleur pour votre vêtement personnalisé d'exception.` | Cartes produits |
| Studio | `Configurez votre vêtement personnalisé` et la description du studio virtuel | Recto/Verso, choix de support, couleur, typo, photos, prix, taille, WhatsApp |
| Avis | `Ceux qui créent avec nous.` et les trois témoignages | Cartes témoignages |
| Contact | `Discutons de votre projet créatif.` et le texte d’accompagnement | WhatsApp, Instagram, téléphone, email, Google Maps |
| Footer | Présentation de l’atelier, Navigation, Légal & B2B, copyright | Ancres et retour en haut |

## Catalogue existant

Les cartes visibles portent les caractéristiques suivantes :

1. **T-Shirts** — `240 g/m² Premium`, coton biologique haut de gamme, `DTF ou Sérigraphie`.
2. **Hoodies** — `400 g/m² Ultra-Lourd`, molletonné et coupe boxy rétro, `Broderie ou DTF`.
3. **Tote Bags** — `340 g/m² Toile Robuste`, toile rigide et coutures renforcées, `DTF ou Impression Numérique`.

Le brief métier impose également la conservation des **Polos**, **Casquettes**, **Sweatshirts**, et des techniques **Impression DTF**, **Sérigraphie**, **Broderie**, **Impression Numérique**. Ils sont intégrés au catalogue V2 avec grammage, description, technique, aperçu et fiche détaillée.

## Composants et boutons existants

- Header et logo typographique ; navigation d’ancres ; CTA `Personnaliser`.
- Hero à visuel textile.
- Cartes catalogue et flèche de passage au Studio.
- Studio : `Recto`, `Verso`, `Vêt.`, `Couleur`, `Typo`, `Photos`, `Prix`.
- Choix de support : `T-shirt dès 16 000 F`, `Sweat Capuche dès 17 000 F`, `Tote Bag dès 15 500 F`.
- Tailles : `XS`, `S`, `M`, `L`, `XL`, `XXL`.
- CTA `Exporter vers WhatsApp`.
- Cartes contact : WhatsApp Business, `@deep_digital`, `+225 01 41 45 16 20`, `contact@deepdigital.studio`.
- Carte Google et bouton `Ouvrir dans Google Maps`.
- Footer : `Modèles`, `Studio Créatif`, `Mentions Légales`, `CGV & CGU`, `Retour en haut`.

## Formulaires et logique métier

Il n’y a pas de formulaire de paiement ni de panier. Le Studio est le formulaire de configuration :

- support textile ;
- face Recto / Verso ;
- couleur et tissu ;
- typographie ;
- photo principale / inspirations ;
- taille ;
- estimation ;
- export de la demande via WhatsApp.

L’estimation actuelle visible est `16 000 F CFA HT` pour la configuration par défaut et précise qu’aucun paiement n’est requis en ligne.

## Parcours utilisateur conservé

1. L’utilisateur découvre le positionnement premium depuis le hero.
2. Il consulte les supports et leurs caractéristiques techniques.
3. Il ouvre le Studio, choisit un vêtement, sa face, sa couleur, son design et sa taille.
4. Il consulte l’estimation.
5. Il exporte vers WhatsApp afin de finaliser la maquette HD avec l’atelier.
6. Il peut alternativement contacter Deep Digital, consulter Instagram ou localiser l’atelier à Abidjan.

## Proposition V2 sans changement d’identité

- Conserver le noir, blanc, rouge Deep Digital, l’éditorial ample et l’imagerie textile.
- Garder la page vitrine à forte direction artistique, sans bascule vers un dashboard ou une interface SaaS.
- Ajouter un motion discret : reveals, hover, zoom image, header glassmorphism, slider d’avis et feedback de contact.
- Étendre le Studio sans le remplacer : calques, guides, grille, snap intelligent, zoom, rotation, historique, brouillon local, comparaison et exports.
- Préserver WhatsApp comme étape commerciale finale et ne jamais introduire de paiement en ligne.

# Deep Digital — Version 2

Reconstruction premium de la plateforme **Deep Digital**, pensée pour préserver son identité éditoriale : noir, blanc, rouge, typographie ample et expérience de personnalisation textile au premier plan.

## Parcours conservé

1. Découverte de la marque et accès au Studio via « Personnaliser ».
2. Consultation des supports textiles premium.
3. Personnalisation Recto/Verso, couleur, typographie et photos.
4. Estimation de devis, sans paiement en ligne.
5. Export direct de la demande vers WhatsApp Business.
6. Prise de contact via WhatsApp, Instagram, téléphone, email ou carte.

## Améliorations V2

- Header intelligent et navigation fluide.
- Catalogue animé avec reveal, zoom et focus technique.
- Studio avec calques, déplacements, grille, guides, duplication, annulation/rétablissement et sauvegarde locale.
- Aperçu 360° léger, zoom, vue Recto/Verso, comparaison avant/après et export PNG/PDF imprimable.
- Avis clients à défilement progressif.
- Contacts activables, copie du numéro/email et carte d’Abidjan.
- Accessibilité : focus visibles, boutons nommés, contraste élevé et respect de `prefers-reduced-motion`.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir ensuite `http://localhost:3000`.

## Arborescence

```text
app/           routes, métadonnées et API
components/    sections de la vitrine et composants Studio
animations/    primitives Motion réutilisables
constants/     URLs et valeurs éditoriales stables
data/          catalogue, avis et options du Studio
hooks/         interactions persistantes
lib/           helpers purs
services/      sérialisation du devis et WhatsApp
types/         contrats TypeScript
utils/         export PNG/PDF et formatage
public/        favicon et ressources statiques
```

L’inventaire exhaustif de la version publique et les choix de conservation sont consignés dans [AUDIT_EXISTANT.md](./AUDIT_EXISTANT.md).

## À connecter avant mise en production

- Le numéro WhatsApp dans `constants/site.ts` utilise le numéro public actuel, sans caractère `+` dans l’URL.
- L’API `app/api/quote/route.ts` valide et prépare la demande : connectez-la au CRM, email transactionnel ou table de production souhaitée.
- Le Studio sauvegarde localement dans le navigateur ; brancher un compte client/API pour une synchronisation multi-appareils.

## Vérification recommandée

Après installation des dépendances :

```bash
npm run typecheck
npm run build
```

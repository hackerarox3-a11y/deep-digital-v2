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
- Studio avec calques, déplacements, grille, guides, duplication, annulation/rétablissement, sauvegarde locale et panier qui conserve séparément les designs réellement différents.
- Aperçu 360° léger, zoom, vue Recto/Verso, comparaison avant/après et export PNG/PDF imprimable.
- Avis clients à défilement progressif.
- Contacts activables, copie du numéro/email et carte d’Abidjan.
- Accessibilité : focus visibles, boutons nommés, contraste élevé et respect de `prefers-reduced-motion`.
- API de devis durcie : validation stricte, limite de taille, protection anti-abus et en-têtes HTTP de sécurité.
- Build Hostinger standalone autonome avec copie automatique des fichiers publics et des assets Next.js.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir ensuite `http://localhost:3000`.

## Base de données

Les demandes envoyées à `POST /api/quote` sont enregistrées dans SQLite. En développement, le fichier par défaut est `data/deep-digital.sqlite` et reste ignoré par Git. En production, `DATABASE_PATH` doit désigner un fichier situé dans un dossier absolu, persistant et accessible en écriture.

### Protections et sauvegardes

- L'API devis limite chaque adresse cliente a 10 demandes par fenêtre de 10 minutes, refuse les corps supérieurs à 4 Ko et valide strictement les champs.
- La limite anti-abus est conservée en mémoire du processus Node. Elle convient à une instance unique ; derrière plusieurs instances, configure un rate limiter partagé au proxy ou dans un stockage commun. Le proxy doit fournir un `X-Real-IP` fiable, ou ajouter l'adresse cliente en dernière position de `X-Forwarded-For`.
- Les fichiers SQLite sont écrits de manière atomique et avec des permissions restrictives lorsque le système hôte les prend en charge.
- `npm run db:backup` crée une copie horodatée dans `data/backups` (ou `DATABASE_BACKUP_DIR`) et conserve les 14 copies les plus récentes. Configure une tâche planifiée quotidienne sur Hostinger ; une sauvegarde stockée uniquement sur le même serveur ne protège pas contre la perte du serveur.

Exemple de tâche cron quotidienne à 02:00 sur un VPS Linux :

```cron
0 2 * * * cd /home/your-user/deep-digital && npm run db:backup
```

Stocke également une copie chiffrée hors du serveur et teste régulièrement sa restauration. Le fichier SQLite contient des informations de demandes clients : limite son accès aux comptes système nécessaires.

Les en-têtes HTTP incluent la désactivation du fingerprinting Next.js, la protection contre le MIME sniffing et le framing, une politique de référent et HSTS en production. HSTS suppose que le domaine est servi uniquement en HTTPS.

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

## Déploiement sur Hostinger (Node.js / VPS / Cloud)

Ce projet est un site Next.js avec API serveur. Pour Hostinger, le bon mode de déploiement est un environnement Node.js (VPS/Cloud ou un plan Node.js compatible) plutôt qu’un simple hébergement partagé statique.

### 1. Préparer le projet

```bash
npm install
npm run build
```

Le build prépare automatiquement `.next/standalone` avec le serveur Node, `public/` et les assets compilés de `.next/static`.

### 2. Variables d’environnement

Crée une copie de `.env.example` puis renseigne les valeurs réelles :

```bash
cp .env.example .env.production
```

Variables conseillées :

```env
NODE_ENV=production
DATABASE_PATH=/home/your-user/deep-digital/data/deep-digital.sqlite
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

En production, `DATABASE_PATH` est obligatoire et doit être un chemin absolu vers un dossier persistant et accessible en écriture. Ne le place pas dans `.next/standalone`, `public` ou un dossier remplacé lors des mises à jour.

### 3. Lancer la production

Sur Hostinger, dans le terminal de ton environnement Node :

```bash
npm install
npm run build
DATABASE_PATH=/home/your-user/deep-digital-data/deep-digital.sqlite npm run start
```

Définis `DATABASE_PATH` comme variable persistante dans le panneau Hostinger. Configure le port demandé par Hostinger (`PORT` est lu par le serveur). La commande de démarrage à renseigner est :

```bash
npm run start
```

### 4. Vérifications importantes

- tester `https://votre-domaine.com/api/quote` avec une requête POST
- vérifier que la base SQLite se crée bien dans le chemin défini par `DATABASE_PATH`
- vérifier le formulaire de devis, le WhatsApp, les liens de contact et les pages SEO
- activer TLS/HTTPS via le panneau Hostinger

### 5. Recommandation importante

Si tu déploies sur un hébergement partagé sans support Node.js, ce projet ne sera pas idéalement compatible. Le plus fiable est :

- Hostinger VPS / Cloud
- ou plan Node.js
- ou bien migration vers Vercel pour le front + Supabase/PostgreSQL pour la base

### 6. À finaliser avant mise en ligne

- vrai numéro WhatsApp dans `constants/site.ts`
- vrai domaine et `NEXT_PUBLIC_SITE_URL`
- vraie base de données de production
- intégration CRM/email réelle pour `POST /api/quote`
- tests d’API + lien WhatsApp + responsive mobile

# Deep Digital — Version 2

Reconstruction premium de la plateforme **Deep Digital**, pensée pour préserver son identité éditoriale : noir, blanc, rouge et typographie ample. Le catalogue mène directement à la commande avec l'atelier sur WhatsApp.

## Parcours conservé

1. Découverte de la marque et consultation des supports textiles.
2. Choix d'un modèle et ouverture d'une commande préremplie dans WhatsApp.
3. Envoi du message, puis confirmation de la taille, couleur, quantité, disponibilité, montant total et livraison avec l'atelier.

## Améliorations V2

- Header intelligent et navigation fluide.
- Catalogue animé avec reveal, zoom et focus technique.
- Commande WhatsApp directe par modèle : la variante sélectionnée et son image précise sont jointes via le partage natif quand disponible ; sinon, le message contient le lien direct de cette image.
- Diaporama de dix visuels dans les Réalisations et diaporama des variantes de T-shirts, avec navigation et sélection synchronisée à la commande.
- Navigation directe vers les réalisations de l'atelier.
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

Le catalogue des modèles et les images des diaporamas sont définis dans `data/catalogue.ts` et `components/realisations.tsx` ; ils ne sont pas administrés par SQLite. Seules les demandes envoyées à `POST /api/quote` sont enregistrées dans la base `quotes`. Les commandes du catalogue sont finalisées dans WhatsApp et ne sont pas enregistrées dans cette table.

En développement, le fichier SQLite par défaut est `data/deep-digital.sqlite`. Il est ignoré par Git afin de ne pas publier les demandes clients. En production, `DATABASE_PATH` doit désigner un fichier situé dans un dossier absolu, persistant et accessible en écriture. Une mise à jour du code sur GitHub ne remplace ni ne synchronise la base de production : configure et sauvegarde-la séparément sur Hostinger.

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
components/    sections de la vitrine
animations/    primitives Motion réutilisables
constants/     URLs et valeurs éditoriales stables
data/          catalogue et avis
lib/           helpers purs
services/      préparation des commandes WhatsApp
types/         contrats TypeScript
public/        favicon et ressources statiques
```

L’inventaire exhaustif de la version publique et les choix de conservation sont consignés dans [AUDIT_EXISTANT.md](./AUDIT_EXISTANT.md).

## À connecter avant mise en production

- Le numéro WhatsApp dans `constants/site.ts` doit correspondre au compte de commande officiel, sans caractère `+` dans l’URL.
- L’API `app/api/quote/route.ts` valide et prépare la demande : connectez-la au CRM, email transactionnel ou table de production souhaitée.
- Les commandes initiées depuis le catalogue sont envoyées à WhatsApp ; confirmer les prix, tailles, couleurs, disponibilités et modalités de livraison avec le client avant production.

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
- tester le bouton de commande de chaque modèle, l'ouverture de WhatsApp, les liens de contact et les pages SEO
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

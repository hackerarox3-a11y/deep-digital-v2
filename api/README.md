# API

La route `app/api/quote/route.ts` valide et enregistre les demandes de devis envoyées au serveur.

Les devis sont persistés dans la table SQLite `quotes`. Le catalogue et ses images sont définis dans les fichiers de l'application, et non dans la base.

Les commandes initiées depuis le catalogue sont envoyées directement à l’atelier sur WhatsApp ; cette API n'est pas utilisée par le parcours de commande et ne persiste pas ces commandes.

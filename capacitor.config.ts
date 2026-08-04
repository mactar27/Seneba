import type { CapacitorConfig } from '@capacitor/cli';

// NOTE : l'application mobile utilise le mode "Web View" (server.url).
// Elle charge directement l'URL de production, ce qui permet aux
// Next.js Server Actions de fonctionner normalement côté serveur.
// Le champ `webDir` est requis par le CLI Capacitor mais n'est pas utilisé
// en production puisque server.url est défini.
const config: CapacitorConfig = {
  appId: 'com.seneba.app',
  appName: 'Seneba',
  webDir: 'out',
  server: {
    url: 'https://seneba.com',
    // ⚠️ cleartext supprimé : toutes les communications se font via HTTPS
  }
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.winterarc.tracker',
  appName: 'WinterArc',
  webDir: 'public',
  server: {
    // Replace with your live deployed URL (e.g., https://winter-tracker.vercel.app)
    // Or for local testing on the same Wi-Fi, use your PC's local IP (e.g. http://192.168.1.x:3000)
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    cleartext: true,
  },
};

export default config;

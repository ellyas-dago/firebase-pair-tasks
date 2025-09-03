import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.858997c5d211483098b6432f285febbf',
  appName: 'firebase-pair-tasks',
  webDir: 'dist',
  server: {
    url: 'https://858997c5-d211-4830-98b6-432f285febbf.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
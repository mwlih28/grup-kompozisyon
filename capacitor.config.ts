import type { CapacitorConfig } from '@capacitor/cli';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const config: CapacitorConfig = {
  appId: 'com.grupkompozisyon',
  appName: 'Grup Kompozisyon',
  webDir: '.next',
  server: {
    url: apiUrl,
  },
};

export default config;

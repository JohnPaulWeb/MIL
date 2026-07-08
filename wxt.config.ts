import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    name: 'Misinformation Detector',
    description: 'Detect misinformation in real-time while browsing',
    version: '1.0.0',
    permissions: ['activeTab', 'scripting', 'storage', 'tabs'],
    host_permissions: ['<all_urls>'],
  },
  runner: {
    firefox: 'firefoxProfiler',
  },
  alias: {
    '@': new URL('./').href,
  },
});

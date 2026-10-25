import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// Custom domain on GitHub Pages: `site` is the domain and there is no `base`,
// so internal links are root-relative. public/CNAME carries the domain for
// GitHub to route.
export default defineConfig({
  site: 'https://nostalgiaui.sylvester.works',
  output: 'static',
  integrations: [react()],
});

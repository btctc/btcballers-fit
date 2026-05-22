import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://btcballers.fit',          lastModified: new Date(), priority: 1.0 },
    { url: 'https://btcballers.fit/programs', lastModified: new Date(), priority: 0.9 },
    { url: 'https://btcballers.fit/playbook', lastModified: new Date(), priority: 0.8 },
    { url: 'https://btcballers.fit/about',    lastModified: new Date(), priority: 0.7 },
    { url: 'https://btcballers.fit/contact',  lastModified: new Date(), priority: 0.7 },
  ];
}

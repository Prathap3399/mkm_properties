import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mkmproperties.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact',
          '/projects',
          '/documents',
          '/privacy',
          '/site-visit'
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/login'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mkmproperties.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/contact', '/login', '/privacy', '/site-visit'],
        disallow: [
          '/projects',
          '/projects/*',
          '/documents',
          '/documents/*',
          '/property-guidance',
          '/dashboard',
          '/profile',
          '/admin',
          '/admin/*',
          '/api/*'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

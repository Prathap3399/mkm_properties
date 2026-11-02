import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyMobileBar from '@/components/layout/StickyMobileBar';
import MetaPixel from '@/components/analytics/MetaPixel';

export const viewport: Viewport = {
  themeColor: '#0b4632',
  width: 'device-width',
  initialScale: 1
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mkmproperties.com'),
  title: {
    default: 'MKM Properties – Trichy | Verified Residential Plots & Property Guidance',
    template: '%s | MKM Properties – Trichy'
  },
  description:
    'Find verified residential plots, DTCP-approved layouts, and authentic land guidance in Trichy, Tamil Nadu. Direct consultation with PRATHAP (+91 96290 48171). Panjappur, K.K. Nagar, Samayapuram, Navalpattu.',
  keywords: [
    'Trichy real estate',
    'plots in trichy',
    'residential plots trichy',
    'panjappur new bus stand plots',
    'samayapuram plots',
    'kk nagar trichy land',
    'navalpattu IT park plots',
    'DTCP approved plots trichy',
    'MKM Properties Trichy',
    'திருச்சி வீட்டு மனை'
  ],
  authors: [{ name: 'MKM Properties – Trichy' }],
  creator: 'PRATHAP',
  openGraph: {
    title: 'MKM Properties – Trichy | Verified Residential Plots',
    description:
      'திருச்சியில் உங்கள் தேவைக்கு ஏற்ற மனையைத் தேடுங்கள்! Verified plots in prime locations across Tiruchirappalli with genuine legal guidance.',
    url: 'https://mkmproperties.com',
    siteName: 'MKM Properties – Trichy',
    images: [
      {
        url: '/images/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'MKM Properties – Trichy Residential Layouts'
      }
    ],
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MKM Properties – Trichy | Residential Plots',
    description: 'Find verified residential plots in Trichy with transparent legal guidance.',
    images: ['/images/hero.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <MetaPixel />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyMobileBar />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'UTH Festival 2026 – Music Open Call & Auditions | Grand Egyptian Museum',
  description:
    'Official Music Open Call for UTH Festival 2026 at the Grand Egyptian Museum. 10 selected talents will perform live, receive professional recording studio support and music video production.',
  keywords: [
    'UTH Festival 2026',
    'Music Open Call',
    'Grand Egyptian Museum',
    'Auditions Egypt',
    'مهرجان UTH 2026',
    'تجارب الأداء الموسيقية',
    'المتحف المصري الكبير',
    'مواهب غنائية',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-zinc-100 antialiased selection:bg-gold-500/30 selection:text-gold-200">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

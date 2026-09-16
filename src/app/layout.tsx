import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lobo Weather 🐺 • Para Miriam',
  description: 'El clima de Ciudad Juárez con Lobo el Alaskan Malamute para Corazoncillo',
  manifest: '/manifest.json',
  icons: {
    icon: '/lobo/icon.jpg',
    apple: '/lobo/icon.jpg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Lobo',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020617',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/lobo/icon.jpg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

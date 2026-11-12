import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: 'Quitopia — Reclaim your focus',
  description:
    'A calm, local-only self-control app for quitting porn, gambling, doomscrolling and other habits. No account, no server, everything stays in your browser.',
  manifest: '/manifest.json',
  applicationName: 'Quitopia',
  appleWebApp: { capable: true, title: 'Quitopia', statusBarStyle: 'default' },
  icons: {
    icon: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/icon-192.png' }]
  }
};

export const viewport: Viewport = {
  themeColor: '#0F3D2E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

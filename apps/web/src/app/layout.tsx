import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Transparent Transaction Ledger',
  description: 'A blockchain-powered platform revolutionizing real estate transactions through transparency, automation, and security.',
  keywords: ['blockchain', 'real estate', 'stacks', 'smart contracts', 'transparency'],
  authors: [{ name: 'TTL Development Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IMSS Calculator',
  description: 'Calculate total employee salary costs in Mexico',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}


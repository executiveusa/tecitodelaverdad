import './globals.css';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700']
});

const body = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: 'Tecito de La Verdad — Encuentra tu verdad',
  description:
    'Ediciones limitadas de té, ritual y palabras desde la Ciudad de México. Cada taza contiene una verdad.',
  openGraph: {
    title: 'Tecito de La Verdad',
    description: 'Cada taza contiene una verdad.',
    type: 'website',
    locale: 'es_MX'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}

import './globals.css';

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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

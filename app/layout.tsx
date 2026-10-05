import type { Metadata } from 'next';
import { Cinzel, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-institutional',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Observatório Eleitoral Bahia 2026',
  description:
    'Iniciativa cívica independente para reunir fatos, documentos e evidências sobre a aplicação de recursos públicos no contexto eleitoral da Bahia.',
  authors: [{ name: 'David Pereira de Azevedo' }],
  creator: 'David Pereira de Azevedo',
  publisher: 'Observatório Eleitoral Bahia 2026',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Observatório Eleitoral Bahia 2026 — Não deixe a Bahia ser refém',
    description: 'Transparência, fiscalização cidadã e verdade documentada.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jakarta.variable} ${cinzel.variable}`}>
      <body>{children}</body>
    </html>
  );
}

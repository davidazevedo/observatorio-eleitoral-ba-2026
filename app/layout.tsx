import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

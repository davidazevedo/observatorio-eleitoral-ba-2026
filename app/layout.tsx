import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Observatório Eleitoral Bahia 2026',
  description:
    'Iniciativa independente para organizar fatos, documentos e pedidos de apuração sobre a aplicação de recursos públicos no período eleitoral na Bahia.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Observatório Eleitoral Bahia 2026',
    description: 'Fatos, documentos, rastreabilidade e participação cidadã.',
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

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel reservado | Observatório Eleitoral Bahia 2026',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return children;
}

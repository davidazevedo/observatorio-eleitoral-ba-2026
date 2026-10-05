import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enviar fato ou evidência | Observatório Eleitoral Bahia 2026',
  description: 'Canal para registrar um fato, documento, fotografia, áudio, vídeo ou outra evidência para verificação, com opção de envio sem identificação no formulário.',
  robots: { index: true, follow: true },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return children;
}

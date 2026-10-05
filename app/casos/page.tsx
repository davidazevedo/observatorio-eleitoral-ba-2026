import Link from 'next/link';
import CasesExplorer from './CasesExplorer';
import { publicCases } from '@/lib/cases';
import { sourceCatalog } from '@/lib/content';

export const metadata = {
  title: 'Casos e ocorrências | Observatório Eleitoral Bahia 2026',
  description:
    'Registro público filtrável de fatos, marcos normativos e ocorrências documentadas que integram a auditoria cidadã do Observatório Eleitoral Bahia 2026.',
};

const countBy = (value: string) => publicCases.filter((item) => item.status === value).length;

export default function CasesPage() {
  return (
    <main className="cases-page">
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/">
            <span className="brand-mark">OE</span>
            <span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span>
          </Link>
          <nav className="nav" aria-label="Principal">
            <Link href="/denuncia">A denúncia</Link>
            <Link href="/casos">Casos</Link>
            <Link href="/fontes">Fontes</Link>
            <Link href="/privacidade">Privacidade</Link>
          </nav>
          <Link className="button compact political-cta" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="cases-hero">
        <div className="container">
          <p className="eyebrow light">REGISTRO PÚBLICO · AUDITORIA CIDADÃ</p>
          <h1>Casos, marcos e ocorrências<br/><em>que podem ser conferidos.</em></h1>
          <p>
            Este registro não é uma lista de acusados. É uma fila pública de fatos documentados, referências normativas e prioridades de auditoria que qualquer pessoa pode conferir nas fontes associadas.
          </p>
        </div>
      </section>

      <section className="container cases-stats" aria-label="Resumo do registro">
        <article><span>REGISTRO PÚBLICO</span><strong>{publicCases.length}</strong><p>itens publicados nesta primeira versão</p></article>
        <article><span>DOCUMENTO PRIMÁRIO</span><strong>{publicCases.filter((item) => item.evidenceLevel === 'L2').length}</strong><p>itens classificados como L2</p></article>
        <article><span>PRIORIDADE</span><strong>{countBy('Prioridade de auditoria')}</strong><p>item atualmente priorizado para decomposição</p></article>
        <article><span>RELATOS PRIVADOS</span><strong>0</strong><p>publicados automaticamente — a regra é zero</p></article>
      </section>

      <section className="container cases-intro">
        <div>
          <p className="eyebrow">COMO LER ESTA PÁGINA</p>
          <h2>O status descreve o estágio da apuração, não a culpa de alguém.</h2>
        </div>
        <p>
          Itens L0 e L1 permanecem fora do registro público. Um item pode ser relevante para auditoria e, ao final, revelar-se totalmente regular. A publicação serve para tornar a pergunta auditável e mostrar as fontes utilizadas.
        </p>
      </section>

      <div className="container">
        <CasesExplorer cases={publicCases} sources={sourceCatalog} />
      </div>

      <section className="container cases-next">
        <div>
          <p className="eyebrow">PRÓXIMA EXPANSÃO</p>
          <h2>Do escopo estadual para os 417 municípios.</h2>
          <p>A matriz será preenchida gradualmente com instrumento, pagamento, contrato, fornecedor, ordem de serviço, medição, execução física e fundamento de eventual exceção eleitoral.</p>
        </div>
        <div className="actions">
          <Link className="button" href="/dossie#analitico">Conhecer o dossiê analítico</Link>
          <Link className="button secondary" href="/enviar">Enviar fato ou evidência</Link>
        </div>
      </section>

      <footer className="political-footer">
        <div className="container footer-top">
          <div><strong>Observatório Eleitoral Bahia 2026</strong><p>Registro público sujeito a atualização, correção e contraditório.</p></div>
          <div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div>
          <p><Link href="/denuncia">Denúncia</Link> · <Link href="/dossie">Dossiê</Link> · <Link href="/correcoes">Correções</Link> · <Link href="/atualizacoes">Atualizações</Link></p>
        </div>
      </footer>
    </main>
  );
}

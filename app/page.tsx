import Link from 'next/link';
import HeroEvidenceScene from '@/components/HeroEvidenceScene';
import { investigationSummary } from '@/lib/investigation-summary';

const timeline = [
  {
    date: '11 JUN',
    value: 'R$ 1,7 bi',
    title: 'Pacote estadual anunciado',
    text: 'Ações anunciadas para aproximadamente 200 municípios.',
    href: 'https://www.ba.gov.br/comunicacao/noticias/2026-06/382803/investimentos-de-mais-de-r-17-bilhao-do-estado-fortalecem-municipios-e',
  },
  {
    date: '03 JUL',
    value: '≈ R$ 6 bi',
    title: 'Novo pacote de investimentos',
    text: 'Mais de cem atos e mais de 160 municípios no anúncio oficial.',
    href: 'https://www.ba.gov.br/comunicacao/noticias/2026-07/383361/audio-governo-do-estado-anuncia-pacote-de-investimentos-de-cerca-de-r-6',
  },
  {
    date: '04 JUL',
    value: 'MARCO',
    title: 'Início do recorte de auditoria',
    text: 'Data relevante para as restrições aplicáveis às transferências analisadas, com exceções que precisam ser demonstradas caso a caso.',
    href: 'https://www.gov.br/transferegov/pt-br/comunicados/comunicados-gerais/2026/comunicado-no-21-2026-orientacoes-para-gestao-das-transferencias-durante-o-periodo-de-defeso-eleitoral-e-suspensao-da-emissao-automatica-da-autorizacao-de-inicio-de-obras-aio',
  },
  {
    date: '04 OUT',
    value: '1º TURNO',
    title: 'Contexto eleitoral',
    text: 'O resultado compõe a cronologia processual; não é tratado como prova de irregularidade.',
    href: '/dossie#fatos',
  },
];

const helpTypes = [
  ['Possível oferta de dinheiro, benefício ou vantagem', 'vídeo, áudio, conversa, testemunho'],
  ['Possível uso de estrutura ou agente público', 'foto, vídeo, documento, escala'],
  ['Contrato ou pagamento que merece verificação', 'contrato, nota, empenho, extrato público'],
  ['Obra ou serviço incompatível com o registro oficial', 'fotos, localização, placa, medição'],
  ['Possível pressão ou condicionamento político', 'mensagem, áudio, documento'],
  ['Outro fato relevante', 'relato detalhado + qualquer evidência'],
];

export default function Home() {
  return (
    <main className="political-home redesigned-home">
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
            <Link href="/dossie">Dossiê</Link>
            <Link href="/privacidade">Privacidade</Link>
          </nav>
          <Link className="button compact political-cta" href="/enviar">Enviar evidência</Link>
        </div>
      </header>

      <section className="research-hero">
        <div className="research-hero-photo" aria-hidden="true">
          <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Pal%C3%A1cio_Luis_Eduardo_Magalh%C3%A3es_%286466206113%29.jpg?width=1800" alt="" />
        </div>
        <div className="research-hero-shade" />
        <div className="container research-hero-grid">
          <div className="research-hero-copy">
            <div className="hero-kicker"><span>BAHIA</span><b>ELEIÇÕES 2026</b><span>FISCALIZAÇÃO CIDADÃ</span></div>
            <h1>A Bahia não pode ser<br/><em>refém do silêncio.</em></h1>
            <p className="trace-line">Dinheiro público deixa rastros. <strong>Nós vamos segui-los.</strong></p>
            <p className="research-hero-text">
              Milhões em recursos, contratos, obras e estruturas públicas atravessaram o ambiente eleitoral de 2026. Este observatório existe para reunir documentos, reconstruir a cronologia dos fatos e pedir que as autoridades investiguem onde houver indícios consistentes de irregularidade.
            </p>
            <p className="verify-motto">Não partimos da culpa. Partimos da obrigação de verificar.</p>
            <div className="actions political-actions">
              <Link className="button button-gold large" href="/enviar">Tenho um fato ou evidência</Link>
              <Link className="button button-outline-light large" href="#denuncia">Entender a denúncia</Link>
            </div>
            <div className="hero-proof">
              <span>Projeto independente</span><span>Fontes verificáveis</span><span>Evidências preservadas</span><span>Direito de resposta</span>
            </div>
          </div>
          <HeroEvidenceScene />
        </div>
      </section>

      <section className="commitment-band">
        <div className="container commitment-grid">
          <div className="commitment-seal"><span>FISCALIZAÇÃO CIDADÃ</span><b>BA</b><small>2026</small></div>
          <div>
            <p className="eyebrow">NOSSO COMPROMISSO</p>
            <h2>A Bahia não pertence ao poder.<br/><strong>O dinheiro público também não.</strong></h2>
            <p>Este projeto não pede fé. Pede documentos, cronologia, contraditório e respostas.</p>
          </div>
          <div className="commitment-map">
            <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Brazil_white_state_maps_-_Bahia.svg" alt="" aria-hidden="true" />
            <strong>{investigationSummary.statewideMunicipalities}</strong><span>municípios na Bahia · {investigationSummary.priorityMunicipalities} no universo prioritário</span>
          </div>
        </div>
      </section>

      <section className="container complaint-question section" id="denuncia">
        <div className="question-mark" aria-hidden="true">?</div>
        <div>
          <p className="eyebrow">A DENÚNCIA</p>
          <h2>Há uma pergunta que a Bahia precisa responder.</h2>
          <p className="question-lead">Recursos, contratos, obras e estruturas públicas foram utilizados regularmente durante o processo eleitoral — ou existem operações em que o interesse público foi desviado para produzir vantagem política ou eleitoral?</p>
          <p>Em ano eleitoral, o Estado continua funcionando: obras precisam continuar, serviços precisam ser prestados e investimentos legítimos não se tornam ilícitos porque uma eleição está próxima. O problema começa quando o recurso público deixa de servir ao interesse público.</p>
          <p><strong>Nosso trabalho é reunir elementos para que essa pergunta seja respondida com documentos, não com torcida.</strong></p>
          <Link className="text-link" href="/denuncia">Ler a representação pública completa →</Link>
        </div>
      </section>

      <section className="facts-stage" id="fatos">
        <div className="container section">
          <div className="facts-heading">
            <p className="eyebrow light">FATOS PÚBLICOS</p>
            <h2>Não começamos com uma acusação.<br/><em>Começamos com datas.</em></h2>
            <p>O objetivo é confrontar o que foi anunciado com o que foi juridicamente formalizado, efetivamente movimentado, contratado e executado.</p>
          </div>
          <div className="facts-timeline">
            {timeline.map((item,index)=>(
              <a key={item.date} className="fact-node" href={item.href} target={item.href.startsWith('http')?'_blank':undefined} rel={item.href.startsWith('http')?'noreferrer':undefined}>
                <span className="fact-index">0{index+1}</span>
                <time>{item.date}</time>
                <strong>{item.value}</strong>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <em>{item.href.startsWith('http')?'Fonte oficial ↗':'Ver no dossiê →'}</em>
              </a>
            ))}
          </div>
          <p className="timeline-caution">Cada espécie de conduta possui fundamento, circunscrição e marco próprios. O portal não trata um único intervalo como se representasse todas as vedações eleitorais.</p>
        </div>
      </section>

      <section className="chain-stage">
        <div className="container chain-stage-grid">
          <div className="chain-statements">
            <p className="eyebrow light">O PONTO QUE EXIGE RESPOSTA</p>
            <h2><span>Anunciar</span> não é transferir.</h2>
            <h2><span>Assinar</span> não é pagar.</h2>
            <h2><span>Pagar</span> não significa executar.</h2>
            <h2><span>Executar</span> não significa agir com finalidade eleitoral.</h2>
            <p>É o encadeamento dos fatos que precisa ser investigado.</p>
          </div>
          <div className="chain-visual" aria-label="Trilha simplificada da investigação">
            {['RECURSO','INSTRUMENTO','TRANSFERÊNCIA','CONTRATO','FORNECEDOR','EXECUÇÃO','CONTEXTO ELEITORAL'].map((item,index)=>(
              <div key={item}><b>{String(index+1).padStart(2,'0')}</b><span>{item}</span>{index<6?<i>→</i>:null}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="container participation-stage">
        <div className="participation-copy">
          <p className="eyebrow">VOCÊ PODE AJUDAR</p>
          <h2>Você viu algo que precisa ser verificado?</h2>
          <p>Conte o que aconteceu. Diga onde, quando e quem estava envolvido. Envie o que tiver: documento, fotografia, vídeo, áudio, link, contrato, comprovante, conversa ou outro registro.</p>
          <p className="participation-highlight">Um relato pode ser apenas o início. Uma evidência pode mostrar onde procurar.</p>
          <Link className="button button-gold large" href="/enviar">Enviar fato ou evidência</Link>
        </div>
        <div className="evidence-types">
          {helpTypes.map(([title,material],index)=><article key={title}><span>0{index+1}</span><h3>{title}</h3><p>{material}</p></article>)}
        </div>
      </section>

      <section className="public-cases-preview">
        <div className="container public-cases-grid">
          <div className="map-status">
            <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Brazil_white_state_maps_-_Bahia.svg" alt="Silhueta do estado da Bahia" />
            <div className="map-dots" aria-hidden="true">{Array.from({length:34}).map((_,index)=><i key={index} style={{'--i':index} as React.CSSProperties} />)}</div>
          </div>
          <div>
            <p className="eyebrow light">O QUE JÁ FOI DOCUMENTADO</p>
            <h2>{investigationSummary.priorityMunicipalities} municípios no universo prioritário. Uma mesma pergunta: o dinheiro chegou como, quando e para quê?</h2>
            <div className="map-metrics">
              <div><strong>{investigationSummary.priorityMunicipalities}</strong><span>universo prioritário</span></div>
              <div><strong>{investigationSummary.p0ClassifiedMunicipalities}/{investigationSummary.p0TotalMunicipalities}</strong><span>P0 classificados</span></div>
              <div><strong>{investigationSummary.centralEvidence}</strong><span>evidências centrais</span></div>
            </div>
            <p>Universo consolidado: {investigationSummary.housingCoreMunicipalities} municípios do núcleo original + {investigationSummary.expansionMunicipalities} da expansão. Em Irecê, a cobertura selecionada está em {investigationSummary.ireceCoveredMunicipalities}/{investigationSummary.ireceOfficialMunicipalities}. Os {investigationSummary.statewideMunicipalities} municípios da Bahia permanecem como escopo estadual potencial. Esses números descrevem cobertura investigativa e não indicam culpa ou irregularidade.</p>
            <Link className="button button-outline-light" href="/casos">Abrir registro público</Link>
          </div>
        </div>
      </section>

      <section className="container dossier-preview">
        <div className="dossier-folder" aria-hidden="true"><span>DOSSIÊ</span><b>ANÁLISE</b><i>acesso verificado</i></div>
        <div>
          <p className="eyebrow">DOSSIÊ</p>
          <h2>O que já sabemos. O que ainda precisa ser explicado.</h2>
          <p>Os fatos, fontes e pedidos permanecem públicos. A matriz, os critérios de priorização, as trilhas e os cruzamentos analíticos exigem confirmação de e-mail antes do acesso.</p>
          <div className="actions"><Link className="button" href="/dossie">Ver resumo público</Link><Link className="button secondary" href="/dossie/acesso">Acessar análise</Link></div>
        </div>
      </section>

      <section className="final-civic-cta">
        <div className="container">
          <p className="eyebrow light">A VERDADE PRECISA DE QUEM DECIDA NÃO SE CALAR</p>
          <h2>Vamos libertar a Bahia do silêncio.</h2>
          <h3>Com fatos. Com documentos. Com coragem.</h3>
          <p>Se você possui um fato, documento, fotografia, áudio ou vídeo que possa ajudar a reconstruir o que aconteceu, sua contribuição pode indicar onde a investigação deve olhar.</p>
          <strong>Não precisamos de boatos. Precisamos de fatos.</strong>
          <div className="actions"><Link className="button button-gold large" href="/enviar">Enviar uma evidência</Link><Link className="button button-outline-light large" href="/denuncia">Entender a denúncia</Link></div>
        </div>
      </section>

      <section className="container author-strip">
        <div className="author-monogram">DPA</div>
        <div><span>Uma iniciativa independente de</span><strong>David Pereira de Azevedo</strong><p>Idealização e coordenação · Bahia · 2026</p></div>
      </section>

      <footer className="political-footer">
        <div className="container footer-top">
          <div><strong>Observatório Eleitoral Bahia 2026</strong><p>Fiscalização cidadã. Evidência. Transparência.</p></div>
          <div className="footer-signature"><span>Idealização e coordenação</span><strong>David Pereira de Azevedo</strong></div>
          <p><Link href="/denuncia">Denúncia</Link> · <Link href="/casos">Casos</Link> · <Link href="/fontes">Fontes</Link> · <Link href="/correcoes">Correções</Link> · <Link href="/atualizacoes">Atualizações</Link></p>
        </div>
        <div className="container visual-credits">Imagens institucionais e mapa via Wikimedia Commons. O mapa é usado como contexto geográfico; estados de apuração não representam culpa.</div>
      </footer>
    </main>
  );
}

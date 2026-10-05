'use client';

import Link from 'next/link';
import { upload } from '@vercel/blob/client';
import { ChangeEvent, FormEvent, useMemo, useState } from 'react';

type Mode = 'anonymous' | 'identified';
type Evidence = {
  pathname: string; url: string; contentType: string; contentDisposition: string; etag: string;
  originalName: string; size: number;
};

const MAX_FILES = 8;
const MAX_FILE_BYTES = 1024 * 1024 * 1024;
const stepLabels = ['O que aconteceu?', 'Onde e quando?', 'Quem estava envolvido?', 'Evidências', 'Contato', 'Revisar e enviar'];

export default function SubmitPage() {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [protocol, setProtocol] = useState('');
  const [mode, setMode] = useState<Mode>('anonymous');
  const [files, setFiles] = useState<File[]>([]);
  const [data, setData] = useState({
    category: '',
    statement: '',
    municipality: '',
    locality: '',
    eventDate: '',
    peopleOrEntities: '',
    sourceContext: '',
    name: '',
    email: '',
    phone: '',
    consent: false,
  });

  const percent = Math.round(((step + 1) / stepLabels.length) * 100);

  function field(name: keyof typeof data, value: string | boolean) {
    setData((current) => ({ ...current, [name]: value }));
  }

  function validateCurrent() {
    setError('');
    if (step === 0) {
      if (!data.category) return 'Selecione uma categoria.';
      if (data.statement.trim().length < 80) return 'Descreva o fato com pelo menos 80 caracteres.';
    }
    if (step === 1 && !data.municipality.trim()) return 'Informe o município.';
    if (step === 3) {
      if (files.length > MAX_FILES) return `Envie no máximo ${MAX_FILES} arquivos.`;
      if (files.some((file) => file.size > MAX_FILE_BYTES)) return 'Cada arquivo pode ter no máximo 1 GB.';
    }
    if (step === 4 && mode === 'identified') {
      if (!data.name.trim()) return 'Informe seu nome ou escolha enviar sem identificação.';
      if (!/^\S+@\S+\.\S+$/.test(data.email)) return 'Informe um e-mail válido.';
    }
    return '';
  }

  function next() {
    const invalid = validateCurrent();
    if (invalid) { setError(invalid); return; }
    setStep((current) => Math.min(stepLabels.length - 1, current + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function back() {
    setError('');
    setStep((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectFiles(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files || []);
    setFiles(nextFiles);
    setError('');
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!data.consent) { setError('Confirme a declaração de boa-fé para enviar.'); return; }
    setBusy(true); setError(''); setProtocol('');
    try {
      const sessionResponse = await fetch('/api/submissions/session', { method: 'POST' });
      const session = await sessionResponse.json();
      if (!sessionResponse.ok || !session.submissionId || !session.sessionToken) throw new Error(session.error || 'Não foi possível iniciar uma sessão segura.');
      const submissionId = String(session.submissionId);
      const sessionToken = String(session.sessionToken);

      const uploaded: Evidence[] = [];
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setProgress(`Enviando ${file.name} · arquivo ${index + 1} de ${files.length}`);
        const blob = await upload(`evidence/${submissionId}/${file.name}`, file, {
          access: 'private',
          handleUploadUrl: '/api/upload',
          multipart: true,
          clientPayload: JSON.stringify({ submissionId, sessionToken }),
          onUploadProgress: ({ percentage }) => setProgress(`${file.name}: ${Math.round(percentage)}%`),
        });
        uploaded.push({ ...blob, originalName: file.name, size: file.size });
      }

      setProgress('Registrando o relato…');
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          sessionToken,
          mode,
          municipality: data.municipality,
          locality: data.locality,
          eventDate: data.eventDate,
          category: data.category,
          peopleOrEntities: data.peopleOrEntities,
          statement: data.statement,
          sourceContext: data.sourceContext,
          name: mode === 'identified' ? data.name : '',
          email: mode === 'identified' ? data.email : '',
          phone: mode === 'identified' ? data.phone : '',
          evidence: uploaded,
          consent: data.consent,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível registrar o relato.');
      setProtocol(result.protocol);
      setProgress('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha inesperada ao enviar.');
      setProgress('');
    } finally {
      setBusy(false);
    }
  }

  const fileSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);

  if (protocol) {
    return (
      <main className="wizard-page">
        <header className="site-header political-header"><div className="container header-inner"><Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link></div></header>
        <section className="wizard-success container">
          <span className="success-seal">✓</span>
          <p className="eyebrow">RELATO RECEBIDO</p>
          <h1>Seu material entrou na fila de verificação.</h1>
          <p className="success-protocol">Protocolo <code>{protocol}</code></p>
          <div className="verification-message"><strong>Denunciar não transforma um relato em fato.</strong><p>Verificar é o que transforma uma pista em evidência. O material não será publicado automaticamente.</p></div>
          <div className="actions"><Link className="button" href="/casos">Ver registro público</Link><Link className="button secondary" href="/">Voltar ao início</Link></div>
        </section>
      </main>
    );
  }

  return (
    <main className="wizard-page">
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link>
          <div className="submit-header-links"><Link className="text-link" href="/denuncia">A denúncia</Link><Link className="text-link" href="/privacidade">Privacidade</Link></div>
        </div>
      </header>

      <section className="container wizard-shell">
        <div className="wizard-header">
          <p className="eyebrow">ENVIO DE FATO OU EVIDÊNCIA</p>
          <h1>A verdade precisa de quem <em>decida não se calar.</em></h1>
          <p>Uma pergunta por vez. Conte apenas o que você sabe e separe observação direta de interpretação.</p>
        </div>

        <div className="wizard-progress" aria-label={`Etapa ${step + 1} de ${stepLabels.length}`}>
          <div><span>ETAPA {step + 1} DE {stepLabels.length}</span><strong>{stepLabels[step]}</strong><em>{percent}%</em></div>
          <i><b style={{ width: `${percent}%` }} /></i>
        </div>

        <form className="wizard-card" onSubmit={submit}>
          {step === 0 && (
            <fieldset>
              <legend>O que aconteceu?</legend>
              <p className="step-help">Descreva a ocorrência em ordem. Não precisa usar linguagem jurídica.</p>
              <label>Qual tema melhor descreve o fato?
                <select value={data.category} onChange={(e)=>field('category',e.target.value)} required>
                  <option value="">Selecione</option>
                  <option>Transferência ou convênio</option><option>Licitação ou contrato</option><option>Obra ou serviço público</option>
                  <option>Distribuição de benefício ou vantagem</option><option>Evento, publicidade ou uso de estrutura pública</option>
                  <option>Fornecedor ou apoiador</option><option>Correção, contraditório ou direito de resposta</option><option>Outro</option>
                </select>
              </label>
              <label>Relato factual
                <textarea value={data.statement} onChange={(e)=>field('statement',e.target.value)} rows={10} placeholder="O que aconteceu? O que você viu, ouviu diretamente ou recebeu? Evite conclusões que não consiga sustentar." />
              </label>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend>Onde e quando?</legend>
              <p className="step-help">Local e data ajudam a confrontar o relato com documentos, agenda, contratos e registros públicos.</p>
              <div className="field-grid">
                <label>Município<input value={data.municipality} onChange={(e)=>field('municipality',e.target.value)} placeholder="Ex.: Irecê" /></label>
                <label>Localidade, órgão ou endereço aproximado<input value={data.locality} onChange={(e)=>field('locality',e.target.value)} placeholder="Bairro, prefeitura, secretaria, obra…" /></label>
                <label>Data aproximada<input type="date" value={data.eventDate} onChange={(e)=>field('eventDate',e.target.value)} /></label>
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset>
              <legend>Quem estava envolvido?</legend>
              <p className="step-help">Cite pessoas, empresas ou órgãos somente quando houver relação direta com o fato. Não inclua dados pessoais desnecessários.</p>
              <label>Pessoas, empresas ou órgãos citados<input value={data.peopleOrEntities} onChange={(e)=>field('peopleOrEntities',e.target.value)} /></label>
              <label>Como você obteve essa informação?
                <textarea value={data.sourceContext} onChange={(e)=>field('sourceContext',e.target.value)} rows={6} placeholder="Ex.: presenciei pessoalmente; gravei no local; recebi o documento; baixei de um portal oficial…" />
              </label>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset>
              <legend>Que evidência você possui?</legend>
              <p className="step-help">Preserve o arquivo original. Não edite foto, vídeo ou áudio antes do envio quando puder evitar.</p>
              <label className="dropzone wizard-dropzone">
                <strong>Adicionar documentos, fotos, áudio ou vídeo</strong>
                <span>Até {MAX_FILES} arquivos · até 1 GB por arquivo · armazenamento privado</span>
                <input type="file" multiple onChange={selectFiles} accept="image/*,video/*,audio/*,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx" />
              </label>
              {files.length ? <div className="selected-files">{files.map((file)=><div key={file.name+file.size}><span>{file.name}</span><b>{(file.size/1024/1024).toFixed(1)} MB</b></div>)}<small>Total: {(fileSize/1024/1024).toFixed(1)} MB</small></div> : <p className="optional-note">Você pode enviar apenas o relato e acrescentar evidências depois por outro protocolo.</p>}
            </fieldset>
          )}

          {step === 4 && (
            <fieldset>
              <legend>Deseja deixar um contato?</legend>
              <p className="step-help">Você pode enviar sem informar nome, telefone ou e-mail. Isso não equivale a prometer anonimato absoluto da infraestrutura de internet.</p>
              <div className="mode-grid wizard-mode">
                <label className={mode==='anonymous'?'mode-card active':'mode-card'}><input type="radio" checked={mode==='anonymous'} onChange={()=>setMode('anonymous')} /><strong>Sem identificação no formulário</strong><span>Não pediremos seus dados de contato.</span></label>
                <label className={mode==='identified'?'mode-card active':'mode-card'}><input type="radio" checked={mode==='identified'} onChange={()=>setMode('identified')} /><strong>Quero deixar contato</strong><span>Permite esclarecer o relato posteriormente.</span></label>
              </div>
              {mode === 'identified' ? <div className="field-grid three contact-fields"><label>Nome<input value={data.name} onChange={(e)=>field('name',e.target.value)} /></label><label>E-mail<input type="email" value={data.email} onChange={(e)=>field('email',e.target.value)} /></label><label>Telefone<input value={data.phone} onChange={(e)=>field('phone',e.target.value)} /></label></div> : <div className="anonymity-note"><strong>Sem identificação no formulário</strong><p>Nenhum sistema comum de internet pode prometer anonimato absoluto. Em situação de risco elevado, considere também os canais oficiais das autoridades competentes.</p></div>}
            </fieldset>
          )}

          {step === 5 && (
            <fieldset>
              <legend>Revise e envie</legend>
              <p className="step-help">Confira os pontos principais antes de registrar o protocolo.</p>
              <div className="review-grid">
                <div><span>Tema</span><strong>{data.category}</strong></div><div><span>Município</span><strong>{data.municipality}</strong></div>
                <div><span>Data</span><strong>{data.eventDate || 'não informada'}</strong></div><div><span>Contato</span><strong>{mode==='identified'?'identificado':'sem identificação no formulário'}</strong></div>
                <div className="review-wide"><span>Relato</span><p>{data.statement}</p></div><div className="review-wide"><span>Evidências</span><strong>{files.length} arquivo(s)</strong></div>
              </div>
              <label className="consent"><input type="checkbox" checked={data.consent} onChange={(e)=>field('consent',e.target.checked)} /><span>Declaro que o relato foi feito de boa-fé e autorizo sua análise para verificação e eventual encaminhamento às autoridades. Entendo que o envio não implica publicação automática.</span></label>
              <button className="button button-gold large final-submit" type="submit" disabled={busy}>{busy?'Enviando…':'Registrar fato/evidência'}</button>
              {progress ? <p className="status">{progress}</p> : null}
            </fieldset>
          )}

          {error ? <p className="status error" role="alert">{error}</p> : null}

          <div className="wizard-actions">
            {step > 0 && !busy ? <button type="button" className="wizard-back" onClick={back}>← Voltar</button> : <span />}
            {step < stepLabels.length - 1 ? <button type="button" className="button" onClick={next}>Continuar →</button> : null}
          </div>
        </form>

        <aside className="wizard-safety">
          <strong>Antes de enviar</strong>
          <span>Não se coloque em risco para conseguir prova.</span>
          <span>Não envie senhas ou credenciais.</span>
          <span>Evite dados de crianças, vítimas ou terceiros sem relação material.</span>
          <Link href="/privacidade">Leia nossa política de tratamento →</Link>
        </aside>
      </section>
    </main>
  );
}

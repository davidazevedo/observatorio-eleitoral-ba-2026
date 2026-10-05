'use client';

import Link from 'next/link';
import { upload } from '@vercel/blob/client';
import { FormEvent, useState } from 'react';

type UploadedEvidence = {
  pathname: string;
  url: string;
  contentType: string;
  contentDisposition: string;
  etag: string;
  originalName: string;
  size: number;
};

const MAX_FILES = 8;
const MAX_FILE_BYTES = 1024 * 1024 * 1024;

export default function SubmitPage() {
  const [identified, setIdentified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [protocol, setProtocol] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setError('');
    setProtocol('');

    try {
      const form = new FormData(formElement);
      if (String(form.get('website') || '')) throw new Error('Envio inválido.');

      const files = form.getAll('evidence').filter((value): value is File => value instanceof File && value.size > 0);
      if (files.length > MAX_FILES) throw new Error(`Envie no máximo ${MAX_FILES} arquivos por relato.`);
      if (files.some((file) => file.size > MAX_FILE_BYTES)) throw new Error('Cada arquivo pode ter no máximo 1 GB.');

      const sessionResponse = await fetch('/api/submissions/session', { method: 'POST' });
      const session = await sessionResponse.json();
      if (!sessionResponse.ok || !session.submissionId || !session.sessionToken) {
        throw new Error(session.error || 'Não foi possível iniciar uma sessão segura de envio.');
      }
      const submissionId = String(session.submissionId);
      const sessionToken = String(session.sessionToken);

      const uploaded: UploadedEvidence[] = [];
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setProgress(`Enviando arquivo ${index + 1} de ${files.length}: ${file.name}`);
        const blob = await upload(`evidence/${submissionId}/${file.name}`, file, {
          access: 'private',
          handleUploadUrl: '/api/upload',
          multipart: true,
          clientPayload: JSON.stringify({ submissionId, sessionToken }),
          onUploadProgress: ({ percentage }) => setProgress(`Enviando ${file.name}: ${Math.round(percentage)}%`),
        });
        uploaded.push({ ...blob, originalName: file.name, size: file.size });
      }

      setProgress('Registrando o relato…');
      const payload = {
        submissionId,
        sessionToken,
        mode: identified ? 'identified' : 'anonymous',
        municipality: String(form.get('municipality') || ''),
        locality: String(form.get('locality') || ''),
        eventDate: String(form.get('eventDate') || ''),
        category: String(form.get('category') || ''),
        peopleOrEntities: String(form.get('peopleOrEntities') || ''),
        statement: String(form.get('statement') || ''),
        sourceContext: String(form.get('sourceContext') || ''),
        name: identified ? String(form.get('name') || '') : '',
        email: identified ? String(form.get('email') || '') : '',
        phone: identified ? String(form.get('phone') || '') : '',
        evidence: uploaded,
        consent: form.get('consent') === 'on',
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível registrar o relato.');

      setProtocol(data.protocol);
      setProgress('');
      formElement.reset();
      setIdentified(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha inesperada ao enviar.');
      setProgress('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <header className="site-header political-header">
        <div className="container header-inner">
          <Link className="brand political-brand" href="/"><span className="brand-mark">OE</span><span className="brand-copy">Observatório Eleitoral<br/><small>Bahia 2026</small></span></Link>
          <div className="submit-header-links"><Link className="text-link" href="/dossie">Dossiê</Link><Link className="text-link" href="/casos">Casos públicos</Link></div>
        </div>
      </header>

      <section className="container form-hero">
        <p className="eyebrow">ENVIO DE FATO OU EVIDÊNCIA</p>
        <h1>A verdade precisa de quem <em>decide não se calar.</em></h1>
        <p className="lead">Envie o que você viu, registrou ou recebeu diretamente. Quanto mais precisos forem local, data, origem do material e sequência dos acontecimentos, maior a capacidade de transformar o relato em uma trilha verificável.</p>
      </section>

      <section className="container form-layout">
        <form className="evidence-form" onSubmit={onSubmit}>
          <fieldset>
            <legend>1. Como deseja enviar?</legend>
            <div className="mode-grid">
              <label className={!identified ? 'mode-card active' : 'mode-card'}>
                <input type="radio" name="mode" checked={!identified} onChange={() => setIdentified(false)} />
                <strong>Sem identificação no formulário</strong><span>Não pediremos nome, e-mail ou telefone.</span>
              </label>
              <label className={identified ? 'mode-card active' : 'mode-card'}>
                <input type="radio" name="mode" checked={identified} onChange={() => setIdentified(true)} />
                <strong>Identificado</strong><span>Permite contato posterior para esclarecer fatos.</span>
              </label>
            </div>
          </fieldset>

          {identified && (
            <fieldset>
              <legend>2. Seus dados</legend>
              <div className="field-grid three">
                <label>Nome<input name="name" required /></label>
                <label>E-mail<input name="email" type="email" required /></label>
                <label>Telefone<input name="phone" /></label>
              </div>
            </fieldset>
          )}

          <fieldset>
            <legend>{identified ? '3' : '2'}. Onde e quando?</legend>
            <div className="field-grid three">
              <label>Município<input name="municipality" required placeholder="Ex.: Irecê" /></label>
              <label>Localidade / órgão<input name="locality" placeholder="Bairro, prefeitura, secretaria…" /></label>
              <label>Data aproximada<input name="eventDate" type="date" /></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>{identified ? '4' : '3'}. O que aconteceu?</legend>
            <div className="field-grid">
              <label>Categoria
                <select name="category" required defaultValue="">
                  <option value="" disabled>Selecione</option>
                  <option>Transferência ou convênio</option>
                  <option>Licitação ou contrato</option>
                  <option>Obra ou serviço público</option>
                  <option>Distribuição de benefício ou vantagem</option>
                  <option>Evento, publicidade ou uso de estrutura pública</option>
                  <option>Fornecedor ou apoiador</option>
                  <option>Outro</option>
                </select>
              </label>
              <label>Pessoas, empresas ou órgãos citados<input name="peopleOrEntities" placeholder="Informe apenas quando houver relação direta com o fato" /></label>
              <label>Relato factual<textarea name="statement" minLength={80} required rows={9} placeholder="Descreva em ordem: o que ocorreu, quem participou, onde, quando e o que você viu ou recebeu diretamente." /></label>
              <label>Como você obteve essa informação ou arquivo?<textarea name="sourceContext" rows={4} placeholder="Ex.: gravei pessoalmente; recebi de servidor; baixei do portal X; fotografei a obra em…" /></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>{identified ? '5' : '4'}. Evidências</legend>
            <label className="dropzone">
              <strong>Adicionar documentos, fotos, áudio ou vídeo</strong>
              <span>Até {MAX_FILES} arquivos. Até 1 GB por arquivo. Os originais são enviados ao armazenamento privado.</span>
              <input name="evidence" type="file" multiple accept="image/*,video/*,audio/*,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx" />
            </label>
          </fieldset>

          <input className="honey" name="website" tabIndex={-1} autoComplete="off" />

          <label className="consent">
            <input type="checkbox" name="consent" required />
            <span>Declaro que o relato foi feito de boa-fé e autorizo sua análise para fins de verificação e eventual encaminhamento às autoridades. Entendo que o envio não implica publicação automática.</span>
          </label>

          <button className="button large" type="submit" disabled={busy}>{busy ? 'Enviando…' : 'Registrar fato/evidência'}</button>
          {progress && <p className="status">{progress}</p>}
          {error && <p className="status error">{error}</p>}
          {protocol && <div className="success"><strong>Recebido.</strong><p>Protocolo: <code>{protocol}</code></p><p>Guarde esse código. O material ficará pendente de triagem e verificação.</p></div>}
        </form>

        <aside className="privacy-card">
          <p className="eyebrow">PRIVACIDADE E CAUTELA</p>
          <h2>Antes de enviar</h2>
          <ul>
            <li>Não envie senhas, credenciais ou documentos pessoais sem relação com o fato.</li>
            <li>Evite expor dados de crianças, vítimas ou terceiros alheios ao caso.</li>
            <li>Preserve o arquivo original sempre que possível; não edite vídeo ou foto antes do envio.</li>
            <li>Não confronte pessoas nem se coloque em risco para conseguir uma prova.</li>
          </ul>
          <p className="small">No modo sem identificação, o formulário não solicita seus dados de contato. Serviços de hospedagem podem manter logs técnicos de segurança e operação.</p>
        </aside>
      </section>
    </main>
  );
}

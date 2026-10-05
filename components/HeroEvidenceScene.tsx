'use client';

import { PointerEvent, useRef } from 'react';

export default function HeroEvidenceScene() {
  const scene = useRef<HTMLDivElement>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    const node = scene.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty('--scene-rx', `${(-y * 8).toFixed(2)}deg`);
    node.style.setProperty('--scene-ry', `${(x * 10).toFixed(2)}deg`);
    node.style.setProperty('--scene-x', `${(x * 10).toFixed(1)}px`);
    node.style.setProperty('--scene-y', `${(y * 8).toFixed(1)}px`);
  }

  function reset() {
    const node = scene.current;
    if (!node) return;
    node.style.setProperty('--scene-rx', '0deg');
    node.style.setProperty('--scene-ry', '0deg');
    node.style.setProperty('--scene-x', '0px');
    node.style.setProperty('--scene-y', '0px');
  }

  return (
    <div className="evidence-scene-wrap" aria-hidden="true">
      <div
        ref={scene}
        className="evidence-scene"
        onPointerMove={move}
        onPointerLeave={reset}
      >
        <div className="scene-grid" />
        <img
          className="bahia-3d"
          src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Brazil_white_state_maps_-_Bahia.svg"
          alt=""
        />
        <div className="evidence-card evidence-card-transfer">
          <span>TRANSFERÊNCIA</span><strong>03 JUL 2026</strong><small>data a confrontar</small>
        </div>
        <div className="evidence-card evidence-card-contract">
          <span>CONTRATO</span><strong>R$ ·······</strong><small>fornecedor / objeto</small>
        </div>
        <div className="evidence-card evidence-card-payment">
          <span>PAGAMENTO</span><strong>ORDEM BANCÁRIA</strong><small>movimentação efetiva</small>
        </div>
        <div className="evidence-card evidence-card-execution">
          <span>EXECUÇÃO</span><strong>A VERIFICAR</strong><small>medição / obra / serviço</small>
        </div>
        <svg className="scene-flow" viewBox="0 0 600 350" preserveAspectRatio="none">
          <path d="M68 277 C165 235 199 110 305 135 S442 272 542 198" />
          <circle cx="68" cy="277" r="5" /><circle cx="305" cy="135" r="5" /><circle cx="542" cy="198" r="5" />
        </svg>
        <div className="scene-flow-label">recurso → município → fornecedor → execução</div>
      </div>
    </div>
  );
}

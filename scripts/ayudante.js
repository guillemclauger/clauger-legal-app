/**
 * ayudante.js — Botón de información + Iconos PSV
 * El tour guiado paso a paso ha sido reemplazado por tutorial.js (secuencia temporizada).
 */

const Ayudante = (() => {
  let _psvPopover = null;
  let _infoPanel  = null;
  let _infoBtn    = null;
  let _pdfLoadingController = null;

  // ─── PDFs de referencia PSV ────────────────────────────────────────────────
  const PSV_PDFS = [
    { label: 'AWP',     src: 'imagenes/ayuda-psv/Infografias PSV_AWP.pdf' },
    { label: 'CASTEL',  src: 'imagenes/ayuda-psv/Infografias PSV_CASTEL.pdf' },
    { label: 'Danfoss', src: 'imagenes/ayuda-psv/Infografias PSV_Danfoss.pdf' },
    { label: 'Herl',    src: 'imagenes/ayuda-psv/Infografias PSV_Herl.pdf' },
  ];

  // Textos hint para imágenes obligatorias específicas
  const IMG_HINTS = {
    B04: 'Haz una foto del cartel de seguridad actual',
    B12: 'Haz una foto del detector de fugas actual',
    B16: 'Haz una foto del cuadro de emergencia y/o pulsadores de emergencia',
    B17: 'Haz una foto del interruptor marcha/paro del extractor de la Sala de Máquinas',
    B23: 'Haz una foto de los equipos de respiración autónomos actuales',
  };

  function getImgHint(itemId, itemDesc) {
    if (IMG_HINTS[itemId]) return IMG_HINTS[itemId];
    const d = itemDesc.charAt(0).toLowerCase() + itemDesc.slice(1);
    return 'Haz una foto de ' + d;
  }

  // ─── Inicialización ───────────────────────────────────────────────────────
  function init() {
    _injectStyles();
    _createPsvPopover();

    // Cierra el visor PSV con el gesto/botón atrás de Android
    window.addEventListener('popstate', () => {
      if (_psvPopover && _psvPopover.style.display !== 'none') {
        _psvPopover.style.display = 'none';
        const iframe = document.getElementById('ay-psv-iframe');
        if (iframe) iframe.src = '';
      }
    });

    // Limpiar claves del tour antiguo para que no persistan
    ['clauger_ayudante_pref', 'clauger_ayudante_step',
     'clauger_ayudante_neg',  'clauger_ayudante_b02'].forEach(k => localStorage.removeItem(k));

    _createInfoBtn();
    _createInfoPanel();

    // Botón de tutorial solo en modo técnico
    if (typeof AppState === 'undefined' || AppState.isLegalMode) return;
    _createTutBtn();
  }

  // ─── Botón "▶" para relanzar el tutorial temporizado ────────────────────
  function _createTutBtn() {
    const btn = document.createElement('button');
    btn.id = 'ay-tut-btn';
    btn.title = 'Repetir tutorial';
    btn.style.cssText = [
      'position:fixed;bottom:1.25rem;right:4.75rem;z-index:9998',
      'width:40px;height:40px;border-radius:50%',
      'background:var(--navy);color:#fff;border:none;cursor:pointer',
      'display:flex;align-items:center;justify-content:center',
      'box-shadow:var(--sh-md)',
    ].join(';');
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    btn.onclick = () => {
      if (typeof Tutorial !== 'undefined') Tutorial.restartSequence();
    };
    document.body.appendChild(btn);
  }

  // ─── Popover PSV (ambos modos) ────────────────────────────────────────────
  function _createPsvPopover() {
    _psvPopover = document.createElement('div');
    _psvPopover.id = 'ay-psv-popover';
    _psvPopover.style.cssText = [
      'display:none;position:fixed;inset:0;z-index:10010',
      'background:rgba(0,0,0,.55);align-items:center;justify-content:center;padding:.25rem',
    ].join(';');
    _psvPopover.innerHTML = `
      <div id="ay-psv-modal" style="background:#fff;border-radius:var(--r-lg);width:99vw;height:98vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.28);overflow:hidden">
        <div id="ay-psv-header" style="background:#fff;border-bottom:1px solid var(--line-2);padding:.75rem 1rem;display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;flex-shrink:0">
          <div style="font-family:var(--display);font-weight:700;font-size:.9rem;color:var(--ink);flex:1;min-width:0">Referencia Válvulas de Seguridad (PSV)</div>
          <button onclick="Ayudante.closePsvPopover()"
                  style="min-width:48px;min-height:48px;padding:0 1.1rem;background:var(--ink,#1a2233);color:#fff;border:none;border-radius:var(--r-md);font-size:.9rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:.35rem;flex-shrink:0">
            ✕ Cerrar
          </button>
          <div style="width:100%;display:flex;gap:.4rem;flex-wrap:wrap;align-items:center">
            ${PSV_PDFS.map((p, i) => `
              <button class="ay-psv-tab${i === 0 ? ' ay-psv-tab--on' : ''}"
                      onclick="Ayudante._psvTab(${i})">${p.label}</button>`).join('')}
            <a id="ay-psv-external" href="${PSV_PDFS[0].src}" target="_blank" rel="noopener"
               style="margin-left:auto;font-size:.78rem;color:var(--accent);text-decoration:none;padding:.35rem .7rem;border:1px solid var(--accent);border-radius:var(--r-md);white-space:nowrap;display:inline-flex;align-items:center;gap:.25rem">
              ↗ Abrir / Descargar
            </a>
          </div>
        </div>
        <div id="ay-psv-canvas-wrap" style="flex:1;overflow:hidden;background:#f0f2f5;min-height:0">
          <iframe id="ay-psv-iframe" style="width:100%;height:100%;border:none;display:block" title="PDF PSV"></iframe>
        </div>
      </div>`;
    _psvPopover.addEventListener('click', (e) => {
      if (e.target === _psvPopover) closePsvPopover();
    });
    document.body.appendChild(_psvPopover);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePsvPopover();
    });
  }

  function openPsvPopover() {
    _injectStyles();
    if (!_psvPopover || !document.body.contains(_psvPopover)) _createPsvPopover();
    _psvPopover.style.display = 'flex';
    history.pushState({ psvModal: true }, '');
    _psvTab(0);
  }

  function closePsvPopover() {
    if (!_psvPopover || _psvPopover.style.display === 'none') return;
    _psvPopover.style.display = 'none';
    const iframe = document.getElementById('ay-psv-iframe');
    if (iframe) iframe.src = '';
    if (history.state && history.state.psvModal) history.back();
  }

  function _psvTab(idx) {
    document.querySelectorAll('.ay-psv-tab').forEach((b, i) => b.classList.toggle('ay-psv-tab--on', i === idx));
    const extLink = document.getElementById('ay-psv-external');
    if (extLink) extLink.href = PSV_PDFS[idx].src;
    _renderPdf(PSV_PDFS[idx].src);
  }

  function _renderPdf(src) {
    const iframe = document.getElementById('ay-psv-iframe');
    if (iframe) iframe.src = src;
  }

  function psvInfoIconHtml() {
    return `<button type="button" class="ay-psv-icon" onclick="event.stopPropagation();Ayudante.openPsvPopover()" title="Ver referencia PSV" aria-label="Información PSV">`
      + `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      + `</button>`;
  }

  // ─── Botón "i" de información ─────────────────────────────────────────────
  function _createInfoBtn() {
    _infoBtn = document.createElement('button');
    _infoBtn.id = 'ay-info-btn';
    _infoBtn.title = 'Información general';
    _infoBtn.style.cssText = [
      'position:fixed;bottom:1.25rem;right:1.25rem;z-index:9998',
      'width:40px;height:40px;border-radius:50%',
      'background:var(--accent);color:#fff;border:none;cursor:pointer',
      'display:flex;align-items:center;justify-content:center',
      'box-shadow:var(--sh-md);font-size:1.05rem;font-weight:700;font-family:var(--display)',
    ].join(';');
    _infoBtn.textContent = 'i';
    _infoBtn.onclick = _toggleInfoPanel;
    document.body.appendChild(_infoBtn);
  }

  function _createInfoPanel() {
    _infoPanel = document.createElement('div');
    _infoPanel.id = 'ay-info-panel';
    _infoPanel.style.cssText = [
      'display:none;position:fixed;bottom:80px;right:1.25rem;z-index:10001',
      'background:#fff;border:1px solid var(--line-2);border-radius:var(--r-lg)',
      'padding:1.25rem 1.5rem;max-width:340px;box-shadow:var(--sh-md)',
      'font-family:var(--body);font-size:0.83rem;color:var(--ink);line-height:1.52',
    ].join(';');
    _infoPanel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.75rem">
        <div style="font-weight:700;font-family:var(--display);font-size:0.9rem">Información general</div>
        <button onclick="Ayudante._closeInfoPanel()" style="background:none;border:none;cursor:pointer;color:var(--ink-3);font-size:1.2rem;line-height:1;padding:0 0 0 0.5rem;flex-shrink:0">×</button>
      </div>
      <p style="margin-bottom:0.7rem">
        Esta aplicación está creada para agilizar, mejorar y facilitar la realización tanto
        de los checklists como de las revisiones periódicas. El funcionamiento es simple:
        hay que rellenar todos los campos.
      </p>
      <p style="font-weight:700;margin-bottom:0.35rem">IMPORTANTE — Guardado</p>
      <p>
        Esta aplicación genera un archivo con todos los datos rellenados, que luego el
        departamento Legal analiza y cumplimenta. Para guardar tu trabajo pulsa
        <b>Exportar</b> (recomendable rellenar antes los campos Sistema, Cliente y
        Nº de revisión, en Datos → Datos del Informe / Datos del Cliente). El archivo se
        guardará en tu equipo. Para retomarlo, abre la app, pulsa <b>Cargar</b> y
        selecciona el archivo que guardaste.
      </p>`;
    document.body.appendChild(_infoPanel);

    document.addEventListener('click', (e) => {
      if (_infoPanel && _infoPanel.style.display !== 'none'
          && !_infoPanel.contains(e.target) && e.target !== _infoBtn) {
        _closeInfoPanel();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') _closeInfoPanel();
    });
  }

  function _toggleInfoPanel() {
    if (!_infoPanel) return;
    _infoPanel.style.display = _infoPanel.style.display === 'none' ? 'block' : 'none';
  }

  function _closeInfoPanel() { if (_infoPanel) _infoPanel.style.display = 'none'; }

  // ─── Estilos ──────────────────────────────────────────────────────────────
  function _injectStyles() {
    if (document.getElementById('ay-styles')) return;
    const s = document.createElement('style');
    s.id = 'ay-styles';
    s.textContent = `
      .ay-psv-tab {
        padding: .3rem .85rem;
        border: 1px solid var(--line-2);
        border-radius: var(--r-md);
        background: var(--surface-2, #f5f7fa);
        color: var(--ink-2);
        font-family: var(--body);
        font-size: .8rem;
        font-weight: 600;
        cursor: pointer;
        transition: background .15s, color .15s, border-color .15s;
      }
      .ay-psv-tab:hover {
        background: var(--accent-light, #e8eef8);
        border-color: var(--accent);
        color: var(--accent);
      }
      .ay-psv-tab--on {
        background: var(--accent) !important;
        color: #fff !important;
        border-color: var(--accent) !important;
      }
      .ay-psv-icon {
        background: none;
        border: 1px solid var(--line-2);
        border-radius: 50%;
        width: 20px; height: 20px;
        padding: 0; cursor: pointer;
        color: var(--ink-3);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: 5px;
        vertical-align: middle;
        flex-shrink: 0;
        transition: color .15s, border-color .15s;
      }
      .ay-psv-icon:hover {
        color: var(--accent);
        border-color: var(--accent);
      }
    `;
    document.head.appendChild(s);
  }

  // No-op: compatibilidad con llamadas existentes en app.js
  function onChecklistNegativo() {}

  // ─── API pública ──────────────────────────────────────────────────────────
  return {
    init,
    openPsvPopover,
    closePsvPopover,
    psvInfoIconHtml,
    onChecklistNegativo,
    getImgHint,
    _closeInfoPanel,
    _psvTab,
    _renderPdf,
  };
})();

/**
 * ayudante.js — Botón de información + Iconos PSV
 * El tour guiado paso a paso ha sido reemplazado por tutorial.js (secuencia temporizada).
 */

const Ayudante = (() => {
  let _psvPopover = null;
  let _docPopover = null;
  let _infoPanel  = null;
  let _infoBtn    = null;
  let _pdfLoadingController = null;
  let _zoomLevel = 1;
  let _naturalW  = 0;
  let _naturalH  = 0;
  let _externalUrl = null;

  // Contextos de zoom/pan: permiten reutilizar el mismo motor de zoom
  // (botones, pellizco, Ctrl+rueda, arrastre) en el visor PSV y en el visor genérico
  const _ctxPsv = { wrap: 'ay-psv-canvas-wrap', container: 'ay-psv-canvas-container', outer: 'ay-psv-zoom-outer', label: 'ay-psv-zoom-label' };
  const _ctxDoc = { wrap: 'ay-doc-canvas-wrap', container: 'ay-doc-canvas-container', outer: 'ay-doc-zoom-outer', label: 'ay-doc-zoom-label' };
  let _activeCtx = _ctxPsv;

  // ─── PDFs de referencia PSV (incrustados en base64, ver scripts/psv-data.js) ─
  const PSV_PDFS = [
    { label: 'AWP',     key: 'AWP'     },
    { label: 'CASTEL',  key: 'CASTEL'  },
    { label: 'Danfoss', key: 'DANFOSS' },
    { label: 'Herl',    key: 'HERL'    },
  ];

  function _base64ToBytes(base64) {
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

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

    // Cierra el visor PSV o el visor de documentos con el gesto/botón atrás de Android
    window.addEventListener('popstate', () => {
      if (_psvPopover && _psvPopover.style.display !== 'none') {
        _psvPopover.style.display = 'none';
        if (_pdfLoadingController) { _pdfLoadingController.abort(); _pdfLoadingController = null; }
      }
      if (_docPopover && _docPopover.style.display !== 'none') {
        _docPopover.style.display = 'none';
        if (_pdfLoadingController) { _pdfLoadingController.abort(); _pdfLoadingController = null; }
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
          <a id="ay-psv-external" href="${PSV_PDFS[0].src}" target="_blank" rel="noopener"
             style="font-size:.78rem;color:var(--accent);text-decoration:none;padding:.35rem .7rem;border:1px solid var(--accent);border-radius:var(--r-md);white-space:nowrap;display:inline-flex;align-items:center;gap:.25rem;flex-shrink:0">
            ↗ Abrir / Descargar
          </a>
          <button onclick="Ayudante.closePsvPopover()"
                  style="min-width:48px;min-height:48px;padding:0 1.1rem;background:var(--ink,#1a2233);color:#fff;border:none;border-radius:var(--r-md);font-size:.9rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:.35rem;flex-shrink:0">
            ✕ Cerrar
          </button>
          <div style="width:100%;display:flex;gap:.4rem;overflow-x:auto;-webkit-overflow-scrolling:touch">
            ${PSV_PDFS.map((p, i) => `
              <button class="ay-psv-tab${i === 0 ? ' ay-psv-tab--on' : ''}"
                      onclick="Ayudante._psvTab(${i})">${p.label}</button>`).join('')}
          </div>
        </div>
        <div id="ay-psv-zoom-bar" style="background:#fff;border-bottom:1px solid var(--line-2);padding:.4rem .75rem;display:flex;align-items:center;gap:.5rem;flex-shrink:0;justify-content:center">
          <button onclick="Ayudante._zoomOut()" title="Reducir" style="width:44px;height:44px;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--surface-2,#f5f7fa);font-size:1.4rem;line-height:1;cursor:pointer;color:var(--ink)">−</button>
          <span id="ay-psv-zoom-label" style="min-width:3.8rem;text-align:center;font-family:var(--body);font-size:.82rem;font-weight:600;color:var(--ink-2)">100%</span>
          <button onclick="Ayudante._zoomIn()" title="Ampliar" style="width:44px;height:44px;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--surface-2,#f5f7fa);font-size:1.4rem;line-height:1;cursor:pointer;color:var(--ink)">+</button>
          <button onclick="Ayudante._zoomReset()" title="Zoom 100%" style="height:44px;padding:0 .8rem;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--surface-2,#f5f7fa);font-size:.75rem;font-family:var(--body);cursor:pointer;color:var(--ink-2)">1:1</button>
        </div>
        <div id="ay-psv-canvas-wrap" style="flex:1;overflow:auto;background:#f0f2f5;min-height:0;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y">
          <div id="ay-psv-zoom-outer" style="display:inline-block;min-width:100%">
            <div id="ay-psv-canvas-container" style="transform-origin:top left;display:inline-block;padding:.75rem;box-sizing:border-box"></div>
          </div>
        </div>
      </div>`;
    _psvPopover.addEventListener('click', (e) => {
      if (e.target === _psvPopover) closePsvPopover();
    });
    document.body.appendChild(_psvPopover);
    _initPinch();
    _initWheelZoom();
    _initDragPan();
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePsvPopover();
    });
  }

  function openPsvPopover() {
    _injectStyles();
    if (!_psvPopover || !document.body.contains(_psvPopover)) _createPsvPopover();
    _activeCtx = _ctxPsv;
    _psvPopover.style.display = 'flex';
    history.pushState({ psvModal: true }, '');
    _psvTab(0);
  }

  function closePsvPopover() {
    if (!_psvPopover || _psvPopover.style.display === 'none') return;
    _psvPopover.style.display = 'none';
    if (_pdfLoadingController) { _pdfLoadingController.abort(); _pdfLoadingController = null; }
    if (history.state && history.state.psvModal) history.back();
  }

  function _psvTab(idx) {
    document.querySelectorAll('.ay-psv-tab').forEach((b, i) => b.classList.toggle('ay-psv-tab--on', i === idx));
    const key   = PSV_PDFS[idx].key;
    const bytes = _base64ToBytes(PSV_PDF_DATA[key]);
    const extLink = document.getElementById('ay-psv-external');
    if (extLink) {
      if (_externalUrl) URL.revokeObjectURL(_externalUrl);
      _externalUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      extLink.href = _externalUrl;
      extLink.download = `Infografia PSV_${PSV_PDFS[idx].label}.pdf`;
    }
    const wrap = document.getElementById('ay-psv-canvas-wrap');
    if (wrap) { wrap.scrollTop = 0; wrap.scrollLeft = 0; }
    _zoomLevel = 1;
    _renderPdf(bytes);
  }

  // ─── Visor genérico de documentos (PDF / Word / Excel adjuntos) ──────────
  function _createDocPopover() {
    _docPopover = document.createElement('div');
    _docPopover.id = 'ay-doc-popover';
    _docPopover.style.cssText = [
      'display:none;position:fixed;inset:0;z-index:10010',
      'background:rgba(0,0,0,.55);align-items:center;justify-content:center;padding:.25rem',
    ].join(';');
    _docPopover.innerHTML = `
      <div id="ay-doc-modal" style="background:#fff;border-radius:var(--r-lg);width:99vw;height:98vh;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.28);overflow:hidden">
        <div id="ay-doc-header" style="background:#fff;border-bottom:1px solid var(--line-2);padding:.75rem 1rem;display:flex;align-items:center;gap:.5rem;flex-shrink:0">
          <div id="ay-doc-title" style="font-family:var(--display);font-weight:700;font-size:.9rem;color:var(--ink);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></div>
          <button onclick="Ayudante.closeDocPreview()"
                  style="min-width:48px;min-height:48px;padding:0 1.1rem;background:var(--ink,#1a2233);color:#fff;border:none;border-radius:var(--r-md);font-size:.9rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:.35rem;flex-shrink:0">
            ✕ Cerrar
          </button>
        </div>
        <div id="ay-doc-zoom-bar" style="background:#fff;border-bottom:1px solid var(--line-2);padding:.4rem .75rem;display:flex;align-items:center;gap:.5rem;flex-shrink:0;justify-content:center">
          <button onclick="Ayudante._zoomOut()" title="Reducir" style="width:44px;height:44px;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--surface-2,#f5f7fa);font-size:1.4rem;line-height:1;cursor:pointer;color:var(--ink)">−</button>
          <span id="ay-doc-zoom-label" style="min-width:3.8rem;text-align:center;font-family:var(--body);font-size:.82rem;font-weight:600;color:var(--ink-2)">100%</span>
          <button onclick="Ayudante._zoomIn()" title="Ampliar" style="width:44px;height:44px;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--surface-2,#f5f7fa);font-size:1.4rem;line-height:1;cursor:pointer;color:var(--ink)">+</button>
          <button onclick="Ayudante._zoomReset()" title="Zoom 100%" style="height:44px;padding:0 .8rem;border:1px solid var(--line-2);border-radius:var(--r-md);background:var(--surface-2,#f5f7fa);font-size:.75rem;font-family:var(--body);cursor:pointer;color:var(--ink-2)">1:1</button>
        </div>
        <div id="ay-doc-canvas-wrap" style="flex:1;overflow:auto;background:#f0f2f5;min-height:0;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y">
          <div id="ay-doc-zoom-outer" style="display:inline-block;min-width:100%">
            <div id="ay-doc-canvas-container" style="transform-origin:top left;display:inline-block;padding:.75rem;box-sizing:border-box"></div>
          </div>
        </div>
      </div>`;
    _docPopover.addEventListener('click', (e) => {
      if (e.target === _docPopover) closeDocPreview();
    });
    document.body.appendChild(_docPopover);
    _initPinch('ay-doc-canvas-wrap');
    _initWheelZoom('ay-doc-canvas-wrap');
    _initDragPan('ay-doc-canvas-wrap');
  }

  function closeDocPreview() {
    if (!_docPopover || _docPopover.style.display === 'none') return;
    _docPopover.style.display = 'none';
    if (_pdfLoadingController) { _pdfLoadingController.abort(); _pdfLoadingController = null; }
    if (history.state && history.state.docModal) history.back();
  }

  async function _loadMammoth() {
    if (window.mammoth) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.7.2/mammoth.browser.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function _loadXlsx() {
    if (window.XLSX) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function previewFile({ name, url, mimeType, ext }) {
    _injectStyles();
    if (!_docPopover || !document.body.contains(_docPopover)) _createDocPopover();
    _activeCtx = _ctxDoc;
    _zoomLevel = 1;
    const title = document.getElementById('ay-doc-title');
    if (title) title.textContent = name || '';
    const wrap = document.getElementById('ay-doc-canvas-wrap');
    if (wrap) { wrap.scrollTop = 0; wrap.scrollLeft = 0; }
    _docPopover.style.display = 'flex';
    history.pushState({ docModal: true }, '');

    const container = document.getElementById('ay-doc-canvas-container');
    if (!container) return;
    const e = (ext || (name || '').split('.').pop() || '').toLowerCase();
    const mime = mimeType || '';

    if (mime === 'application/pdf' || e === 'pdf') {
      try {
        const bytes = new Uint8Array(await (await fetch(url)).arrayBuffer());
        await _renderPdf(bytes);
      } catch (err) {
        container.innerHTML = `<div style="padding:2rem;text-align:center;font-family:var(--body);color:var(--ink-3)">No se pudo cargar el PDF.</div>`;
      }
      return;
    }

    if (e === 'docx' || mime.includes('wordprocessingml')) {
      container.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--ink-3);font-family:var(--body)">Cargando documento…</div>';
      try {
        await _loadMammoth();
        const arrayBuffer = await (await fetch(url)).arrayBuffer();
        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        container.innerHTML = `<div style="max-width:800px;background:#fff;padding:2rem;font-family:var(--body);color:var(--ink);line-height:1.6">${result.value}</div>`;
        _naturalW = container.scrollWidth;
        _naturalH = container.scrollHeight;
        _applyZoom();
      } catch (err) {
        container.innerHTML = `<div style="padding:2rem;text-align:center;font-family:var(--body);color:var(--ink-3)">No se pudo previsualizar el documento Word.</div>`;
      }
      return;
    }

    if (e === 'xlsx' || e === 'xls' || mime.includes('spreadsheetml') || mime === 'application/vnd.ms-excel') {
      container.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--ink-3);font-family:var(--body)">Cargando hoja de cálculo…</div>';
      try {
        await _loadXlsx();
        const arrayBuffer = await (await fetch(url)).arrayBuffer();
        const wb = window.XLSX.read(arrayBuffer, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const html = window.XLSX.utils.sheet_to_html(sheet);
        container.innerHTML = `<div style="background:#fff;padding:1rem;font-family:var(--body);font-size:.85rem">${html}</div>`;
        _naturalW = container.scrollWidth;
        _naturalH = container.scrollHeight;
        _applyZoom();
      } catch (err) {
        container.innerHTML = `<div style="padding:2rem;text-align:center;font-family:var(--body);color:var(--ink-3)">No se pudo previsualizar la hoja de cálculo.</div>`;
      }
      return;
    }

    container.innerHTML = `<div style="padding:2rem;text-align:center;font-family:var(--body);color:var(--ink-3)">
      <div style="margin-bottom:.75rem">No hay vista previa disponible para este tipo de archivo.</div>
      <a href="${url}" download="${name || ''}" style="color:var(--accent);text-decoration:none;font-weight:600">↗ Descargar ${name || ''}</a>
    </div>`;
    _naturalW = 0; _naturalH = 0;
    _applyZoom(0, 0);
  }

  async function _loadPdfJs() {
    if (window.pdfjsLib) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  async function _renderPdf(bytes) {
    if (_pdfLoadingController) _pdfLoadingController.abort();
    const ctrl = new AbortController();
    _pdfLoadingController = ctrl;

    const container = document.getElementById(_activeCtx.container);
    if (!container) return;
    container.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--ink-3);font-family:var(--body)">Cargando PDF…</div>';
    _applyZoom(0, 0);

    try {
      await _loadPdfJs();
      if (ctrl.signal.aborted) return;

      const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
      if (ctrl.signal.aborted) return;

      container.innerHTML = '';
      const wrap = document.getElementById(_activeCtx.wrap);
      const availableWidth = (wrap ? wrap.clientWidth : window.innerWidth) - 24;

      for (let i = 1; i <= pdf.numPages; i++) {
        if (ctrl.signal.aborted) return;
        const page    = await pdf.getPage(i);
        const vp1     = page.getViewport({ scale: 1 });
        const scale   = Math.min(2.5, availableWidth / vp1.width);
        const viewport = page.getViewport({ scale });
        const dpr     = window.devicePixelRatio || 1;
        const canvas  = document.createElement('canvas');
        canvas.width  = Math.floor(viewport.width  * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.cssText = `width:${Math.floor(viewport.width)}px;display:block;margin-bottom:8px;border-radius:4px;box-shadow:0 1px 6px rgba(0,0,0,.15)`;
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (ctrl.signal.aborted) return;
      }

      _naturalW = container.scrollWidth;
      _naturalH = container.scrollHeight;
      _applyZoom();
    } catch (e) {
      if (!ctrl.signal.aborted) {
        container.innerHTML = `<div style="padding:2rem;text-align:center;font-family:var(--body);color:var(--ink-3)">
          <div style="margin-bottom:.5rem">No se pudo cargar el PDF.</div>
          <small>${e.message}</small></div>`;
      }
    }
  }

  function psvInfoIconHtml() {
    return `<button type="button" class="ay-psv-icon" onclick="event.stopPropagation();Ayudante.openPsvPopover()" title="Ver referencia PSV" aria-label="Información PSV">`
      + `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      + `</button>`;
  }

  // ─── Zoom + Pinch ─────────────────────────────────────────────────────────
  function _applyZoom(w, h) {
    const container = document.getElementById(_activeCtx.container);
    const outer     = document.getElementById(_activeCtx.outer);
    const label     = document.getElementById(_activeCtx.label);
    const wrap      = document.getElementById(_activeCtx.wrap);
    if (!container || !outer) return;
    const nw = (w !== undefined ? w : _naturalW) * _zoomLevel;
    const nh = (h !== undefined ? h : _naturalH) * _zoomLevel;
    container.style.transform = `scale(${_zoomLevel})`;
    outer.style.width  = nw ? nw + 'px' : '';
    outer.style.height = nh ? nh + 'px' : '';
    if (label) label.textContent = Math.round(_zoomLevel * 100) + '%';
    if (wrap) wrap.style.cursor = _zoomLevel > 1 ? 'grab' : '';
  }

  function _zoomIn()    { _zoomLevel = Math.min(4,   +(_zoomLevel + 0.25).toFixed(2)); _applyZoom(); }
  function _zoomOut()   { _zoomLevel = Math.max(0.5, +(_zoomLevel - 0.25).toFixed(2)); _applyZoom(); }
  function _zoomReset() { _zoomLevel = 1; _applyZoom(); }

  function _initPinch(wrapId) {
    const wrap = document.getElementById(wrapId || 'ay-psv-canvas-wrap');
    if (!wrap) return;
    let startDist = 0, startZoom = 1;
    wrap.addEventListener('touchstart', e => {
      if (e.touches.length === 2) {
        startDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        startZoom = _zoomLevel;
      }
    }, { passive: true });
    wrap.addEventListener('touchmove', e => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      _zoomLevel = Math.max(0.5, Math.min(4, +((startZoom * dist / startDist).toFixed(2))));
      _applyZoom();
    }, { passive: false });
  }

  function _initWheelZoom(wrapId) {
    const wrap = document.getElementById(wrapId || 'ay-psv-canvas-wrap');
    if (!wrap) return;
    wrap.addEventListener('wheel', e => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (e.deltaY < 0) _zoomIn(); else _zoomOut();
    }, { passive: false });
  }

  function _initDragPan(wrapId) {
    const wrap = document.getElementById(wrapId || 'ay-psv-canvas-wrap');
    if (!wrap) return;
    let dragging = false, startX = 0, startY = 0, startLeft = 0, startTop = 0;
    wrap.addEventListener('mousedown', e => {
      if (_zoomLevel <= 1) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startLeft = wrap.scrollLeft; startTop = wrap.scrollTop;
      wrap.style.cursor = 'grabbing';
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      wrap.scrollLeft = startLeft - (e.clientX - startX);
      wrap.scrollTop  = startTop  - (e.clientY - startY);
    });
    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false;
      wrap.style.cursor = _zoomLevel > 1 ? 'grab' : '';
    });
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
        min-height: 40px;
        flex-shrink: 0;
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
    previewFile,
    closeDocPreview,
    _closeInfoPanel,
    _psvTab,
    _renderPdf,
    _zoomIn,
    _zoomOut,
    _zoomReset,
  };
})();

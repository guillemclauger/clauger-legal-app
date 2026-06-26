// ══ DIVISORIA DE SECCIÓN ══  (reemplaza la función divider actual)
// Fondo blanco, número gigante en gris muy claro, sin índice dentro.
const divider = (num, title, desc='') => `
<div class="page page-divider page-break">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 80px;position:relative">
    <div style="position:absolute;right:40px;bottom:90px;font-size:300px;font-weight:900;color:#f0f2f7;line-height:.74;letter-spacing:-.04em;user-select:none">${String(num).padStart(2,'0')}</div>
    <div style="position:relative;z-index:1">
      <div style="font-size:12px;font-weight:700;letter-spacing:.30em;text-transform:uppercase;color:var(--accent);margin-bottom:18px">Sección ${String(num).padStart(2,'0')}</div>
      <div style="font-size:48px;font-weight:800;letter-spacing:-.02em;line-height:1.04;max-width:62%;color:var(--navy)">${title}</div>
      <div style="display:flex;align-items:center;gap:14px;margin-top:30px">
        <i style="width:70px;height:3px;background:var(--accent)"></i>
        <span style="font-weight:700;color:var(--accent);font-size:22px;line-height:1">&#8600;</span>
      </div>
      ${desc?`<div style="font-size:14px;color:var(--ink-2);margin-top:24px;max-width:48%;line-height:1.65">${desc}</div>`:''}
    </div>
  </div>
</div>`;

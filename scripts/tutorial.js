/**
 * tutorial.js — Modo Tutorial para modo técnico (secuencia temporizada)
 */

const Tutorial = (() => {
    let _active = false;
    let _spotlight = null;
    let _tooltip = null;
    let _timer = null;

    function _injectStyles() {
        if (document.getElementById('tut-styles')) return;
        const s = document.createElement('style');
        s.id = 'tut-styles';
        s.textContent = `
            .tut-tip {
                position: fixed;
                background: #fff;
                color: #1a2744;
                padding: .75rem 1.1rem;
                border-radius: 10px;
                font-size: .84rem;
                line-height: 1.55;
                max-width: 290px;
                z-index: 10000;
                pointer-events: none;
                box-shadow: 0 6px 24px rgba(0,0,0,.18), 0 1px 4px rgba(0,0,0,.08);
                animation: tut-fadein .2s ease;
                border-left: 3px solid #2f5aa6;
            }
            @keyframes tut-fadein {
                from { opacity: 0; transform: translateY(5px); }
                to   { opacity: 1; transform: none; }
            }
        `;
        document.head.appendChild(s);
    }

    function _clearHighlight() {
        if (_spotlight) { _spotlight.remove(); _spotlight = null; }
        if (_tooltip)   { _tooltip.remove();   _tooltip   = null; }
        if (_timer)     { clearTimeout(_timer); _timer     = null; }
    }

    // Calcula el rect que engloba todos los elementos (para multi)
    function _boundingRect(els) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        els.forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.left   < minX) minX = r.left;
            if (r.top    < minY) minY = r.top;
            if (r.right  > maxX) maxX = r.right;
            if (r.bottom > maxY) maxY = r.bottom;
        });
        return { top: minY, left: minX, width: maxX - minX, height: maxY - minY,
                 bottom: maxY, right: maxX };
    }

    function _showSpotlight(r) {
        if (_spotlight) _spotlight.remove();
        const pad = 6;
        const sp = document.createElement('div');
        sp.id = 'tut-spotlight';
        sp.style.cssText = [
            'position:fixed;pointer-events:none;z-index:9990',
            `top:${r.top - pad}px;left:${r.left - pad}px`,
            `width:${r.width + pad * 2}px;height:${r.height + pad * 2}px`,
            'border-radius:7px',
            'box-shadow:0 0 0 9999px rgba(10,18,38,.5)',
            'border:2px solid rgba(255,255,255,.6)',
            'transition:top .25s,left .25s,width .25s,height .25s',
        ].join(';');
        document.body.appendChild(sp);
        _spotlight = sp;
    }

    function _positionTip(tip, r) {
        const tw = tip.offsetWidth;
        const th = tip.offsetHeight;
        let top  = r.bottom + 16;
        let left = r.left + r.width / 2 - tw / 2;
        if (top + th > window.innerHeight - 10) top = r.top - th - 16;
        if (top < 8) top = 8;
        left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
        tip.style.top  = top + 'px';
        tip.style.left = left + 'px';
    }

    function _highlight(els, text, duration, cb) {
        _clearHighlight();
        const valid = els.filter(Boolean);
        if (!valid.length) { if (cb) setTimeout(cb, 0); return; }

        const r = _boundingRect(valid);
        _showSpotlight(r);

        const tip = document.createElement('div');
        tip.className = 'tut-tip';
        tip.textContent = text;
        document.body.appendChild(tip);
        _tooltip = tip;
        requestAnimationFrame(() => _positionTip(tip, r));

        _timer = setTimeout(() => { _clearHighlight(); if (cb) cb(); }, duration);
    }

    // ─── Secuencia de pasos ───────────────────────────────────────────────────

    function _runSteps(steps, i) {
        if (!_active || i >= steps.length) return;
        const s  = steps[i];
        const next = () => _runSteps(steps, i + 1);

        if (s.type === 'tab') {
            // Navega al tab y lo remarca
            const tabEl = document.querySelector(s.sel);
            if (!tabEl) { next(); return; }
            tabEl.click();
            // Si hay sidebar que seleccionar, esperamos al render
            if (s.sidebar) {
                setTimeout(() => {
                    const sideBtn = [...document.querySelectorAll('#sidebar .sidebar-btn')]
                        .find(b => b.textContent.includes(s.sidebar));
                    if (sideBtn) sideBtn.click();
                }, 150);
            }
            _highlight([tabEl], s.text, s.ms, next);

        } else if (s.type === 'multi') {
            // Remarca varios elementos a la vez (sin navegar)
            const delay = s.delay || 0;
            setTimeout(() => {
                const els = [...document.querySelectorAll(s.sel)];
                if (!els.length) { next(); return; }
                _highlight(els, s.text, s.ms, next);
            }, delay);

        } else if (s.type === 'scroll') {
            // Hace scroll al elemento y lo remarca
            const delay = s.delay || 0;
            setTimeout(() => {
                const el = document.querySelector(s.sel);
                if (!el) { next(); return; }
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => _highlight([el], s.text, s.ms, next), 400);
            }, delay);

        } else if (s.type === 'fixed') {
            // Elemento siempre visible (cabecera / botones flotantes), spotlight directo
            const el = document.querySelector(s.sel);
            if (!el) { next(); return; }
            _highlight([el], s.text, s.ms, next);
        }
    }

    function startTabSequence() {
        _injectStyles();
        const STEPS = [
            {
                type: 'tab', sel: '.nav-tab[data-page="datos"]', ms: 5000,
                text: 'En esta pestaña rellenaras los datos más básicos sobre el cliente y la instalación.'
            },
            {
                type: 'tab', sel: '.nav-tab[data-page="checklist"]', ms: 10000,
                text: 'Aquí deberás rellenar todos los puntos indicando si hay defectos en la instalación. Muy importante realizar fotos y dar explicación de los defectos.'
            },
            {
                type: 'tab', sel: '.nav-tab[data-page="equipos"]', ms: 10000,
                sidebar: 'Unidad Compresora',
                text: 'En este apartado rellenaras los datos de todos los equipos y válvulas de seguridad que componen la instalación. Muy importante realizar fotografías y no saltarse datos.'
            },
            {
                type: 'multi', sel: '.components-grid .component-btn', ms: 5000,
                delay: 200,
                text: 'Añade todos los componentes que conformen la unidad compresora.'
            },
            {
                type: 'scroll', sel: '.add-vs-btn', ms: 5000,
                text: 'Si existen válvulas de seguridad por favor añádelas clickando en este botón.'
            },
            {
                type: 'tab', sel: '.nav-tab[data-page="servicios"]', ms: 4000,
                text: 'En este apartado indicarás los servicios que componen la instalación.'
            },
            {
                type: 'tab', sel: '.nav-tab[data-page="verif_fugas"]', ms: 8000,
                text: 'Esta pestaña solo se usará en caso de realizar la calibración de fugas, en ese caso deberás realizar todos los puntos indicados.'
            },
            {
                type: 'fixed', sel: '#btnUndo', ms: 4000,
                text: 'Con este botón podrás deshacer los últimos cambios realizados, muy útil si te has equivocado en algún dato.'
            },
            {
                type: 'fixed', sel: '#btnRedo', ms: 3000,
                text: 'Y con este puedes rehacer lo que acabas de deshacer, recuperando datos borrados.'
            },
            {
                type: 'fixed', sel: '#btnLoad', ms: 5000,
                text: 'Cargar te permite abrir un informe guardado anteriormente. Así podrás retomar el trabajo donde lo dejaste con todos los datos ya rellenados.'
            },
            {
                type: 'fixed', sel: '#btnExport', ms: 7000,
                text: 'Exportar guarda un archivo con todos los datos cumplimentados. Hazlo siempre antes de cerrar. Ese mismo archivo podrás cargarlo más adelante para continuar o enviarlo al departamento Legal.'
            },
            {
                type: 'fixed', sel: '#ay-info-btn', ms: 4000,
                text: 'Aquí encontrarás información general sobre la aplicación: cómo funciona, cómo guardar y cómo retomar un informe.'
            },
            {
                type: 'fixed', sel: '#ay-tut-btn', ms: 5000,
                text: '¡Y aquí puedes repetir este tutorial cuando quieras! Si en algún momento te quedan dudas, vuelve a él.'
            },
        ];
        _runSteps(STEPS, 0);
    }

    // ─── Diálogo de activación ────────────────────────────────────────────────

    function askAndStart() {
        _injectStyles();
        const ov = document.createElement('div');
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center';
        ov.innerHTML = `
            <div style="background:#fff;border-radius:12px;padding:2rem;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center;font-family:inherit">
                <div style="font-size:2rem;margin-bottom:.5rem">🎓</div>
                <h2 style="margin:0 0 .4rem;font-size:1.1rem;color:#1a2744">Modo Tutorial</h2>
                <p style="margin:0 0 1.5rem;color:#64748b;font-size:.85rem">¿Quieres activar el modo tutorial?<br><span style="color:#94a3b8;font-size:.8rem">Recomendado para la primera vez</span></p>
                <div style="display:flex;flex-direction:column;gap:.6rem">
                    <button id="_tutYes" style="padding:.75rem 1rem;background:#2f5aa6;color:#fff;border:none;border-radius:8px;font-size:.95rem;font-weight:600;cursor:pointer">Activar tutorial</button>
                    <button id="_tutNo" style="padding:.75rem 1rem;background:transparent;color:#94a3b8;border:1px solid #e2e8f0;border-radius:8px;font-size:.9rem;cursor:pointer">Omitir</button>
                </div>
            </div>`;
        document.body.appendChild(ov);
        ov.querySelector('#_tutYes').onclick = () => {
            document.body.removeChild(ov);
            _active = true;
            startTabSequence();
        };
        ov.querySelector('#_tutNo').onclick = () => document.body.removeChild(ov);
    }

    // Llamado desde el botón flotante del Ayudante para repetir la secuencia
    function restartSequence() {
        _clearHighlight();
        _active = true;
        startTabSequence();
    }

    // Hooks desde app.js (ya no se usan en la secuencia principal, se mantienen por compatibilidad)
    function onAddCompositeUnit() {}
    function onAddSubEquipment() {}

    return {
        askAndStart,
        restartSequence,
        onAddCompositeUnit,
        onAddSubEquipment,
        get active() { return _active; }
    };
})();

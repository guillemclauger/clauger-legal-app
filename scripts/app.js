/**
 * ============================================================================
 * CLAUGER - Sistema de Informes Técnicos
 * ============================================================================
 * Archivo: app.js
 * Descripción: Lógica principal de la aplicación
 * Versión: 1.2 - CORREGIDO PARA MODO LEGAL
 * ============================================================================
 */

// Lucide SVG icons — stroke 1.6, 16×16 inline
const ICONS = {
  wrench:      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  trash:       '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
  plus:        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  camera:      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  file:        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  clipboard:   '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
  gear:        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>',
  snowflake:   '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>',
  search:      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  thermometer: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>',
  calendar:    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  home:        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  list:        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  refresh:     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  zap:         '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  radio:       '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>',
  factory:     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>',
  package:     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  message:     '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  chart:       '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  paperclip:   '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
  lock:        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  note:        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  shield:      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
};
const ic = name => ICONS[name] || '';

// Referencia al FileSystemFileHandle del archivo activo (File System Access API)
let _fileHandle = null;

const App = {
    init() {
        console.log('🎯 Inicializando App - Modo Legal:', AppState.isLegalMode);
        this.initializeSectionsData();
        // Unidad Compresora por defecto (solo modo técnico, solo si está vacío)
        if (!AppState.isLegalMode && !AppState.equipmentData['Unidad Compresora']?.length) {
            AppState.equipmentData['Unidad Compresora'] = [{
                identificador: '', fabricante: '', modelo: '', numSerie: '',
                subEquipments: {
                    'Bloque Compresor': [{
                        fabricante: '', modelo: '', numSerie: '', numPlaca: '', fechaFabricacion: '',
                        normativa: '', ubicacion: '', categoria: '', observaciones: '',
                        photos: {placa: null, general: null}, imagenes: [],
                        fluido: '', volInterno: '', presionMax: '', presionMin: '',
                        valvulas: {marca: '', modelo: '', sifon: '', items: []},
                        resultadoForzado: false, presostato: '', presionRegulacion: ''
                    }]
                }
            }];
            AppState.expandedEquipment['Unidad Compresora_0'] = true;
        }
        this.setupEventListeners();
        // Show legal-only tabs only in legal mode
        document.querySelectorAll('.nav-tab[data-legal-only]').forEach(tab => {
            tab.style.display = AppState.isLegalMode ? '' : 'none';
        });
        // En modo legal, estas pestañas ya están dentro de Revisión Final
        if (AppState.isLegalMode) {
            document.querySelectorAll('.nav-tab[data-page="termografia"], .nav-tab[data-page="verif_fugas"]').forEach(tab => {
                tab.style.display = 'none';
            });
            document.getElementById('btnInformeFinal').style.display = 'block';
        }
        this.renderSidebar();
        this.renderWorkspace();
        if (AppState.isLegalMode) this.calcularDatosRevision();
    },

    initializeSectionsData() {
        Object.keys(PAGES_CONFIG).forEach(pageKey => {
            PAGES_CONFIG[pageKey].sections.forEach(section => {
                // CRÍTICO: Usar AppState.isLegalMode
                if (section.legalOnly && !AppState.isLegalMode) {
                    console.log(`⏭️ Saltando sección ${section.id} (solo legal)`);
                    return;
                }
                if (section.technicalOnly && AppState.isLegalMode) {
                    return;
                }
                
                const sectionId = `${pageKey}_${section.id}`;
                if (!AppState.sectionsData[sectionId]) AppState.sectionsData[sectionId] = {};

                if (section.type === 'form') {
                    section.fields.forEach(field => {
                        if (AppState.sectionsData[sectionId][field.name] === undefined)
                            AppState.sectionsData[sectionId][field.name] = '';
                    });
                } else if (section.type === 'checklist') {
                    section.items.forEach(item => {
                        if (!AppState.sectionsData[sectionId][item.id])
                            AppState.sectionsData[sectionId][item.id] = {
                                estado: '', gravedad: '', correccion: '', observaciones: '', imagenes: []
                            };
                    });
                }
            });
        });
        
        console.log('✅ Secciones inicializadas');
    },

    setupEventListeners() {
        document.getElementById('btnExport').onclick = () => this.exportJSON();
        document.getElementById('btnLoad').onclick = () => this.loadJSON();
        document.getElementById('btnActaInicial').onclick = () => this.generateActaInicial();
        document.getElementById('btnInformeFinal').onclick = () => this.generateInformeFinal();
        document.getElementById('closeModal').onclick = () => this.closeImageModal();
        document.getElementById('imageModal').onclick = (e) => {
            if (e.target.id === 'imageModal') this.closeImageModal();
        };
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); this.undo(); }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); this.redo(); }
        });
    },

    // ── Restore dialog ───────────────────────────────────────────────────────
    _showRestoreDialog(snap, when, onRestore, onNew) {
        const ov = document.createElement('div');
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;display:flex;align-items:center;justify-content:center';
        ov.innerHTML = `
            <div style="background:#fff;border-radius:12px;padding:2rem;max-width:380px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center;font-family:inherit">
                <div style="font-size:2rem;margin-bottom:.5rem">📂</div>
                <h2 style="margin:0 0 .4rem;font-size:1.1rem;color:#1a2744">Sesión guardada encontrada</h2>
                <p style="margin:0 0 1.5rem;color:#64748b;font-size:.85rem">${when}</p>
                <div style="display:flex;flex-direction:column;gap:.6rem">
                    <button id="_dlgRestore" style="padding:.75rem 1rem;background:#2f5aa6;color:#fff;border:none;border-radius:8px;font-size:.95rem;font-weight:600;cursor:pointer">Restaurar sesión anterior</button>
                    <button id="_dlgNew" style="padding:.75rem 1rem;background:transparent;color:#64748b;border:1px solid #e2e8f0;border-radius:8px;font-size:.9rem;cursor:pointer">Empezar sesión nueva</button>
                </div>
            </div>`;
        document.body.appendChild(ov);
        ov.querySelector('#_dlgRestore').onclick = () => { document.body.removeChild(ov); onRestore(); };
        ov.querySelector('#_dlgNew').onclick    = () => { document.body.removeChild(ov); onNew(); };
    },

    // ── Autosave ──────────────────────────────────────────────────────────────
    _badgeFadeTimer: null,

    _doAutosave() {
        this._saveHistory();
        try {
            const termografiaExport = (AppState.termografiaData || []).map(t => {
                const copy = Object.assign({}, t);
                delete copy._pcImg; // derived, can be regenerated
                return copy;
            });
            const snap = {
                ts: Date.now(),
                isLegalMode: AppState.isLegalMode,
                sectionsData: AppState.sectionsData,
                equipmentData: AppState.equipmentData,
                detectorsData: AppState.detectorsData,
                instalacionCircuitos: AppState.instalacionCircuitos,
                instalacionSalas: AppState.instalacionSalas,
                instalacionCamaras: AppState.instalacionCamaras,
                serviciosData: AppState.serviciosData,
                portadaData: AppState.portadaData || {},
                indiceData: AppState.indiceData || { items: [] },
                contraportadaData: AppState.contraportadaData || { texto: '' },
                certPsvArchivos: AppState.certPsvArchivos || [],
                actaInicialArchivos: AppState.actaInicialArchivos || [],
                termografiaData: termografiaExport,
                planificacionData: AppState.planificacionData || { textoRevision: '', textoInspeccion: '' },
            };
            localStorage.setItem('clauger_autosave', JSON.stringify(snap));
            this._updateAutosaveBadge();
        } catch(e) {
            if (e.name === 'QuotaExceededError') {
                console.warn('Autosave: almacenamiento lleno, no se pudo guardar');
            }
        }
    },

    _updateAutosaveBadge() {
        // Badge oculto visualmente, autoguardado sigue funcionando
    },

    _getAutosave() {
        try {
            const raw = localStorage.getItem('clauger_autosave');
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    },

    _clearAutosave() {
        localStorage.removeItem('clauger_autosave');
    },

    _applyAutosave(snap) {
        AppState.sectionsData       = snap.sectionsData || {};
        // Sync SISTEMA y CIF entre modo técnico y legal al cargar
        {
            const _inf  = AppState.sectionsData['datos_datos_informe']     || {};
            const _inst = AppState.sectionsData['datos_datos_instalacion'] || {};
            if (_inf['SISTEMA'] && !_inst['SISTEMA']) _inst['SISTEMA'] = _inf['SISTEMA'];
            if (_inst['SISTEMA'] && !_inf['SISTEMA']) _inf['SISTEMA'] = _inst['SISTEMA'];
            if (_inf['CIF'] && !_inst['CIF']) _inst['CIF'] = _inf['CIF'];
            if (_inst['CIF'] && !_inf['CIF']) _inf['CIF'] = _inst['CIF'];
            if (!AppState.sectionsData['datos_datos_informe']) AppState.sectionsData['datos_datos_informe'] = _inf;
            if (!AppState.sectionsData['datos_datos_instalacion']) AppState.sectionsData['datos_datos_instalacion'] = _inst;
        }
        AppState.equipmentData      = snap.equipmentData || {};
        AppState.detectorsData      = snap.detectorsData || [];
        AppState.instalacionCircuitos = snap.instalacionCircuitos || AppState.instalacionCircuitos;
        AppState.instalacionSalas   = snap.instalacionSalas || [];
        AppState.instalacionCamaras = snap.instalacionCamaras || AppState.instalacionCamaras;
        AppState.serviciosData      = snap.serviciosData || [];
        AppState.portadaData        = snap.portadaData || {};
        AppState.indiceData         = snap.indiceData || { items: [] };
        AppState.contraportadaData  = snap.contraportadaData || { texto: '' };
        AppState.certPsvArchivos    = snap.certPsvArchivos || [];
        AppState.actaInicialArchivos = snap.actaInicialArchivos || [];
        AppState.termografiaData    = snap.termografiaData || [];
        AppState.planificacionData  = snap.planificacionData || { textoRevision: '', textoInspeccion: '' };
        this.renderSidebar();
        this.renderWorkspace();
        this.showToast('Sesión restaurada', 'success');
    },
    // ─────────────────────────────────────────────────────────────────────────

    _renderFieldInput(f, data) {
        const value = data[f.name] !== undefined ? data[f.name] : '';
        if (f.type === 'textarea') {
            return `<textarea class="form-input" data-field="${f.name}" rows="${f.rows || 4}" ${f.readonly ? 'readonly' : ''}>${value}</textarea>`;
        } else if (f.type === 'select') {
            return `<select class="form-input" data-field="${f.name}">
                ${f.options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt || '— Seleccionar —'}</option>`).join('')}
            </select>`;
        } else if (f.type === 'date_or_never') {
            const isNunca = value === '__nunca__';
            const dateVal = isNunca ? '' : value;
            return `<div style="display:flex;gap:0.5rem;align-items:center">
                <input type="date" class="form-input" data-field="${f.name}" value="${dateVal}" ${isNunca ? 'disabled' : ''} style="flex:1${isNunca ? ';background:#f3f4f6;opacity:0.5' : ''}">
                <label style="display:flex;align-items:center;gap:0.4rem;white-space:nowrap;font-size:0.85rem;cursor:pointer;font-weight:normal">
                    <input type="checkbox" data-field-nunca="${f.name}" ${isNunca ? 'checked' : ''} style="width:1rem;height:1rem"> Nunca realizada
                </label>
            </div>`;
        } else {
            const roAttr = f.readonly ? ' readonly' : '';
            const inputType = f.type || 'text';
            const phAttr = f.placeholder ? ` placeholder="${f.placeholder}"` : '';
            const phClass = f.placeholder ? ' form-input--hint' : '';
            return `<input type="${inputType}" class="form-input${phClass}" data-field="${f.name}" value="${value}"${roAttr}${phAttr}>`;
        }
    },

    calcularDatosRevision() {
        const instalacion = AppState.sectionsData['datos_datos_instalacion'] || {};
        const revision = AppState.sectionsData['datos_datos_revision'];
        if (!revision) return;

        const nivel = instalacion['NIVEL'] || '';
        const fechaPS = instalacion['FECHA PS'] || '';

        let totalTnCO2 = 0;
        let totalKgRef = 0;
        AppState.instalacionCircuitos.forEach(circ => {
            const carga = parseFloat(circ.carga) || 0;
            const pca = REFRIGERANTES_PCA[circ.refrigerante] || 0;
            totalTnCO2 += (carga * pca) / 1000;
            totalKgRef += carga;
        });

        // Periodicidad inspección
        let periodInsp;
        if (totalTnCO2 >= 5000)      periodInsp = '1 año';
        else if (totalTnCO2 >= 500)  periodInsp = '2 años';
        else if (totalTnCO2 >= 50)   periodInsp = '5 años';
        else if (nivel === '2')       periodInsp = '10 años';
        else                          periodInsp = 'Exento';

        // Periodicidad revisión
        let periodRev = '5 años';
        if (totalKgRef > 3000 && fechaPS) {
            const yearsOld = (new Date() - new Date(fechaPS)) / (1000 * 60 * 60 * 24 * 365.25);
            if (yearsOld >= 15) periodRev = '2 años';
        }

        // Próxima revisión
        let proximaRevision = '';
        const fechaRevision = revision['FECHA REVISIÓN'] || '';
        if (fechaRevision) {
            const d = new Date(fechaRevision);
            d.setFullYear(d.getFullYear() + (periodRev === '2 años' ? 2 : 5));
            proximaRevision = d.toISOString().split('T')[0];
        }

        // Próxima inspección
        let proximaInspeccion = '';
        const ultimaInsp = revision['ÚLTIMA INSPECCIÓN'] || '';
        if (periodInsp !== 'Exento') {
            const yrs = periodInsp === '1 año' ? 1 : periodInsp === '2 años' ? 2 : periodInsp === '5 años' ? 5 : 10;
            let baseDate = null;
            if (ultimaInsp === '__nunca__' || ultimaInsp === '') {
                if (fechaPS) baseDate = new Date(fechaPS);
            } else {
                baseDate = new Date(ultimaInsp);
            }
            if (baseDate && !isNaN(baseDate)) {
                baseDate.setFullYear(baseDate.getFullYear() + yrs);
                proximaInspeccion = baseDate.toISOString().split('T')[0];
            }
        }

        revision['PERIODICIDAD REVISIÓN']    = periodRev;
        revision['PRÓXIMA REVISIÓN']         = proximaRevision;
        revision['PERIODICIDAD INSPECCIÓN']  = periodInsp;
        revision['PRÓXIMA INSPECCIÓN']       = proximaInspeccion;

        // Actualizar DOM si la sección está visible
        if (AppState.currentSection === 'datos_datos_revision') {
            const ws = document.getElementById('workspace');
            const set = (name, val) => { const el = ws.querySelector(`[data-field="${name}"]`); if (el) el.value = val; };
            set('PERIODICIDAD REVISIÓN',   periodRev);
            set('PRÓXIMA REVISIÓN',        proximaRevision);
            set('PERIODICIDAD INSPECCIÓN', periodInsp);
            set('PRÓXIMA INSPECCIÓN',      proximaInspeccion);
        }
    },

    _normativaFromYear(fechaStr) {
        if (!fechaStr) return '';
        const y = new Date(fechaStr).getFullYear();
        if (isNaN(y)) return '';
        if (y < 2011) return 'RD3099/1977';
        if (y < 2020) return 'RD138/2011';
        return 'RD552/2019';
    },

    _getFluidOptions() {
        const fixed = ['Agua', 'Aceite', 'Agua + Glicol', 'R744', 'R717'];
        const fromCircuits = (AppState.instalacionCircuitos || [])
            .map(c => c.refrigerante)
            .filter(r => r && r.trim());
        return ['', ...[...new Set([...fromCircuits, ...fixed])]];
    },

    createFormFields(fields, dataArray, dataAttribute = 'data-field') {
        return fields.map((field, idx) => {
            const value = dataArray[idx] || '';
            return `
                <div class="form-col">
                    <label class="form-label">${field.label || field.name}</label>
                    ${field.type === 'textarea' 
                        ? `<textarea class="form-input" ${dataAttribute}="${field.path || field.name}" rows="${field.rows || 4}" ${field.readonly ? 'readonly style="background:#f3f4f6;cursor:not-allowed"' : ''}>${value}</textarea>`
                        : field.type === 'select'
                        ? `<select class="form-input" ${dataAttribute}="${field.path || field.name}">
                            ${field.options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                           </select>`
                        : `<input type="${field.type || 'text'}" class="form-input" ${dataAttribute}="${field.path || field.name}" value="${value}">`
                    }
                </div>
            `;
        }).join('');
    },

    renderValvulas(valvulas, context, lado = 'single') {
        const {equipKey, index, isSubEquip, subType, subIdx} = context;
        const items        = valvulas?.items  || [];
        const psvMarca              = valvulas?.marca   || '';
        const psvModelo             = valvulas?.modelo  || '';
        const psvSifon              = valvulas?.sifon   || '';
        const tipoConexionEntrada   = valvulas?.tipoConexionEntrada || '';
        const tipoConexionSalida    = valvulas?.tipoConexionSalida  || '';

        const addFn    = isSubEquip ? `App.addValvulaSub('${equipKey}',${index},'${subType}',${subIdx},'${lado}')` : `App.addValvula('${equipKey}',${index},'${lado}')`;
        const removeFn = (vIdx) => isSubEquip ? `App.removeValvulaSub('${equipKey}',${index},'${subType}',${subIdx},'${lado}',${vIdx})` : `App.removeValvula('${equipKey}',${index},'${lado}',${vIdx})`;
        const genFn    = (field) => isSubEquip ? `App.setPsvGenSub('${equipKey}',${index},'${subType}',${subIdx},'${lado}','${field}',this.value)` : `App.setPsvGen('${equipKey}',${index},'${lado}','${field}',this.value)`;
        const rowFn    = (vIdx, field, val) => isSubEquip ? `App.setPsvRowSub('${equipKey}',${index},'${subType}',${subIdx},'${lado}',${vIdx},'${field}','${val}')` : `App.setPsvRow('${equipKey}',${index},'${lado}',${vIdx},'${field}','${val}')`;
        const ciFn     = (vIdx, field) => isSubEquip ? `App.updatePsvCiSub('${equipKey}',${index},'${subType}',${subIdx},'${lado}',${vIdx},'${field}',this.value)` : `App.updatePsvCi('${equipKey}',${index},'${lado}',${vIdx},'${field}',this.value)`;

        const BRANDS = ['AWP','DANFOSS','CAEN','CASTEL','HERL','HANSEN','NGI','GMC','TOSACA','LESER','HANSA','FAVRE'];
        const uid = `${isSubEquip ? `s-${String(subType).replace(/\s+/g,'-')}-${subIdx}-` : ''}${String(equipKey).replace(/\s+/g,'-')}-${index}-${lado}`;

        const yesNo = (vIdx, field, state) => `<div class="seg seg--mini"><button class="${state==='si'?'seg-on-ok':''}" onclick="${rowFn(vIdx,field,'si')}">Sí</button><button class="${state==='no'?'seg-on-bad':''}" onclick="${rowFn(vIdx,field,'no')}">No</button></div>`;
        const isLegal = AppState.isLegalMode;

        const sideLabel = lado === 'A' ? 'Lado A' : lado === 'B' ? 'Lado B' : 'Válvulas de Seguridad';

        const setTcEntFn = (opt) => isSubEquip
            ? `App.setPsvGenSub('${equipKey}',${index},'${subType}',${subIdx},'${lado}','tipoConexionEntrada','${opt}');App.selectAwpConexion('awp-picker-ent-${uid}','awp-wrap-ent-${uid}','${opt}')`
            : `App.setPsvGen('${equipKey}',${index},'${lado}','tipoConexionEntrada','${opt}');App.selectAwpConexion('awp-picker-ent-${uid}','awp-wrap-ent-${uid}','${opt}')`;
        const setTcSalFn = (opt) => isSubEquip
            ? `App.setPsvGenSub('${equipKey}',${index},'${subType}',${subIdx},'${lado}','tipoConexionSalida','${opt}');App.selectAwpConexion('awp-picker-sal-${uid}','awp-wrap-sal-${uid}','${opt}')`
            : `App.setPsvGen('${equipKey}',${index},'${lado}','tipoConexionSalida','${opt}');App.selectAwpConexion('awp-picker-sal-${uid}','awp-wrap-sal-${uid}','${opt}')`;

        return `
            <div class="lado-section${lado === 'B' ? ' lado-b' : ''}">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
                    <div class="lado-label" style="margin-bottom:0">${sideLabel}${typeof Ayudante !== 'undefined' ? Ayudante.psvInfoIconHtml() : ''}</div>
                    <button class="add-vs-btn" onclick="${addFn}" style="margin:0">${ic('plus')} Añadir Válvula</button>
                </div>
                ${items.length > 0 ? `
                <div class="psv-gen">
                    <span class="psv-tag">PSV</span>
                    <label class="pg-f">Marca
                        <select class="pg pg--marca" onchange="${genFn('marca')};App.onPsvMarcaChange(this,'awp-wrap-ent-${uid}','awp-wrap-sal-${uid}')">
                            <option value="">—</option>
                            ${BRANDS.map(b => `<option value="${b}"${psvMarca===b?' selected':''}>${b}</option>`).join('')}
                        </select>
                    </label>
                    <label class="pg-f">Modelo<input class="pg" value="${psvModelo}" onchange="${genFn('modelo')}"></label>
                    <label class="pg-f" style="gap:8px">Indicador de descarga
                        <select class="pg" onchange="${genFn('sifon')}">
                            <option value="">—</option>
                            <option value="No"${psvSifon==='No'?' selected':''}>No</option>
                            <option value="Luz"${psvSifon==='Luz'?' selected':''}>Luz</option>
                            <option value="Sifón"${psvSifon==='Sifón'?' selected':''}>Sifón</option>
                        </select>
                    </label>
                    <div class="awp-picker-wrap" id="awp-wrap-ent-${uid}"${psvMarca==='AWP'?'':' style="display:none"'}>
                        <button type="button" class="awp-icon-btn" onclick="App.toggleAwpPicker('awp-picker-ent-${uid}')">
                            <div class="awp-icons-row">
                                <img src="imagenes/tipo de conexión.png" class="awp-icon">
                                ${tipoConexionEntrada ? `<img src="imagenes/${tipoConexionEntrada}.png" class="awp-sel-img">` : ''}
                            </div>
                            <span class="awp-icon-label">Tipo de conexión entrada</span>
                        </button>
                        <div class="awp-picker" id="awp-picker-ent-${uid}">
                            ${['AWP 1','AWP 2','AWP 3'].map(opt => `
                                <div class="awp-opt${tipoConexionEntrada===opt?' awp-opt--sel':''}" data-val="${opt}" onclick="${setTcEntFn(opt)}">
                                    <img src="imagenes/${opt}.png"><span>${opt}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="awp-picker-wrap" id="awp-wrap-sal-${uid}"${psvMarca==='AWP'?'':' style="display:none"'}>
                        <button type="button" class="awp-icon-btn" onclick="App.toggleAwpPicker('awp-picker-sal-${uid}')">
                            <div class="awp-icons-row">
                                <img src="imagenes/tipo de conexión.png" class="awp-icon">
                                ${tipoConexionSalida ? `<img src="imagenes/${tipoConexionSalida}.png" class="awp-sel-img">` : ''}
                            </div>
                            <span class="awp-icon-label">Tipo de conexión salida</span>
                        </button>
                        <div class="awp-picker" id="awp-picker-sal-${uid}">
                            ${['AWP 1','AWP 2','AWP 3'].map(opt => `
                                <div class="awp-opt${tipoConexionSalida===opt?' awp-opt--sel':''}" data-val="${opt}" onclick="${setTcSalFn(opt)}">
                                    <img src="imagenes/${opt}.png"><span>${opt}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <table class="vtab--pair" style="width:100%;table-layout:auto">
                    <thead>
                        <tr class="vgrp">
                            <th colspan="5" class="g-old">Válvula existente</th>
                            ${isLegal ? '<th colspan="3"></th>' : ''}
                            <th colspan="5" class="g-new">Válvula nueva</th>
                            <th></th>
                        </tr>
                        <tr class="vsub">
                            <th>Nº serie</th><th>DN ent.</th><th>Fecha fab.</th><th>Tarado <span>bar</span></th><th>DN sal.</th>
                            ${isLegal ? '<th>Inspección Visual</th><th>Verif. Disparo / Retimbrado</th><th>Sustitución</th>' : ''}
                            <th>Nº serie</th><th>DN ent.</th><th>Fecha fab.</th><th>Tarado <span>bar</span></th><th>DN sal.</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((valv, vIdx) => {
                            const nc = (val, field) => `<input class="ci" value="${val||''}" onchange="${ciFn(vIdx,field)}">`;
                            return `<tr>
                                <td><input class="ci" value="${valv.serieExistente||''}" onchange="${ciFn(vIdx,'serieExistente')}"></td>
                                <td><input class="ci" value="${valv.dnEntradaExistente||''}" onchange="${ciFn(vIdx,'dnEntradaExistente')}"></td>
                                <td><input class="ci" value="${valv.fechaFabricacionExistente||''}" onchange="${ciFn(vIdx,'fechaFabricacionExistente')}"></td>
                                <td><input class="ci" value="${valv.presionExistente||''}" onchange="${ciFn(vIdx,'presionExistente')}"></td>
                                <td><input class="ci" value="${valv.dnSalidaExistente||''}" onchange="${ciFn(vIdx,'dnSalidaExistente')}"></td>
                                ${isLegal ? `
                                <td class="vc-insp">${yesNo(vIdx,'inspVisual',valv.inspVisual||'')}</td>
                                <td class="vc-insp">${yesNo(vIdx,'verificacionDisparo',valv.verificacionDisparo||'')}</td>
                                <td class="vc-sust">${yesNo(vIdx,'sustitucion',valv.sustitucion||'')}</td>
                                ` : ''}
                                <td class="vc-new">${nc(valv.serieNueva,'serieNueva')}</td>
                                <td class="vc-new">${nc(valv.dnEntradaNueva,'dnEntradaNueva')}</td>
                                <td class="vc-new">${nc(valv.fechaFabricacionNueva,'fechaFabricacionNueva')}</td>
                                <td class="vc-new">${nc(valv.presionNueva,'presionNueva')}</td>
                                <td class="vc-new">${nc(valv.dnSalidaNueva,'dnSalidaNueva')}</td>
                                <td class="vc-del"><button class="remove-vs-btn" onclick="${removeFn(vIdx)}">${ic('trash')}</button></td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
                ` : `<p style="font-size:.8rem;color:var(--ink-3);padding:.5rem 0">Sin válvulas añadidas</p>`}
            </div>
        `;
    },

    _legalImgSectionHtml(zoneId, images, dropFnStr, clickFnStr, removeFnStr, toggleFnStr) {
        const grid = images && images.length ? `
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem;margin-top:0.75rem">
                ${images.map((img, idx) => `
                    <div style="position:relative;border-radius:0.5rem;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
                        <img src="${img.data}" onclick="App.viewImage('${img.data}')" style="width:100%;height:150px;object-fit:cover;cursor:pointer;opacity:${img.incluirEnPdf===false?'0.4':'1'}">
                        <button class="photo-remove" onclick="${removeFnStr.replace(/\{i\}/g,idx)}">×</button>
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0.5rem;background:rgba(0,0,0,0.75)">
                            <span style="color:white;font-size:0.7rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:80px">${img.name||'Imagen '+(idx+1)}</span>
                            <button onclick="${toggleFnStr.replace(/\{i\}/g,idx)}" style="background:${img.incluirEnPdf===false?'#6b7280':'#16a34a'};color:white;border:none;border-radius:3px;padding:1px 6px;font-size:0.68rem;cursor:pointer;font-weight:700;flex-shrink:0">${img.incluirEnPdf===false?'PDF ✗':'PDF ✓'}</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        ` : '';
        return `
            <div ondragover="event.preventDefault();this.style.borderColor='#2f5aa6';this.style.background='#eff6ff'"
                 ondragleave="this.style.borderColor='#d1d5db';this.style.background='#fafafa'"
                 ondrop="event.preventDefault();this.style.borderColor='#d1d5db';this.style.background='#fafafa';${dropFnStr}"
                 onclick="${clickFnStr}"
                 style="border:2px dashed #d1d5db;border-radius:0.75rem;padding:1.2rem;text-align:center;cursor:pointer;background:#fafafa;transition:border-color .15s,background .15s;margin-bottom:0.5rem">
                <div style="margin-bottom:0.3rem;color:#6b7280">${ic('camera')}</div>
                <div style="font-size:0.85rem;color:#6b7280;font-weight:600">Arrastra imágenes aquí o haz clic para seleccionar</div>
                <div style="font-size:0.72rem;color:#9ca3af;margin-top:0.2rem">Puedes seleccionar varias a la vez</div>
            </div>
            ${grid}
        `;
    },

    _readMultipleImages(files, pushFn, rerenderFn) {
        const imgFiles = files.filter(f => f.type.startsWith('image/'));
        if (!imgFiles.length) { this.showToast('Solo se admiten imágenes', 'error'); return; }
        let done = 0;
        imgFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => {
                pushFn({name: file.name, data: ev.target.result, timestamp: new Date().toISOString(), incluirEnPdf: true});
                if (++done === imgFiles.length) {
                    rerenderFn();
                    this.showToast(`${imgFiles.length} imagen${imgFiles.length>1?'es':''} añadida${imgFiles.length>1?'s':''}`, 'success');
                }
            };
            reader.readAsDataURL(file);
        });
    },

    _pickImages(onFiles, capture) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        if (capture) { input.capture = 'environment'; } else { input.multiple = true; }
        input.onchange = e => { if (e.target.files.length) onFiles(Array.from(e.target.files)); };
        input.click();
    },

    renderPhotoSection(photos, context) {
        const {equipKey, index, isSubEquip, subType, subIdx} = context;
        const uploadFunc = (type) => isSubEquip ? `App.uploadPhotoSub('${equipKey}',${index},'${subType}',${subIdx},'${type}')` : `App.uploadPhoto('${equipKey}',${index},'${type}')`;
        const uploadCamFunc = (type) => isSubEquip ? `App.uploadPhotoSubCam('${equipKey}',${index},'${subType}',${subIdx},'${type}')` : `App.uploadPhotoCam('${equipKey}',${index},'${type}')`;
        const removeFunc = (type) => isSubEquip ? `App.removePhotoSub('${equipKey}',${index},'${subType}',${subIdx},'${type}')` : `App.removePhoto('${equipKey}',${index},'${type}')`;
        const dropSlotFunc = (type) => isSubEquip ? `App.dropPhotoSlotSub(event,'${equipKey}',${index},'${subType}',${subIdx},'${type}')` : `App.dropPhotoSlot(event,'${equipKey}',${index},'${type}')`;
        const togglePhotoFunc = (type) => isSubEquip ? `App.toggleEquipSubPhotoIncluir('${equipKey}',${index},'${subType}',${subIdx},'${type}')` : `App.toggleEquipPhotoIncluir('${equipKey}',${index},'${type}')`;
        const uploadExtFunc = isSubEquip ? `App.uploadEquipSubImages('${equipKey}',${index},'${subType}',${subIdx})` : `App.uploadEquipImages('${equipKey}',${index})`;
        const uploadExtCamFunc = isSubEquip ? `App.uploadEquipSubImagesCam('${equipKey}',${index},'${subType}',${subIdx})` : `App.uploadEquipImagesCam('${equipKey}',${index})`;
        const dropExtFunc = isSubEquip ? `App.dropEquipSubImages(event,'${equipKey}',${index},'${subType}',${subIdx})` : `App.dropEquipImages(event,'${equipKey}',${index})`;

        const galImages = isSubEquip
            ? (AppState.equipmentData[equipKey]?.[index]?.subEquipments?.[subType]?.[subIdx]?.imagenes || [])
            : (AppState.equipmentData[equipKey]?.[index]?.imagenes || []);

        const extraPhotosHtml = `
            <div class="extra-photos-section" style="margin-top:1rem">
                ${galImages.length > 0 ? `
                    <div class="photo-grid">
                        ${galImages.map((img, idx) => {
                            const removeExtraFn = isSubEquip ? `App.removeEquipSubImage('${equipKey}',${index},'${subType}',${subIdx},${idx})` : `App.removeEquipImage('${equipKey}',${index},${idx})`;
                            const togglePdfFn = isSubEquip ? `App.toggleEquipSubImagePdf('${equipKey}',${index},'${subType}',${subIdx},${idx})` : `App.toggleEquipImagePdf('${equipKey}',${index},${idx})`;
                            return `<div class="photo-preview" style="position:relative">
                                <img src="${img.data}" onclick="App.viewImage('${img.data}')" style="cursor:pointer">
                                <button class="photo-remove" onclick="${removeExtraFn}">×</button>
                                ${AppState.isLegalMode ? `<div style="position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:flex-end;padding:4px 6px;background:rgba(0,0,0,0.55)"><button onclick="${togglePdfFn}" style="background:${img.incluirEnPdf===false?'#6b7280':'#16a34a'};color:white;border:none;border-radius:3px;padding:1px 7px;font-size:0.68rem;cursor:pointer;font-weight:700">${img.incluirEnPdf===false?'PDF ✗':'PDF ✓'}</button></div>` : ''}
                            </div>`;
                        }).join('')}
                    </div>
                ` : ''}
                <div class="extra-add-row" ondragover="event.preventDefault()" ondrop="${dropExtFunc}">
                    <button type="button" class="extra-photo-btn" onclick="App._showPhotoSourceDialog(()=>{${uploadExtCamFunc}},()=>{${uploadExtFunc}})">${ic('camera')} Añadir foto</button>
                    <span style="font-size:10px;color:var(--ink-3)">o arrastra aquí</span>
                </div>
            </div>
        `;

        return `
            <div class="photo-section">
                <div class="form-section-title">${ic('camera')} Fotografías</div>
                <div class="photo-grid">
                    ${['placa', 'general'].map(type => `
                        <div>
                            <label class="form-label">${type === 'placa' ? 'Placa de Características' : 'General'}</label>
                            ${photos[type] ? `
                                <div class="photo-preview" style="position:relative" ondragover="event.preventDefault()" ondrop="${dropSlotFunc(type)}">
                                    <img src="${photos[type]}" onclick="App.viewImage('${photos[type]}')">
                                    <button class="photo-remove" onclick="${removeFunc(type)}">×</button>
                                    ${AppState.isLegalMode ? `
                                        <div style="position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:flex-end;padding:4px 6px;background:rgba(0,0,0,0.55)">
                                            <button onclick="${togglePhotoFunc(type)}" style="background:${photos[type+'Incluir']===false?'#6b7280':'#16a34a'};color:white;border:none;border-radius:3px;padding:1px 7px;font-size:0.68rem;cursor:pointer;font-weight:700">${photos[type+'Incluir']===false?'PDF ✗':'PDF ✓'}</button>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : `
                                <div class="photo-upload" ondragover="event.preventDefault()" ondrop="${dropSlotFunc(type)}" onclick="App._showPhotoSourceDialog(()=>{${uploadCamFunc(type)}},()=>{${uploadFunc(type)}})">
                                    <div style="margin-bottom:0.25rem;color:#6b7280">${ic('camera')}</div>
                                    <div style="font-size:0.8rem;color:#6b7280;font-weight:600;margin-bottom:0.25rem">${type === 'placa' ? 'Placa de Características' : 'General'}</div>
                                    <div style="font-size:0.75rem;color:#9ca3af">Toca para añadir</div>
                                </div>
                            `}
                        </div>
                    `).join('')}
                </div>
                ${extraPhotosHtml}
            </div>
        `;
    },

    manageValvula(action, equipKey, index, lado, valvIdx, subType, subIdx) {
        const isSubEquip = subType !== undefined;
        const equipment = isSubEquip ? AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx] 
                                     : AppState.equipmentData[equipKey][index];
        const valvKey = lado === 'single' ? 'valvulas' : `valvulas${lado}`;
        
        if (action === 'add') {
            if (!equipment[valvKey]) equipment[valvKey] = {marca:'', modelo:'', sifon:'', tipoConexion:'', items:[]};
            equipment[valvKey].items.push({serieExistente:'', presionExistente:'', dnEntradaExistente:'', dnSalidaExistente:'', inspVisual:'', verificacionDisparo:'', sustitucion:'', serieNueva:'', presionNueva:'', dnEntradaNueva:'', dnSalidaNueva:''});
            this.showToast('Válvula añadida', 'success');
        } else if (action === 'remove' && confirm('¿Eliminar esta válvula?')) {
            equipment[valvKey].items.splice(valvIdx, 1);
            this.showToast('Válvula eliminada', 'success');
        }
        
        isSubEquip ? this.renderCompositeUnitsList() : this.renderEquipmentList();
    },

    addValvula(equipKey, index, lado) { this.manageValvula('add', equipKey, index, lado); },
    removeValvula(equipKey, index, lado, valvIdx) { this.manageValvula('remove', equipKey, index, lado, valvIdx); },
    addValvulaSub(equipKey, index, subType, subIdx, lado) { this.manageValvula('add', equipKey, index, lado, undefined, subType, subIdx); },
    removeValvulaSub(equipKey, index, subType, subIdx, lado, valvIdx) { this.manageValvula('remove', equipKey, index, lado, valvIdx, subType, subIdx); },

    managePhoto(action, equipKey, index, photoType, subType, subIdx, capture) {
        const isSubEquip = subType !== undefined;
        const equipment = isSubEquip ? AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx]
                                     : AppState.equipmentData[equipKey][index];

        if (action === 'upload') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            if (capture) input.capture = 'environment';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (!equipment.photos) equipment.photos = {};
                        equipment.photos[photoType] = event.target.result;
                        isSubEquip ? this.renderCompositeUnitsList() : this.renderEquipmentList();
                        this.showToast('Foto añadida', 'success');
                        this._doAutosave();
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        } else if (action === 'remove') {
            equipment.photos[photoType] = null;
            isSubEquip ? this.renderCompositeUnitsList() : this.renderEquipmentList();
            this.showToast('Foto eliminada', 'success');
            this._doAutosave();
        }
    },

    uploadPhoto(equipKey, index, photoType) { this.managePhoto('upload', equipKey, index, photoType); },
    uploadPhotoCam(equipKey, index, photoType) { this.managePhoto('upload', equipKey, index, photoType, undefined, undefined, true); },
    removePhoto(equipKey, index, photoType) { this.managePhoto('remove', equipKey, index, photoType); },
    uploadPhotoSub(equipKey, index, subType, subIdx, photoType) { this.managePhoto('upload', equipKey, index, photoType, subType, subIdx); },
    uploadPhotoSubCam(equipKey, index, subType, subIdx, photoType) { this.managePhoto('upload', equipKey, index, photoType, subType, subIdx, true); },
    removePhotoSub(equipKey, index, subType, subIdx, photoType) { this.managePhoto('remove', equipKey, index, photoType, subType, subIdx); },
    dropPhotoSlot(event, equipKey, index, photoType) {
        event.preventDefault();
        const file = [...(event.dataTransfer?.files || [])].find(f => f.type.startsWith('image/'));
        if (!file) return;
        const eq = AppState.equipmentData[equipKey][index];
        const reader = new FileReader();
        reader.onload = e => { if (!eq.photos) eq.photos = {}; eq.photos[photoType] = e.target.result; this.renderEquipmentList(); this._doAutosave(); };
        reader.readAsDataURL(file);
    },
    dropPhotoSlotSub(event, equipKey, index, subType, subIdx, photoType) {
        event.preventDefault();
        const file = [...(event.dataTransfer?.files || [])].find(f => f.type.startsWith('image/'));
        if (!file) return;
        const sub = AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx];
        const reader = new FileReader();
        reader.onload = e => { if (!sub.photos) sub.photos = {}; sub.photos[photoType] = e.target.result; this.renderCompositeUnitsList(); this._doAutosave(); };
        reader.readAsDataURL(file);
    },
    uploadEquipImagesCam(equipKey, index) {
        this._pickImages(files => {
            const eq = AppState.equipmentData[equipKey][index];
            if (!eq.imagenes) eq.imagenes = [];
            this._readMultipleImages(files, img => eq.imagenes.push(img), () => this.renderEquipmentList());
        }, true);
    },
    uploadEquipSubImagesCam(equipKey, index, subType, subIdx) {
        this._pickImages(files => {
            const sub = AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx];
            if (!sub.imagenes) sub.imagenes = [];
            this._readMultipleImages(files, img => sub.imagenes.push(img), () => this.renderCompositeUnitsList());
        }, true);
    },

    viewImage(src) {
        document.getElementById('imageModal').classList.add('show');
        document.getElementById('modalImage').src = src;
    },

    closeImageModal() {
        document.getElementById('imageModal').classList.remove('show');
    },

    renderSidebar() {
        const sidebar = document.getElementById('sidebar');
        
        if (AppState.currentPage === 'equipos') {
            sidebar.innerHTML = `<div class="sidebar-title">${ic('gear')} EQUIPOS</div>`;
            Object.entries(EQUIPMENT_TYPES).forEach(([typeName, typeData]) => {
                const mainBtn = document.createElement('button');
                mainBtn.className = 'sidebar-btn' + (AppState.currentEquipmentType === typeName ? ' active' : '');
                const ucCount = (typeData.isComposite || typeData.isSingle) ? (AppState.equipmentData[typeName]?.length || 0) : 0;
                const ucLabel = (typeData.isComposite || typeData.isSingle) && ucCount > 0 ? `${typeName} (${ucCount})` : typeName;
                mainBtn.innerHTML = `<span class="icon">${typeData.icon}</span><span>${ucLabel}</span>`;
                mainBtn.onclick = () => {
                    AppState.currentEquipmentType = typeName;
                    AppState.currentSubType = typeData.isSingle ? (typeData.label || typeName) : (typeData.isComposite ? typeName : null);
                    this.renderSidebar();
                    this.renderWorkspace();
                };
                sidebar.appendChild(mainBtn);

                if (!typeData.isComposite && !typeData.isSingle && AppState.currentEquipmentType === typeName) {
                    typeData.subTypes.forEach(subType => {
                        const subBtn = document.createElement('button');
                        subBtn.className = 'sidebar-subbtn' + (AppState.currentSubType === subType ? ' active' : '');
                        const subCount = AppState.equipmentData[subType]?.length || 0;
                        const subLabel = subCount > 0 ? `${subType} (${subCount})` : subType;
                        subBtn.innerHTML = `<span style="font-size:0.75rem">▸</span><span>${subLabel}</span>`;
                        subBtn.onclick = () => {
                            AppState.currentSubType = subType;
                            this.renderSidebar();
                            this.renderWorkspace();
                        };
                        sidebar.appendChild(subBtn);
                    });
                }
            });
        } else if (AppState.currentPage === 'verif_fugas') {
            sidebar.innerHTML = `<div class="sidebar-title">${ic('search')} DETECTORES</div>`;
            
            const addDetectorBtn = document.createElement('button');
            addDetectorBtn.className = 'sidebar-btn';
            addDetectorBtn.innerHTML = `<span class="icon">${ic('plus')}</span><span>Agregar Detector</span>`;
            addDetectorBtn.onclick = () => this.addDetector();
            sidebar.appendChild(addDetectorBtn);

            AppState.detectorsData.forEach((detector, index) => {
                const detectorBtn = document.createElement('button');
                detectorBtn.className = 'sidebar-subbtn' + (AppState.currentDetector === index ? ' active' : '');
                const _detTipoLabel = AppState.isLegalMode ? (detector.tipo === 'pdf' ? ' (PDF)' : ' (Form)') : '';
                detectorBtn.innerHTML = `<span style="font-size:0.75rem">▸</span><span>Detector ${index + 1}${_detTipoLabel}</span>`;
                detectorBtn.onclick = () => {
                    AppState.currentDetector = index;
                    this.renderSidebar();
                    this.renderWorkspace();
                };
                sidebar.appendChild(detectorBtn);
            });
        } else if (AppState.currentPage === 'revision_final') {
            sidebar.innerHTML = `<div class="sidebar-title">${ic('clipboard')} REVISIÓN FINAL</div>`;
            const rfTabs = [
                { id: 'portada',       icon: ic('home'),        label: 'Portada'                },
                { id: 'indice',        icon: ic('list'),        label: 'Índice'                 },
                { id: 'acta_inicial',  icon: ic('clipboard'),   label: 'Acta'                   },
                { id: 'equipos',       icon: ic('gear'),        label: 'Equipos'               },
                { id: 'cert_psv',      icon: ic('paperclip'),   label: 'Cert PSV'              },
                { id: 'verif_fugas',   icon: ic('search'),      label: 'Verif. Detector Fugas' },
                { id: 'termografia',   icon: ic('thermometer'), label: 'Termografía'          },
                { id: 'planificacion', icon: ic('calendar'),    label: 'Planificación'          },
                { id: 'contraportada', icon: ic('file'),        label: 'Contraportada'          }
            ];
            rfTabs.forEach(tab => {
                const btn = document.createElement('button');
                btn.className = 'sidebar-btn' + (AppState.currentRevisionFinalTab === tab.id ? ' active' : '');
                btn.innerHTML = `<span class="icon">${tab.icon}</span><span>${tab.label}</span>`;
                btn.onclick = () => {
                    AppState.currentRevisionFinalTab = tab.id;
                    this.renderSidebar();
                    this.renderWorkspace();
                };
                sidebar.appendChild(btn);
            });

            // Sub-navegación dinámica según la pestaña activa
            const rfTab = AppState.currentRevisionFinalTab;
            if (rfTab === 'equipos') {
                const sep = document.createElement('div');
                sep.style.cssText = 'border-top:1px solid #e5e7eb;margin:0.5rem 0.75rem;opacity:0.6';
                sidebar.appendChild(sep);
                Object.entries(EQUIPMENT_TYPES).forEach(([typeName, typeData]) => {
                    const mainBtn = document.createElement('button');
                    mainBtn.className = 'sidebar-btn' + (AppState.currentEquipmentType === typeName ? ' active' : '');
                    mainBtn.innerHTML = `<span class="icon">${typeData.icon}</span><span>${typeName}</span>`;
                    mainBtn.onclick = () => {
                        AppState.currentEquipmentType = typeName;
                        AppState.currentSubType = typeData.isSingle ? (typeData.label || typeName) : (typeData.isComposite ? typeName : null);
                        this.renderSidebar();
                        this.renderWorkspace();
                    };
                    sidebar.appendChild(mainBtn);
                    if (!typeData.isComposite && !typeData.isSingle && AppState.currentEquipmentType === typeName) {
                        typeData.subTypes.forEach(subType => {
                            const subBtn = document.createElement('button');
                            subBtn.className = 'sidebar-subbtn' + (AppState.currentSubType === subType ? ' active' : '');
                            subBtn.innerHTML = `<span style="font-size:0.75rem">▸</span><span>${subType}</span>`;
                            subBtn.onclick = () => {
                                AppState.currentSubType = subType;
                                this.renderSidebar();
                                this.renderWorkspace();
                            };
                            sidebar.appendChild(subBtn);
                        });
                    }
                });
            } else if (rfTab === 'verif_fugas') {
                const sep = document.createElement('div');
                sep.style.cssText = 'border-top:1px solid #e5e7eb;margin:0.5rem 0.75rem;opacity:0.6';
                sidebar.appendChild(sep);
                const addBtn = document.createElement('button');
                addBtn.className = 'sidebar-btn';
                addBtn.innerHTML = `<span class="icon">${ic('plus')}</span><span>Agregar Detector</span>`;
                addBtn.onclick = () => this.addDetector();
                sidebar.appendChild(addBtn);
                AppState.detectorsData.forEach((detector, index) => {
                    const detectorBtn = document.createElement('button');
                    detectorBtn.className = 'sidebar-subbtn' + (AppState.currentDetector === index ? ' active' : '');
                    const _detTipoLabel = AppState.isLegalMode ? (detector.tipo === 'pdf' ? ' (PDF)' : ' (Form)') : '';
                detectorBtn.innerHTML = `<span style="font-size:0.75rem">▸</span><span>Detector ${index + 1}${_detTipoLabel}</span>`;
                    detectorBtn.onclick = () => {
                        AppState.currentDetector = index;
                        this.renderSidebar();
                        this.renderWorkspace();
                    };
                    sidebar.appendChild(detectorBtn);
                });
            } else if (rfTab === 'termografia') {
                const sep = document.createElement('div');
                sep.style.cssText = 'border-top:1px solid #e5e7eb;margin:0.5rem 0.75rem;opacity:0.6';
                sidebar.appendChild(sep);
                const addBtn = document.createElement('button');
                addBtn.className = 'sidebar-btn';
                addBtn.innerHTML = `<span class="icon">${ic('plus')}</span><span>Agregar Punto</span>`;
                addBtn.onclick = () => this.addTermografia();
                sidebar.appendChild(addBtn);
                AppState.termografiaData.forEach((t, idx) => {
                    const btn = document.createElement('button');
                    btn.className = 'sidebar-subbtn' + (AppState.currentTermografia === idx ? ' active' : '');
                    const tipoLabel = AppState.isLegalMode ? (t.tipo === 'informe' ? ' (PDF)' : ' (Análisis)') : '';
                    btn.innerHTML = `<span style="font-size:0.75rem">▸</span><span>${t.equipo || 'Punto ' + (idx + 1)}${tipoLabel}</span>`;
                    btn.onclick = () => {
                        AppState.currentTermografia = idx;
                        this.renderSidebar();
                        this.renderWorkspace();
                    };
                    sidebar.appendChild(btn);
                });
            }
        } else if (AppState.currentPage === 'termografia') {
            sidebar.innerHTML = `<div class="sidebar-title">${ic('thermometer')} TERMOGRAFÍA</div>`;
            const addBtn = document.createElement('button');
            addBtn.className = 'sidebar-btn';
            addBtn.innerHTML = `<span class="icon">${ic('plus')}</span><span>Agregar Punto</span>`;
            addBtn.onclick = () => this.addTermografia();
            sidebar.appendChild(addBtn);
            AppState.termografiaData.forEach((t, idx) => {
                const btn = document.createElement('button');
                btn.className = 'sidebar-subbtn' + (AppState.currentTermografia === idx ? ' active' : '');
                const tipoLabel = AppState.isLegalMode ? (t.tipo === 'informe' ? ' (PDF)' : ' (Análisis)') : '';
                btn.innerHTML = `<span style="font-size:0.75rem">▸</span><span>${t.equipo || 'Punto ' + (idx + 1)}${tipoLabel}</span>`;
                btn.onclick = () => {
                    AppState.currentTermografia = idx;
                    this.renderSidebar();
                    this.renderWorkspace();
                };
                sidebar.appendChild(btn);
            });
        } else if (AppState.currentPage === 'servicios') {
            sidebar.innerHTML = `<div class="sidebar-title">${ic('snowflake')} SERVICIOS</div>`;
            
            const addServicioBtn = document.createElement('button');
            addServicioBtn.className = 'sidebar-btn';
            addServicioBtn.innerHTML = `<span class="icon">${ic('plus')}</span><span>Agregar Servicio</span>`;
            addServicioBtn.onclick = () => this.addServicio();
            sidebar.appendChild(addServicioBtn);

            AppState.serviciosData.forEach((servicio, index) => {
                const servicioBtn = document.createElement('button');
                servicioBtn.className = 'sidebar-subbtn' + (AppState.currentServicio === index ? ' active' : '');
                servicioBtn.innerHTML = `<span style="font-size:0.75rem">▸</span><span>${servicio.idCamara || 'Servicio ' + (index + 1)}</span>`;
                servicioBtn.onclick = () => {
                    AppState.currentServicio = index;
                    this.renderSidebar();
                    this.renderWorkspace();
                };
                sidebar.appendChild(servicioBtn);
            });
        } else {
            const page = PAGES_CONFIG[AppState.currentPage];
            sidebar.innerHTML = `<div class="sidebar-title">${page.title}</div>`;
            page.sections.forEach(section => {
                // CRÍTICO: Verificar modo legal
                if (section.legalOnly && !AppState.isLegalMode) {
                    console.log(`⏭️ Ocultando sección ${section.id} en sidebar (solo legal)`);
                    return;
                }
                if (section.technicalOnly && AppState.isLegalMode) return;
                
                const sectionId = `${AppState.currentPage}_${section.id}`;
                const btn = document.createElement('button');
                btn.className = 'sidebar-btn' + (AppState.currentSection === sectionId ? ' active' : '');
                btn.innerHTML = `<span class="icon">${section.icon}</span><span>${section.name}</span>`;
                btn.onclick = () => {
                    AppState.currentSection = sectionId;
                    this.renderSidebar();
                    this.renderWorkspace();
                };
                sidebar.appendChild(btn);
            });
        }
    },

    scrollToTop() {
        const workspace = document.getElementById('workspace');
        if (workspace) {
            workspace.scrollTop = 0;
            workspace.scrollTo({ top: 0, behavior: 'instant' });
        }
    },

    renderWorkspace() {
        const workspace = document.getElementById('workspace');
        this.scrollToTop();
        
        console.log('📄 Renderizando workspace - Página:', AppState.currentPage, '- Modo Legal:', AppState.isLegalMode);
        
        if (AppState.currentPage === 'equipos') {
            if (!AppState.currentSubType) {
                workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('gear')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona un tipo de equipo</div><p>Usa el menú lateral para comenzar</p></div></div>`;
                return;
            }
            
            const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
            workspace.innerHTML = `
                <div class="section-card">
                    <div class="section-title">${typeData.icon} ${AppState.currentSubType}</div>
                    <button class="add-equipment-btn" onclick="App.${typeData.isSingle ? 'addEquipoServicio' : (typeData.isComposite ? 'addCompositeUnit' : 'addEquipment')}()">
                        ${ic('plus')} Añadir ${AppState.currentSubType}
                    </button>
                    <div class="equipment-list" id="equipmentList"></div>
                </div>
            `;
            typeData.isSingle ? this.renderEquipoServiciosList() : (typeData.isComposite ? this.renderCompositeUnitsList() : this.renderEquipmentList());
        } else if (AppState.currentPage === 'verif_fugas') {
            if (AppState.currentDetector === null) {
                workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('search')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un detector</div><p>Usa el menú lateral para comenzar</p></div></div>`;
                return;
            }
            this.renderDetectorForm();
        } else if (AppState.currentPage === 'revision_final') {
            const tab = AppState.currentRevisionFinalTab;
            if (!tab) {
                workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('clipboard')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Revisión Final</div><p>Selecciona una sección en el menú lateral</p></div></div>`;
            } else if (tab === 'portada')       { this.renderPortada();       }
              else if (tab === 'indice')        { this.renderIndice();        }
              else if (tab === 'acta_inicial')  { this.renderActaInicial();   }
              else if (tab === 'cert_psv')      { this.renderCertPsv();       }
              else if (tab === 'planificacion') { this.renderPlanificacion(); }
              else if (tab === 'contraportada') { this.renderContraportada(); }
              else if (tab === 'equipos') {
                  if (!AppState.currentSubType) {
                      workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('gear')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona un tipo de equipo</div><p>Usa el menú lateral para comenzar</p></div></div>`;
                  } else {
                      const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
                      workspace.innerHTML = `
                          <div class="section-card">
                              <div class="section-title">${typeData.icon} ${AppState.currentSubType}</div>
                              <button class="add-equipment-btn" onclick="App.${typeData.isSingle ? 'addEquipoServicio' : (typeData.isComposite ? 'addCompositeUnit' : 'addEquipment')}()">
                                  ${ic('plus')} Añadir ${AppState.currentSubType}
                              </button>
                              <div class="equipment-list" id="equipmentList"></div>
                          </div>`;
                      typeData.isSingle ? this.renderEquipoServiciosList() : (typeData.isComposite ? this.renderCompositeUnitsList() : this.renderEquipmentList());
                  }
              } else if (tab === 'verif_fugas') {
                  if (AppState.currentDetector === null) {
                      workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('search')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un detector</div><p>Usa el menú lateral para comenzar</p></div></div>`;
                  } else {
                      this.renderDetectorForm();
                  }
              } else if (tab === 'termografia') {
                  if (AppState.currentTermografia !== null) {
                      this.renderTermografia();
                  } else {
                      workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('thermometer')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un punto</div><p>Usa el menú lateral para comenzar</p></div></div>`;
                  }
              }
        } else if (AppState.currentPage === 'termografia') {
            if (AppState.currentTermografia !== null) {
                this.renderTermografia();
            } else {
                workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('thermometer')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un punto</div><p>Usa el menú lateral para comenzar</p></div></div>`;
            }
        } else if (AppState.currentPage === 'servicios') {
            if (AppState.currentServicio !== null) {
                this.renderServicioForm();
            } else {
                workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('snowflake')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un Servicio</div><p>Usa el menú lateral para comenzar</p></div></div>`;
            }
        } else {
            if (!AppState.currentSection) {
                workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('clipboard')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona una sección</div><p>Usa el menú lateral para comenzar</p></div></div>`;
                return;
            }
            
            const [pageKey, ...sectionParts] = AppState.currentSection.split('_');
            const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sectionParts.join('_'));
            
            // CRÍTICO: Verificar si la sección es solo para legal
            if (section.legalOnly && !AppState.isLegalMode) {
                workspace.innerHTML = `<div class="empty-workspace"><div><div class="empty-icon">${ic('lock')}</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Sección no disponible</div><p>Esta sección solo está disponible en modo Legal</p></div></div>`;
                return;
            }
            
            section.type === 'form' ? this.renderFormSection(section) : this.renderChecklistSection(section);
        }
    },

    addServicio() {
        const newServicio = {
            idCamara: '',
            volumen: '',
            refrigerante: '',
            temperaturaRegulacion: '',
            registradorTemp: '',
            detectorFugas: '',
            hacha: '',
            existenciaDispositivo: '',
            dispositivoLlamada: '',
            funciona: ''
        };
        AppState.serviciosData.push(newServicio);
        AppState.currentServicio = AppState.serviciosData.length - 1;
        this.renderSidebar();
        this.renderWorkspace();
        this.showToast('Servicio añadido', 'success');
        this._doAutosave();
    },

    removeServicio(index) {
        if (confirm('¿Eliminar este servicio?')) {
            AppState.serviciosData.splice(index, 1);
            AppState.currentServicio = AppState.serviciosData.length > 0 ? 0 : null;
            this.renderSidebar();
            this.renderWorkspace();
            this.showToast('Servicio eliminado', 'success');
            this._doAutosave();
        }
    },

    renderServicioForm() {
        const workspace = document.getElementById('workspace');
        const servicio = AppState.serviciosData[AppState.currentServicio];
        
        workspace.innerHTML = `
            <div class="section-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
                    <div class="section-title">${ic('snowflake')} Servicio ${AppState.currentServicio + 1}</div>
                    <button class="equipment-remove-btn" onclick="App.removeServicio(${AppState.currentServicio})">${ic('trash')} Eliminar Servicio</button>
                </div>

                <div class="form-section">
                    <div class="form-section-title">${ic('clipboard')} Datos del Servicio / Cámara</div>
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">ID Cámara</label>
                            <input type="text" class="form-input" data-servicio="idCamara" value="${servicio.idCamara}">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Volumen aprox. (AxBxH)</label>
                            <input type="text" class="form-input" data-servicio="volumen" value="${servicio.volumen}">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Refrigerante</label>
                            <input type="text" class="form-input" data-servicio="refrigerante" value="${servicio.refrigerante}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Temperatura regulación</label>
                            <input type="text" class="form-input" data-servicio="temperaturaRegulacion" value="${servicio.temperaturaRegulacion}">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Registrador de temp. (E03)</label>
                            <input type="text" class="form-input" data-servicio="registradorTemp" value="${servicio.registradorTemp}">
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">${ic('shield')} Equipamiento de Seguridad</div>
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Detector de fugas (E06)</label>
                            <select class="form-input" data-servicio="detectorFugas">
                                <option value="">Seleccionar...</option>
                                <option value="SI" ${servicio.detectorFugas === 'SI' ? 'selected' : ''}>SI</option>
                                <option value="NO" ${servicio.detectorFugas === 'NO' ? 'selected' : ''}>NO</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label class="form-label">Hacha (Mango largo) (E09)</label>
                            <select class="form-input" data-servicio="hacha">
                                <option value="">Seleccionar...</option>
                                <option value="SI" ${servicio.hacha === 'SI' ? 'selected' : ''}>SI</option>
                                <option value="NO" ${servicio.hacha === 'NO' ? 'selected' : ''}>NO</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label class="form-label">Existencia dispositivo de llamada</label>
                            <select class="form-input" data-servicio="existenciaDispositivo">
                                <option value="">Seleccionar...</option>
                                <option value="SI" ${servicio.existenciaDispositivo === 'SI' ? 'selected' : ''}>SI</option>
                                <option value="NO" ${servicio.existenciaDispositivo === 'NO' ? 'selected' : ''}>NO</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label class="form-label">Dispositivo de llamada (E07-E08)</label>
                            <select class="form-input" data-servicio="dispositivoLlamada" id="dispositivoLlamada_sel" ${servicio.existenciaDispositivo === 'NO' ? 'disabled style="background:#f3f4f6;cursor:not-allowed"' : ''}>
                                <option value="">Seleccionar...</option>
                                <option value="Simple" ${servicio.dispositivoLlamada === 'Simple' ? 'selected' : ''}>Simple</option>
                                <option value="Doble" ${servicio.dispositivoLlamada === 'Doble' ? 'selected' : ''}>Doble</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label class="form-label">Funciona</label>
                            <select class="form-input" data-servicio="funciona">
                                <option value="">Seleccionar...</option>
                                <option value="SI" ${servicio.funciona === 'SI' ? 'selected' : ''}>SI</option>
                                <option value="NO" ${servicio.funciona === 'NO' ? 'selected' : ''}>NO</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;

        workspace.querySelectorAll('[data-servicio]').forEach(input => {
            input.onchange = (e) => {
                AppState.serviciosData[AppState.currentServicio][e.target.dataset.servicio] = e.target.value;
                if (e.target.dataset.servicio === 'idCamara') this.renderSidebar();
                if (e.target.dataset.servicio === 'existenciaDispositivo') {
                    const disp = workspace.querySelector('#dispositivoLlamada_sel');
                    if (disp) {
                        disp.disabled = e.target.value === 'NO';
                        disp.style.background = e.target.value === 'NO' ? '#f3f4f6' : '';
                        disp.style.cursor = e.target.value === 'NO' ? 'not-allowed' : '';
                    }
                }
            };
        });
    },

    addDetector() {
        if (AppState.isLegalMode) {
            AppState.currentDetector = null;
            this.renderSidebar();
            document.getElementById('workspace').innerHTML = `
                <div class="section-card" style="max-width:520px;margin:3rem auto;text-align:center">
                    <div class="section-title" style="margin-bottom:0.75rem">${ic('plus')} Nuevo Detector</div>
                    <p style="color:#6b7280;margin-bottom:2rem;font-size:0.9rem">Selecciona el tipo de certificado para este detector:</p>
                    <div style="display:flex;gap:1.5rem;justify-content:center">
                        <button onclick="App.addDetectorWithType('pdf')"
                            style="flex:1;padding:2rem 1rem;background:#eff6ff;border:2px solid #2f5aa6;border-radius:1rem;cursor:pointer">
                            <div style="font-size:2.5rem;margin-bottom:0.75rem">${ic('file')}</div>
                            <div style="font-size:1rem;font-weight:700;color:#2f5aa6">Adjuntar PDF(s)</div>
                            <div style="font-size:0.78rem;color:#6b7280;margin-top:0.4rem">Sube uno o varios certificados PDF del fabricante/laboratorio</div>
                        </button>
                        <button onclick="App.addDetectorWithType('formulario')"
                            style="flex:1;padding:2rem 1rem;background:#f0fdf4;border:2px solid #16a34a;border-radius:1rem;cursor:pointer">
                            <div style="font-size:2.5rem;margin-bottom:0.75rem">${ic('note')}</div>
                            <div style="font-size:1rem;font-weight:700;color:#16a34a">Formulario de calibración</div>
                            <div style="font-size:0.78rem;color:#6b7280;margin-top:0.4rem">Rellena los datos del detector manualmente</div>
                        </button>
                    </div>
                </div>`;
            return;
        }
        this._createDetector('formulario');
    },

    addDetectorWithType(tipo) {
        this._createDetector(tipo);
    },

    _createDetector(tipo) {
        const newDetector = {
            tipo: tipo,
            marca: '', modelo: '', numSerie: '', refrigerante: '',
            preAlarma: '', alarma: '', tensionAlimentacion: '',
            operaciones: {
                correctaUbicacion: '', tiempoRespuesta: '', estadoGeneral: '',
                verificacionTension: '', testLedsDisplay: '', pruebaActivacion: '',
                senalOpticoAcustica: '', reglajePunto0: '',
                reglajePreAlarma: '', reglajeAlarma: '', activacionExtractor: ''
            },
            observaciones: '',
            imagenes: [],
            certArchivos: [],
            fechaVerificacion: '',
            fechaProximaVerificacion: '',
            respVerificacion: ''
        };
        AppState.detectorsData.push(newDetector);
        AppState.currentDetector = AppState.detectorsData.length - 1;
        this.renderSidebar();
        this.renderWorkspace();
        this.showToast('Detector añadido', 'success');
        this._doAutosave();
    },

    removeDetector(index) {
        if (confirm('¿Eliminar este detector?')) {
            AppState.detectorsData.splice(index, 1);
            AppState.currentDetector = AppState.detectorsData.length > 0 ? 0 : null;
            this.renderSidebar();
            this.renderWorkspace();
            this.showToast('Detector eliminado', 'success');
            this._doAutosave();
        }
    },

    renderDetectorForm() {
        const workspace = document.getElementById('workspace');
        const detector = AppState.detectorsData[AppState.currentDetector];
        const idx = AppState.currentDetector;
        const isPdf = detector.tipo === 'pdf';

        const _certPdfList = (det, detIdx) => `
            <div ondragover="event.preventDefault();this.style.borderColor='#2f5aa6';this.style.background='#eff6ff'"
                 ondragleave="this.style.borderColor='#d1d5db';this.style.background='#fafafa'"
                 ondrop="event.preventDefault();this.style.borderColor='#d1d5db';this.style.background='#fafafa';App.dropDetectorCert(event,${detIdx})"
                 onclick="App.uploadDetectorCert(${detIdx})"
                 style="border:2px dashed #d1d5db;border-radius:0.75rem;padding:1.5rem;text-align:center;cursor:pointer;background:#fafafa;transition:border-color .15s,background .15s;margin-bottom:1rem">
                <div style="margin-bottom:0.3rem">${ic('file')}</div>
                <div style="font-size:0.85rem;color:#6b7280;font-weight:600">Arrastra PDF(s) aquí o haz clic para seleccionar</div>
                <div style="font-size:0.72rem;color:#9ca3af;margin-top:0.2rem">Puedes adjuntar varios certificados a la vez</div>
            </div>
            ${(det.certArchivos && det.certArchivos.length) ? `
                <div style="display:flex;flex-direction:column;gap:0.5rem">
                    ${det.certArchivos.map((pdf, ci) => `
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.8rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0.5rem">
                            <div style="display:flex;align-items:center;gap:0.5rem;overflow:hidden">
                                <span>${ic('file')}</span>
                                <div style="overflow:hidden">
                                    <div style="font-size:0.82rem;font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${pdf.name}</div>
                                    <div style="font-size:0.72rem;color:#94a3b8">${(pdf.size/1024).toFixed(0)} KB</div>
                                </div>
                            </div>
                            <div style="display:flex;gap:0.4rem;flex-shrink:0">
                                <button onclick="App.viewDetectorCert(${detIdx},${ci})" style="padding:3px 10px;background:#e8f4ff;border:1px solid #b3d9ff;color:#0070b8;border-radius:4px;font-size:0.75rem;cursor:pointer;font-weight:600">Ver</button>
                                <button onclick="App.removeDetectorCert(${detIdx},${ci})" style="padding:3px 8px;background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;border-radius:4px;font-size:0.75rem;cursor:pointer;font-weight:700">✕</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}`;

        if (isPdf) {
            workspace.innerHTML = `
                <div class="section-card">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
                        <div class="section-title">${ic('search')} Detector ${idx + 1} <span style="font-size:0.75rem;background:#2f5aa6;color:#fff;border-radius:4px;padding:2px 8px;vertical-align:middle">PDF</span></div>
                        <button class="equipment-remove-btn" onclick="App.removeDetector(${idx})">${ic('trash')} Eliminar Detector</button>
                    </div>
                    <div class="verification-header">
                        <h3 style="font-size:1.25rem;margin-bottom:0.5rem">${ic('file')} CERTIFICADO PDF — DETECTOR / CENTRALITA</h3>
                        <p style="font-size:0.875rem;opacity:0.9">Normativa: RD 552/2019 IF-16 Pto 3.3</p>
                    </div>
                    <div class="form-section">
                        <div class="form-section-title">${ic('file')} Certificados PDF</div>
                        <p style="font-size:0.8rem;color:#6b7280;margin-bottom:0.75rem">Adjunta los certificados oficiales del fabricante o laboratorio en formato PDF.</p>
                        ${_certPdfList(detector, idx)}
                    </div>
                </div>`;
            return;
        }

        workspace.innerHTML = `
            <div class="section-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
                    <div class="section-title">${ic('search')} Detector ${idx + 1}${AppState.isLegalMode ? ' <span style="font-size:0.75rem;background:#16a34a;color:#fff;border-radius:4px;padding:2px 8px;vertical-align:middle">Form</span>' : ''}</div>
                    <button class="equipment-remove-btn" onclick="App.removeDetector(${idx})">${ic('trash')} Eliminar Detector</button>
                </div>

                <div class="verification-header">
                    <h3 style="font-size:1.25rem;margin-bottom:0.5rem">${ic('radio')} DETECTOR / CENTRALITA</h3>
                    <p style="font-size:0.875rem;opacity:0.9">Normativa: RD 552/2019 IF-16 Pto 3.3</p>
                </div>

                <div class="form-section">
                    <div class="form-section-title">${ic('clipboard')} Datos del Detector</div>
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Marca</label>
                            <input type="text" class="form-input" data-detector="marca" value="${detector.marca}">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Modelo</label>
                            <input type="text" class="form-input" data-detector="modelo" value="${detector.modelo}">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Nº de Serie</label>
                            <input type="text" class="form-input" data-detector="numSerie" value="${detector.numSerie}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Refrigerante</label>
                            <input type="text" class="form-input" data-detector="refrigerante" value="${detector.refrigerante}">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Pre-Alarma (ppm)</label>
                            <input type="text" class="form-input" data-detector="preAlarma" value="${detector.preAlarma}">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Alarma (ppm)</label>
                            <input type="text" class="form-input" data-detector="alarma" value="${detector.alarma}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Tensión Alimentación</label>
                            <input type="text" class="form-input" data-detector="tensionAlimentacion" value="${detector.tensionAlimentacion}">
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">${ic('shield')} OPERACIONES REALIZADAS</div>
                    <div class="operations-table">
                        ${this.renderOperationRow('Correcta ubicación', 'correctaUbicacion', detector.operaciones.correctaUbicacion)}
                        ${this.renderOperationRow('Tiempo de respuesta inferior o igual a 60 segundos', 'tiempoRespuesta', detector.operaciones.tiempoRespuesta)}
                        ${this.renderOperationRow('Verificación del estado general', 'estadoGeneral', detector.operaciones.estadoGeneral)}
                        ${this.renderOperationRow('Verificación tensión de alimentación', 'verificacionTension', detector.operaciones.verificacionTension)}
                        ${this.renderOperationRow('Test leds y display', 'testLedsDisplay', detector.operaciones.testLedsDisplay)}
                        ${this.renderOperationRow('Prueba activación maniobras', 'pruebaActivacion', detector.operaciones.pruebaActivacion)}
                        ${this.renderOperationRow('Señal óptico y acústica', 'senalOpticoAcustica', detector.operaciones.senalOpticoAcustica)}
                        ${this.renderOperationRow('Reglaje a punto 0', 'reglajePunto0', detector.operaciones.reglajePunto0)}
                        ${this.renderOperationRow('Reglaje punto disparo Pre-Alarma (concentración elevada)', 'reglajePreAlarma', detector.operaciones.reglajePreAlarma)}
                        ${this.renderOperationRow('Reglaje punto disparo Alarma (concentración muy elevada)', 'reglajeAlarma', detector.operaciones.reglajeAlarma)}
                        ${this.renderOperationRow('Activación extractor', 'activacionExtractor', detector.operaciones.activacionExtractor)}
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">${ic('camera')} Imágenes</div>
                    ${AppState.isLegalMode
                        ? this._legalImgSectionHtml(
                            '',
                            detector.imagenes || [],
                            `App.dropDetectorImages(event,${idx})`,
                            `App.uploadDetectorImages(${idx})`,
                            `App.removeDetectorImage(${idx},{i})`,
                            `App.toggleDetectorImagePdf(${idx},{i})`
                          )
                        : `
                          <div class="photo-upload" onclick="App._showPhotoSourceDialog(()=>{App.uploadDetectorImage(${idx})},()=>{App.uploadDetectorImages(${idx})})" style="margin-bottom:1rem">
                              <div style="margin-bottom:0.5rem;color:#6b7280">${ic('camera')}</div>
                              <div style="font-size:0.875rem;color:#6b7280;font-weight:600">Añadir Imagen</div>
                          </div>
                          ${detector.imagenes && detector.imagenes.length > 0 ? `
                              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem">
                                  ${detector.imagenes.map((img, i) => `
                                      <div style="position:relative;border-radius:0.5rem;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
                                          <img src="${img.data}" onclick="App.viewImage('${img.data}')" style="width:100%;height:150px;object-fit:cover;cursor:pointer">
                                          <button class="photo-remove" onclick="App.removeDetectorImage(${idx},${i})">×</button>
                                          <div style="padding:0.5rem;background:rgba(0,0,0,0.7);color:white;font-size:0.75rem;text-align:center">${img.name || 'Imagen '+(i+1)}</div>
                                      </div>
                                  `).join('')}
                              </div>
                          ` : ''}
                        `
                    }
                </div>

                <div class="form-section">
                    <div class="form-section-title">${ic('message')} OBSERVACIONES / COMENTARIOS</div>
                    <div style="display:grid;grid-template-columns:${AppState.isLegalMode ? '1fr 1fr' : '1fr'};gap:0.75rem">
                        <div>
                            <label class="form-label">Observaciones - Técnico</label>
                            <textarea class="form-input" data-detector="observaciones" rows="6">${detector.observaciones}</textarea>
                        </div>
                        ${AppState.isLegalMode ? `<div>
                            <label class="form-label">Observaciones - Legal</label>
                            <textarea class="form-input" data-detector="observacionesLegal" rows="6">${detector.observacionesLegal||''}</textarea>
                        </div>` : ''}
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-section-title">${ic('calendar')} Fechas y Responsables</div>
                    <div class="form-row">
                        <div class="form-col">
                            <label class="form-label">Fecha Verificación</label>
                            <input type="text" class="form-input" data-detector="fechaVerificacion" value="${detector.fechaVerificacion}" placeholder="dd/mm/aaaa">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Fecha Máxima Próxima Verificación</label>
                            <input type="text" class="form-input" data-detector="fechaProximaVerificacion" value="${detector.fechaProximaVerificacion}" placeholder="dd/mm/aaaa">
                        </div>
                        <div class="form-col">
                            <label class="form-label">Técnico verificación</label>
                            <input type="text" class="form-input" data-detector="respVerificacion" value="${detector.respVerificacion}">
                        </div>
                    </div>
                </div>
            </div>
        `;

        workspace.querySelectorAll('[data-detector]').forEach(input => {
            input.onchange = (e) => {
                AppState.detectorsData[AppState.currentDetector][e.target.dataset.detector] = e.target.value;
            };
        });

        workspace.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.onclick = (e) => {
                const fieldName = e.target.name;
                const value = e.target.value;
                const currentValue = AppState.detectorsData[AppState.currentDetector].operaciones[fieldName];
                
                if (currentValue === value) {
                    e.target.checked = false;
                    AppState.detectorsData[AppState.currentDetector].operaciones[fieldName] = '';
                } else {
                    AppState.detectorsData[AppState.currentDetector].operaciones[fieldName] = value;
                }
            };
        });
    },

    renderOperationRow(label, fieldName, value) {
        return `
            <div class="operation-row">
                <div class="operation-label">${label}</div>
                <div class="seg-group">
                    <input type="radio" id="${fieldName}_si" name="${fieldName}" value="SI" ${value === 'SI' ? 'checked' : ''}>
                    <label for="${fieldName}_si" class="seg-btn seg-si">SI</label>
                    <input type="radio" id="${fieldName}_no" name="${fieldName}" value="NO" ${value === 'NO' ? 'checked' : ''}>
                    <label for="${fieldName}_no" class="seg-btn seg-no">NO</label>
                    <input type="radio" id="${fieldName}_na" name="${fieldName}" value="N/A" ${value === 'N/A' ? 'checked' : ''}>
                    <label for="${fieldName}_na" class="seg-btn seg-na">N/A</label>
                </div>
            </div>
        `;
    },

    uploadDetectorImage(detectorIndex) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const detector = AppState.detectorsData[detectorIndex];
                    if (!detector.imagenes) detector.imagenes = [];
                    detector.imagenes.push({name: file.name, data: event.target.result, timestamp: new Date().toISOString()});
                    this.renderDetectorForm();
                    this.showToast('Imagen añadida', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    },

    removeDetectorImage(detectorIndex, imageIndex) {
        if (confirm('¿Eliminar esta imagen?')) {
            AppState.detectorsData[detectorIndex].imagenes.splice(imageIndex, 1);
            this.renderDetectorForm();
            this.showToast('Imagen eliminada', 'success');
        }
    },

    uploadDetectorImages(idx) {
        this._pickImages(files => {
            const detector = AppState.detectorsData[idx];
            if (!detector.imagenes) detector.imagenes = [];
            this._readMultipleImages(files, img => detector.imagenes.push(img), () => this.renderDetectorForm());
        });
    },

    dropDetectorImages(event, idx) {
        const detector = AppState.detectorsData[idx];
        if (!detector.imagenes) detector.imagenes = [];
        this._readMultipleImages(Array.from(event.dataTransfer.files), img => detector.imagenes.push(img), () => this.renderDetectorForm());
    },

    toggleDetectorImagePdf(detectorIdx, imageIdx) {
        const img = AppState.detectorsData[detectorIdx].imagenes[imageIdx];
        img.incluirEnPdf = img.incluirEnPdf === false;
        this.renderDetectorForm();
    },

    uploadDetectorCert(idx) {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'application/pdf'; input.multiple = true;
        input.onchange = e => {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = ev => {
                    if (!AppState.detectorsData[idx].certArchivos) AppState.detectorsData[idx].certArchivos = [];
                    AppState.detectorsData[idx].certArchivos.push({name: file.name, data: ev.target.result, size: file.size, timestamp: new Date().toISOString()});
                    this.renderDetectorForm();
                    this.showToast('Certificado adjuntado', 'success');
                };
                reader.readAsDataURL(file);
            });
        };
        input.click();
    },

    dropDetectorCert(event, idx) {
        const files = Array.from(event.dataTransfer.files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
        if (!files.length) { this.showToast('Solo se admiten archivos PDF', 'error'); return; }
        if (!AppState.detectorsData[idx].certArchivos) AppState.detectorsData[idx].certArchivos = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => {
                AppState.detectorsData[idx].certArchivos.push({name: file.name, data: ev.target.result, size: file.size, timestamp: new Date().toISOString()});
                this.renderDetectorForm();
                this.showToast('Certificado adjuntado', 'success');
            };
            reader.readAsDataURL(file);
        });
    },

    viewDetectorCert(idx, certIdx) {
        const pdf = AppState.detectorsData[idx].certArchivos[certIdx];
        if (pdf) this._downloadPdf(pdf.data, pdf.name);
    },

    removeDetectorCert(idx, certIdx) {
        if (confirm('¿Eliminar este certificado?')) {
            AppState.detectorsData[idx].certArchivos.splice(certIdx, 1);
            this.renderDetectorForm();
            this.showToast('Certificado eliminado', 'success');
        }
    },

    dropEquipImages(event, equipKey, index) {
        const eq = AppState.equipmentData[equipKey][index];
        if (!eq.imagenes) eq.imagenes = [];
        this._readMultipleImages(Array.from(event.dataTransfer.files), img => eq.imagenes.push(img), () => this.renderEquipmentList());
    },
    uploadEquipImages(equipKey, index) {
        this._pickImages(files => {
            const eq = AppState.equipmentData[equipKey][index];
            if (!eq.imagenes) eq.imagenes = [];
            this._readMultipleImages(files, img => eq.imagenes.push(img), () => this.renderEquipmentList());
        });
    },
    removeEquipImage(equipKey, index, imageIdx) {
        AppState.equipmentData[equipKey][index].imagenes.splice(imageIdx, 1);
        this.renderEquipmentList();
    },
    toggleEquipImagePdf(equipKey, index, imageIdx) {
        const img = AppState.equipmentData[equipKey][index].imagenes[imageIdx];
        img.incluirEnPdf = img.incluirEnPdf === false;
        this.renderEquipmentList();
    },
    toggleEquipPhotoIncluir(equipKey, index, type) {
        const eq = AppState.equipmentData[equipKey][index];
        if (!eq.photos) eq.photos = {};
        eq.photos[type + 'Incluir'] = eq.photos[type + 'Incluir'] === false;
        this.renderEquipmentList();
    },
    dropEquipSubImages(event, equipKey, index, subType, subIdx) {
        const sub = AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx];
        if (!sub.imagenes) sub.imagenes = [];
        this._readMultipleImages(Array.from(event.dataTransfer.files), img => sub.imagenes.push(img), () => this.renderCompositeUnitsList());
    },
    uploadEquipSubImages(equipKey, index, subType, subIdx) {
        this._pickImages(files => {
            const sub = AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx];
            if (!sub.imagenes) sub.imagenes = [];
            this._readMultipleImages(files, img => sub.imagenes.push(img), () => this.renderCompositeUnitsList());
        });
    },
    removeEquipSubImage(equipKey, index, subType, subIdx, imageIdx) {
        AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx].imagenes.splice(imageIdx, 1);
        this.renderCompositeUnitsList();
    },
    toggleEquipSubImagePdf(equipKey, index, subType, subIdx, imageIdx) {
        const img = AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx].imagenes[imageIdx];
        img.incluirEnPdf = img.incluirEnPdf === false;
        this.renderCompositeUnitsList();
    },
    toggleEquipSubPhotoIncluir(equipKey, index, subType, subIdx, type) {
        const sub = AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx];
        if (!sub.photos) sub.photos = {};
        sub.photos[type + 'Incluir'] = sub.photos[type + 'Incluir'] === false;
        this.renderCompositeUnitsList();
    },

    addLocal() {
        AppState.instalacionSalas.push({nombre: `Local ${AppState.instalacionSalas.length + 1}`, valor: ''});
        const [pageKey, ...sectionParts] = AppState.currentSection.split('_');
        const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sectionParts.join('_'));
        this.renderFormSection(section);
        this.showToast('Local agregado', 'success');
    },

    removeLocal(index) {
        if (confirm('¿Eliminar este local?')) {
            AppState.instalacionSalas.splice(index, 1);
            const [pageKey, ...sectionParts] = AppState.currentSection.split('_');
            const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sectionParts.join('_'));
            this.renderFormSection(section);
            this.showToast('Local eliminado', 'success');
        }
    },

    renderFormSection(section) {
        const workspace = document.getElementById('workspace');
        const data = AppState.sectionsData[AppState.currentSection] || {};
        
        const isInstalacion = section.id === 'datos_instalacion';
        const isLegalMode = AppState.isLegalMode;
        
        console.log('📝 Renderizando sección:', section.id, '- Modo Legal:', isLegalMode);
        
        workspace.innerHTML = `
            <div class="section-card">
                <div class="section-title">${section.icon} ${section.name}</div>
                ${(() => {
                    let html = '';
                    let tempFields = [];
                    
                    section.fields.forEach((field, idx) => {
                        // Si el campo es fullWidth, renderizar la fila anterior y luego este campo solo
                        if (field.fullWidth) {
                            // Renderizar campos acumulados
                            if (tempFields.length > 0) {
                                html += '<div class="form-row">' + tempFields.map(f => `
                                    <div class="form-col${f.computed || f.readonly ? ' is-computed' : ''}">
                                        <label class="form-label">${f.label || f.name}${f.computed ? ' <span class="calc-tag">auto</span>' : ''}</label>
                                        ${this._renderFieldInput(f, data)}
                                    </div>
                                `).join('') + '</div>';
                                tempFields = [];
                            }

                            // Renderizar campo fullWidth
                            html += `<div class="form-row">
                                <div class="form-col${field.computed || field.readonly ? ' is-computed' : ''}" style="grid-column: 1 / -1;">
                                    <label class="form-label">${field.name}${field.computed ? ' <span class="calc-tag">auto</span>' : ''}</label>
                                    ${this._renderFieldInput(field, data)}
                                </div>
                            </div>`;
                        } else {
                            // Acumular campos normales
                            tempFields.push(field);
                            
                            // Si llegamos a 3 campos o es el último, renderizar la fila
                            if (tempFields.length === 3 || idx === section.fields.length - 1) {
                                html += '<div class="form-row">' + tempFields.map(f => `
                                    <div class="form-col${f.computed || f.readonly ? ' is-computed' : ''}">
                                        <label class="form-label">${f.label || f.name}${f.computed ? ' <span class="calc-tag">auto</span>' : ''}</label>
                                        ${this._renderFieldInput(f, data)}
                                    </div>
                                `).join('') + '</div>';
                                tempFields = [];
                            }
                        }
                    });
                    
                    return html;
                })()}
                
                ${isInstalacion ? `
                    <div class="form-section" style="margin-top:2rem">
                        <div class="form-section-title">${ic('gear')} CIRCUITOS</div>
                        <div style="overflow-x:auto">
                            <table style="width:100%;border-collapse:collapse;background:var(--surface)">
                                <thead>
                                    <tr style="background:var(--navy);color:var(--on-dark)">
                                        <th style="padding:0.75rem;text-align:left;border:1px solid var(--line-dark)">Circuito</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid var(--line-dark)">Refrigerante</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid var(--line-dark)">Carga (kg)</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid var(--line-dark)">PCA</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid var(--line-dark)">Tn eq. CO2</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid var(--line-dark)">Detector</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${AppState.instalacionCircuitos.map((circ, idx) => {
                                        const pca = REFRIGERANTES_PCA[circ.refrigerante] || '';
                                        const carga = parseFloat(circ.carga) || 0;
                                        const tnCO2 = pca !== '' && carga > 0 ? ((carga * pca) / 1000).toFixed(3) : '';
                                        
                                        return `
                                        <tr>
                                            <td style="padding:0.75rem;border:1px solid #e5e7eb;font-weight:600">${idx + 1}</td>
                                            <td style="padding:0.5rem;border:1px solid #e5e7eb">
                                                ${isLegalMode ? `
                                                    <select class="form-input" data-circuito="${idx}" data-field-circ="refrigerante" style="margin:0;padding:0.5rem">
                                                        <option value="">Seleccionar...</option>
                                                        ${Object.keys(REFRIGERANTES_PCA).sort().map(ref => `
                                                            <option value="${ref}" ${circ.refrigerante === ref ? 'selected' : ''}>${ref}</option>
                                                        `).join('')}
                                                    </select>
                                                ` : `
                                                    <input type="text" class="form-input" data-circuito="${idx}" data-field-circ="refrigerante" value="${circ.refrigerante}" style="margin:0;padding:0.5rem">
                                                `}
                                            </td>
                                            <td style="padding:0.5rem;border:1px solid #e5e7eb">
                                                <input type="text" class="form-input" data-circuito="${idx}" data-field-circ="carga" value="${circ.carga}" style="margin:0;padding:0.5rem">
                                            </td>
                                            <td style="padding:0.5rem;border:1px solid #e5e7eb">
                                                <input type="text" class="form-input" value="${pca}" style="margin:0;padding:0.5rem" readonly>
                                            </td>
                                            <td style="padding:0.5rem;border:1px solid #e5e7eb">
                                                <input type="text" class="form-input" value="${tnCO2}" style="margin:0;padding:0.5rem" readonly>
                                            </td>
                                            <td style="padding:0.5rem;border:1px solid #e5e7eb">
                                                ${isLegalMode ? `
                                                    <select class="form-input" data-circuito="${idx}" data-field-circ="detector" style="margin:0;padding:0.5rem">
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Si" ${circ.detector === 'Si' ? 'selected' : ''}>Si</option>
                                                        <option value="No" ${circ.detector === 'No' ? 'selected' : ''}>No</option>
                                                    </select>
                                                ` : `
                                                    <input type="text" class="form-input" data-circuito="${idx}" data-field-circ="detector" value="${circ.detector}" style="margin:0;padding:0.5rem">
                                                `}
                                            </td>
                                        </tr>
                                    `}).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="sm-grid" style="margin-top:2rem">
                        <div class="sm-card">
                            <div class="sm-card-title">${ic('factory')} SALAS DE MÁQUINAS O ESPACIOS EQUIVALENTES</div>
                            <button class="add-vs-btn" onclick="App.addLocal()" style="margin-bottom:1rem;width:100%">${ic('plus')} Agregar Local</button>
                            ${AppState.instalacionSalas.map((sala, idx) => `
                                <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;align-items:flex-end">
                                    <div style="flex:1">
                                        <label class="form-label">Nombre del Local</label>
                                        <input type="text" class="form-input" data-sala="${idx}" data-field-sala="nombre" value="${sala.nombre}" placeholder="Ej: Local 1, Sala A, etc.">
                                    </div>
                                    <div style="flex:2">
                                        <label class="form-label">Descripción</label>
                                        <input type="text" class="form-input" data-sala="${idx}" data-field-sala="valor" value="${sala.valor}">
                                    </div>
                                    <button class="remove-vs-btn" onclick="App.removeLocal(${idx})" style="height:fit-content;margin-bottom:0.25rem">${ic('trash')}</button>
                                </div>
                            `).join('')}
                            ${AppState.instalacionSalas.length === 0 ? '<p style="text-align:center;color:#9ca3af;padding:1rem">No hay locales agregados</p>' : ''}
                        </div>

                        <div class="sm-card">
                            <div class="sm-card-title">${ic('snowflake')} CÁMARAS O ESPACIOS ACONDICIONADOS</div>
                            <div style="overflow-x:auto">
                                <table style="width:100%;border-collapse:collapse;margin-top:0.5rem">
                                    <thead>
                                        <tr style="background:#f3f4f6">
                                            <th style="padding:0.5rem;text-align:left;border:1px solid #e5e7eb;font-size:0.875rem"></th>
                                            <th style="padding:0.5rem;text-align:center;border:1px solid #e5e7eb;font-size:0.875rem">Num.</th>
                                            <th style="padding:0.5rem;text-align:center;border:1px solid #e5e7eb;font-size:0.875rem">Volumen (m³)</th>
                                            <th style="padding:0.5rem;text-align:center;border:1px solid #e5e7eb;font-size:0.875rem">Atmósfera</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${AppState.instalacionCamaras.map((camara, idx) => `
                                            <tr>
                                                <td style="padding:0.5rem;border:1px solid #e5e7eb;font-weight:600;font-size:0.875rem">${camara.tipo}</td>
                                                <td style="padding:0.25rem;border:1px solid #e5e7eb">
                                                    <input type="text" class="form-input" data-camara="${idx}" data-field-cam="num" value="${camara.num}" style="margin:0;padding:0.5rem;text-align:center">
                                                </td>
                                                <td style="padding:0.25rem;border:1px solid #e5e7eb">
                                                    <input type="text" class="form-input" data-camara="${idx}" data-field-cam="volumen" value="${camara.volumen}" style="margin:0;padding:0.5rem;text-align:center">
                                                </td>
                                                <td style="padding:0.25rem;border:1px solid #e5e7eb">
                                                    <select class="form-input" data-camara="${idx}" data-field-cam="atmosfera" style="margin:0;padding:0.5rem;text-align:center">
                                                        <option value="">Seleccionar...</option>
                                                        <option value="Artificial" ${camara.atmosfera === 'Artificial' ? 'selected' : ''}>Artificial</option>
                                                        <option value="Natural" ${camara.atmosfera === 'Natural' ? 'selected' : ''}>Natural</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        
        const isRevision = section.id === 'datos_revision';

        workspace.querySelectorAll('.form-input[data-field]').forEach(input => {
            const saveFieldValue = (e) => {
                if (!AppState.sectionsData[AppState.currentSection]) AppState.sectionsData[AppState.currentSection] = {};
                AppState.sectionsData[AppState.currentSection][e.target.dataset.field] = e.target.value;

                // Sync CIF entre modo técnico y legal
                if (e.target.dataset.field === 'CIF') {
                    const _partner = AppState.currentSection === 'datos_datos_informe' ? 'datos_datos_instalacion'
                        : AppState.currentSection === 'datos_datos_instalacion' ? 'datos_datos_informe' : null;
                    if (_partner) {
                        if (!AppState.sectionsData[_partner]) AppState.sectionsData[_partner] = {};
                        AppState.sectionsData[_partner]['CIF'] = e.target.value;
                    }
                }

                // Sync NÚMERO REVISIÓN entre Certificado y Datos del Informe
                if (e.target.dataset.field === 'NÚMERO REVISIÓN') {
                    ['datos_datos_certificado', 'datos_datos_informe'].forEach(sec => {
                        if (sec !== AppState.currentSection) {
                            if (!AppState.sectionsData[sec]) AppState.sectionsData[sec] = {};
                            AppState.sectionsData[sec]['NÚMERO REVISIÓN'] = e.target.value;
                        }
                    });
                }

                // Sync IDENTIFICACIÓN SEGÚN CLIENTE ↔ REF. TITULAR
                if (e.target.dataset.field === 'IDENTIFICACIÓN SEGÚN CLIENTE') {
                    if (!AppState.sectionsData['datos_datos_instalacion']) AppState.sectionsData['datos_datos_instalacion'] = {};
                    AppState.sectionsData['datos_datos_instalacion']['REF. TITULAR'] = e.target.value;
                }
                if (e.target.dataset.field === 'REF. TITULAR') {
                    if (!AppState.sectionsData['datos_datos_informe']) AppState.sectionsData['datos_datos_informe'] = {};
                    AppState.sectionsData['datos_datos_informe']['IDENTIFICACIÓN SEGÚN CLIENTE'] = e.target.value;
                }

                // Auto-relleno Datos de Delegación
                if (e.target.dataset.field === 'DELEGACIÓN') {
                    const DELEGACIONES = {
                        'A CORUÑA':    {DIRECCIÓN: 'Dársena de Oza, local nº2',               POBLACIÓN: 'A Coruña',      'C.P.': '15006', PROVINCIA: 'A Coruña'},
                        'BARCELONA':   {DIRECCIÓN: 'C/ Acústica 16 PI Santa Rita',             POBLACIÓN: 'Castellbisbal', 'C.P.': '08755', PROVINCIA: 'Barcelona'},
                        'HUELVA':      {DIRECCIÓN: 'Avda de la Ría Edif. Insur 2ª Planta',    POBLACIÓN: 'Huelva',        'C.P.': '21001', PROVINCIA: 'Huelva'},
                        'MADRID':      {DIRECCIÓN: 'C/ Edison 47 2ª 4ª',                       POBLACIÓN: 'Getafe',        'C.P.': '28906', PROVINCIA: 'Madrid'},
                        'MÁLAGA':      {DIRECCIÓN: 'C/ Luis F Pallardo',                       POBLACIÓN: 'Málaga',        'C.P.': '29007', PROVINCIA: 'Málaga'},
                        'MURCIA':      {DIRECCIÓN: 'C/ Alcalde Clemente Garcia 19',            POBLACIÓN: 'San Ginés',     'C.P.': '30169', PROVINCIA: 'Murcia'},
                        'VALLADOLID':  {DIRECCIÓN: 'C/ Cobalto 32 Nave 8',                    POBLACIÓN: 'Valladolid',    'C.P.': '47012', PROVINCIA: 'Valladolid'},
                        'VALENCIA':    {DIRECCIÓN: 'Calle C 2B Parque Empresarial Táctica',   POBLACIÓN: 'Paterna',       'C.P.': '46980', PROVINCIA: 'Valencia'},
                        'VIGO':        {DIRECCIÓN: 'C/ C Nave D8',                             POBLACIÓN: 'Vigo',          'C.P.': '36315', PROVINCIA: 'Vigo'},
                        'ZARAGOZA':    {DIRECCIÓN: 'Pablo Ruiz Picasso 5',                     POBLACIÓN: 'Zaragoza',      'C.P.': '50015', PROVINCIA: 'Zaragoza'}
                    };
                    const datos = DELEGACIONES[e.target.value];
                    if (datos) {
                        const sec = AppState.sectionsData[AppState.currentSection];
                        Object.assign(sec, datos);
                        ['DIRECCIÓN', 'POBLACIÓN', 'C.P.', 'PROVINCIA'].forEach(field => {
                            const el = workspace.querySelector(`.form-input[data-field="${field}"]`);
                            if (el) el.value = datos[field];
                        });
                    }
                }

                // Lógica especial para DICTAMEN - actualizar COMENTARIOS automáticamente
                if (e.target.dataset.field === 'DICTAMEN') {
                    const dictamenTextos = {
                        'Favorable (Sin defectos)': 'La instalación anteriormente descrita, según se ha comprobado en la revisión periódica obligatoria, no presenta defectos, por lo que la instalación puede continuar en funcionamiento en condiciones de seguridad.',
                        'Favorable (Defectos leves)': 'La instalación anteriormente descrita, según se ha comprobado en la revisión periódica obligatoria, presenta defectos LEVES, por lo que la instalación puede continuar en funcionamiento en condiciones de seguridad. Los defectos deben subsanarse antes de la siguiente revisión.',
                        'Desfavorable': 'La instalación anteriormente descrita, según se ha comprobado en la revisión periódica obligatoria, presenta al menos un defecto GRAVE, o defectos LEVES procedentes de otra revisión anterior que no han sido corregidos. El plazo para su corrección no deberá superar los 6 meses.',
                        'Negativa': 'Que la instalación anteriormente descrita, según se ha comprobado en la revisión periódica obligatoria, NO reúne las condiciones de seguridad reglamentarias para su funcionamiento. Para que esta instalación reúna las mencionadas condiciones se deberán realizar las modificaciones que se enumeran en el informe anexo.',
                        'Condicionado': 'La instalación anteriormente descrita, según se ha comprobado en la revisión periódica obligatoria, reúne las condiciones de seguridad reglamentarias para su funcionamiento, quedando pendiente la subsanación de los defectos detectados antes de 6 meses desde la emisión y comunicación de este informe. Si transcurrido dicho plazo las deficiencias no han sido corregidas o se ha establecido una fecha para su corrección el dictamen pasara a ser Negativo / Desfavorable.',
                        'Comunicación deficiencias': 'En la instalación anteriormente descrita, según se ha comprobado en la revisión periódica obligatoria, existen deficiencias a corregir para reunir las condiciones de seguridad reglamentarias para su funcionamiento.'
                    };

                    const textoComentarios = dictamenTextos[e.target.value] || '';
                    AppState.sectionsData[AppState.currentSection]['COMENTARIOS'] = textoComentarios;

                    // Actualizar el textarea de comentarios
                    const comentariosTextarea = workspace.querySelector('textarea[data-field="COMENTARIOS"]');
                    if (comentariosTextarea) comentariosTextarea.value = textoComentarios;
                }

                // Recalcular datos de revisión cuando cambian campos relevantes
                if (isInstalacion || isRevision) {
                    this.calcularDatosRevision();
                }
            };
            input.onchange = saveFieldValue;
            input.oninput = saveFieldValue;
        });

        // Checkbox "Nunca realizada" para ÚLTIMA INSPECCIÓN
        if (isRevision) {
            workspace.querySelectorAll('input[data-field-nunca]').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const fieldName = e.target.dataset.fieldNunca;
                    const isChecked = e.target.checked;
                    AppState.sectionsData[AppState.currentSection][fieldName] = isChecked ? '__nunca__' : '';
                    const dateInput = workspace.querySelector(`input[type="date"][data-field="${fieldName}"]`);
                    if (dateInput) {
                        dateInput.disabled = isChecked;
                        dateInput.style.background = isChecked ? '#f3f4f6' : '';
                        dateInput.style.opacity = isChecked ? '0.5' : '';
                        if (isChecked) dateInput.value = '';
                    }
                    this.calcularDatosRevision();
                });
            });
        }

        if (isInstalacion) {
            workspace.querySelectorAll('input[data-circuito], select[data-circuito]').forEach(input => {
                input.addEventListener('change', (e) => {
                    const idx = parseInt(e.target.dataset.circuito);
                    const field = e.target.dataset.fieldCirc;
                    AppState.instalacionCircuitos[idx][field] = e.target.value;

                    if (field === 'refrigerante' || field === 'carga') {
                        this.renderFormSection(section);
                    }
                    this.calcularDatosRevision();
                });
            });

            workspace.querySelectorAll('input[data-sala]').forEach(input => {
                input.onchange = (e) => {
                    const idx = parseInt(e.target.dataset.sala);
                    const field = e.target.dataset.fieldSala;
                    AppState.instalacionSalas[idx][field] = e.target.value;
                };
            });

            workspace.querySelectorAll('input[data-camara], select[data-camara]').forEach(input => {
                input.onchange = (e) => {
                    const idx = parseInt(e.target.dataset.camara);
                    const field = e.target.dataset.fieldCam;
                    AppState.instalacionCamaras[idx][field] = e.target.value;
                };
            });
        }
    },

    renderChecklistSection(section) {
        const workspace = document.getElementById('workspace');
        const sectionId = AppState.currentSection;
        const data = AppState.sectionsData[sectionId] || {};
        const isLegalMode = AppState.isLegalMode;
        
        console.log('✅ Renderizando checklist:', section.id, '- Modo Legal:', isLegalMode);
        
        const alwaysShowImages = ['B02', 'B03', 'B04', 'B12', 'B16', 'B17', 'B23', 'B24', 'B25', 'B26', 'E06', 'D21'];
        const estados = ['', '✔️ POSITIVO', '❌ NEGATIVO', '⚠️ RECOMENDACIÓN', '➖ NO PROCEDE'];
        if (!this._clFilters) this._clFilters = {};
        const activeFilter = this._clFilters[sectionId] || 'todos';

        let okCount = 0, negCount = 0, recomCount = 0, naCount = 0, pendingCount = 0;
        section.items.forEach(item => {
            const est = (data[item.id] || {}).estado || '';
            if (est === '✔️ POSITIVO') okCount++;
            else if (est === '❌ NEGATIVO') negCount++;
            else if (est === '⚠️ RECOMENDACIÓN') recomCount++;
            else if (est === '➖ NO PROCEDE') naCount++;
            else pendingCount++;
        });
        const total = section.items.length;
        const completedCount = okCount + negCount + recomCount + naCount;
        const progressPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
        const filterDefs = [
            {key: 'todos', label: `Todos (${total})`},
            {key: 'ok',    label: `OK (${okCount})`},
            {key: 'nook',  label: `No OK (${negCount + recomCount})`},
            {key: 'na',    label: `N/A (${naCount})`},
            {key: 'pend',  label: `Pendientes (${pendingCount})`},
        ];

        workspace.innerHTML = `
            <div class="section-card">
                <div class="section-title">${section.icon} ${section.name}</div>
                <div class="checklist-section-header">
                    <div class="cl-progress-label">${completedCount} / ${total} completados</div>
                    <div class="cl-progress-bar"><div class="cl-progress-bar-fill" style="width:${progressPct}%"></div></div>
                    ${negCount > 0 ? `<div style="font-family:var(--display);font-size:11px;font-weight:700;color:var(--bad);white-space:nowrap">${negCount} no conformidades</div>` : ''}
                </div>
                <div class="cl-filters">
                    ${filterDefs.map(f => `<button class="cl-filter-btn${activeFilter === f.key ? ' active' : ''}" data-filter="${f.key}">${f.label}</button>`).join('')}
                </div>
                ${section.items.map(item => {
                    const itemData = data[item.id] || {estado: '', gravedad: '', correccion: '', observaciones: '', imagenes: []};
                    const est = itemData.estado || '';
                    let visible = true;
                    if (activeFilter === 'ok') visible = est === '✔️ POSITIVO';
                    else if (activeFilter === 'nook') visible = est === '❌ NEGATIVO' || est === '⚠️ RECOMENDACIÓN';
                    else if (activeFilter === 'na') visible = est === '➖ NO PROCEDE';
                    else if (activeFilter === 'pend') visible = est === '';
                    if (!visible) return '';
                    const stateClass = est === '✔️ POSITIVO' ? 'cl-item--ok'
                        : (est === '❌ NEGATIVO' || est === '⚠️ RECOMENDACIÓN') ? 'cl-item--bad'
                        : est === '➖ NO PROCEDE' ? 'cl-item--na' : '';
                    const selectClass = est === '✔️ POSITIVO' ? 'result-valid'
                        : est === '❌ NEGATIVO' ? 'result-invalid'
                        : est === '⚠️ RECOMENDACIÓN' ? 'result-warning' : '';
                    const showExtraFields = est === '❌ NEGATIVO' || est === '⚠️ RECOMENDACIÓN';
                    const forceShowImages = alwaysShowImages.includes(item.id);
                    const shouldShowImages = showExtraFields || forceShowImages;

                    return `
                        <div class="checklist-item-container ${stateClass}">
                            <div class="checklist-item-badge">${item.id}</div>
                            <div style="flex:1;min-width:0">
                                <div style="font-family:var(--display);font-size:0.875rem;font-weight:600;color:var(--ink);margin-bottom:0.4rem">${item.desc}</div>
                                <div style="background:var(--accent-soft);border-left:3px solid var(--accent);padding:0.6rem 0.75rem;border-radius:var(--r-sm);font-size:0.8rem;color:var(--ink-2);white-space:pre-line;margin-bottom:0.75rem">${item.comment}</div>

                                ${showExtraFields && isLegalMode ? `
                                    <div class="checklist-extra-fields" style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
                                        <div>
                                            <label class="form-label">Estado</label>
                                            <select class="form-input ${selectClass}" data-item="${item.id}" data-field-type="estado">
                                                ${estados.map(st => `<option value="${st}" ${st === est ? 'selected' : ''}>${st || 'Seleccione...'}</option>`).join('')}
                                            </select>
                                        </div>
                                        <div>
                                            <label class="form-label">Gravedad</label>
                                            <select class="form-input ${itemData.gravedad === 'Leve' ? 'checklist-gravedad-leve' : itemData.gravedad === 'Grave' ? 'checklist-gravedad-grave' : ''}" data-item="${item.id}" data-field-type="gravedad">
                                                <option value="">Seleccionar...</option>
                                                <option value="Leve" ${itemData.gravedad === 'Leve' ? 'selected' : ''}>Leve</option>
                                                <option value="Grave" ${itemData.gravedad === 'Grave' ? 'selected' : ''}>Grave</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="form-label">Corrección</label>
                                            <select class="form-input" data-item="${item.id}" data-field-type="correccion">
                                                <option value="">Seleccionar...</option>
                                                <option value="Titular" ${itemData.correccion === 'Titular' ? 'selected' : ''}>Titular</option>
                                                <option value="Clauger" ${itemData.correccion === 'Clauger' ? 'selected' : ''}>Clauger</option>
                                                <option value="Clauger/Titular" ${itemData.correccion === 'Clauger/Titular' ? 'selected' : ''}>Clauger/Titular</option>
                                                <option value="A determinar" ${itemData.correccion === 'A determinar' ? 'selected' : ''}>A determinar</option>
                                                <option value="Mantenedor" ${itemData.correccion === 'Mantenedor' ? 'selected' : ''}>Mantenedor</option>
                                            </select>
                                        </div>
                                    </div>
                                ` : `
                                    <select class="form-input ${selectClass}" data-item="${item.id}" data-field-type="estado" style="margin-bottom:0.75rem">
                                        ${estados.map(st => `<option value="${st}" ${st === est ? 'selected' : ''}>${st || 'Seleccione...'}</option>`).join('')}
                                    </select>
                                `}

                                ${showExtraFields ? `
                                    <div style="margin-top:0.75rem;display:grid;grid-template-columns:${AppState.isLegalMode ? '1fr 1fr' : '1fr'};gap:0.75rem">
                                        <div>
                                            <label class="form-label">Observaciones - Técnico</label>
                                            <textarea class="form-input" data-item="${item.id}" data-field-type="observaciones" rows="3">${itemData.observaciones || ''}</textarea>
                                        </div>
                                        ${AppState.isLegalMode ? `<div>
                                            <label class="form-label">Observaciones - Legal</label>
                                            <textarea class="form-input" data-item="${item.id}" data-field-type="observacionesLegal" rows="3">${itemData.observacionesLegal || ''}</textarea>
                                        </div>` : ''}
                                    </div>
                                ` : ''}

                                ${shouldShowImages ? (() => {
                                    let imgLabel = 'Imágenes';
                                    if (forceShowImages && !showExtraFields) {
                                        imgLabel = (!AppState.isLegalMode && typeof Ayudante !== 'undefined')
                                            ? Ayudante.getImgHint(item.id, item.desc)
                                            : 'Imágenes (Obligatorio)';
                                    }
                                    const imgContent = AppState.isLegalMode
                                        ? this._legalImgSectionHtml(
                                            '',
                                            itemData.imagenes || [],
                                            "App.dropChecklistImages(event,'" + sectionId + "','" + item.id + "')",
                                            "App.uploadChecklistImages('" + sectionId + "','" + item.id + "')",
                                            "App.removeChecklistImage('" + sectionId + "','" + item.id + "',{i})",
                                            "App.toggleImagePdf('" + sectionId + "','" + item.id + "',{i})"
                                          )
                                        : '<div class="photo-upload" onclick="App._showPhotoSourceDialog(()=>{App.uploadChecklistImage(\'' + sectionId + '\',\'' + item.id + '\')},()=>{App.uploadChecklistImages(\'' + sectionId + '\',\'' + item.id + '\')})" style="margin-bottom:1rem">'
                                            + `<div style="margin-bottom:0.5rem;color:#6b7280">${ic('camera')}</div>`
                                            + '<div style="font-size:0.875rem;color:#6b7280;font-weight:600">Añadir Imagen</div>'
                                            + '</div>'
                                            + (itemData.imagenes && itemData.imagenes.length > 0
                                                ? '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem">'
                                                    + itemData.imagenes.map((img, idx) =>
                                                        '<div style="position:relative;border-radius:0.5rem;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1)">'
                                                        + '<img src="' + img.data + '" onclick="App.viewImage(\'' + img.data + '\')" style="width:100%;height:150px;object-fit:cover;cursor:pointer;opacity:' + (img.incluirEnPdf === false ? '0.4' : '1') + '">'
                                                        + '<button class="photo-remove" onclick="App.removeChecklistImage(\'' + sectionId + '\',\'' + item.id + '\',' + idx + ')">×</button>'
                                                        + '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0.5rem;background:rgba(0,0,0,0.75)">'
                                                        + '<span style="color:white;font-size:0.7rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:80px">' + (img.name || 'Imagen ' + (idx + 1)) + '</span>'
                                                        + '<button onclick="App.toggleImagePdf(\'' + sectionId + '\',\'' + item.id + '\',' + idx + ')" style="background:' + (img.incluirEnPdf === false ? '#6b7280' : '#16a34a') + ';color:white;border:none;border-radius:3px;padding:1px 6px;font-size:0.68rem;cursor:pointer;font-weight:700;flex-shrink:0">' + (img.incluirEnPdf === false ? 'PDF ✗' : 'PDF ✓') + '</button>'
                                                        + '</div>'
                                                        + '</div>'
                                                    ).join('')
                                                    + '</div>'
                                                : '');
                                    return '<div style="margin-top:1rem"><label class="form-label">' + imgLabel + '</label>' + imgContent + '</div>';
                                })() : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        workspace.querySelectorAll('.cl-filter-btn').forEach(btn => {
            btn.onclick = () => {
                this._clFilters[sectionId] = btn.dataset.filter;
                this.renderChecklistSection(section);
            };
        });

        workspace.querySelectorAll('select[data-item]').forEach(select => {
            select.onchange = (e) => {
                const itemId = e.target.dataset.item;
                const fieldType = e.target.dataset.fieldType;

                AppState.sectionsData[sectionId][itemId][fieldType] = e.target.value;

                if (fieldType === 'estado') {
                    e.target.className = 'form-input ' + (e.target.value === '✔️ POSITIVO' ? 'result-valid'
                                       : e.target.value === '❌ NEGATIVO' ? 'result-invalid'
                                       : e.target.value === '⚠️ RECOMENDACIÓN' ? 'result-warning' : '');
                    if ((e.target.value === '❌ NEGATIVO' || e.target.value === '⚠️ RECOMENDACIÓN') && typeof Ayudante !== 'undefined') {
                        Ayudante.onChecklistNegativo(sectionId, itemId);
                    }
                    this.renderChecklistSection(section);
                } else if (fieldType === 'gravedad') {
                    e.target.className = 'form-input ' + (e.target.value === 'Leve' ? 'checklist-gravedad-leve'
                                       : e.target.value === 'Grave' ? 'checklist-gravedad-grave' : '');
                }
            };
        });

        workspace.querySelectorAll('textarea[data-item]').forEach(textarea => {
            textarea.onchange = (e) => {
                const itemId = e.target.dataset.item;
                const fieldType = e.target.dataset.fieldType;
                AppState.sectionsData[sectionId][itemId][fieldType] = e.target.value;
            };
        });
    },

    uploadChecklistImage(sectionId, itemId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const itemData = AppState.sectionsData[sectionId][itemId];
                    if (!itemData.imagenes) itemData.imagenes = [];
                    itemData.imagenes.push({name: file.name, data: event.target.result, timestamp: new Date().toISOString(), incluirEnPdf: true});
                    
                    const [pageKey, ...sectionParts] = sectionId.split('_');
                    const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sectionParts.join('_'));
                    this.renderChecklistSection(section);
                    this.showToast('Imagen añadida', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    },

    removeChecklistImage(sectionId, itemId, imageIndex) {
        if (confirm('¿Eliminar esta imagen?')) {
            AppState.sectionsData[sectionId][itemId].imagenes.splice(imageIndex, 1);
            const [pageKey, ...sectionParts] = sectionId.split('_');
            const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sectionParts.join('_'));
            this.renderChecklistSection(section);
            this.showToast('Imagen eliminada', 'success');
        }
    },

    toggleImagePdf(sectionId, itemId, imageIndex) {
        const img = AppState.sectionsData[sectionId][itemId].imagenes[imageIndex];
        img.incluirEnPdf = img.incluirEnPdf === false;
        const [pageKey, ...sectionParts] = sectionId.split('_');
        const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sectionParts.join('_'));
        this.renderChecklistSection(section);
    },

    uploadChecklistImages(sectionId, itemId) {
        this._pickImages(files => {
            const itemData = AppState.sectionsData[sectionId][itemId];
            if (!itemData.imagenes) itemData.imagenes = [];
            const [pageKey, ...sp] = sectionId.split('_');
            const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sp.join('_'));
            this._readMultipleImages(files, img => itemData.imagenes.push(img), () => this.renderChecklistSection(section));
        });
    },

    dropChecklistImages(event, sectionId, itemId) {
        const itemData = AppState.sectionsData[sectionId][itemId];
        if (!itemData.imagenes) itemData.imagenes = [];
        const [pageKey, ...sp] = sectionId.split('_');
        const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sp.join('_'));
        this._readMultipleImages(Array.from(event.dataTransfer.files), img => itemData.imagenes.push(img), () => this.renderChecklistSection(section));
    },

    renderPlanificacion() {
        const workspace = document.getElementById('workspace');
        const revision    = AppState.sectionsData['datos_datos_revision']    || {};
        const instalacion = AppState.sectionsData['datos_datos_instalacion'] || {};

        const nivel    = instalacion['NIVEL'] || '—';
        const periodRev  = revision['PERIODICIDAD REVISIÓN']   || '5 años';
        const periodInsp = revision['PERIODICIDAD INSPECCIÓN'] || '—';
        const proxRev    = revision['PRÓXIMA REVISIÓN']        || '';
        const proxInsp   = revision['PRÓXIMA INSPECCIÓN']      || '';

        const formatFecha = (dateStr) => {
            if (!dateStr) return '— / — / ——';
            const d = new Date(dateStr);
            const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
                           'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
            return `${String(d.getDate()).padStart(2,'0')} / ${meses[d.getMonth()]} / ${d.getFullYear()}`;
        };

        const plan = AppState.planificacionData || { textoRevision: '', textoInspeccion: '' };

        const defaultTextoRev =
`La periodicidad para realizar las revisiones periódicas será como norma general de ${periodRev}, salvo que los sistemas que utilicen una carga de refrigerante superior a 3000 kg y posean una antigüedad superior a quince años se revisarán al menos cada dos años.
La próxima revisión obligatoria de la instalación frigorífica, realizada por parte de una empresa frigorista autorizada de Nivel ${nivel} deberá realizarse antes de ${formatFecha(proxRev)}.`;

        const defaultTextoInsp =
`Como norma general las instalaciones de Nivel 2 se inspeccionarán por parte de un Órgano de Control cada 10 años, salvo las que utilicen gases de tipo HFC, las cuales, independientemente de su nivel, se inspeccionarán en función de las Tn equivalentes de CO2, ver tabla 1.

La próxima inspección periódica obligatoria de la instalación frigorífica, realizada por parte de Órgano de Control deberá realizarse antes de ${formatFecha(proxInsp)}.`;

        const textoRev  = plan.textoRevision  || defaultTextoRev;
        const textoInsp = plan.textoInspeccion || defaultTextoInsp;

        workspace.innerHTML = `
            <div class="section-card">
                <div class="section-title">${ic('calendar')} Planificación</div>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
                    <div style="font-size:0.85rem;color:#6b7280">Los datos resaltados se calculan automáticamente desde <b>Datos de Instalación</b> y <b>Datos de Revisión</b>.</div>
                    <button class="add-vs-btn" onclick="App.regenerarPlanificacion()" style="margin:0">${ic('refresh')} Regenerar texto automático</button>
                </div>

                <!-- Tabla periodicidad revisión -->
                ${(() => {
                    const fechaPS = instalacion['FECHA PS'] || '';
                    const totalKg = (AppState.instalacionCircuitos || []).reduce((s, c) => s + (parseFloat(c.carga) || 0), 0);
                    let ageYears = null;
                    if (fechaPS) { const d = new Date(fechaPS); if (!isNaN(d)) ageYears = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25); }
                    const isAntigua = ageYears !== null && ageYears >= 15;
                    const isHeavy   = totalKg >= 3000;
                    const period    = (isAntigua && isHeavy) ? 'Cada 2 años' : 'Cada 5 años';
                    const hl = (cond) => cond ? 'background:#fef9c3;font-weight:700' : '';
                    return `<div style="overflow-x:auto;margin-bottom:1.5rem">
                        <div style="font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">Tabla — Periodicidad de revisión según antigüedad y carga</div>
                        <div style="font-size:0.8rem;color:#6b7280;margin-bottom:0.5rem">Antigüedad: ${ageYears !== null ? Math.floor(ageYears) + ' años' : 'sin FECHA PS'} · Carga total: ${totalKg.toFixed(0)} kg · <strong>Resultado: ${period}</strong></div>
                        <table style="border-collapse:collapse;min-width:500px">
                            <thead><tr style="background:#1f2937;color:white">
                                <th style="padding:0.6rem 1rem;border:1px solid #374151">Antigüedad</th>
                                <th style="padding:0.6rem 1rem;border:1px solid #374151">Carga de refrigerante</th>
                                <th style="padding:0.6rem 1rem;border:1px solid #374151">Periodicidad</th>
                            </tr></thead>
                            <tbody>
                                <tr style="${hl(!isAntigua && !isHeavy)}"><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Inferior a 15 años</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Inferior a 3.000 kg</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Cada 5 años</td></tr>
                                <tr style="background:#f9fafb;${hl(!isAntigua && isHeavy)}"><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Inferior a 15 años</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Superior a 3.000 kg</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Cada 5 años</td></tr>
                                <tr style="${hl(isAntigua && !isHeavy)}"><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Superior a 15 años</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Inferior a 3.000 kg</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Cada 5 años</td></tr>
                                <tr style="background:#f9fafb;${hl(isAntigua && isHeavy)}"><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Superior a 15 años</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Superior a 3.000 kg</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Cada 2 años</td></tr>
                            </tbody>
                        </table>
                    </div>`;
                })()}

                <!-- Sección 1: Revisión -->
                <div class="form-section" style="margin-bottom:2rem">
                    <div class="form-section-title" style="font-size:1rem">Planificación próxima revisión obligatoria</div>
                    <textarea id="plan-texto-revision" class="form-input" rows="5" style="font-size:0.93rem;line-height:1.6;resize:vertical">${textoRev}</textarea>
                </div>

                <!-- Sección 2: Inspección -->
                <div class="form-section" style="margin-bottom:2rem">
                    <div class="form-section-title" style="font-size:1rem">Planificación próxima inspección obligatoria</div>

                    <!-- Tabla 1 -->
                    <div style="overflow-x:auto;margin-bottom:1.25rem">
                        <table style="border-collapse:collapse;min-width:400px">
                            <caption style="caption-side:top;text-align:left;font-weight:600;font-size:0.875rem;margin-bottom:0.5rem">Tabla 1 — Periodicidad según Tn eq. CO2</caption>
                            <thead>
                                <tr style="background:#1f2937;color:white">
                                    <th style="padding:0.6rem 1rem;text-align:left;border:1px solid #374151">Tn eq. CO2</th>
                                    <th style="padding:0.6rem 1rem;text-align:left;border:1px solid #374151">Periodicidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="background:${periodInsp==='1 año'?'#fef9c3':'white'}"><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Más de 5.000</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb;font-weight:${periodInsp==='1 año'?'700':'400'}">Anual</td></tr>
                                <tr style="background:${periodInsp==='2 años'?'#fef9c3':'#f9fafb'}"><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Entre 5.000 y 500</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb;font-weight:${periodInsp==='2 años'?'700':'400'}">Cada 2 años</td></tr>
                                <tr style="background:${periodInsp==='5 años'?'#fef9c3':'white'}"><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Entre 500 y 50</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb;font-weight:${periodInsp==='5 años'?'700':'400'}">Cada 5 años</td></tr>
                                <tr style="background:${periodInsp==='10 años'?'#fef9c3':'#f9fafb'}"><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Inferior a 50 (Nivel 2)</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb;font-weight:${periodInsp==='10 años'?'700':'400'}">Cada 10 años</td></tr>
                                <tr style="background:${periodInsp==='Exento'?'#fef9c3':'white'}"><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb">Inferior a 50 (otros)</td><td style="padding:0.5rem 1rem;border:1px solid #e5e7eb;font-weight:${periodInsp==='Exento'?'700':'400'}">Exentas</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <textarea id="plan-texto-inspeccion" class="form-input" rows="5" style="font-size:0.93rem;line-height:1.6;resize:vertical">${textoInsp}</textarea>
                </div>

                <!-- Datos de referencia (solo lectura) -->
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;padding:1rem;background:#f0f9ff;border:1px solid #bae6fd;border-radius:0.5rem">
                    <div><span style="font-size:0.78rem;color:#6b7280;font-weight:600;text-transform:uppercase">Nivel instalación</span><div style="font-weight:700;font-size:1.1rem;color:#1e40af">${nivel}</div></div>
                    <div><span style="font-size:0.78rem;color:#6b7280;font-weight:600;text-transform:uppercase">Próxima revisión</span><div style="font-weight:700;font-size:1.1rem;color:#1e40af">${formatFecha(proxRev)}</div></div>
                    <div><span style="font-size:0.78rem;color:#6b7280;font-weight:600;text-transform:uppercase">Próxima inspección</span><div style="font-weight:700;font-size:1.1rem;color:#1e40af">${formatFecha(proxInsp)}</div></div>
                </div>
            </div>
        `;

        // Guardar cambios en AppState
        document.getElementById('plan-texto-revision').addEventListener('input', (e) => {
            AppState.planificacionData.textoRevision = e.target.value;
        });
        document.getElementById('plan-texto-inspeccion').addEventListener('input', (e) => {
            AppState.planificacionData.textoInspeccion = e.target.value;
        });
    },

    regenerarPlanificacion() {
        AppState.planificacionData = { textoRevision: '', textoInspeccion: '' };
        this.renderPlanificacion();
        this.showToast('Texto regenerado con datos actuales', 'success');
    },

    _getPortadaDefaults() {
        const cliente    = AppState.sectionsData['datos_datos_cliente']     || {};
        const instalacion= AppState.sectionsData['datos_datos_instalacion'] || {};
        const revision   = AppState.sectionsData['datos_datos_revision']    || {};
        const fechaRev   = revision['FECHA REVISIÓN'] || '';
        const anio       = fechaRev ? new Date(fechaRev).getFullYear().toString() : '';
        return {
            titulo:     'REVISIÓN PERIÓDICA',
            subtitulo:  'INSTALACIÓN FRIGORÍFICA',
            cliente:    cliente['CLIENTE']    || '',
            direccion:  cliente['DIRECCIÓN']  || '',
            cp:         cliente['CP']         || '',
            localidad:  cliente['LOCALIDAD']  || '',
            provincia:  cliente['PROVINCIA']  || '',
            referencia: instalacion['REF. EFA'] || '',
            anio
        };
    },

    renderPortada() {
        const workspace = document.getElementById('workspace');
        const defaults  = this._getPortadaDefaults();
        const d         = AppState.portadaData;
        const v = (key) => d[key] || defaults[key] || '';

        workspace.innerHTML = `
        <div class="section-card" style="padding:0">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;background:#f9fafb">
                <span style="font-weight:600;color:#374151">${ic('home')} Portada</span>
                <button class="add-vs-btn" onclick="App.regenerarPortada()" style="margin:0">${ic('refresh')} Regenerar datos automáticos</button>
            </div>
            <div style="padding:2rem;background:#e8e8e8;display:flex;gap:2rem;align-items:flex-start">
                <div style="width:260px;flex-shrink:0;background:#fff;border-radius:8px;padding:1.2rem;box-shadow:0 1px 4px rgba(0,0,0,.1)">
                    <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:1rem">Datos de portada</div>
                    ${['titulo','subtitulo','cliente','direccion','cp','localidad','provincia','referencia','anio'].map(key => `
                    <div style="margin-bottom:0.7rem">
                        <label style="display:block;font-size:0.7rem;font-weight:600;color:#4d5670;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <input id="port-${key}" class="form-input" value="${v(key)}" style="font-size:0.82rem;padding:0.35rem 0.55rem" placeholder="${key}">
                    </div>`).join('')}
                </div>
                <div style="overflow:hidden;width:516px;height:730px;flex-shrink:0">
                    <iframe id="portada-preview-frame"
                        style="width:794px;height:1123px;border:none;transform:scale(0.65);transform-origin:top left;pointer-events:none">
                    </iframe>
                </div>
            </div>
        </div>`;

        const frame = document.getElementById('portada-preview-frame');
        if (frame) frame.srcdoc = this._buildPreviewSrcdoc(this._buildPortadaHtml(v));

        ['titulo','subtitulo','cliente','direccion','cp','localidad','provincia','referencia','anio'].forEach(key => {
            const el = document.getElementById('port-' + key);
            if (el) el.addEventListener('input', (e) => {
                AppState.portadaData[key] = e.target.value;
                const pvFn = (k) => AppState.portadaData[k] || defaults[k] || '';
                const fr = document.getElementById('portada-preview-frame');
                if (fr) fr.srcdoc = this._buildPreviewSrcdoc(this._buildPortadaHtml(pvFn));
            });
        });
    },

    regenerarPortada() {
        AppState.portadaData = { titulo:'',subtitulo:'',cliente:'',direccion:'',cp:'',localidad:'',provincia:'',referencia:'',anio:'' };
        this.renderPortada();
        this.showToast('Datos regenerados desde el formulario', 'success');
    },

    _buildPortadaHtml(pvFn) {
        return `<div style="min-height:1123px;width:794px;background:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;font-family:'Inter',Arial,sans-serif">
  <div style="display:flex;height:5px"><i style="width:120px;background:#d32525;display:block"></i><i style="flex:1;background:#2f5aa6;display:block"></i></div>
  <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:46px 60px 0">
    <img src="imagenes/clauger-color.png" style="height:30px;object-fit:contain;display:block" alt="CLAUGER">
    <div style="text-align:right;font-size:10px;line-height:1.7;letter-spacing:.05em;text-transform:uppercase;color:#8b93a7">
      ${pvFn('referencia')?`<b style="display:block;color:#515b73;font-weight:700;font-size:11px">${pvFn('referencia')}</b>`:''}Informe técnico${pvFn('anio')?' &middot; '+pvFn('anio'):''}
    </div>
  </div>
  <img src="imagenes/clauger-macaron-faint.png" style="position:absolute;top:120px;right:-70px;width:430px;opacity:.5" alt="">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:0 60px;position:relative;z-index:1">
    <div style="font-size:11px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#2f5aa6">Informe técnico reglamentario</div>
    <div style="font-size:46px;font-weight:800;line-height:1.06;letter-spacing:-.02em;color:#1a2744;margin-top:22px">${pvFn('titulo')}</div>
    <div style="font-size:16px;color:#515b73;margin-top:16px">${pvFn('subtitulo')}</div>
    <div style="display:flex;align-items:center;gap:14px;margin:32px 0 40px">
      <i style="width:60px;height:3px;background:#2f5aa6;display:block"></i>
      <span style="font-weight:700;color:#2f5aa6;font-size:20px;line-height:1">&#8600;</span>
    </div>
    <div style="border:1px solid #d9dee9;border-radius:10px;padding:26px 30px;max-width:430px">
      <div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#2f5aa6;font-weight:700;margin-bottom:14px">Datos del cliente</div>
      ${pvFn('cliente')?`<div style="font-size:18px;font-weight:700;color:#1a2744">${pvFn('cliente')}</div>`:''}
      ${pvFn('direccion')?`<div style="font-size:13px;color:#515b73;line-height:1.6;margin-top:6px">${pvFn('direccion')}</div>`:''}
      ${(pvFn('cp')||pvFn('localidad'))?`<div style="font-size:13px;color:#515b73;line-height:1.6">${[pvFn('cp'),pvFn('localidad')].filter(Boolean).join(' &mdash; ')}</div>`:''}
      ${pvFn('provincia')?`<div style="font-size:13px;color:#515b73;line-height:1.6">${pvFn('provincia')}</div>`:''}
      <div style="display:flex;gap:30px;margin-top:20px;padding-top:18px;border-top:1px solid #e7eaf1">
        ${pvFn('referencia')?`<div><div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#8b93a7;font-weight:700">Referencia</div><div style="font-size:14px;font-weight:700;color:#1a2744;margin-top:4px">${pvFn('referencia')}</div></div>`:''}
        ${pvFn('anio')?`<div><div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#8b93a7;font-weight:700">Año</div><div style="font-size:14px;font-weight:700;color:#1a2744;margin-top:4px">${pvFn('anio')}</div></div>`:''}
      </div>
    </div>
  </div>
  <div style="padding:18px 60px 40px">
    <div style="border-top:1px solid #e7eaf1;padding-top:16px;display:flex;justify-content:space-between;font-size:10px;color:#8b93a7;letter-spacing:.04em">
      <span><b style="color:#515b73">CLAUGER Refrigeración Iberia S.A.</b> &middot; Empresa Frigorista Autorizada</span>
      <span>Documento confidencial</span>
    </div>
  </div>
</div>`;
    },

    _buildContraportadaHtml(pvFn, contraTexto) {
        const escaped = (contraTexto||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        return `<div style="min-height:1123px;width:794px;background:#fff;display:flex;flex-direction:column;font-family:'Inter',Arial,sans-serif">
  <div style="display:flex;height:5px"><i style="width:120px;background:#d32525;display:block"></i><i style="flex:1;background:#2f5aa6;display:block"></i></div>
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 60px;text-align:center">
    <img src="imagenes/clauger-macaron-color.png" style="width:78px;object-fit:contain;display:block;margin-bottom:30px" alt="CLAUGER">
    <div style="font-size:24px;font-weight:700;color:#1a2744;line-height:1.3;max-width:440px;letter-spacing:-.02em;white-space:pre-line">${escaped}</div>
    <div style="width:60px;height:3px;background:#2f5aa6;margin:34px auto"></div>
    <div style="display:flex;gap:64px;justify-content:center;text-align:left">
      <div>
        <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#2f5aa6;font-weight:700;margin-bottom:10px">Contacto</div>
        <div style="font-size:13px;color:#515b73;line-height:1.7"><b style="color:#1a2744">CLAUGER Refrigeración Iberia S.A.</b><br>Empresa Frigorista Autorizada<br>www.clauger.com</div>
      </div>
      ${pvFn('referencia')?`<div>
        <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#2f5aa6;font-weight:700;margin-bottom:10px">Documento</div>
        <div style="font-size:13px;color:#515b73;line-height:1.7">Ref. <b style="color:#1a2744">${pvFn('referencia')}</b>${pvFn('anio')?`<br>Emitido en ${pvFn('anio')}`:''}<br>Confidencial — uso del cliente</div>
      </div>`:''}
    </div>
  </div>
  <div style="padding:22px 60px 40px">
    <div style="border-top:1px solid #e7eaf1;padding-top:16px;display:flex;justify-content:space-between;font-size:10px;color:#8b93a7;letter-spacing:.04em">
      <span><b style="color:#515b73">CLAUGER Refrigeración Iberia S.A.</b></span>
      <span>www.clauger.com &middot; Documento confidencial</span>
    </div>
  </div>
</div>`;
    },

    _buildPreviewSrcdoc(innerHtml) {
        const base = window.location.href;
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><base href="${base}"><style>*{margin:0;padding:0;box-sizing:border-box}body{margin:0;padding:0;background:#fff}</style></head><body>${innerHtml}</body></html>`;
    },

    renderIndice() {
        const workspace = document.getElementById('workspace');

        const defaultItems = [
            { key: 'acta',         label: 'ACTA'                              },
            { key: 'equipos',      label: 'CERTIFICADO EQUIPOS A PRESIÓN'      },
            { key: 'valvulas',     label: 'CERTIFICADO VÁLVULAS DE SEGURIDAD'  },
            { key: 'detectores',   label: 'CERTIFICADO DETECTOR'               },
            { key: 'termografia',  label: 'TERMOGRAFÍA'                        },
            { key: 'planificacion',label: 'PLANIFICACIÓN'                      }
        ];

        const _VALID_KEYS = ['acta','equipos','valvulas','detectores','termografia','planificacion'];
        const _LABEL_KEY_MAP = { 'ACTA':'acta','CERTIFICADO EQUIPOS A PRESIÓN':'equipos','CERTIFICADO VÁLVULAS DE SEGURIDAD':'valvulas','CERTIFICADO DETECTOR':'detectores','TERMOGRAFÍA':'termografia','PLANIFICACIÓN':'planificacion' };
        if (!AppState.indiceData.items || AppState.indiceData.items.length === 0) {
            AppState.indiceData.items = defaultItems.map((i, n) => ({...i, num: String(n + 1)}));
        } else {
            AppState.indiceData.items.forEach((item, idx) => {
                if (!item.key || !_VALID_KEYS.includes(item.key)) {
                    item.key = _LABEL_KEY_MAP[(item.label||'').toUpperCase().trim()] || 'custom_' + idx;
                }
                item.num = String(idx + 1);
            });
        }
        const items = AppState.indiceData.items;

        const filas = items.map((item, idx) => `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.7rem 1rem;border-bottom:1px solid #e5e7eb;background:${idx%2===0?'white':'#f9fafb'}">
                <div style="display:flex;flex-direction:column;gap:2px;flex-shrink:0">
                    <button onclick="App.moveIndiceItem(${idx},-1)" ${idx===0?'disabled':''} style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:3px;width:22px;height:18px;cursor:pointer;font-size:10px;line-height:1;${idx===0?'opacity:0.3;':''}display:flex;align-items:center;justify-content:center">▲</button>
                    <button onclick="App.moveIndiceItem(${idx},1)" ${idx===items.length-1?'disabled':''} style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:3px;width:22px;height:18px;cursor:pointer;font-size:10px;line-height:1;${idx===items.length-1?'opacity:0.3;':''}display:flex;align-items:center;justify-content:center">▼</button>
                </div>
                <input value="${item.label}" data-indice="${idx}" data-indice-field="label"
                    style="flex:1;border:none;background:transparent;font-size:0.92rem;font-weight:500;color:#1f2937;outline:none;padding:0.15rem 0.3rem;border-radius:3px"
                    onfocus="this.style.background='#eff6ff'" onblur="this.style.background='transparent'">
                <div style="display:flex;align-items:center;gap:0.5rem;flex-shrink:0">
                    <span style="color:#9ca3af;font-size:0.8rem">Sección</span>
                    <span style="width:28px;text-align:center;font-size:0.9rem;font-weight:700;color:#374151">${item.num}</span>
                    <button onclick="App.removeIndiceItem(${idx})" style="background:#fee2e2;color:#ef4444;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:0.9rem;line-height:1;display:flex;align-items:center;justify-content:center">×</button>
                </div>
            </div>`).join('');

        workspace.innerHTML = `
        <div class="section-card" style="padding:0">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;background:#f9fafb">
                <span style="font-weight:600;color:#374151">${ic('list')} Índice de documentos</span>
                <div style="display:flex;gap:0.5rem;align-items:center">
                    <select id="new-indice-key" style="font-size:0.82rem;border:1px solid #d1d5db;border-radius:5px;padding:4px 8px;background:white;color:#374151;max-width:260px">
                        <option value="acta">ACTA</option>
                        <option value="equipos">CERTIFICADO EQUIPOS A PRESIÓN</option>
                        <option value="valvulas">CERTIFICADO VÁLVULAS DE SEGURIDAD</option>
                        <option value="detectores">CERTIFICADO DETECTOR</option>
                        <option value="termografia">TERMOGRAFÍA</option>
                        <option value="planificacion">PLANIFICACIÓN</option>
                    </select>
                    <button class="add-vs-btn" onclick="App.addIndiceItem()" style="margin:0">${ic('plus')} Añadir</button>
                </div>
            </div>
            <div style="padding:1rem 1.5rem;background:#fffbeb;border-bottom:1px solid #fde68a;font-size:0.8rem;color:#92400e">
                ${ic('zap')} Las secciones eliminadas no aparecerán en el PDF. El orden aquí determina el orden en el informe.
            </div>

            <!-- Preview índice -->
            <div style="padding:2rem;background:#f3f4f6;display:flex;justify-content:center">
                <div style="width:595px;min-height:842px;background:white;box-shadow:0 4px 24px rgba(0,0,0,0.13);display:flex;flex-direction:column;font-family:'Segoe UI',Arial,sans-serif;overflow:hidden">

                    <div style="background:#1a2744;height:12px;width:100%"></div>

                    <div style="padding:2.5rem 2.5rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #e5e7eb">
                        <img src="imagenes/clauger-logo-white.png" style="height:40px;object-fit:contain" alt="CLAUGER">
                        <div style="font-size:0.7rem;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.1em">ÍNDICE DE DOCUMENTOS</div>
                    </div>

                    <div style="padding:2rem 2.5rem;flex:1">
                        <div id="indice-lista" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden">
                            ${filas}
                        </div>
                    </div>

                    <div style="background:#1a2744;height:8px;width:100%"></div>
                </div>
            </div>
        </div>`;

        workspace.querySelectorAll('input[data-indice]').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx   = parseInt(e.target.dataset.indice);
                const field = e.target.dataset.indiceField;
                AppState.indiceData.items[idx][field] = e.target.value;
            });
        });
    },

    addIndiceItem() {
        const PREDEFINED = {
            acta: 'ACTA',
            equipos: 'CERTIFICADO EQUIPOS A PRESIÓN',
            valvulas: 'CERTIFICADO VÁLVULAS DE SEGURIDAD',
            detectores: 'CERTIFICADO DETECTOR',
            termografia: 'TERMOGRAFÍA',
            planificacion: 'PLANIFICACIÓN'
        };
        const sel = document.getElementById('new-indice-key');
        const key = sel ? sel.value : 'acta';
        const label = PREDEFINED[key] || key;
        const n = AppState.indiceData.items.length + 1;
        AppState.indiceData.items.push({ key, label, num: String(n) });
        this.renderIndice();
    },

    removeIndiceItem(idx) {
        AppState.indiceData.items.splice(idx, 1);
        this.renderIndice();
    },

    moveIndiceItem(idx, direction) {
        const items = AppState.indiceData.items;
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= items.length) return;
        [items[idx], items[newIdx]] = [items[newIdx], items[idx]];
        this.renderIndice();
    },

    renderContraportada() {
        const workspace = document.getElementById('workspace');
        const defaults  = this._getPortadaDefaults();
        const d         = AppState.portadaData;
        const v = (key) => d[key] || defaults[key] || '';
        const defaultTexto = AppState.contraportadaData.texto ||
`CLAUGER REFRIGERACIÓN IBERIA S.A.
Empresa Frigorista Autorizada

Para cualquier consulta o información adicional relacionada con este informe, no dude en ponerse en contacto con nuestro departamento técnico.

www.clauger.com`;

        workspace.innerHTML = `
        <div class="section-card" style="padding:0">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;background:#f9fafb">
                <span style="font-weight:600;color:#374151">${ic('file')} Contraportada</span>
                <span style="font-size:0.8rem;color:#9ca3af">Edita el texto libremente</span>
            </div>
            <div style="padding:2rem;background:#e8e8e8;display:flex;gap:2rem;align-items:flex-start">
                <div style="width:260px;flex-shrink:0;background:#fff;border-radius:8px;padding:1.2rem;box-shadow:0 1px 4px rgba(0,0,0,.1)">
                    <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:0.8rem">Texto de contraportada</div>
                    <textarea id="contra-texto" class="form-input"
                        style="width:100%;min-height:280px;font-size:0.85rem;line-height:1.7;resize:vertical"
                        placeholder="Texto de contraportada...">${defaultTexto}</textarea>
                </div>
                <div style="overflow:hidden;width:516px;height:730px;flex-shrink:0">
                    <iframe id="contra-preview-frame"
                        style="width:794px;height:1123px;border:none;transform:scale(0.65);transform-origin:top left;pointer-events:none">
                    </iframe>
                </div>
            </div>
        </div>`;

        const frame = document.getElementById('contra-preview-frame');
        if (frame) frame.srcdoc = this._buildPreviewSrcdoc(this._buildContraportadaHtml(v, defaultTexto));

        document.getElementById('contra-texto').addEventListener('input', (e) => {
            AppState.contraportadaData.texto = e.target.value;
            const pvFn = (k) => AppState.portadaData[k] || defaults[k] || '';
            const fr = document.getElementById('contra-preview-frame');
            if (fr) fr.srcdoc = this._buildPreviewSrcdoc(this._buildContraportadaHtml(pvFn, e.target.value));
        });
    },

    _pdfDropZoneHtml(dropType, clickFn) {
        return `<div id="dropzone-${dropType}"
            style="border:2px dashed #d1d5db;border-radius:0.75rem;padding:2rem;text-align:center;cursor:pointer;background:#fafafa;transition:border-color .15s,background .15s;margin-bottom:1.5rem"
            onclick="${clickFn}">
            <div style="margin-bottom:0.5rem;pointer-events:none">${ic('file')}</div>
            <div style="font-size:0.9rem;color:#374151;font-weight:600;pointer-events:none">Arrastra los PDF aquí o haz clic</div>
            <div style="font-size:0.75rem;color:#9ca3af;margin-top:0.35rem;pointer-events:none">Se admiten varios archivos a la vez</div>
        </div>`;
    },

    _setupDropZone(dropType, renderFn) {
        const zone = document.getElementById('dropzone-' + dropType);
        if (!zone) return;
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.borderColor = '#2f5aa6';
            zone.style.background = '#eff6ff';
        });
        zone.addEventListener('dragleave', () => {
            zone.style.borderColor = '#d1d5db';
            zone.style.background = '#fafafa';
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.borderColor = '#d1d5db';
            zone.style.background = '#fafafa';
            const files = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
            if (!files.length) { this.showToast('Solo se admiten archivos PDF', 'error'); return; }
            files.forEach(f => this._storePdf(f, dropType, renderFn));
        });
    },

    _storePdf(file, storeKey, renderFn) {
        const reader = new FileReader();
        reader.onload = (e) => {
            AppState[storeKey].push({ name: file.name, data: e.target.result, size: file.size, timestamp: new Date().toISOString() });
            renderFn();
            this.showToast(`${file.name} adjuntado`, 'success');
        };
        reader.readAsDataURL(file);
    },

    _downloadPdf(data, name) {
        const a = document.createElement('a');
        a.href = data;
        a.download = name;
        a.click();
    },

    async _pdfToImages(dataUrl, scale = 3) {
        if (!window.pdfjsLib) {
            await new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                s.onload = () => {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    resolve();
                };
                s.onerror = reject;
                document.head.appendChild(s);
            });
        }
        const b64 = dataUrl.split(',')[1];
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        const pdf = await window.pdfjsLib.getDocument({ data: arr }).promise;
        const imgs = [];
        for (let p = 1; p <= pdf.numPages; p++) {
            const page = await pdf.getPage(p);
            const vp = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.width = vp.width;
            canvas.height = vp.height;
            await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
            imgs.push(canvas.toDataURL('image/jpeg', 0.95));
        }
        return imgs;
    },

    _pdfFilaHtml(pdf, idx, downloadFn, removeFn) {
        return `<div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;border:1px solid #e5e7eb;border-radius:0.5rem;background:#f9fafb;margin-bottom:0.6rem">
            <span style="flex-shrink:0">${ic('file')}</span>
            <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:0.875rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${pdf.name}">${pdf.name}</div>
                <div style="font-size:0.75rem;color:#6b7280">${(pdf.size/1024).toFixed(0)} KB · ${new Date(pdf.timestamp).toLocaleDateString('es-ES')}</div>
            </div>
            <button onclick="${downloadFn}(${idx})" style="background:#2f5aa6;color:#fff;border:none;border-radius:0.375rem;padding:0.35rem 0.75rem;font-size:0.8rem;cursor:pointer;font-weight:600">⬇ Descargar</button>
            <button onclick="${removeFn}(${idx})" style="background:#ef4444;color:#fff;border:none;border-radius:0.375rem;padding:0.35rem 0.6rem;font-size:1rem;cursor:pointer;font-weight:700;line-height:1">×</button>
        </div>`;
    },

    renderCertPsv() {
        const workspace = document.getElementById('workspace');
        const archivos = AppState.certPsvArchivos;
        const lista = archivos.length === 0
            ? '<p style="color:#9ca3af;font-size:0.875rem;text-align:center;padding:1rem 0">Sin archivos adjuntos</p>'
            : archivos.map((pdf, idx) => this._pdfFilaHtml(pdf, idx, 'App.viewCertPsv', 'App.removeCertPsv')).join('');
        workspace.innerHTML = `
            <div class="section-card">
                <div class="section-title">${ic('paperclip')} Certificado PSV</div>
                ${this._pdfDropZoneHtml('certPsv', 'App.uploadCertPsv()')}
                ${lista}
            </div>`;
        this._setupDropZone('certPsv', () => this.renderCertPsv());
    },

    uploadCertPsv() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        input.multiple = true;
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(f => this._storePdf(f, 'certPsvArchivos', () => this.renderCertPsv()));
        };
        input.click();
    },

    viewCertPsv(idx) {
        const pdf = AppState.certPsvArchivos[idx];
        if (pdf) this._downloadPdf(pdf.data, pdf.name);
    },

    removeCertPsv(idx) {
        if (confirm('¿Eliminar este archivo?')) {
            AppState.certPsvArchivos.splice(idx, 1);
            this.renderCertPsv();
            this.showToast('Archivo eliminado', 'success');
        }
    },

    renderActaInicial() {
        const workspace = document.getElementById('workspace');
        const archivos = AppState.actaInicialArchivos;
        const lista = archivos.length === 0
            ? '<p style="color:#9ca3af;font-size:0.875rem;text-align:center;padding:1rem 0">Sin archivos adjuntos</p>'
            : archivos.map((pdf, idx) => this._pdfFilaHtml(pdf, idx, 'App.viewActaInicial', 'App.removeActaInicial')).join('');
        workspace.innerHTML = `
            <div class="section-card">
                <div class="section-title">${ic('clipboard')} Acta</div>
                ${this._pdfDropZoneHtml('actaInicial', 'App.uploadActaInicial()')}
                ${lista}
            </div>`;
        this._setupDropZone('actaInicial', () => this.renderActaInicial());
    },

    uploadActaInicial() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/pdf';
        input.multiple = true;
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(f => this._storePdf(f, 'actaInicialArchivos', () => this.renderActaInicial()));
        };
        input.click();
    },

    viewActaInicial(idx) {
        const pdf = AppState.actaInicialArchivos[idx];
        if (pdf) this._downloadPdf(pdf.data, pdf.name);
    },

    removeActaInicial(idx) {
        if (confirm('¿Eliminar este archivo?')) {
            AppState.actaInicialArchivos.splice(idx, 1);
            this.renderActaInicial();
            this.showToast('Archivo eliminado', 'success');
        }
    },

    // ─── TERMOGRAFÍA ───────────────────────────────────────────────────────────

    _termoImgCache: {},

    _TERMO_PAL: {
        frioCalor: [[0,[30,30,120]],[.33,[0,80,255]],[.5,[0,200,200]],[.66,[255,200,0]],[1,[255,30,0]]]
    },

    _termoPalColor(pal, t) {
        const stops = this._TERMO_PAL[pal] || this._TERMO_PAL.frioCalor;
        t = Math.max(0, Math.min(1, t));
        let lo = stops[0], hi = stops[stops.length - 1];
        for (let i = 0; i < stops.length - 1; i++) {
            if (t >= stops[i][0] && t <= stops[i+1][0]) { lo = stops[i]; hi = stops[i+1]; break; }
        }
        const f = lo[0] === hi[0] ? 0 : (t - lo[0]) / (hi[0] - lo[0]);
        return [
            Math.round(lo[1][0] + f*(hi[1][0]-lo[1][0])),
            Math.round(lo[1][1] + f*(hi[1][1]-lo[1][1])),
            Math.round(lo[1][2] + f*(hi[1][2]-lo[1][2]))
        ];
    },

    _termoPalImg(pal, w=54, h=16) {
        const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
        const ctx = cv.getContext('2d'), grd = ctx.createLinearGradient(0,0,w,0);
        this._TERMO_PAL[pal].forEach(([p,rgb]) => grd.addColorStop(p, `rgb(${rgb})`));
        ctx.fillStyle = grd; ctx.fillRect(0,0,w,h);
        return cv.toDataURL();
    },

    _termoReprocess(idx) {
        const p = AppState.termografiaData[idx];
        const orig = this._termoImgCache[idx];
        if (!orig) return;
        const cv = document.getElementById('termo-canvas-' + idx);
        if (!cv) return;
        cv.width = orig.width; cv.height = orig.height;
        const ctx = cv.getContext('2d');
        const src = orig.data;
        const out = ctx.createImageData(cv.width, cv.height);
        const od = out.data;
        const br = p.brightness || 0, ct = (p.contrast || 100) / 100;
        const tMin = p.tMin !== undefined ? p.tMin : 0;
        const tMax = p.tMax !== undefined ? p.tMax : 100;
        const tr = tMax - tMin;
        for (let i = 0; i < src.length; i += 4) {
            let l = 0.299*src[i] + 0.587*src[i+1] + 0.114*src[i+2];
            l = Math.max(0, Math.min(255, (l - 128)*ct + 128 + br));
            const n = tr > 0 ? (l/255*100 - tMin) / tr : 0.5;
            const [r, g, b] = this._termoPalColor(p.palette || 'frioCalor', n);
            od[i] = r; od[i+1] = g; od[i+2] = b; od[i+3] = 255;
        }
        ctx.putImageData(out, 0, 0);
        const dataUrl = cv.toDataURL('image/jpeg', 0.95);
        AppState.termografiaData[idx]._processedImg = dataUrl;
        // Update the visible img element
        const imgEl = document.getElementById('termo-img-' + idx);
        if (imgEl) imgEl.src = dataUrl;
    },

    _termoDrawScale(idx) {
        const p = AppState.termografiaData[idx];
        const cv = document.getElementById('termo-scale-' + idx);
        if (!cv) return;
        const ctx = cv.getContext('2d'), H = cv.height, W = cv.width;
        const grd = ctx.createLinearGradient(0, 0, 0, H);
        this._TERMO_PAL[p.palette || 'frioCalor'].slice().reverse().forEach(([pos, rgb]) => grd.addColorStop(pos, `rgb(${rgb})`));
        ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
        // labels
        const tMin = p.tMin !== undefined ? p.tMin : 0;
        const tMax = p.tMax !== undefined ? p.tMax : 100;
        const el = document.getElementById('termo-scale-max-' + idx);
        const el2 = document.getElementById('termo-scale-min-' + idx);
        if (el) el.textContent = tMax + '°C';
        if (el2) el2.textContent = tMin + '°C';
    },

    _termoDrawPC(idx) {
        const p = AppState.termografiaData[idx];
        const res = p.resultados;
        if (!res) return;
        const cv = document.getElementById('termo-pc-' + idx);
        if (!cv) return;
        const dpr = window.devicePixelRatio || 1;
        cv.width = cv.offsetWidth * dpr; cv.height = cv.offsetHeight * dpr;
        const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
        const w = cv.offsetWidth, h = cv.offsetHeight;
        const Ta = res.Tamb, HR = res.HR, Tr = res.Tr, Ts = res.Ts;
        const wR = (T, rh) => { const Ps = 0.6108*Math.exp(17.27*T/(T+237.3)), Pw=(rh/100)*Ps; return 0.622*Pw/(101.325-Pw); };
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, w, h);
        const pad = {l:38, r:14, t:14, b:26};
        const cW = w-pad.l-pad.r, cH = h-pad.t-pad.b;
        const Tn = Math.min(Tr-5, Ts-5, -5), Tx = Math.max(Ta+5, 35);
        const xS = t => pad.l + ((t-Tn)/(Tx-Tn))*cW;
        const wMx = wR(Ta, HR !== null && HR !== undefined ? Math.min(HR, 100) : 50) * 1.65;
        const wToY = v => pad.t + (1-(v/wMx))*cH;
        // grid
        ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
        for (let T = Math.ceil(Tn/5)*5; T <= Tx; T += 5) {
            ctx.beginPath(); ctx.moveTo(xS(T), pad.t); ctx.lineTo(xS(T), pad.t+cH); ctx.stroke();
            ctx.fillStyle = '#9ca3af'; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(T+'°', xS(T), pad.t+cH+14);
        }
        // saturation curve
        const sat = [];
        for (let T = Tn; T <= Tx; T += 0.5) sat.push({T, w: wR(T, 100)});
        ctx.beginPath();
        sat.forEach((pt, i) => { const x=xS(pt.T),y=wToY(pt.w); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
        ctx.lineTo(xS(Tx), wToY(0)); ctx.lineTo(xS(Tn), wToY(0)); ctx.closePath();
        const grd = ctx.createLinearGradient(0, pad.t, 0, pad.t+cH);
        grd.addColorStop(0, 'rgba(0,178,255,0.12)'); grd.addColorStop(1, 'rgba(0,178,255,0.02)');
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath();
        sat.forEach((pt, i) => { const x=xS(pt.T),y=wToY(pt.w); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
        ctx.strokeStyle = '#00B2FF'; ctx.lineWidth = 1.5; ctx.stroke();
        // RH curves
        [25, 50, 75].forEach(rh => {
            ctx.beginPath(); let f = true;
            for (let T = Tn; T <= Tx; T += 0.5) {
                const y = wToY(wR(T, rh)); if (y < pad.t) continue;
                f ? ctx.moveTo(xS(T), y) : ctx.lineTo(xS(T), y); f = false;
            }
            ctx.strokeStyle = 'rgba(0,178,255,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
        });
        // Points
        const xA = xS(Ta), yA = wToY(wR(Ta, HR));
        ctx.beginPath(); ctx.arc(xA, yA, 4, 0, Math.PI*2); ctx.fillStyle = '#00B2FF'; ctx.fill();
        ctx.fillStyle = '#00B2FF'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Aire', xA, yA-7);
        const xD = xS(Tr), yD = wToY(wR(Tr, 100));
        ctx.beginPath(); ctx.arc(xD, yD, 4, 0, Math.PI*2); ctx.fillStyle = '#E8002D'; ctx.fill();
        ctx.fillStyle = '#E8002D'; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Trocío', xD, yD+11);
        ctx.beginPath(); ctx.moveTo(xA, yA); ctx.lineTo(xD, yD);
        ctx.strokeStyle = 'rgba(232,0,45,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
        const tc = Ts<=Tr?'#E8002D':Ts<=Tr+2?'#f59e0b':'#10b981', xT=xS(Ts), yB=pad.t+cH;
        ctx.beginPath(); ctx.moveTo(xT, yB+3); ctx.lineTo(xT-5, yB+10); ctx.lineTo(xT+5, yB+10); ctx.closePath(); ctx.fillStyle=tc; ctx.fill();
        ctx.fillStyle=tc; ctx.font='bold 8px sans-serif'; ctx.textAlign='center'; ctx.fillText('Ts', xT, yB+20);
        ctx.beginPath(); ctx.moveTo(xT, pad.t); ctx.lineTo(xT, yB); ctx.strokeStyle=tc+'55'; ctx.lineWidth=1; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
    },

    _termoPCToDataUrl(res, forPdf = false) {
        const W = forPdf ? 1000 : 500, H = forPdf ? 300 : 500;
        const fSm = forPdf ? 15 : 9, fBold = forPdf ? 16 : 9;
        const dotR = forPdf ? 9 : 5, triW = forPdf ? 9 : 5, triH = forPdf ? 15 : 8;
        const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
        const ctx = cv.getContext('2d');
        const Ta = res.Tamb, HR = res.HR, Tr = res.Tr, Ts = res.Ts;
        const wR = (T, rh) => { const Ps = 0.6108*Math.exp(17.27*T/(T+237.3)), Pw=(rh/100)*Ps; return 0.622*Pw/(101.325-Pw); };
        ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, W, H);
        const pad = forPdf ? {l:58, r:44, t:18, b:38} : {l:42, r:16, t:16, b:30};
        const cW = W-pad.l-pad.r, cH = H-pad.t-pad.b;
        const Tn = Math.min(Tr-5, Ts-5, -5), Tx = Math.max(Ta+5, 35);
        const xS = t => pad.l + ((t-Tn)/(Tx-Tn))*cW;
        const wMx = wR(Ta, HR !== null && HR !== undefined ? Math.min(HR, 100) : 50) * 1.65;
        const wToY = v => pad.t + (1-(v/wMx))*cH;
        ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1;
        for (let T = Math.ceil(Tn/5)*5; T <= Tx; T += 5) {
            ctx.beginPath(); ctx.moveTo(xS(T), pad.t); ctx.lineTo(xS(T), pad.t+cH); ctx.stroke();
            ctx.fillStyle = '#9ca3af'; ctx.font = `${fSm}px sans-serif`; ctx.textAlign = 'center';
            ctx.fillText(T+'°C', xS(T), pad.t+cH+(forPdf?20:16));
        }
        const sat = []; for (let T = Tn; T <= Tx; T += 0.5) sat.push({T, w: wR(T, 100)});
        ctx.beginPath(); sat.forEach((pt, i) => { const x=xS(pt.T),y=wToY(pt.w); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
        ctx.lineTo(xS(Tx), wToY(0)); ctx.lineTo(xS(Tn), wToY(0)); ctx.closePath();
        const grd = ctx.createLinearGradient(0,pad.t,0,pad.t+cH); grd.addColorStop(0,'rgba(0,178,255,0.12)'); grd.addColorStop(1,'rgba(0,178,255,0.02)');
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); sat.forEach((pt, i) => { const x=xS(pt.T),y=wToY(pt.w); i===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
        ctx.strokeStyle = '#00B2FF'; ctx.lineWidth = forPdf ? 2.5 : 2; ctx.stroke();
        [25, 50, 75].forEach(rh => {
            ctx.beginPath(); let f = true;
            for (let T = Tn; T <= Tx; T += 0.5) { const y = wToY(wR(T, rh)); if (y < pad.t) continue; f ? ctx.moveTo(xS(T), y) : ctx.lineTo(xS(T), y); f = false; }
            ctx.strokeStyle = 'rgba(0,178,255,0.25)'; ctx.lineWidth = forPdf ? 1.5 : 1; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
            // RH label on right edge
            if (forPdf) {
                const yLbl = wToY(wR(Tx - 1, rh));
                if (yLbl >= pad.t && yLbl <= pad.t+cH) {
                    ctx.fillStyle = 'rgba(0,178,255,0.6)'; ctx.font = `11px sans-serif`; ctx.textAlign = 'left';
                    ctx.fillText(rh+'%', xS(Tx)+4, yLbl+4);
                }
            }
        });
        const xA = xS(Ta), yA = wToY(wR(Ta, HR));
        ctx.beginPath(); ctx.arc(xA, yA, dotR, 0, Math.PI*2); ctx.fillStyle = '#00B2FF'; ctx.fill();
        ctx.fillStyle = '#00B2FF'; ctx.font = `bold ${fBold}px sans-serif`; ctx.textAlign = 'center';
        ctx.fillText(`Aire (${Ta.toFixed(1)}°C, ${HR}%)`, xA, yA-(dotR+5));
        const xD = xS(Tr), yD = wToY(wR(Tr, 100));
        ctx.beginPath(); ctx.arc(xD, yD, dotR, 0, Math.PI*2); ctx.fillStyle = '#E8002D'; ctx.fill();
        ctx.fillStyle = '#E8002D'; ctx.font = `bold ${fBold}px sans-serif`; ctx.textAlign = 'center';
        ctx.fillText(`Trocío (${Tr.toFixed(1)}°C)`, xD, yD+(dotR+14));
        ctx.beginPath(); ctx.moveTo(xA, yA); ctx.lineTo(xD, yD); ctx.strokeStyle = 'rgba(232,0,45,0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
        const tc = Ts<=Tr?'#E8002D':Ts<=Tr+2?'#f59e0b':'#10b981', xT=xS(Ts), yB=pad.t+cH;
        ctx.beginPath(); ctx.moveTo(xT, yB+3); ctx.lineTo(xT-triW, yB+3+triH); ctx.lineTo(xT+triW, yB+3+triH); ctx.closePath(); ctx.fillStyle=tc; ctx.fill();
        ctx.fillStyle=tc; ctx.font=`bold ${fBold}px sans-serif`; ctx.textAlign='center';
        ctx.fillText(`Ts (${Ts.toFixed(1)}°C)`, xT, yB+3+triH+(forPdf?18:13));
        ctx.beginPath(); ctx.moveTo(xT, pad.t); ctx.lineTo(xT, yB); ctx.strokeStyle=tc+'55'; ctx.lineWidth=forPdf?2:1; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
        return cv.toDataURL('image/png');
    },

    importTestoXls(idx) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xls,.xlsx';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => this._parseTestoXls(ev.target.result, idx);
            reader.readAsArrayBuffer(file);
        };
        input.click();
    },

    _parseTestoXls(arrayBuffer, idx) {
        if (typeof XLSX === 'undefined') {
            this.showToast('Librería XLSX no cargada. Comprueba conexión a internet.', 'error');
            return;
        }
        try {
            const wb = XLSX.read(arrayBuffer, {type: 'array'});
            const ws = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(ws, {defval: ''});
            if (!rows.length) { this.showToast('El archivo XLS está vacío', 'error'); return; }

            const keys = Object.keys(rows[0]);
            const nameKey  = keys.find(k => /N[.°º]/.test(k) || k.trim() === 'N.°') || keys[0];
            const tempKey  = keys.find(k => k.includes('Temp') && k.includes('°C') && !k.toLowerCase().includes('refl'));
            const reflKey  = keys.find(k => k.toLowerCase().includes('refl'));
            const emisKey  = keys.find(k => k.toLowerCase().includes('emis'));
            const comentKey = keys.find(k => k.toLowerCase().includes('coment') || k.toLowerCase().includes('comment'));

            const parseNum = v => parseFloat(String(v).replace(',', '.'));

            // Ambient temp from first valid "refl" value
            const tAmb = reflKey ? parseNum(rows[0][reflKey]) : NaN;

            // Extract all points that have a numeric temperature
            const points = rows.map(r => ({
                id:      String(r[nameKey] || '').trim(),
                temp:    tempKey ? parseNum(r[tempKey]) : NaN,
                emis:    emisKey ? parseNum(r[emisKey]) : NaN,
                comment: comentKey ? String(r[comentKey] || '').trim() : ''
            })).filter(p => p.id && !isNaN(p.temp));

            if (!points.length) { this.showToast('No se encontraron puntos con temperatura válida', 'error'); return; }

            // Detect Testo naming conventions
            // CS = Cold Spot, HS = Hot Spot, M = manual point, C = circle, L = line, A = area
            const typeOf = id => {
                if (/^CS\d/i.test(id)) return 'cold';
                if (/^HS\d/i.test(id)) return 'hot';
                if (/^M\d/i.test(id))  return 'manual';
                return 'other';
            };

            AppState.termografiaData[idx]._testoPoints = points;
            AppState.termografiaData[idx]._testoTamb   = isNaN(tAmb) ? null : tAmb;

            // Auto-fill Tamb from reflected temperature
            if (!isNaN(tAmb)) AppState.termografiaData[idx].tamb = tAmb;

            // Auto-assign defaults: CS → Ts, HS → Tin (always)
            const csPoint = points.find(p => /^CS\d/i.test(p.id));
            const hsPoint = points.find(p => /^HS\d/i.test(p.id));
            if (csPoint) AppState.termografiaData[idx].ts  = csPoint.temp;
            if (hsPoint) AppState.termografiaData[idx].tin = hsPoint.temp;

            this.renderTermografia();
            this.showToast(`${points.length} puntos cargados de Testo`, 'success');
            this._doAutosave();
        } catch(e) {
            console.error('Error parsing Testo XLS:', e);
            this.showToast('Error al leer el archivo XLS', 'error');
        }
    },

    applyTestoPoint(idx, field, temp) {
        AppState.termografiaData[idx][field] = temp;
        this.renderTermografia();
    },

    clearTestoImport(idx) {
        delete AppState.termografiaData[idx]._testoPoints;
        delete AppState.termografiaData[idx]._testoTamb;
        this.renderTermografia();
    },

    addTermografia() {
        if (AppState.isLegalMode) {
            AppState.currentTermografia = null;
            this.renderSidebar();
            document.getElementById('workspace').innerHTML = `
                <div class="section-card" style="max-width:540px;margin:3rem auto;text-align:center">
                    <div class="section-title">${ic('plus')} Nueva Termografía</div>
                    <p style="color:#6b7280;font-size:0.9rem;margin-bottom:1.5rem">Selecciona el tipo de registro</p>
                    <div style="display:flex;gap:1.5rem;justify-content:center">
                        <button onclick="App._createTermografia('informe')"
                            style="flex:1;padding:1.2rem 1rem;background:#fff;border:2px solid #1a2744;border-radius:0.75rem;cursor:pointer;font-size:0.95rem;font-weight:700;color:#1a2744;transition:background 0.15s"
                            onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='#fff'">
                            ${ic('file')} Adjuntar Informe
                        </button>
                        <button onclick="App._createTermografia('analisis')"
                            style="flex:1;padding:1.2rem 1rem;background:#fff;border:2px solid #1a2744;border-radius:0.75rem;cursor:pointer;font-size:0.95rem;font-weight:700;color:#1a2744;transition:background 0.15s"
                            onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='#fff'">
                            ${ic('clipboard')} Justificar Deficiencia de Aislamiento
                        </button>
                    </div>
                </div>`;
            return;
        }
        this._createTermografia('analisis');
    },

    _createTermografia(tipo) {
        AppState.termografiaData.push({
            tipo: tipo,
            imagen: null, imagenNombre: '', _processedImg: null,
            equipo: '', observaciones: '',
            fecha: new Date().getFullYear().toString(),
            tin: '', tamb: '', ts: '', hr: 50,
            palette: 'frioCalor', tMin: 0, tMax: 100, brightness: 0, contrast: 100,
            resultados: null,
            informeArchivos: []
        });
        AppState.currentTermografia = AppState.termografiaData.length - 1;
        this.renderSidebar();
        this.renderWorkspace();
        this.showToast('Punto de termografía añadido', 'success');
        this._doAutosave();
    },

    removeTermografia(idx) {
        if (confirm('¿Eliminar este punto de termografía?')) {
            delete this._termoImgCache[idx];
            AppState.termografiaData.splice(idx, 1);
            // Rebuild cache keys
            const newCache = {};
            Object.keys(this._termoImgCache).forEach(k => {
                const ki = parseInt(k);
                if (ki > idx) newCache[ki - 1] = this._termoImgCache[k];
                else if (ki < idx) newCache[ki] = this._termoImgCache[k];
            });
            this._termoImgCache = newCache;
            AppState.currentTermografia = AppState.termografiaData.length > 0 ? Math.min(idx, AppState.termografiaData.length - 1) : null;
            this.renderSidebar();
            this.renderWorkspace();
            this.showToast('Punto eliminado', 'success');
            this._doAutosave();
        }
    },

    updateTermografiaField(idx, field, value) {
        AppState.termografiaData[idx][field] = value;
        if (field === 'equipo') this.renderSidebar();
        if (['palette','tMin','tMax','brightness','contrast'].includes(field)) {
            if (field === 'tMin' || field === 'tMax') {
                AppState.termografiaData[idx][field] = parseFloat(value) || 0;
            } else if (field === 'brightness' || field === 'contrast') {
                AppState.termografiaData[idx][field] = parseInt(value);
            }
            this._termoReprocess(idx);
        }
    },

    uploadTermografiaImagen(idx) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                AppState.termografiaData[idx].imagen = ev.target.result;
                AppState.termografiaData[idx].imagenNombre = file.name;
                AppState.termografiaData[idx]._processedImg = null;
                // Load image into cache
                const img = new Image();
                img.onload = () => {
                    const oc = document.createElement('canvas');
                    oc.width = img.naturalWidth; oc.height = img.naturalHeight;
                    oc.getContext('2d').drawImage(img, 0, 0);
                    this._termoImgCache[idx] = oc.getContext('2d').getImageData(0, 0, oc.width, oc.height);
                    this.renderTermografia();
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    },

    removeTermografiaImagen(idx) {
        AppState.termografiaData[idx].imagen = null;
        AppState.termografiaData[idx].imagenNombre = '';
        AppState.termografiaData[idx]._processedImg = null;
        delete this._termoImgCache[idx];
        this.renderTermografia();
    },

    toggleTermografiaImgPdf(idx) {
        const p = AppState.termografiaData[idx];
        p.imgIncluirEnPdf = p.imgIncluirEnPdf === false;
        this.renderTermografia();
    },

    calcularTermografia(idx) {
        const p = AppState.termografiaData[idx];
        const Tin  = parseFloat(p.tin);
        const Tamb = parseFloat(p.tamb);
        const Ts   = parseFloat(p.ts);
        const HR   = parseFloat(p.hr); // optional

        if ([Tin, Tamb, Ts].some(isNaN)) {
            const missing = [['Tin',Tin],['Tamb',Tamb],['Ts',Ts]].filter(([,v])=>isNaN(v)).map(([k])=>k);
            this.showToast(`Faltan datos: ${missing.join(', ')}`, 'error');
            return;
        }
        if (!isNaN(HR) && (HR < 0 || HR > 100)) { this.showToast('Humedad relativa debe estar entre 0 y 100', 'error'); return; }
        if (Tamb === Tin) { this.showToast('Tamb y Tin no pueden ser iguales', 'error'); return; }

        const I = (Tamb - Ts) / (Tamb - Tin);
        const eff = Math.max(0, Math.min(100, Math.round((1 - I) * 100)));
        const dT = Tamb - Ts;

        let Tr = null, mg = null, cc = null, cr = null;
        if (!isNaN(HR) && HR >= 0 && HR <= 100) {
            const a = 17.62, b = 243.12;
            const alpha = Math.log(HR / 100) + (a * Tamb) / (b + Tamb);
            Tr = (b * alpha) / (a - alpha);
            mg = Ts - Tr;
            if (mg <= 0)      { cr = 'CONDENSA';     cc = 'crit'; }
            else if (mg <= 2) { cr = 'MUY PROBABLE'; cc = 'crit'; }
            else if (mg <= 5) { cr = 'POSIBLE';      cc = 'warn'; }
            else               { cr = 'BAJO';         cc = 'ok'; }
        }

        let sc, st;
        if (I >= 0.6 || cr === 'CONDENSA')           { st = 'CRÍTICO';    sc = 'crit'; }
        else if (I >= 0.35 || cr === 'MUY PROBABLE') { st = 'VIGILANCIA'; sc = 'warn'; }
        else                                          { st = 'OK';         sc = 'ok'; }

        const hrVal = isNaN(HR) ? null : HR;
        AppState.termografiaData[idx].resultados = { I, eff, dT, Tr, mg, cr, cc, st, sc, Tin, Tamb, Ts, HR: hrVal };
        AppState.termografiaData[idx]._pcImg = Tr !== null ? this._termoPCToDataUrl(AppState.termografiaData[idx].resultados, true) : null;
        this.renderTermografia();
        this.showToast('Cálculo realizado', 'success');
        this._doAutosave();
    },

    renderTermografiaInforme(idx) {
        const p = AppState.termografiaData[idx];
        const workspace = document.getElementById('workspace');
        const archivos = p.informeArchivos || [];
        workspace.innerHTML = `
            <div class="section-card" style="max-width:600px">
                <div class="section-title" style="display:flex;justify-content:space-between;align-items:center">
                    <span>${ic('file')} Informe Termografía ${idx + 1}</span>
                    <button onclick="App.removeTermografia(${idx})" style="background:#fee2e2;color:#dc2626;border:none;border-radius:0.5rem;padding:0.35rem 0.75rem;font-size:0.8rem;cursor:pointer">${ic('trash')} Eliminar</button>
                </div>
                <div id="termo-drop-${idx}"
                    ondragover="event.preventDefault();this.style.borderColor='#1a2744';this.style.background='#f0f4ff'"
                    ondragleave="this.style.borderColor='#d1d5db';this.style.background='#fafafa'"
                    ondrop="event.preventDefault();this.style.borderColor='#d1d5db';this.style.background='#fafafa';App._dropTermografiaInforme(event,${idx})"
                    style="border:2px dashed #d1d5db;border-radius:0.75rem;background:#fafafa;padding:2.5rem;text-align:center;cursor:pointer;transition:all 0.2s;margin-bottom:1rem"
                    onclick="App.uploadTermografiaInforme(${idx})">
                    <div style="margin-bottom:0.5rem">${ic('paperclip')}</div>
                    <div style="font-weight:600;color:#374151;margin-bottom:0.25rem">Arrastra PDFs aquí o haz clic para seleccionar</div>
                    <div style="font-size:0.8rem;color:#9ca3af">Se pueden adjuntar varios archivos a la vez</div>
                </div>
                ${archivos.length ? `<div style="display:flex;flex-direction:column;gap:0.5rem">
                    ${archivos.map((f, fi) => `
                        <div style="display:flex;align-items:center;justify-content:space-between;background:#f8fafc;border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.6rem 0.9rem">
                            <span style="font-size:0.875rem;color:#374151">${ic('file')} ${f.name}</span>
                            <button onclick="App.removeTermografiaInforme(${idx},${fi})" style="background:none;border:none;color:#dc2626;cursor:pointer;line-height:1">${ic('trash')}</button>
                        </div>`).join('')}
                </div>` : ''}
            </div>`;
    },

    uploadTermografiaInforme(idx) {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = '.pdf'; input.multiple = true;
        input.onchange = e => this._readTermografiaInformeFiles(Array.from(e.target.files), idx);
        input.click();
    },

    _dropTermografiaInforme(event, idx) {
        const files = Array.from(event.dataTransfer.files).filter(f => f.type === 'application/pdf');
        if (!files.length) return;
        this._readTermografiaInformeFiles(files, idx);
    },

    _readTermografiaInformeFiles(files, idx) {
        if (!files.length) return;
        if (!AppState.termografiaData[idx].informeArchivos) AppState.termografiaData[idx].informeArchivos = [];
        let pending = files.length;
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = ev => {
                AppState.termografiaData[idx].informeArchivos.push({ name: file.name, data: ev.target.result, size: file.size });
                pending--;
                if (pending === 0) { this.renderTermografiaInforme(idx); this._doAutosave(); }
            };
            reader.readAsDataURL(file);
        });
    },

    removeTermografiaInforme(idx, fi) {
        AppState.termografiaData[idx].informeArchivos.splice(fi, 1);
        this.renderTermografiaInforme(idx);
        this._doAutosave();
    },

    renderTermografia() {
        const idx = AppState.currentTermografia;
        if (idx === null || !AppState.termografiaData[idx]) return;
        const p = AppState.termografiaData[idx];
        if (p.tipo === 'informe') { this.renderTermografiaInforme(idx); return; }
        const res = p.resultados;
        const workspace = document.getElementById('workspace');

        const tMin = p.tMin !== undefined ? p.tMin : 0;
        const tMax = p.tMax !== undefined ? p.tMax : 100;

        const imageCol = p.imagen ? `
            <div>
                <label class="form-label">Imagen Termográfica</label>
                <div style="aspect-ratio:4/3;border-radius:8px;border:1px solid #e5e7eb;background:#0a0a0a;overflow:hidden;display:flex;align-items:center;justify-content:center">
                    <canvas id="termo-canvas-${idx}" style="display:none"></canvas>
                    <img id="termo-img-${idx}" src="${p._processedImg || p.imagen}" style="width:100%;height:100%;object-fit:contain;display:block">
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
                    <div>
                        <div style="font-size:10px;font-weight:600;color:#6b7280;text-transform:uppercase;display:flex;justify-content:space-between"><span>Brillo</span><span style="color:#00B2FF">${p.brightness||0}</span></div>
                        <input type="range" min="-80" max="80" value="${p.brightness||0}" oninput="App.updateTermografiaField(${idx},'brightness',this.value)" style="width:100%;height:4px;cursor:pointer;margin-top:4px">
                    </div>
                    <div>
                        <div style="font-size:10px;font-weight:600;color:#6b7280;text-transform:uppercase;display:flex;justify-content:space-between"><span>Contraste</span><span style="color:#00B2FF">${p.contrast||100}%</span></div>
                        <input type="range" min="50" max="200" value="${p.contrast||100}" oninput="App.updateTermografiaField(${idx},'contrast',this.value)" style="width:100%;height:4px;cursor:pointer;margin-top:4px">
                    </div>
                    <div>
                        <div style="font-size:10px;font-weight:600;color:#6b7280;text-transform:uppercase">T mín escala (°C)</div>
                        <input type="number" value="${tMin}" onchange="App.updateTermografiaField(${idx},'tMin',this.value)" style="width:100%;padding:5px 8px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;margin-top:4px">
                    </div>
                    <div>
                        <div style="font-size:10px;font-weight:600;color:#6b7280;text-transform:uppercase">T máx escala (°C)</div>
                        <input type="number" value="${tMax}" onchange="App.updateTermografiaField(${idx},'tMax',this.value)" style="width:100%;padding:5px 8px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;margin-top:4px">
                    </div>
                </div>
                <div style="display:flex;gap:6px;margin-top:8px">
                    <button onclick="App.uploadTermografiaImagen(${idx})" style="flex:1;padding:6px;border-radius:6px;background:#e8f4ff;border:1px solid #b3d9ff;color:#0070b8;font-size:11px;font-weight:600;cursor:pointer">${ic('refresh')} Cambiar imagen</button>
                    <button onclick="App.removeTermografiaImagen(${idx})" style="padding:6px 10px;border-radius:6px;background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer">${ic('trash')}</button>
                    ${AppState.isLegalMode ? `<button onclick="App.toggleTermografiaImgPdf(${idx})" style="padding:6px 10px;border-radius:6px;background:${p.imgIncluirEnPdf===false?'#6b7280':'#16a34a'};color:white;border:none;font-size:11px;font-weight:600;cursor:pointer">${p.imgIncluirEnPdf===false?'PDF ✗':'PDF ✓'}</button>` : ''}
                </div>
            </div>` : `
            <div>
                <label class="form-label">Imagen Termográfica</label>
                <div style="aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;border:2px dashed #d1d5db;border-radius:8px;background:#f9fafb;cursor:pointer" onclick="App.uploadTermografiaImagen(${idx})">
                    <div style="text-align:center;padding:1rem">
                        <div style="margin-bottom:0.5rem">${ic('camera')}</div>
                        <div style="font-size:0.875rem;color:#6b7280;font-weight:600">Adjuntar imagen termográfica</div>
                        <div style="font-size:0.75rem;color:#9ca3af;margin-top:4px">Haz clic para seleccionar</div>
                    </div>
                </div>
            </div>`;

        const bdg = (c,t) => {
            const col = {ok:'#059669',warn:'#d97706',crit:'#dc2626',info:'#0070b8'}[c] || '#374151';
            const bg  = {ok:'rgba(16,185,129,.1)',warn:'rgba(245,158,11,.1)',crit:'rgba(239,68,68,.1)',info:'rgba(0,112,184,.1)'}[c] || '#f3f4f6';
            return `<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;color:${col};background:${bg}">${t}</span>`;
        };

        const resultBlock = res ? (() => {
            const SC = {ok:'#10b981',warn:'#f59e0b',crit:'#ef4444'}[res.sc];
            const SBg = {ok:'linear-gradient(135deg,#f0fdf4,#ecfdf5)',warn:'linear-gradient(135deg,#fffbeb,#fef9ec)',crit:'linear-gradient(135deg,#fef2f2,#fef1f1)'}[res.sc];
            const SBorder = {ok:'rgba(16,185,129,0.25)',warn:'rgba(245,158,11,0.25)',crit:'rgba(239,68,68,0.25)'}[res.sc];
            const ico = {ok:ic('shield'),warn:ic('zap'),crit:ic('zap')}[res.sc];
            const ttl = {ok:'Aislamiento en buen estado',warn:'Requiere vigilancia',crit:'Fallo crítico de aislamiento'}[res.sc];
            const dsc = {ok:'Sin anomalías térmicas significativas detectadas.',warn:'Indicios de degradación o riesgo de condensación. Revisar.',crit:'Aislamiento severamente comprometido. Acción inmediata requerida.'}[res.sc];
            const iCl = res.I<0.15?'ok':res.I<0.35?'info':res.I<0.6?'warn':'crit';
            const iClM = res.I<0.15?'#10b981':res.I<0.35?'#00B2FF':res.I<0.6?'#f59e0b':'#ef4444';

            const metrics = [
                {id:'mI',  lbl:'Índice Aislamiento (I)', val:res.I.toFixed(3),  sub:'I=(Tamb−Ts)/(Tamb−Tin)', col:iClM},
                {id:'mE',  lbl:'Eficiencia aislamiento',  val:res.eff+'%',       sub:'(1−I)×100',              col:res.eff>80?'#10b981':res.eff>55?'#f59e0b':'#ef4444'},
                ...(res.Tr!==null?[{id:'mR', lbl:'Punto de Rocío',      val:res.Tr.toFixed(1)+'°C', sub:'Magnus',   col:'#00B2FF'}]:[]),
                ...(res.mg!==null?[{id:'mM', lbl:'Margen condensación',  val:(res.mg>=0?'+':'')+res.mg.toFixed(1)+'°C', sub:'Ts−Trocío', col:res.mg>2?'#10b981':res.mg>0?'#f59e0b':'#ef4444'}]:[]),
                {id:'mD',  lbl:'ΔTs (Tamb−Ts)',           val:res.dT.toFixed(1)+'°C', sub:'',                col:'#374151'},
                ...(res.cr!==null?[{id:'mC', lbl:'Riesgo condensación',  val:res.cr, sub:'', col:{ok:'#10b981',warn:'#f59e0b',crit:'#ef4444'}[res.cc]}]:[]),
            ].map(m => `
                <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;position:relative;overflow:hidden">
                    <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${m.col};border-radius:10px 10px 0 0"></div>
                    <div style="font-size:9px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">${m.lbl}</div>
                    <div style="font-size:20px;font-weight:700;color:${m.col};line-height:1;margin-bottom:3px">${m.val}</div>
                    ${m.sub ? `<div style="font-size:9px;color:#9ca3af">${m.sub}</div>` : ''}
                </div>`).join('');

            // Gauge bar
            const gCol = res.I<0.15?'#10b981':res.I<0.35?'#84cc16':res.I<0.6?'#f59e0b':'#ef4444';
            const gLbl = res.I<0.15?'Excelente':res.I<0.35?'Aceptable':res.I<0.6?'Deficiente':'Fallo grave';
            const cpPct = res.mg!==null ? Math.max(0, Math.min(97, 100 - (res.mg / 12) * 100)) : null;

            // Recommendations
            const recos = [];
            if (res.cr==='CONDENSA')     recos.push({c:'crit',i:ic('zap'),t:'Condensación activa detectada',d:'Ts bajo punto de rocío. Riesgo inmediato de corrosión bajo aislamiento. Inspeccionar urgente.'});
            if (res.cr==='MUY PROBABLE') recos.push({c:'warn',i:ic('zap'),t:'Riesgo muy alto de condensación',d:`Margen de solo ${res.mg.toFixed(1)}°C. Verificar sellado de vapor y barrera antivapor.`});
            if (res.I>=0.6)              recos.push({c:'crit',i:ic('zap'),t:'Fallo grave del aislamiento',d:`I=${res.I.toFixed(3)}. Pérdida severa de material o daño estructural. Reposición urgente.`});
            else if (res.I>=0.35)        recos.push({c:'warn',i:ic('zap'),t:'Aislamiento deficiente',d:`I=${res.I.toFixed(3)}. Posible humedad absorbida o pérdida de espesor. Planificar revisión.`});
            else if (res.I<0.15)         recos.push({c:'ok', i:ic('shield'),t:'Aislamiento excelente',d:`I=${res.I.toFixed(3)} — rendimiento óptimo. Mantener inspecciones periódicas.`});
            else                          recos.push({c:'ok', i:ic('shield'),t:'Aislamiento aceptable',d:`I=${res.I.toFixed(3)} dentro de rango normal.`});
            if (res.mg!==null && res.mg>5) recos.push({c:'ok', i:ic('thermometer'),t:'Margen de condensación suficiente',d:`${res.mg.toFixed(1)}°C sobre el punto de rocío. Sin riesgo en condiciones actuales.`});
            if (res.HR===null)             recos.push({c:'info'||'ok',i:ic('thermometer'),t:'Humedad relativa no disponible',d:'Sin HR no se calcula punto de rocío ni riesgo de condensación. Introduce HR para análisis completo.'});
            if (res.sc==='crit')           recos.push({c:'crit',i:ic('wrench'),t:'Intervención técnica inmediata',d:'Revisar aislamiento. Medición de espesores con ultrasonidos.'});
            else                            recos.push({c:'ok', i:ic('clipboard'),t:'Mantener registro de inspecciones',d:'Documentar con fecha, condiciones e imagen termográfica.'});
            const recoColors = {ok:{bg:'linear-gradient(135deg,#f0fdf4,#f8fffb)',border:'#10b981'},warn:{bg:'linear-gradient(135deg,#fffbeb,#fffef8)',border:'#f59e0b'},crit:{bg:'linear-gradient(135deg,#fef2f2,#fffafa)',border:'#ef4444'},info:{bg:'linear-gradient(135deg,#eff6ff,#f0f9ff)',border:'#60a5fa'}};
            const recosHtml = recos.map(r => `
                <div style="display:flex;align-items:flex-start;gap:10px;border:1px solid #e5e7eb;border-left:3px solid ${recoColors[r.c].border};border-radius:8px;padding:10px 12px;background:${recoColors[r.c].bg}">
                    <span style="font-size:15px;flex-shrink:0;margin-top:1px">${r.i}</span>
                    <div><div style="font-size:12px;font-weight:600;margin-bottom:2px">${r.t}</div><div style="font-size:11px;color:#6b7280;line-height:1.5">${r.d}</div></div>
                </div>`).join('');

            // Table rows
            const rows = [
                ['T interior (Tin)',          res.Tin.toFixed(1)+' °C',  bdg('info','—')],
                ['T ambiente (Tamb)',          res.Tamb.toFixed(1)+' °C', bdg('info','—')],
                ['T superficie exterior (Ts)', res.Ts.toFixed(1)+' °C',  bdg('info','—')],
                ...(res.HR!==null?[['Humedad relativa (HR)', res.HR.toFixed(0)+' %', bdg('info','—')]]:[]),
                ...(res.Tr!==null?[['Punto de rocío (Trocío)', res.Tr.toFixed(2)+' °C', bdg('info','Magnus')]]:[]),
                ['Índice aislamiento (I)',     res.I.toFixed(4),          bdg(iCl, res.I<0.15?'MUY BUENO':res.I<0.35?'ACEPTABLE':res.I<0.6?'DEFICIENTE':'FALLO')],
                ['ΔTs (Tamb−Ts)',              res.dT.toFixed(2)+' °C',   bdg('info','—')],
                ...(res.mg!==null?[['Margen condensación (Ts−Trocío)', res.mg.toFixed(2)+' °C', bdg(res.cc, res.cr)]]:[]),
                ...(res.cr!==null?[['Riesgo de condensación', res.cr, bdg(res.cc, res.cr)]]:[]),
                ['Eficiencia aislamiento',     res.eff+' %',              bdg(res.eff>80?'ok':res.eff>55?'warn':'crit', res.eff>80?'BUENA':'REDUCIDA')],
                ['Diagnóstico global',         res.st,                    bdg(res.sc, res.st)],
            ];

            // Psychrometric section: only shown if HR available
            const pcSection = p._pcImg ? `
                <div>
                    <div style="font-size:10px;font-weight:700;color:#00B2FF;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #e8f4ff;display:flex;align-items:center;gap:6px"><span style="width:3px;height:14px;background:#00B2FF;border-radius:2px;display:inline-block"></span>Diagrama Psicrométrico</div>
                    <canvas id="termo-pc-${idx}" style="width:100%;aspect-ratio:10/3;border-radius:8px;border:1px solid #e5e7eb;background:#f8fafc;display:block"></canvas>
                    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;margin-top:7px">
                        ${[['Tamb',res.Tamb.toFixed(1),'°C'],['HR',res.HR!==null?res.HR.toFixed(0):'N/D','%'],['Trocío',res.Tr!==null?res.Tr.toFixed(1):'N/D','°C'],['Ts',res.Ts.toFixed(1),'°C']].map(([l,v,u])=>`
                        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:6px;text-align:center">
                            <div style="font-size:8px;font-weight:700;color:#9ca3af;text-transform:uppercase">${l}</div>
                            <div style="font-size:13px;font-weight:700;color:#00B2FF">${v}<span style="font-size:8px;color:#9ca3af">${u}</span></div>
                        </div>`).join('')}
                    </div>
                </div>` : '';

            return `
            <!-- Status Banner -->
            <div style="border-radius:10px;padding:18px 22px;display:flex;align-items:center;gap:14px;margin-top:1.25rem;border:1px solid ${SBorder};background:${SBg};position:relative;overflow:hidden">
                <div style="position:absolute;left:0;top:0;bottom:0;width:4px;background:${SC}"></div>
                <div style="width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;background:${SC}22">${ico}</div>
                <div style="flex:1">
                    <div style="font-size:15px;font-weight:700;margin-bottom:2px;color:${SC}">${ttl}</div>
                    <div style="font-size:12px;color:#6b7280">${dsc}</div>
                </div>
                <span style="font-size:10px;font-weight:700;padding:5px 14px;border-radius:20px;letter-spacing:0.6px;text-transform:uppercase;color:${SC};background:${SC}19;border:1px solid ${SC}33">${res.st}</span>
            </div>

            <!-- Metrics grid -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-top:1rem">${metrics}</div>

            <!-- Gauge -->
            <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;margin-top:1rem">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:12px">
                    <span style="color:#6b7280;font-weight:500">Eficiencia del aislamiento</span>
                    <span style="font-weight:700;font-size:11px">${gLbl} — I = ${res.I.toFixed(3)}</span>
                </div>
                <div style="height:10px;background:#e5e7eb;border-radius:5px;overflow:hidden">
                    <div style="height:100%;width:${Math.min(100,res.I*100)}%;background:${gCol};border-radius:5px;transition:width 1s"></div>
                </div>
                <div style="display:flex;justify-content:space-between;margin-top:3px;font-size:9px;color:#9ca3af"><span>0</span><span>0.35</span><span>0.6</span><span>1.0</span></div>
            </div>

            ${cpPct!==null ? `
            <!-- Condensation bar -->
            <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;margin-top:0.75rem">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:12px">
                    <span style="color:#6b7280;font-weight:500">Riesgo de condensación</span>
                </div>
                <div style="position:relative;height:12px;border-radius:6px;background:linear-gradient(90deg,#10b981,#f59e0b 50%,#ef4444);margin:8px 0 4px">
                    <div style="position:absolute;top:-4px;bottom:-4px;left:${cpPct}%;width:3px;background:#111;border-radius:2px;box-shadow:0 0 6px rgba(0,0,0,0.3)"></div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:9px;color:#9ca3af"><span>Sin riesgo</span><span>Posible</span><span>Condensa</span></div>
                <div style="font-size:11px;color:#374151;margin-top:4px;font-weight:600">${res.cr} (margen: ${res.mg.toFixed(1)}°C)</div>
            </div>` : ''}

            <!-- Two-col: chart + image -->
            <div style="display:grid;grid-template-columns:${pcSection?'1.4fr 1fr':'1fr'};gap:16px;margin-top:1rem;align-items:start">
                ${pcSection}
                <div>
                    <div style="font-size:10px;font-weight:700;color:#00B2FF;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #e8f4ff;display:flex;align-items:center;gap:6px"><span style="width:3px;height:14px;background:#00B2FF;border-radius:2px;display:inline-block"></span>Imagen Termográfica</div>
                    <div style="aspect-ratio:4/3;border-radius:8px;border:1px solid #e5e7eb;background:#0a0a0a;overflow:hidden;display:flex;align-items:center;justify-content:center">
                        ${(p._processedImg || p.imagen) ? `<img src="${p._processedImg || p.imagen}" style="width:100%;height:100%;object-fit:contain">` : `<div style="color:#6b7280;font-size:12px;text-align:center;padding:1rem">Sin imagen</div>`}
                    </div>
                    <div style="display:flex;flex-direction:column;gap:6px;margin-top:12px">${recosHtml}</div>
                </div>
            </div>

            <!-- Data Table -->
            <div style="margin-top:1.25rem">
                <div style="font-size:10px;font-weight:700;color:#00B2FF;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #e8f4ff;display:flex;align-items:center;gap:6px"><span style="width:3px;height:14px;background:#00B2FF;border-radius:2px;display:inline-block"></span>Tabla de Resultados</div>
                <table style="width:100%;border-collapse:collapse;font-size:12px">
                    <thead><tr>
                        <th style="background:#f8fafc;padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:#6b7280;letter-spacing:0.5px;text-transform:uppercase;border-bottom:2px solid #e5e7eb">Parámetro</th>
                        <th style="background:#f8fafc;padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:#6b7280;letter-spacing:0.5px;text-transform:uppercase;border-bottom:2px solid #e5e7eb">Valor</th>
                        <th style="background:#f8fafc;padding:7px 10px;text-align:left;font-size:10px;font-weight:700;color:#6b7280;letter-spacing:0.5px;text-transform:uppercase;border-bottom:2px solid #e5e7eb">Estado</th>
                    </tr></thead>
                    <tbody>${rows.map(row=>`<tr style="border-bottom:1px solid #f3f4f6"><td style="padding:7px 10px;color:#374151">${row[0]}</td><td style="padding:7px 10px;font-family:monospace">${row[1]}</td><td style="padding:7px 10px">${row[2]}</td></tr>`).join('')}</tbody>
                </table>
            </div>`;
        })() : '';

        workspace.innerHTML = `
            <div class="section-card">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.25rem">
                    <div class="section-title" style="margin-bottom:0">${ic('thermometer')} ${p.equipo || 'Punto ' + (idx + 1)}</div>
                    <button onclick="App.removeTermografia(${idx})" style="background:#ef4444;color:#fff;border:none;border-radius:0.375rem;padding:0.4rem 0.9rem;font-size:0.85rem;cursor:pointer;font-weight:600">${ic('trash')} Eliminar</button>
                </div>

                <!-- Equipo + Año -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.25rem">
                    <div class="form-group">
                        <label class="form-label">Equipo / Zona</label>
                        <input class="form-input" value="${p.equipo}" oninput="App.updateTermografiaField(${idx},'equipo',this.value)" placeholder="Ej: Cámara frigorífica">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Año</label>
                        <input class="form-input" value="${p.fecha}" oninput="App.updateTermografiaField(${idx},'fecha',this.value)" placeholder="${new Date().getFullYear()}">
                    </div>
                </div>

                <!-- Dos columnas: imagen izquierda · parámetros derecha -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.25rem;align-items:start">
                    ${imageCol}
                    <div class="form-group" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:0.5rem;padding:1.25rem">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
                            <div style="font-weight:700;font-size:0.9rem;color:#374151">Parámetros Térmicos</div>
                            <button onclick="App.importTestoXls(${idx})" title="Importar XLS exportado desde Testo IRSoft"
                                style="display:flex;align-items:center;gap:5px;padding:5px 10px;background:#fff;border:1.5px solid #2f5aa6;border-radius:6px;color:#2f5aa6;font-size:0.75rem;font-weight:700;cursor:pointer">
                                ${ic('chart')} Importar Testo
                            </button>
                        </div>

                        ${p._testoPoints && p._testoPoints.length ? (() => {
                            const typeOf = id => /^CS\d/i.test(id)?'cold':/^HS\d/i.test(id)?'hot':/^M\d/i.test(id)?'manual':'other';
                            const typeStyle = t => ({
                                cold:   {bg:'#eff6ff',border:'#93c5fd',color:'#2f5aa6',icon:ic('snowflake'),label:'Frío'},
                                hot:    {bg:'#fff7ed',border:'#fdba74',color:'#c2410c',icon:ic('zap'),label:'Caliente'},
                                manual: {bg:'#f0fdf4',border:'#86efac',color:'#15803d',icon:ic('thermometer'),label:'Manual'},
                                other:  {bg:'#f9fafb',border:'#d1d5db',color:'#6b7280',icon:'·',label:'Área'}
                            })[t] || {bg:'#f9fafb',border:'#d1d5db',color:'#6b7280',icon:'·',label:''};

                            const assignedTin = p.tin !== '' && p.tin !== undefined ? p.tin : null;
                            const assignedTs  = p.ts  !== '' && p.ts  !== undefined ? p.ts  : null;

                            const cards = p._testoPoints.map(pt => {
                                const t = typeOf(pt.id);
                                const s = typeStyle(t);
                                const isTin = assignedTin === pt.temp;
                                const isTs  = assignedTs  === pt.temp;
                                return `<div style="background:${s.bg};border:1.5px solid ${isTin||isTs?s.color:s.border};border-radius:8px;padding:8px 10px;position:relative">
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                                        <div style="display:flex;align-items:center;gap:5px">
                                            <span style="font-size:0.9rem">${s.icon}</span>
                                            <span style="font-size:0.8rem;font-weight:700;color:${s.color}">${pt.id}</span>
                                            ${pt.comment ? `<span style="font-size:0.7rem;color:#9ca3af;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${pt.comment}</span>` : ''}
                                        </div>
                                        <span style="font-size:1rem;font-weight:800;color:${s.color}">${pt.temp.toFixed(1)} °C</span>
                                    </div>
                                    <div style="display:flex;gap:4px">
                                        <button onclick="App.applyTestoPoint(${idx},'tin',${pt.temp})"
                                            style="flex:1;padding:3px 6px;border-radius:4px;font-size:0.68rem;font-weight:700;cursor:pointer;border:1.5px solid ${isTin?'#2f5aa6':'#d1d5db'};background:${isTin?'#2f5aa6':'#fff'};color:${isTin?'#fff':'#6b7280'}">
                                            ${isTin?'✓ ':''}→ Temperatura Interior
                                        </button>
                                        <button onclick="App.applyTestoPoint(${idx},'ts',${pt.temp})"
                                            style="flex:1;padding:3px 6px;border-radius:4px;font-size:0.68rem;font-weight:700;cursor:pointer;border:1.5px solid ${isTs?'#2f5aa6':'#d1d5db'};background:${isTs?'#2f5aa6':'#fff'};color:${isTs?'#fff':'#6b7280'}">
                                            ${isTs?'✓ ':''}→ Temperatura Superficie
                                        </button>
                                    </div>
                                </div>`;
                            }).join('');

                            return `<div style="background:#e0f2fe;border:1px solid #7dd3fc;border-radius:8px;padding:8px 10px;margin-bottom:10px">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                                    <span style="font-size:0.78rem;font-weight:700;color:#0369a1">${ic('chart')} Puntos de medición Testo</span>
                                    <button onclick="App.clearTestoImport(${idx})" style="font-size:0.7rem;color:#0369a1;background:none;border:none;cursor:pointer;text-decoration:underline">Limpiar</button>
                                </div>
                                ${p._testoTamb !== null && p._testoTamb !== undefined ? `<div style="font-size:0.72rem;color:#0369a1;margin-bottom:6px">${ic('thermometer')} Temp. reflejada → <strong>Tamb = ${p._testoTamb} °C</strong> (auto-rellenado)</div>` : ''}
                                <div style="font-size:0.72rem;color:#0369a1;margin-bottom:8px">Haz clic en los botones para asignar cada punto a Tin o Ts:</div>
                                <div style="display:flex;flex-direction:column;gap:6px">${cards}</div>
                            </div>`;
                        })() : ''}

                        ${!p._testoPoints ? `
                        <div class="form-group">
                            <label class="form-label">T interior (Tin) °C</label>
                            <input type="number" step="0.1" class="form-input" value="${p.tin}" oninput="App.updateTermografiaField(${idx},'tin',this.value)" placeholder="Ej: -20">
                        </div>
                        <div class="form-group">
                            <label class="form-label">T ambiente (Tamb) °C</label>
                            <input type="number" step="0.1" class="form-input" value="${p.tamb}" oninput="App.updateTermografiaField(${idx},'tamb',this.value)" placeholder="Ej: 25">
                        </div>
                        <div class="form-group">
                            <label class="form-label">T superficie (Ts) °C</label>
                            <input type="number" step="0.1" class="form-input" value="${p.ts}" oninput="App.updateTermografiaField(${idx},'ts',this.value)" placeholder="Ej: 18">
                        </div>
                        ` : ''}
                        <div class="form-group">
                            <label class="form-label">Humedad relativa (%) <span style="font-size:0.72rem;color:#9ca3af;font-weight:400">(opcional)</span></label>
                            <input type="number" step="1" min="0" max="100" class="form-input" value="${p.hr}" oninput="App.updateTermografiaField(${idx},'hr',this.value)" placeholder="Ej: 60 — si se omite no se calcula punto de rocío">
                        </div>
                        <button onclick="App.calcularTermografia(${idx})" style="margin-top:0.5rem;width:100%;background:#2f5aa6;color:#fff;border:none;border-radius:0.5rem;padding:0.6rem 1rem;font-size:0.9rem;font-weight:700;cursor:pointer">
                            ${ic('zap')} Analizar aislamiento
                        </button>
                    </div>
                </div>

                <!-- Observaciones -->
                <div class="form-group">
                    <div style="display:grid;grid-template-columns:${AppState.isLegalMode ? '1fr 1fr' : '1fr'};gap:0.75rem">
                        <div>
                            <label class="form-label">Observaciones - Técnico</label>
                            <textarea class="form-input" rows="4" oninput="App.updateTermografiaField(${idx},'observaciones',this.value)" placeholder="Observaciones adicionales...">${p.observaciones}</textarea>
                        </div>
                        ${AppState.isLegalMode ? `<div>
                            <label class="form-label">Observaciones - Legal</label>
                            <textarea class="form-input" rows="4" oninput="App.updateTermografiaField(${idx},'observacionesLegal',this.value)" placeholder="Observaciones legales...">${p.observacionesLegal||''}</textarea>
                        </div>` : ''}
                    </div>
                </div>

                ${resultBlock}
            </div>`;

        // After DOM update, draw canvases
        requestAnimationFrame(() => {
            if (this._termoImgCache[idx]) this._termoReprocess(idx);
            if (res) this._termoDrawPC(idx);
        });
    },

    // ─── FIN TERMOGRAFÍA ───────────────────────────────────────────────────────

    addCompositeUnit() {
        const equipKey = 'Unidad Compresora';
        if (!AppState.equipmentData[equipKey]) AppState.equipmentData[equipKey] = [];
        
        AppState.equipmentData[equipKey].push({identificador: '', fabricante: '', modelo: '', numSerie: '', subEquipments: {}});
        const newIndex = AppState.equipmentData[equipKey].length - 1;
        AppState.expandedEquipment[`${equipKey}_${newIndex}`] = true;
        
        this.renderCompositeUnitsList();
        this.showToast('Unidad Compresora añadida', 'success');
        if (typeof Tutorial !== 'undefined') Tutorial.onAddCompositeUnit();
    },

    renderCompositeUnitsList() {
        const listContainer = document.getElementById('equipmentList');
        if (!listContainer) return;
        
        const equipKey = 'Unidad Compresora';
        const units = AppState.equipmentData[equipKey] || [];
        
        if (units.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:2rem">No hay unidades añadidas</p>';
            return;
        }
        
        listContainer.innerHTML = units.map((unit, index) => {
            const isExpanded = AppState.expandedEquipment[`${equipKey}_${index}`];
            const typeData = EQUIPMENT_TYPES['Unidad Compresora'];
            
            return `
                <div class="equipment-item">
                    <div class="equipment-header" onclick="App.toggleEquipment('${equipKey}',${index})">
                        <div>
                            <div class="equipment-header-title">${typeData.icon} Unidad Compresora #${index + 1}${unit.identificador ? ` — ${unit.identificador}` : ''}</div>
                            <div class="equipment-summary">${[unit.fabricante, unit.modelo, unit.numSerie].filter(Boolean).join(' <span class="sep">·</span> ')}</div>
                        </div>
                        <div class="equipment-header-controls">
                            <button class="equipment-toggle">${isExpanded ? '▼' : '▶'}</button>
                            <button class="equipment-remove-btn" onclick="event.stopPropagation();App.removeEquipment('${equipKey}',${index})">${ic('trash')} Eliminar</button>
                        </div>
                    </div>
                    <div class="equipment-content ${isExpanded ? 'show' : ''}" id="equipment_${equipKey}_${index}">
                        <div class="form-section">
                            <div class="form-section-title">${ic('clipboard')} Datos Generales</div>
                            <div class="form-row">
                                ${this.createFormFields([
                                    {name: 'Identificador', path: 'identificador'},
                                    {name: 'Fabricante', path: 'fabricante'},
                                    {name: 'Modelo', path: 'modelo'},
                                    {name: 'Nº Serie', path: 'numSerie'}
                                ], [unit.identificador||'', unit.fabricante, unit.modelo, unit.numSerie])}
                            </div>
                        </div>
                        <div class="form-section">
                            <div class="form-section-title">${ic('gear')} Componentes</div>
                            <div class="components-grid">
                                ${typeData.subTypes.map(subType => {
                                    const count = unit.subEquipments[subType]?.length || 0;
                                    return `<button class="component-btn" onclick="App.addSubEquipment('${equipKey}',${index},'${subType}')">${ic('plus')} ${subType} (${count})</button>`;
                                }).join('')}
                            </div>
                        </div>
                        ${Object.keys(unit.subEquipments || {}).map(subType => 
                            unit.subEquipments[subType]?.length > 0 ? `
                                <div class="form-section">
                                    <div class="form-section-title">${ic('package')} ${subType}</div>
                                    ${unit.subEquipments[subType].map((subEquip, subIdx) => 
                                        this.renderSubEquipmentForm(subEquip, equipKey, index, subType, subIdx)
                                    ).join('')}
                                </div>
                            ` : ''
                        ).join('')}
                    </div>
                </div>
            `;
        }).join('');
        
        this.attachFormListeners();
    },

    // ── Servicios (equipos) ───────────────────────────────────────────────────
    addEquipoServicio() {
        const equipKey = 'Servicios';
        if (!AppState.equipmentData[equipKey]) AppState.equipmentData[equipKey] = [];
        AppState.equipmentData[equipKey].push({
            identificador: '', marca: '', modelo: '', numSerie: '', fechaFabricacion: '',
            volumen: '', presionMax: '', presionMin: '', ubicacion: '',
            normativa: '', categoria: '',
            valvulas: {marca:'', modelo:'', sifon:'', items:[]},
            observaciones: '', observacionesLegal: '',
            resultadoForzado: false, certChecklist: [],
            photos: {placa: null, general: null}, imagenes: []
        });
        const newIndex = AppState.equipmentData[equipKey].length - 1;
        AppState.expandedEquipment[`${equipKey}_${newIndex}`] = true;
        this.renderEquipoServiciosList();
        this.showToast('Servicio añadido', 'success');
    },

    renderEquipoServiciosList() {
        const listContainer = document.getElementById('equipmentList');
        if (!listContainer) return;
        const equipKey = 'Servicios';
        const items = AppState.equipmentData[equipKey] || [];
        if (items.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:2rem">No hay servicios añadidos</p>';
            return;
        }
        listContainer.innerHTML = items.map((svc, index) => {
            const isExpanded = AppState.expandedEquipment[`${equipKey}_${index}`];
            const context = {equipKey, index, isSubEquip: false};
            return `
                <div class="equipment-item">
                    <div class="equipment-header" onclick="App.toggleEquipment('${equipKey}',${index})">
                        <div>
                            <div class="equipment-header-title">🔩 Servicio #${index + 1}${svc.identificador ? ` — ${svc.identificador}` : ''}</div>
                            <div class="equipment-summary">${[svc.marca, svc.modelo, svc.numSerie].filter(Boolean).join(' <span class="sep">·</span> ')}</div>
                        </div>
                        <div class="equipment-header-controls">
                            <button class="equipment-toggle">${isExpanded ? '▼' : '▶'}</button>
                            <button class="equipment-remove-btn" onclick="event.stopPropagation();App.removeEquipment('${equipKey}',${index})">${ic('trash')} Eliminar</button>
                        </div>
                    </div>
                    <div class="equipment-content ${isExpanded ? 'show' : ''}" id="equipment_${equipKey}_${index}">
                        <div class="form-section">
                            <div class="form-section-title">${ic('clipboard')} Descripción</div>
                            <div class="ficha-top">
                                <div class="ficha-photo">${this._fichaPhotoSlot(svc.photos?.placa||null, `App.uploadPhoto('${equipKey}',${index},'placa')`, `App.removePhoto('${equipKey}',${index},'placa')`, `App.uploadPhotoCam('${equipKey}',${index},'placa')`)}</div>
                                <div class="ficha-id">${this._buildDsheetServicio(svc, equipKey, index)}</div>
                            </div>
                        </div>
                        <div class="vtab-wrap">${this.renderValvulas(svc.valvulas, context, 'single')}</div>
                        ${AppState.isLegalMode ? this._certBandHtml(svc.resultadoForzado, `App.setResultadoForzado('${equipKey}',${index},'favorable')`, `App.setResultadoForzado('${equipKey}',${index},'desfavorable')`, 'Servicios', 'Servicios', svc.certChecklist || [], `App.setCertChecklist('${equipKey}',${index},`) : ''}
                        <div class="form-section">
                            <div class="form-section-title">${ic('message')} Observaciones</div>
                            ${AppState.isLegalMode ? `
                                <div class="form-row" style="grid-template-columns:1fr 1fr">
                                    ${this.createFormFields([{name: 'Observación - Técnico', type: 'textarea', path: 'observaciones', rows: 4}], [svc.observaciones])}
                                    ${this.createFormFields([{name: 'Observación - Legal', type: 'textarea', path: 'observacionesLegal', rows: 4}], [svc.observacionesLegal||''])}
                                </div>
                            ` : this.createFormFields([{name: 'Observación - Técnico', type: 'textarea', path: 'observaciones', rows: 4}], [svc.observaciones])}
                        </div>
                        ${this.renderPhotoSection(svc.photos || {placa: null, general: null}, context)}
                    </div>
                </div>
            `;
        }).join('');
        this.attachFormListeners();
    },

    renderSubEquipmentForm(subEquip, unitKey, unitIndex, subType, subIdx) {
        const isCompresor = subType === 'Bloque Compresor';
        const isIntercambiador = subType.includes('Enfriador Aceite');
        const template = isIntercambiador ? 'plantilla2' : 'plantilla1';
        const context = {equipKey: unitKey, index: unitIndex, isSubEquip: true, subType, subIdx};
        
        const unit = AppState.equipmentData[unitKey]?.[unitIndex];
        const identifier = unit?.identificador ? ` — ${unit.identificador}` : '';
        const isOtro = subType === 'Otro';
        const subTitle = isOtro ? (subEquip.nombreEquipo || `Otro #${subIdx + 1}`) : `${subType} #${subIdx + 1}${identifier}`;

        return `
            <div style="background:#f9fafb;border:2px solid #e5e7eb;border-radius:0.75rem;padding:1.5rem;margin-bottom:1rem">
                <div style="display:flex;justify-content:space-between;margin-bottom:1rem">
                    <h4 id="subequip-title-${unitKey}-${unitIndex}-${subIdx}" data-subtype="${subType}" data-subidx="${subIdx}" style="font-weight:600">${subTitle}</h4>
                    <button class="remove-vs-btn" onclick="App.removeSubEquipment('${unitKey}',${unitIndex},'${subType}',${subIdx})">Eliminar</button>
                </div>
                ${isOtro ? `<div class="form-row">${this.createFormFields([{name: 'Nombre equipo', path: `${subType}.${subIdx}.nombreEquipo`}], [subEquip.nombreEquipo||''], 'data-subfield')}</div>` : ''}
                ${template === 'plantilla2'
                    ? `<div class="ficha-top"><div class="ficha-photo">${this._fichaPhotoSlot(subEquip.photos?.placa||null, `App.uploadPhotoSub('${unitKey}',${unitIndex},'${subType}',${subIdx},'placa')`, `App.removePhotoSub('${unitKey}',${unitIndex},'${subType}',${subIdx},'placa')`, `App.uploadPhotoSubCam('${unitKey}',${unitIndex},'${subType}',${subIdx},'placa')`)}</div><div class="ficha-id">${this._buildAbTblSubEquip(subEquip, unitKey, unitIndex, subType, subIdx)}</div></div>`
                    : `<div class="ficha-top">
                        <div class="ficha-photo">${this._fichaPhotoSlot(subEquip.photos?.placa||null, `App.uploadPhotoSub('${unitKey}',${unitIndex},'${subType}',${subIdx},'placa')`, `App.removePhotoSub('${unitKey}',${unitIndex},'${subType}',${subIdx},'placa')`, `App.uploadPhotoSubCam('${unitKey}',${unitIndex},'${subType}',${subIdx},'placa')`)}</div>
                        <div class="ficha-id">
                            ${this._buildDsheetSubEquip(subEquip, unitKey, unitIndex, subType, subIdx)}
                        </div>
                      </div>`
                }
                ${template === 'plantilla1'
                    ? `<div class="vtab-wrap">${this.renderValvulas(subEquip.valvulas, context, 'single')}</div>`
                    : `<div class="vs-section"><div class="vtab-wrap">${this.renderValvulas(subEquip.valvulasA, context, 'A')}${this.renderValvulas(subEquip.valvulasB, context, 'B')}</div></div>`
                }
                ${isCompresor ? `
                    <div class="presostato-section">
                        <div style="font-weight:600;margin-bottom:1rem">${ic('zap')} Presostato AP</div>
                        <div class="form-row" style="grid-template-columns:1fr 1fr">
                            ${this.createFormFields([
                                {name: 'Tipo', type: 'select', path: `${subType}.${subIdx}.presostato`, options: ['', 'Simple', 'Doble', 'No']}
                            ], [subEquip.presostato], 'data-subfield')}
                            <div class="form-col">
                                <label class="form-label">Presión de regulación</label>
                                <div style="display:flex;align-items:center;gap:6px">
                                    <input type="text" class="form-input" data-subfield="${subType}.${subIdx}.presionRegulacion" value="${subEquip.presionRegulacion||''}">
                                    <span style="font-size:11px;color:var(--ink-3);font-weight:600;white-space:nowrap">bar</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}
                ${AppState.isLegalMode ? this._certBandHtml(subEquip.resultadoForzado, `App.setResultadoForzadoSub('${unitKey}',${unitIndex},'${subType}',${subIdx},'favorable')`, `App.setResultadoForzadoSub('${unitKey}',${unitIndex},'${subType}',${subIdx},'desfavorable')`, 'Unidad Compresora', subType, subEquip.certChecklist || [], `App.setCertChecklistSub('${unitKey}',${unitIndex},'${subType}',${subIdx},`) : ''}
                <div class="form-section">
                    <div class="form-section-title">${ic('message')} Observaciones</div>
                    ${AppState.isLegalMode ? `
                        <div class="form-row" style="grid-template-columns:1fr 1fr">
                            ${this.createFormFields([{name: 'Observación - Técnico', type: 'textarea', path: `${subType}.${subIdx}.observaciones`, rows: 4}], [subEquip.observaciones], 'data-subfield')}
                            ${this.createFormFields([{name: 'Observación - Legal', type: 'textarea', path: `${subType}.${subIdx}.observacionesLegal`, rows: 4}], [subEquip.observacionesLegal||''], 'data-subfield')}
                        </div>
                    ` : this.createFormFields([{name: 'Observación - Técnico', type: 'textarea', path: `${subType}.${subIdx}.observaciones`, rows: 4}], [subEquip.observaciones], 'data-subfield')}
                </div>
                ${this.renderPhotoSection(subEquip.photos || {placa: null, general: null}, context)}
            </div>
        `;
    },

    // ── PSV gen helpers ──────────────────────────────────────────────────────
    setPsvGen(equipKey, index, lado, field, val) {
        const eq = AppState.equipmentData[equipKey]?.[index];
        if (!eq) return;
        const k = lado === 'single' ? 'valvulas' : `valvulas${lado}`;
        if (!eq[k]) eq[k] = {marca:'', modelo:'', sifon:'', items:[]};
        eq[k][field] = val;
        this._doAutosave();
    },
    setPsvGenSub(unitKey, unitIdx, subType, subIdx, lado, field, val) {
        const sub = AppState.equipmentData[unitKey]?.[unitIdx]?.subEquipments?.[subType]?.[subIdx];
        if (!sub) return;
        const k = lado === 'single' ? 'valvulas' : `valvulas${lado}`;
        if (!sub[k]) sub[k] = {marca:'', modelo:'', sifon:'', items:[]};
        sub[k][field] = val;
        this._doAutosave();
    },
    setPsvRow(equipKey, index, lado, vIdx, field, val) {
        const eq = AppState.equipmentData[equipKey]?.[index];
        if (!eq) return;
        const k = lado === 'single' ? 'valvulas' : `valvulas${lado}`;
        if (eq[k]?.items?.[vIdx] !== undefined) {
            eq[k].items[vIdx][field] = val;
            if (val === 'si' && ['inspVisual','verificacionDisparo','sustitucion'].includes(field)) {
                ['inspVisual','verificacionDisparo','sustitucion'].forEach(f => { if (f !== field) eq[k].items[vIdx][f] = 'no'; });
            }
        }
        this.renderEquipmentList();
        this._doAutosave();
    },
    setPsvRowSub(unitKey, unitIdx, subType, subIdx, lado, vIdx, field, val) {
        const sub = AppState.equipmentData[unitKey]?.[unitIdx]?.subEquipments?.[subType]?.[subIdx];
        if (!sub) return;
        const k = lado === 'single' ? 'valvulas' : `valvulas${lado}`;
        if (sub[k]?.items?.[vIdx] !== undefined) {
            sub[k].items[vIdx][field] = val;
            if (val === 'si' && ['inspVisual','verificacionDisparo','sustitucion'].includes(field)) {
                ['inspVisual','verificacionDisparo','sustitucion'].forEach(f => { if (f !== field) sub[k].items[vIdx][f] = 'no'; });
            }
        }
        this.renderCompositeUnitsList();
        this._doAutosave();
    },
    toggleAwpPicker(pickerId) {
        const el = document.getElementById(pickerId);
        if (el) el.classList.toggle('awp-picker--open');
    },
    onPsvMarcaChange(selectEl, ...wrapIds) {
        const isAwp = selectEl.value === 'AWP';
        wrapIds.forEach(wid => {
            const wrap = document.getElementById(wid);
            if (wrap) wrap.style.display = isAwp ? '' : 'none';
        });
    },
    selectAwpConexion(pickerId, wrapId, val) {
        const picker = document.getElementById(pickerId);
        if (picker) {
            picker.classList.remove('awp-picker--open');
            picker.querySelectorAll('.awp-opt').forEach(opt => opt.classList.toggle('awp-opt--sel', opt.dataset.val === val));
        }
        const wrap = document.getElementById(wrapId);
        if (wrap) {
            let selImg = wrap.querySelector('.awp-sel-img');
            if (!selImg) {
                const iconsRow = wrap.querySelector('.awp-icons-row');
                selImg = document.createElement('img');
                selImg.className = 'awp-sel-img';
                if (iconsRow) iconsRow.appendChild(selImg);
            }
            if (selImg) selImg.src = `imagenes/${val}.png`;
        }
    },
    updatePsvCi(equipKey, index, lado, vIdx, field, val) {
        const eq = AppState.equipmentData[equipKey]?.[index];
        if (!eq) return;
        const k = lado === 'single' ? 'valvulas' : `valvulas${lado}`;
        if (eq[k]?.items?.[vIdx] !== undefined) { eq[k].items[vIdx][field] = val; }
    },
    updatePsvCiSub(unitKey, unitIdx, subType, subIdx, lado, vIdx, field, val) {
        const sub = AppState.equipmentData[unitKey]?.[unitIdx]?.subEquipments?.[subType]?.[subIdx];
        if (!sub) return;
        const k = lado === 'single' ? 'valvulas' : `valvulas${lado}`;
        if (sub[k]?.items?.[vIdx] !== undefined) { sub[k].items[vIdx][field] = val; }
    },
    toggleResultadoForzado(equipKey, index) {
        const eq = AppState.equipmentData[equipKey]?.[index];
        if (!eq) return;
        eq.resultadoForzado = !eq.resultadoForzado;
        this.renderEquipmentList();
        this._doAutosave();
    },
    setResultadoForzado(equipKey, index, val) {
        const eq = AppState.equipmentData[equipKey]?.[index];
        if (!eq) return;
        eq.resultadoForzado = val;
        this.renderEquipmentList();
        this._doAutosave();
    },
    toggleResultadoForzadoSub(unitKey, unitIdx, subType, subIdx) {
        const sub = AppState.equipmentData[unitKey]?.[unitIdx]?.subEquipments?.[subType]?.[subIdx];
        if (!sub) return;
        sub.resultadoForzado = !sub.resultadoForzado;
        this.renderCompositeUnitsList();
        this._doAutosave();
    },
    setResultadoForzadoSub(unitKey, unitIdx, subType, subIdx, val) {
        const sub = AppState.equipmentData[unitKey]?.[unitIdx]?.subEquipments?.[subType]?.[subIdx];
        if (!sub) return;
        sub.resultadoForzado = val;
        this.renderCompositeUnitsList();
        this._doAutosave();
    },
    setCertChecklist(equipKey, index, itemIdx, val) {
        const eq = AppState.equipmentData[equipKey]?.[index];
        if (!eq) return;
        if (!eq.certChecklist) eq.certChecklist = [];
        eq.certChecklist[itemIdx] = val;
        this._doAutosave();
    },
    setCertChecklistSub(unitKey, unitIdx, subType, subIdx, itemIdx, val) {
        const sub = AppState.equipmentData[unitKey]?.[unitIdx]?.subEquipments?.[subType]?.[subIdx];
        if (!sub) return;
        if (!sub.certChecklist) sub.certChecklist = [];
        sub.certChecklist[itemIdx] = val;
        this._doAutosave();
    },
    _certChecklistItems(equipType, subType) {
        const LIST_A = [
            'Inspección visual del aparato observando que no presenta defectos, ni corrosiones en su superficie y soldaduras.',
            'Inspección visual interna del aparato.',
            'Inspección visual del aislamiento / Termografía.',
            'Control de espesores por ultrasonidos según mediciones.'
        ];
        const LIST_B = [
            'Inspección visual del aparato observando que no presenta defectos, ni corrosiones en su superficie y soldaduras.',
            'Inspección visual interna del aparato.',
            'Inspección visual del aislamiento / Termografía.',
            'Verificación estado y existencia placa de características.',
            'Control de espesores por ultrasonidos según mediciones.'
        ];
        const LIST_C = [
            'Inspección visual del aparato observando que no presenta defectos, ni corrosiones en su superficie y soldaduras.',
            'Inspección visual interna del aparato.',
            'Verificación estado y existencia placa de características.'
        ];
        const LIST_D = [
            'Inspección visual del aparato observando que no presenta defectos, ni corrosiones en su superficie y soldaduras.',
            'Verificación estado y existencia placa de características.'
        ];
        const UC_SUBS = ['Sep. Aceite', 'Sep. Aceite Sec.', 'Enfriador Aceite', 'Enfriador Aceite Sec.', 'Filtro Aceite', 'Filtro Aspiración', 'Otro'];
        if (subType === 'Bloque Compresor') return LIST_A;
        if (UC_SUBS.includes(subType) || equipType === 'Recipiente' || subType === 'Int. Multitubular') return LIST_B;
        if (subType === 'Int. Placas') return LIST_C;
        if (equipType === 'Condensador') return LIST_D;
        if (equipType === 'Servicios') return LIST_B;
        return [];
    },
    // ── Slot de foto para ficha-top ──────────────────────────────────────────
    _fichaPhotoSlot(photoData, uploadFn, removeFn, uploadCamFn) {
        if (photoData) {
            return `<div class="slot" style="position:relative" onclick="${uploadFn}">
                <img src="${photoData}" alt="Placa">
                <button onclick="event.stopPropagation();${removeFn}" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,.55);border:0;color:#fff;border-radius:4px;width:22px;height:22px;cursor:pointer;font-size:13px;line-height:1">×</button>
            </div>`;
        }
        const clickFn = uploadCamFn
            ? `App._showPhotoSourceDialog(()=>{${uploadCamFn}},()=>{${uploadFn}})`
            : uploadFn;
        return `<div class="slot" onclick="${clickFn}">
            <span class="slot-noimg">${ic('camera')}<b>Placa</b><span>Toca para añadir</span></span>
        </div>`;
    },
    // ── Undo / Redo ──────────────────────────────────────────────────────────
    _historyStack: [],
    _historyIdx: -1,
    _saveHistory() {
        try {
            const snap = JSON.parse(JSON.stringify({
                sectionsData: AppState.sectionsData,
                equipmentData: AppState.equipmentData,
                detectorsData: AppState.detectorsData,
                serviciosData: AppState.serviciosData,
                portadaData: AppState.portadaData || {},
                indiceData: AppState.indiceData || {items:[]},
                contraportadaData: AppState.contraportadaData || {texto:''},
                planificacionData: AppState.planificacionData || {}
            }));
            this._historyStack = this._historyStack.slice(0, this._historyIdx + 1);
            this._historyStack.push(snap);
            if (this._historyStack.length > 30) this._historyStack.shift();
            this._historyIdx = this._historyStack.length - 1;
            this._updateUndoRedoBtns();
        } catch(e) { /* ignore memory errors */ }
    },
    undo() {
        if (this._historyIdx <= 0) return;
        this._historyIdx--;
        this._applyHistorySnap(this._historyStack[this._historyIdx]);
    },
    redo() {
        if (this._historyIdx >= this._historyStack.length - 1) return;
        this._historyIdx++;
        this._applyHistorySnap(this._historyStack[this._historyIdx]);
    },
    _applyHistorySnap(snap) {
        AppState.sectionsData       = snap.sectionsData || {};
        AppState.equipmentData      = snap.equipmentData || {};
        AppState.detectorsData      = snap.detectorsData || [];
        AppState.serviciosData      = snap.serviciosData || [];
        AppState.portadaData        = snap.portadaData || {};
        AppState.indiceData         = snap.indiceData || {items:[]};
        AppState.contraportadaData  = snap.contraportadaData || {texto:''};
        AppState.planificacionData  = snap.planificacionData || {};
        this.renderSidebar();
        this.renderWorkspace();
        this._updateUndoRedoBtns();
    },
    _updateUndoRedoBtns() {
        const bUndo = document.getElementById('btnUndo');
        const bRedo = document.getElementById('btnRedo');
        if (bUndo) bUndo.disabled = this._historyIdx <= 0;
        if (bRedo) bRedo.disabled = this._historyIdx >= this._historyStack.length - 1;
    },
    _showPhotoSourceDialog(camFn, galFn) {
        const modal = document.getElementById('photoSourceModal');
        if (!modal) return;
        modal._cb = { cam: camFn, gal: galFn };
        modal.style.display = 'flex';
    },
    _photoSourceModalConfirmCamera() {
        const modal = document.getElementById('photoSourceModal');
        if (!modal) return;
        modal.style.display = 'none';
        if (modal._cb && modal._cb.cam) modal._cb.cam();
    },
    _photoSourceModalConfirmGallery() {
        const modal = document.getElementById('photoSourceModal');
        if (!modal) return;
        modal.style.display = 'none';
        if (modal._cb && modal._cb.gal) modal._cb.gal();
    },
    _photoSourceModalClose() {
        const modal = document.getElementById('photoSourceModal');
        if (modal) modal.style.display = 'none';
    },

    // ── Datasheet compacto plantilla1 ────────────────────────────────────────
    _buildDsheetEquip(equip, equipKey, index) {
        const isCompresor = equipKey === 'Bloque Compresor';
        const tf = 'data-field';
        const inp = (f,v) => `<input class="di" ${tf}="${f}" value="${v||''}">`;
        const selOpts = (f,opts,v) => `<select class="di" ${tf}="${f}">${opts.map(o=>`<option value="${o}" ${v===o?'selected':''}>${o||'—'}</option>`).join('')}</select>`;
        const row1 = (lbl,c) => `<div class="dl">${lbl}</div><div class="dv dv--wide">${c}</div>`;
        const row2 = (l1,c1,l2,c2,num1,num2) =>
            `<div class="dl">${l1}</div><div class="dv${num1?' num':''}"><div style="display:flex;align-items:center;flex:1">${c1}</div></div><div class="dl">${l2}</div><div class="dv${num2?' num':''}"><div style="display:flex;align-items:center;flex:1">${c2}</div></div>`;
        const rows = [];
        rows.push(row1('Identificador', inp('identificador', equip.identificador)));
        rows.push(row1('Fabricante', inp('fabricante', equip.fabricante)));
        rows.push(row1('Modelo', inp('modelo', equip.modelo)));
        rows.push(row2('Nº Serie', inp('numSerie', equip.numSerie), 'Nº Placa', inp('numPlaca', equip.numPlaca)));
        if (AppState.isLegalMode) {
            rows.push(row2('Fecha fab.', inp('fechaFabricacion', equip.fechaFabricacion), 'Normativa',
                selOpts('normativa', ['','RD3099/1977','RD138/2011','RD552/2019'], equip.normativa||'')));
        } else {
            rows.push(row1('Fecha fab.', inp('fechaFabricacion', equip.fechaFabricacion)));
        }
        if (!isCompresor) {
            rows.push(row2('Fluido', selOpts('fluido', this._getFluidOptions(), equip.fluido||''), 'Vol. Interno', `<input class="di" style="text-align:right" ${tf}="volInterno" value="${equip.volInterno||''}"><span class="du">dm³</span>`));
            rows.push(row2('P.S. Máx', `<input class="di" style="text-align:right" ${tf}="presionMax" value="${equip.presionMax||''}"><span class="du">bar</span>`, 'P.S. Mín', `<input class="di" style="text-align:right" ${tf}="presionMin" value="${equip.presionMin||''}"><span class="du">bar</span>`));
        }
        if (AppState.isLegalMode) rows.push(row2('Categoría', selOpts('categoria', ['','I','II','III','IV','-'], equip.categoria||''), 'Ubicación', inp('ubicacion', equip.ubicacion)));
        else rows.push(row1('Ubicación', inp('ubicacion', equip.ubicacion)));
        return `<div class="dsheet">${rows.join('')}</div>`;
    },
    _buildDsheetSubEquip(sub, unitKey, unitIndex, subType, subIdx) {
        const isCompresor = subType === 'Bloque Compresor';
        const tf = 'data-subfield';
        const p = (f) => `${subType}.${subIdx}.${f}`;
        const inp = (f,v) => `<input class="di" ${tf}="${p(f)}" value="${v||''}">`;
        const selOpts = (f,opts,v) => `<select class="di" ${tf}="${p(f)}">${opts.map(o=>`<option value="${o}" ${v===o?'selected':''}>${o||'—'}</option>`).join('')}</select>`;
        const row1 = (lbl,c) => `<div class="dl">${lbl}</div><div class="dv dv--wide">${c}</div>`;
        const row2 = (l1,c1,l2,c2) =>
            `<div class="dl">${l1}</div><div class="dv"><div style="display:flex;align-items:center;flex:1">${c1}</div></div><div class="dl">${l2}</div><div class="dv"><div style="display:flex;align-items:center;flex:1">${c2}</div></div>`;
        const rows = [];
        rows.push(row1('Fabricante', inp('fabricante', sub.fabricante)));
        rows.push(row1('Modelo', inp('modelo', sub.modelo)));
        if (!isCompresor) rows.push(row2('Nº Serie', inp('numSerie', sub.numSerie), 'Nº Placa', inp('numPlaca', sub.numPlaca)));
        else rows.push(row1('Nº Serie', inp('numSerie', sub.numSerie)));
        if (AppState.isLegalMode) {
            rows.push(row2('Fecha fab.', inp('fechaFabricacion', sub.fechaFabricacion), 'Normativa',
                selOpts('normativa', ['','RD3099/1977','RD138/2011','RD552/2019'], sub.normativa||'')));
        } else {
            rows.push(row1('Fecha fab.', inp('fechaFabricacion', sub.fechaFabricacion)));
        }
        if (!isCompresor) {
            rows.push(row2('Fluido', selOpts('fluido', this._getFluidOptions(), sub.fluido||''), 'Vol. Interno', `<input class="di" style="text-align:right" ${tf}="${p('volInterno')}" value="${sub.volInterno||''}"><span class="du">dm³</span>`));
            rows.push(row2('P.S. Máx', `<input class="di" style="text-align:right" ${tf}="${p('presionMax')}" value="${sub.presionMax||''}"><span class="du">bar</span>`, 'P.S. Mín', `<input class="di" style="text-align:right" ${tf}="${p('presionMin')}" value="${sub.presionMin||''}"><span class="du">bar</span>`));
        }
        if (AppState.isLegalMode) rows.push(row2('Categoría', selOpts('categoria', ['','I','II','III','IV','-'], sub.categoria||''), 'Ubicación', inp('ubicacion', sub.ubicacion)));
        else rows.push(row1('Ubicación', inp('ubicacion', sub.ubicacion)));
        return `<div class="dsheet">${rows.join('')}</div>`;
    },

    _buildDsheetServicio(svc, svcKey, index) {
        const tf = 'data-field';
        const inp = (f,v) => `<input class="di" ${tf}="${f}" value="${v||''}">`;
        const selOpts = (f,opts,v) => `<select class="di" ${tf}="${f}">${opts.map(o=>`<option value="${o}" ${v===o?'selected':''}>${o||'—'}</option>`).join('')}</select>`;
        const row1 = (lbl,c) => `<div class="dl">${lbl}</div><div class="dv dv--wide">${c}</div>`;
        const row2 = (l1,c1,l2,c2,num1,num2) =>
            `<div class="dl">${l1}</div><div class="dv${num1?' num':''}"><div style="display:flex;align-items:center;flex:1">${c1}</div></div><div class="dl">${l2}</div><div class="dv${num2?' num':''}"><div style="display:flex;align-items:center;flex:1">${c2}</div></div>`;
        const rows = [];
        rows.push(row1('Identificación', inp('identificador', svc.identificador)));
        rows.push(row2('Marca', inp('marca', svc.marca), 'Modelo', inp('modelo', svc.modelo)));
        rows.push(row2('Nº Serie', inp('numSerie', svc.numSerie), 'Fecha fab.', inp('fechaFabricacion', svc.fechaFabricacion)));
        rows.push(row2('Volumen', `<input class="di" style="text-align:right" ${tf}="volumen" value="${svc.volumen||''}"><span class="du">dm³</span>`, 'P.S. Máx', `<input class="di" style="text-align:right" ${tf}="presionMax" value="${svc.presionMax||''}"><span class="du">bar</span>`));
        if (AppState.isLegalMode) {
            rows.push(row2('P.S. Mín', `<input class="di" style="text-align:right" ${tf}="presionMin" value="${svc.presionMin||''}"><span class="du">bar</span>`, 'Normativa', selOpts('normativa', ['','RD3099/1977','RD138/2011','RD552/2019'], svc.normativa||'')));
            rows.push(row2('Categoría', selOpts('categoria', ['','I','II','III','IV','-'], svc.categoria||''), 'Ubicación', inp('ubicacion', svc.ubicacion)));
        } else {
            rows.push(row2('P.S. Mín', `<input class="di" style="text-align:right" ${tf}="presionMin" value="${svc.presionMin||''}"><span class="du">bar</span>`, 'Ubicación', inp('ubicacion', svc.ubicacion)));
        }
        return `<div class="dsheet">${rows.join('')}</div>`;
    },

    // ── A/B table helper ─────────────────────────────────────────────────────
    _buildAbTblEquip(equip, equipKey, index) {
        const fl = this._getFluidOptions();
        const oc = (f) => `App._abChg('${equipKey}',${index},'${f}',this.value)`;
        const inp = (f,v) => `<input class="ci" value="${v||''}" onchange="${oc(f)}">`;
        const sel = (f,opts,v,extraCls) => `<select class="ci${extraCls?' '+extraCls:''}" onchange="${oc(f)}">${opts.map(o=>`<option value="${o}" ${v===o?'selected':''}>${o||'—'}</option>`).join('')}</select>`;
        const comb = (lbl,c) => `<tr class="ab-comb"><th>${lbl}</th><td colspan="2"><div class="cell">${c}</div></td></tr>`;
        const abrow = (lbl,cA,cB,u) => `<tr><th>${lbl}</th><td class="${u?'num':''}"><div class="cell">${cA}${u?`<span class="cu">${u}</span>`:''}</div></td><td class="${u?'num':''}"><div class="cell">${cB}${u?`<span class="cu">${u}</span>`:''}</div></td></tr>`;
        const split2 = (l1,c1,l2,c2) => `<tr><th>${l1}</th><td><div class="cell">${c1}</div></td><td><div class="cell" style="display:flex;align-items:center;gap:5px"><span style="font-size:10px;font-weight:700;color:var(--ink-2);white-space:nowrap">${l2}</span>${c2}</div></td></tr>`;
        return `<table class="ab-tbl"><colgroup><col style="width:28%"><col style="width:36%"><col style="width:36%"></colgroup><tbody>
            ${comb('Fabricante', inp('fabricante',equip.fabricante))}
            ${comb('Modelo', inp('modelo',equip.modelo))}
            ${comb('Nº Serie', inp('numSerie',equip.numSerie))}
            ${comb('Nº Placa', inp('numPlaca',equip.numPlaca))}
            ${AppState.isLegalMode
                ? split2('Fecha fab.', inp('fechaFabricacion',equip.fechaFabricacion), 'Normativa', sel('normativa',['','RD3099/1977','RD138/2011','RD552/2019'],equip.normativa||'','ab-norm'))
                : comb('Fecha fab.', inp('fechaFabricacion',equip.fechaFabricacion))}
            ${AppState.isLegalMode ? comb('Categoría', sel('categoria',['','I','II','III','IV','-'],equip.categoria||'')) : ''}
            <tr class="ab-subhdr"><th></th><th>Lado <b>A</b></th><th>Lado <b>B</b></th></tr>
            ${abrow('Fluido', sel('fluidoA',fl,equip.fluidoA||''), sel('fluidoB',fl,equip.fluidoB||''))}
            ${abrow('Volumen', inp('volInternoA',equip.volInternoA), inp('volInternoB',equip.volInternoB), 'dm³')}
            ${abrow('P.S. Máx', inp('presionMaxA',equip.presionMaxA), inp('presionMaxB',equip.presionMaxB), 'bar')}
            ${abrow('P.S. Mín', inp('presionMinA',equip.presionMinA), inp('presionMinB',equip.presionMinB), 'bar')}
            ${comb('Local', inp('ubicacion',equip.ubicacion))}
        </tbody></table>`;
    },
    _buildAbTblSubEquip(sub, unitKey, unitIdx, subType, subIdx) {
        const fl = this._getFluidOptions();
        const oc = (f) => `App._abChgSub('${unitKey}',${unitIdx},'${subType}',${subIdx},'${f}',this.value)`;
        const inp = (f,v) => `<input class="ci" value="${v||''}" onchange="${oc(f)}">`;
        const sel = (f,opts,v,extraCls) => `<select class="ci${extraCls?' '+extraCls:''}" onchange="${oc(f)}">${opts.map(o=>`<option value="${o}" ${v===o?'selected':''}>${o||'—'}</option>`).join('')}</select>`;
        const comb = (lbl,c) => `<tr class="ab-comb"><th>${lbl}</th><td colspan="2"><div class="cell">${c}</div></td></tr>`;
        const abrow = (lbl,cA,cB,u) => `<tr><th>${lbl}</th><td class="${u?'num':''}"><div class="cell">${cA}${u?`<span class="cu">${u}</span>`:''}</div></td><td class="${u?'num':''}"><div class="cell">${cB}${u?`<span class="cu">${u}</span>`:''}</div></td></tr>`;
        const split2 = (l1,c1,l2,c2) => `<tr><th>${l1}</th><td><div class="cell">${c1}</div></td><td><div class="cell" style="display:flex;align-items:center;gap:5px"><span style="font-size:10px;font-weight:700;color:var(--ink-2);white-space:nowrap">${l2}</span>${c2}</div></td></tr>`;
        return `<table class="ab-tbl"><colgroup><col style="width:28%"><col style="width:36%"><col style="width:36%"></colgroup><tbody>
            ${comb('Fabricante', inp('fabricante',sub.fabricante))}
            ${comb('Modelo', inp('modelo',sub.modelo))}
            ${comb('Nº Serie', inp('numSerie',sub.numSerie))}
            ${comb('Nº Placa', inp('numPlaca',sub.numPlaca))}
            ${AppState.isLegalMode
                ? split2('Fecha fab.', inp('fechaFabricacion',sub.fechaFabricacion), 'Normativa', sel('normativa',['','RD3099/1977','RD138/2011','RD552/2019'],sub.normativa||'','ab-norm'))
                : comb('Fecha fab.', inp('fechaFabricacion',sub.fechaFabricacion))}
            ${AppState.isLegalMode ? comb('Categoría', sel('categoria',['','I','II','III','IV','-'],sub.categoria||'')) : ''}
            <tr class="ab-subhdr"><th></th><th>Lado <b>A</b></th><th>Lado <b>B</b></th></tr>
            ${abrow('Fluido', sel('fluidoA',fl,sub.fluidoA||''), sel('fluidoB',fl,sub.fluidoB||''))}
            ${abrow('Volumen', inp('volInternoA',sub.volInternoA), inp('volInternoB',sub.volInternoB), 'dm³')}
            ${abrow('P.S. Máx', inp('presionMaxA',sub.presionMaxA), inp('presionMaxB',sub.presionMaxB), 'bar')}
            ${abrow('P.S. Mín', inp('presionMinA',sub.presionMinA), inp('presionMinB',sub.presionMinB), 'bar')}
            ${comb('Local', inp('ubicacion',sub.ubicacion))}
        </tbody></table>`;
    },
    _abChg(equipKey, index, field, val) {
        this.updateEquipmentField(equipKey, index, field, val);
        if (field === 'fechaFabricacion' && AppState.isLegalMode) {
            const normativa = this._normativaFromYear(val);
            this.updateEquipmentField(equipKey, index, 'normativa', normativa);
            const cont = document.getElementById(`equipment_${equipKey}_${index}`);
            if (cont) { const s = cont.querySelector('.ab-norm'); if (s) s.value = normativa; }
        }
    },
    _abChgSub(unitKey, unitIdx, subType, subIdx, field, val) {
        const path = `${subType}.${subIdx}.${field}`;
        this.updateSubEquipmentField(unitKey, unitIdx, path, val);
        if (field === 'fechaFabricacion' && AppState.isLegalMode) {
            const normativa = this._normativaFromYear(val);
            const normPath = `${subType}.${subIdx}.normativa`;
            this.updateSubEquipmentField(unitKey, unitIdx, normPath, normativa);
            const cont = document.getElementById(`equipment_${unitKey}_${unitIdx}`);
            if (cont) { const s = cont.querySelector('.ab-norm'); if (s) s.value = normativa; }
        }
    },
    _certBandHtml(rfRaw, setFavFn, setDesFn, equipType, subType, certChecklist, setCheckFn) {
        const rf = rfRaw === true ? 'favorable' : (rfRaw || '');
        const items = this._certChecklistItems(equipType || '', subType || '');
        return `<div class="cert-band cert-band--legal">
            <div class="cert-band-top">
                <p><b>Clauger Refrigeración Ibérica S.A.</b>, empresa frigorista habilitada, certifica la revisión del aparato a presión (RD&nbsp;552/2019).</p>
                <div class="cert-res">
                    <span class="cert-k">Resultado</span>
                    <div class="seg seg--sm">
                        <button class="${rf==='desfavorable'?'seg-on-bad':''}" onclick="${setDesFn}">Desfavorable</button>
                        <button class="${rf==='favorable'?'seg-on-ok':''}" onclick="${setFavFn}">Favorable</button>
                    </div>
                </div>
            </div>
            ${items.length > 0 ? `<div class="cert-checklist">${items.map((item, i) => `<label class="cert-check-item"><input type="checkbox" ${(certChecklist && certChecklist[i]) ? 'checked' : ''} onchange="${setCheckFn},${i},this.checked)"><span>${item}</span></label>`).join('')}</div>` : ''}
        </div>`;
    },

    addSubEquipment(unitKey, unitIndex, subType) {
        const unit = AppState.equipmentData[unitKey][unitIndex];
        if (!unit.subEquipments) unit.subEquipments = {};
        if (!unit.subEquipments[subType]) unit.subEquipments[subType] = [];
        
        const isIntercambiador = subType.includes('Enfriador Aceite');
        const newSubEquip = {
            fabricante: '', modelo: '', numSerie: '', numPlaca: '', fechaFabricacion: '',
            normativa: '', ubicacion: '', categoria: '', observaciones: '',
            photos: {placa: null, general: null},
            imagenes: []
        };

        if (isIntercambiador) {
            newSubEquip.fluidoA = ''; newSubEquip.fluidoB = '';
            newSubEquip.volInternoA = ''; newSubEquip.volInternoB = '';
            newSubEquip.presionMaxA = ''; newSubEquip.presionMinA = '';
            newSubEquip.presionMaxB = ''; newSubEquip.presionMinB = '';
            newSubEquip.valvulasA = {marca:'', modelo:'', sifon:'', items:[]};
            newSubEquip.valvulasB = {marca:'', modelo:'', sifon:'', items:[]};
        } else {
            newSubEquip.fluido = ''; newSubEquip.volInterno = '';
            newSubEquip.presionMax = ''; newSubEquip.presionMin = '';
            newSubEquip.valvulas = {marca:'', modelo:'', sifon:'', items:[]};
        }
        newSubEquip.resultadoForzado = false;
        
        if (subType === 'Bloque Compresor') { newSubEquip.presostato = ''; newSubEquip.presionRegulacion = ''; }
        if (subType === 'Otro') newSubEquip.nombreEquipo = '';

        unit.subEquipments[subType].push(newSubEquip);
        this.renderCompositeUnitsList();
        this.showToast(`${subType} añadido`, 'success');
        if (typeof Tutorial !== 'undefined') Tutorial.onAddSubEquipment();
    },

    removeSubEquipment(unitKey, unitIndex, subType, subIdx) {
        if (confirm(`¿Eliminar este ${subType}?`)) {
            const unit = AppState.equipmentData[unitKey][unitIndex];
            unit.subEquipments[subType].splice(subIdx, 1);
            if (unit.subEquipments[subType].length === 0) delete unit.subEquipments[subType];
            this.renderCompositeUnitsList();
            this.showToast('Componente eliminado', 'success');
        }
    },

    renderEquipmentList() {
        if (AppState.currentEquipmentType === 'Servicios') { this.renderEquipoServiciosList(); return; }
        const listContainer = document.getElementById('equipmentList');
        if (!listContainer) return;

        const equipKey = AppState.currentSubType;
        const equipments = AppState.equipmentData[equipKey] || [];
        
        if (equipments.length === 0) {
            listContainer.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:2rem">No hay equipos añadidos</p>';
            return;
        }
        
        const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
        const template = typeData.template;
        
        listContainer.innerHTML = equipments.map((equip, index) => {
            const isExpanded = AppState.expandedEquipment[`${equipKey}_${index}`];
            const context = {equipKey, index, isSubEquip: false};
            const isCompresor = equipKey === 'Bloque Compresor';
            
            return `
                <div class="equipment-item">
                    <div class="equipment-header" onclick="App.toggleEquipment('${equipKey}',${index})">
                        <div>
                            <div class="equipment-header-title">${typeData.icon} ${equipKey} #${index + 1}${equip.identificador ? ` — ${equip.identificador}` : ''}</div>
                            <div class="equipment-summary">${[equip.fabricante, equip.modelo, equip.numSerie, equip.ubicacion].filter(Boolean).join(' <span class="sep">·</span> ')}</div>
                        </div>
                        <div class="equipment-header-controls">
                            <button class="equipment-toggle">${isExpanded ? '▼' : '▶'}</button>
                            <button class="equipment-remove-btn" onclick="event.stopPropagation();App.removeEquipment('${equipKey}',${index})">${ic('trash')} Eliminar</button>
                        </div>
                    </div>
                    <div class="equipment-content ${isExpanded ? 'show' : ''}" id="equipment_${equipKey}_${index}">
                        ${template === 'plantilla2'
                            ? `<div class="form-section"><div class="form-section-title">${ic('clipboard')} Descripción</div><div class="ficha-top"><div class="ficha-photo">${this._fichaPhotoSlot(equip.photos?.placa||null, `App.uploadPhoto('${equipKey}',${index},'placa')`, `App.removePhoto('${equipKey}',${index},'placa')`, `App.uploadPhotoCam('${equipKey}',${index},'placa')`)}</div><div class="ficha-id">${this._buildAbTblEquip(equip, equipKey, index)}</div></div></div>`
                            : `<div class="form-section"><div class="form-section-title">${ic('clipboard')} Descripción</div><div class="ficha-top">
                                <div class="ficha-photo">${this._fichaPhotoSlot(equip.photos?.placa||null, `App.uploadPhoto('${equipKey}',${index},'placa')`, `App.removePhoto('${equipKey}',${index},'placa')`, `App.uploadPhotoCam('${equipKey}',${index},'placa')`)}</div>
                                <div class="ficha-id">
                                    ${this._buildDsheetEquip(equip, equipKey, index)}
                                </div>
                              </div></div>`
                        }
                        ${template === 'plantilla1'
                            ? `<div class="vtab-wrap">${this.renderValvulas(equip.valvulas, context, 'single')}</div>`
                            : `<div class="vs-section"><div class="vtab-wrap">${this.renderValvulas(equip.valvulasA, context, 'A')}${this.renderValvulas(equip.valvulasB, context, 'B')}</div></div>`
                        }
                        ${isCompresor ? `
                            <div class="presostato-section">
                                <div style="font-weight:600;margin-bottom:1rem">${ic('zap')} Presostato AP</div>
                                <div class="form-row" style="grid-template-columns:1fr 1fr">
                                    ${this.createFormFields([{name: 'Valor', path: 'presostato'}], [equip.presostato])}
                                    <div class="form-col">
                                        <label class="form-label">Presión de regulación</label>
                                        <div style="display:flex;align-items:center;gap:6px">
                                            <input type="text" class="form-input" data-field="presionRegulacion" value="${equip.presionRegulacion||''}">
                                            <span style="font-size:11px;color:var(--ink-3);font-weight:600;white-space:nowrap">bar</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                        ${AppState.isLegalMode ? this._certBandHtml(equip.resultadoForzado, `App.setResultadoForzado('${equipKey}',${index},'favorable')`, `App.setResultadoForzado('${equipKey}',${index},'desfavorable')`, AppState.currentEquipmentType, equipKey, equip.certChecklist || [], `App.setCertChecklist('${equipKey}',${index},`) : ''}
                        <div class="form-section">
                            <div class="form-section-title">${ic('message')} Observaciones</div>
                            ${AppState.isLegalMode ? `
                                <div class="form-row" style="grid-template-columns:1fr 1fr">
                                    ${this.createFormFields([{name: 'Observación - Técnico', type: 'textarea', path: 'observaciones', rows: 4}], [equip.observaciones])}
                                    ${this.createFormFields([{name: 'Observación - Legal', type: 'textarea', path: 'observacionesLegal', rows: 4}], [equip.observacionesLegal||''])}
                                </div>
                            ` : this.createFormFields([{name: 'Observación - Técnico', type: 'textarea', path: 'observaciones', rows: 4}], [equip.observaciones])}
                        </div>
                        ${this.renderPhotoSection(equip.photos || {placa: null, general: null}, context)}
                    </div>
                </div>
            `;
        }).join('');
        
        this.attachFormListeners();
    },

    attachFormListeners() {
        document.querySelectorAll('.form-input[data-field], .di[data-field], select[data-field], textarea[data-field]').forEach(input => {
            input.onchange = (e) => {
                const content = e.target.closest('.equipment-content');
                if (!content) return;
                const [, equipKey, index] = content.id.split('_');
                this.updateEquipmentField(equipKey, parseInt(index), e.target.dataset.field, e.target.value);
                if (e.target.dataset.field === 'fechaFabricacion' && AppState.isLegalMode) {
                    const normativa = this._normativaFromYear(e.target.value);
                    const sel = content.querySelector('[data-field="normativa"]');
                    if (sel) { sel.value = normativa; this.updateEquipmentField(equipKey, parseInt(index), 'normativa', normativa); }
                }
                if (e.target.dataset.field === 'identificador') {
                    const titleEl = content.parentElement?.querySelector('.equipment-header-title');
                    if (titleEl) {
                        const eqType = EQUIPMENT_TYPES[AppState.currentEquipmentType];
                        const icon = eqType ? eqType.icon : ic('gear');
                        const labelName = eqType?.isSingle ? (eqType.label || equipKey) : equipKey;
                        titleEl.innerHTML = `${icon} ${labelName} #${parseInt(index) + 1}${e.target.value ? ` — ${e.target.value}` : ''}`;
                    }
                    // Update all sub-component titles (UC only)
                    if (equipKey === 'Unidad Compresora') {
                        content.querySelectorAll('h4[data-subtype]').forEach(h4 => {
                            if (h4.dataset.subtype !== 'Otro') {
                                h4.textContent = `${h4.dataset.subtype} #${parseInt(h4.dataset.subidx) + 1}${e.target.value ? ` — ${e.target.value}` : ''}`;
                            }
                        });
                    }
                }
            };
        });

        document.querySelectorAll('.form-input[data-subfield], .di[data-subfield], select[data-subfield], textarea[data-subfield]').forEach(input => {
            input.onchange = (e) => {
                const content = e.target.closest('.equipment-content');
                if (!content) return;
                const [, equipKey, index] = content.id.split('_');
                this.updateSubEquipmentField(equipKey, parseInt(index), e.target.dataset.subfield, e.target.value);
                if (e.target.dataset.subfield?.endsWith('.nombreEquipo')) {
                    const sfParts = e.target.dataset.subfield.split('.');
                    const subIdx = sfParts[sfParts.length - 2];
                    const titleEl = document.getElementById(`subequip-title-${equipKey}-${parseInt(index)}-${subIdx}`);
                    if (titleEl) titleEl.textContent = e.target.value || `Otro #${parseInt(subIdx) + 1}`;
                }
                if (e.target.dataset.subfield?.endsWith('.fechaFabricacion') && AppState.isLegalMode) {
                    const normativa = this._normativaFromYear(e.target.value);
                    const normPath = e.target.dataset.subfield.replace('.fechaFabricacion', '.normativa');
                    const sel = content.querySelector(`[data-subfield="${normPath}"]`);
                    if (sel) { sel.value = normativa; this.updateSubEquipmentField(equipKey, parseInt(index), normPath, normativa); }
                }
            };
        });
    },

    updateEquipmentField(equipKey, index, field, value) {
        const equipment = AppState.equipmentData[equipKey]?.[index];
        if (!equipment) return;
        
        const parts = field.split('.');
        let obj = equipment;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!obj[parts[i]]) obj[parts[i]] = isNaN(parts[i + 1]) ? {} : [];
            obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
    },

    updateSubEquipmentField(equipKey, unitIndex, subfieldPath, value) {
        const unit = AppState.equipmentData[equipKey]?.[unitIndex];
        if (!unit || !unit.subEquipments) return;
        let subType = null, restPath = '';
        for (const st of Object.keys(unit.subEquipments)) {
            if (subfieldPath.startsWith(st + '.')) { subType = st; restPath = subfieldPath.slice(st.length + 1); break; }
        }
        if (!subType) return;
        const parts = restPath.split('.');
        const subIdx = parseInt(parts[0]);
        const subEquip = unit.subEquipments[subType]?.[subIdx];
        if (!subEquip) return;
        let obj = subEquip;
        for (let i = 1; i < parts.length - 1; i++) {
            if (!obj[parts[i]]) obj[parts[i]] = isNaN(parts[i + 1]) ? {} : [];
            obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
    },

    addEquipment() {
        const equipKey = AppState.currentSubType;
        if (!AppState.equipmentData[equipKey]) AppState.equipmentData[equipKey] = [];
        
        const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
        const newEquip = {
            identificador: '', fabricante: '', modelo: '', numSerie: '', numPlaca: '', fechaFabricacion: '',
            normativa: '', ubicacion: '', categoria: '', observaciones: '',
            photos: {placa: null, general: null},
            imagenes: []
        };

        if (typeData.template === 'plantilla1') {
            newEquip.fluido = ''; newEquip.volInterno = '';
            newEquip.presionMax = ''; newEquip.presionMin = '';
            newEquip.valvulas = {marca:'', modelo:'', sifon:'', items:[]};
        } else if (typeData.template === 'plantilla2') {
            newEquip.fluidoA = ''; newEquip.fluidoB = '';
            newEquip.volInternoA = ''; newEquip.volInternoB = '';
            newEquip.presionMaxA = ''; newEquip.presionMinA = '';
            newEquip.presionMaxB = ''; newEquip.presionMinB = '';
            newEquip.valvulasA = {marca:'', modelo:'', sifon:'', items:[]};
            newEquip.valvulasB = {marca:'', modelo:'', sifon:'', items:[]};
        }
        newEquip.resultadoForzado = false;

        if (equipKey === 'Bloque Compresor') { newEquip.presostato = ''; newEquip.presionRegulacion = ''; }
        
        AppState.equipmentData[equipKey].push(newEquip);
        const newIndex = AppState.equipmentData[equipKey].length - 1;
        AppState.expandedEquipment[`${equipKey}_${newIndex}`] = true;
        
        this.renderEquipmentList();
        this.showToast('Equipo añadido', 'success');
    },

    removeEquipment(equipKey, index) {
        if (confirm('¿Eliminar este equipo?')) {
            AppState.equipmentData[equipKey].splice(index, 1);
            delete AppState.expandedEquipment[`${equipKey}_${index}`];
            const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
            typeData?.isComposite ? this.renderCompositeUnitsList() : this.renderEquipmentList();
            this.showToast('Equipo eliminado', 'success');
        }
    },

    toggleEquipment(equipKey, index) {
        const key = `${equipKey}_${index}`;
        AppState.expandedEquipment[key] = !AppState.expandedEquipment[key];
        const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
        typeData?.isComposite ? this.renderCompositeUnitsList() : this.renderEquipmentList();
    },

    exportJSON() {
        this._captureActiveFields();
        const blob = new Blob([JSON.stringify(this._buildExportData(), null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = this._buildFilename();
        a.click();
        this.showToast('Datos exportados', 'success');
    },

    // Captura el campo con foco antes de serializar
    _captureActiveFields() {
        if (AppState.currentSection && AppState.sectionsData[AppState.currentSection]) {
            const workspace = document.getElementById('workspace');
            if (workspace) {
                workspace.querySelectorAll('.form-input[data-field]').forEach(input => {
                    AppState.sectionsData[AppState.currentSection][input.dataset.field] = input.value;
                });
            }
        }
    },

    // Construye el objeto de datos para guardar/exportar
    _buildExportData() {
        const termografiaExport = (AppState.termografiaData || []).map(p => ({ ...p }));
        return {
            isLegalMode: AppState.isLegalMode,
            sectionsData: AppState.sectionsData,
            equipmentData: AppState.equipmentData,
            detectorsData: AppState.detectorsData,
            instalacionCircuitos: AppState.instalacionCircuitos,
            instalacionSalas: AppState.instalacionSalas,
            instalacionCamaras: AppState.instalacionCamaras,
            serviciosData: AppState.serviciosData,
            portadaData: AppState.portadaData || {},
            indiceData: AppState.indiceData || { items: [] },
            contraportadaData: AppState.contraportadaData || { texto: '' },
            certPsvArchivos: AppState.certPsvArchivos || [],
            actaInicialArchivos: AppState.actaInicialArchivos || [],
            termografiaData: termografiaExport,
            planificacionData: AppState.planificacionData || { textoRevision: '', textoInspeccion: '' },
            exportDate: new Date().toISOString()
        };
    },

    // Genera el nombre de fichero según modo y datos del informe
    _buildFilename() {
        if (AppState.isLegalMode) {
            const _inst = AppState.sectionsData['datos_datos_instalacion'] || {};
            const _rev  = AppState.sectionsData['datos_datos_revision'] || {};
            const _cert = AppState.sectionsData['datos_datos_certificado'] || {};
            const _fRev = _rev['FECHA REVISIÓN'] || '';
            const _ano  = (_fRev.match(/\d{4}/) || [new Date().getFullYear()])[0];
            const _sis  = (_inst['SISTEMA'] || '').trim().replace(/\s+/g, '_') || 'SIN_SISTEMA';
            const _nRev = (_cert['NÚMERO REVISIÓN'] || '').trim().replace(/\s+/g, '_') || 'SIN_REV';
            return `${_ano}_${_sis}_${_nRev}.json`;
        }
        const informe = AppState.sectionsData['datos_datos_informe'] || {};
        const sistema = (informe['SISTEMA'] || '').trim().replace(/\s+/g, '_') || 'SIN_SISTEMA';
        const numRev  = (informe['NÚMERO REVISIÓN'] || '').trim().replace(/\s+/g, '_') || 'SIN_REV';
        return `${new Date().getFullYear()}_${sistema}_${numRev}.json`;
    },

    loadJSON() {
        if ('showOpenFilePicker' in window) {
            window.showOpenFilePicker({
                types: [{ description: 'Archivo de revisión Clauger', accept: { 'application/json': ['.json'] } }]
            }).then(async ([handle]) => {
                try {
                    const file = await handle.getFile();
                    const data = JSON.parse(await file.text());
                    if (this._applyLoadedData(data)) {
                        _fileHandle = handle;
                        this._updateSaveBtn();
                    }
                } catch { this.showToast('Error al cargar', 'error'); }
            }).catch(err => { if (err.name !== 'AbortError') this.showToast('Error al cargar', 'error'); });
            return;
        }
        // Fallback para navegadores sin File System Access API
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        this._applyLoadedData(JSON.parse(event.target.result));
                    } catch { this.showToast('Error al cargar', 'error'); }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    },

    // Aplica los datos cargados al AppState y re-renderiza. Devuelve false si el usuario cancela.
    _applyLoadedData(data) {
        if (data.isLegalMode && !AppState.isLegalMode) {
            if (!confirm('Este archivo fue creado en Modo Legal. Algunas secciones no estarán disponibles en Modo Técnico. ¿Desea continuar?')) return false;
        }
        if (data.sectionsData) {
            Object.keys(data.sectionsData).forEach(sectionKey => {
                const sectionData = data.sectionsData[sectionKey];
                Object.keys(sectionData).forEach(itemKey => {
                    const item = sectionData[itemKey];
                    if (item && typeof item === 'object' && !item.hasOwnProperty('gravedad')) {
                        item.gravedad = '';
                        item.correccion = '';
                    }
                });
            });
        }
        AppState.sectionsData = data.sectionsData || {};
        AppState.equipmentData = data.equipmentData || {};
        const _migrateValvs = (items) => items.map(valv => {
            if (valv.serieAntigua === undefined) return valv;
            return {
                marca: valv.marca || '', modelo: valv.modelo || '',
                indicadorDescarga: valv.indicadorSifon === 'SI' ? 'Sifón' : valv.indicadorLuz === 'SI' ? 'Luz' : '',
                serieExistente: valv.serieAntigua || '', fechaExistente: valv.fecha || '',
                presionExistente: valv.presionTarado || '', serieNueva: valv.serieNueva || '',
                fechaNueva: '', presionNueva: ''
            };
        });
        Object.keys(AppState.equipmentData).forEach(equipKey => {
            AppState.equipmentData[equipKey].forEach(equip => {
                ['valvulas','valvulasA','valvulasB'].forEach(k => { if (equip[k]?.items) equip[k].items = _migrateValvs(equip[k].items); });
                if (equip.subEquipments) Object.keys(equip.subEquipments).forEach(subType => {
                    equip.subEquipments[subType].forEach(sub => {
                        ['valvulas','valvulasA','valvulasB'].forEach(k => { if (sub[k]?.items) sub[k].items = _migrateValvs(sub[k].items); });
                    });
                });
            });
        });
        AppState.detectorsData = data.detectorsData || [];
        AppState.detectorsData.forEach(d => { if (!d.imagenes) d.imagenes = []; });
        AppState.instalacionCircuitos = data.instalacionCircuitos || AppState.instalacionCircuitos;
        AppState.instalacionSalas     = data.instalacionSalas     || AppState.instalacionSalas;
        AppState.instalacionCamaras   = data.instalacionCamaras   || AppState.instalacionCamaras;
        AppState.serviciosData        = data.serviciosData        || [];
        AppState.portadaData          = data.portadaData          || { titulo:'',subtitulo:'',cliente:'',direccion:'',cp:'',localidad:'',provincia:'',referencia:'',anio:'' };
        AppState.indiceData           = data.indiceData           || { items: [] };
        AppState.contraportadaData    = data.contraportadaData    || { texto: '' };
        AppState.certPsvArchivos      = data.certPsvArchivos      || [];
        AppState.actaInicialArchivos  = data.actaInicialArchivos  || [];
        AppState.termografiaData      = data.termografiaData      || [];
        AppState.planificacionData    = data.planificacionData    || { textoRevision: '', textoInspeccion: '' };
        this._termoImgCache = {};
        AppState.termografiaData.forEach((punto, idx) => {
            if (punto.imagen) {
                const img = new Image();
                img.onload = () => {
                    const oc = document.createElement('canvas');
                    oc.width = img.naturalWidth; oc.height = img.naturalHeight;
                    oc.getContext('2d').drawImage(img, 0, 0);
                    this._termoImgCache[idx] = oc.getContext('2d').getImageData(0, 0, oc.width, oc.height);
                };
                img.src = punto.imagen;
            }
        });
        this.calcularDatosRevision();
        this.renderSidebar();
        this.renderWorkspace();
        this.showToast('Datos cargados', 'success');
        this._doAutosave();
        return true;
    },

    // Guarda en el mismo archivo (File System Access API) o crea uno nuevo si no hay handle
    async saveJSON() {
        this._captureActiveFields();
        if (!('showSaveFilePicker' in window)) {
            // Navegador sin soporte (Firefox): descarga normal
            this.exportJSON();
            return;
        }
        try {
            if (!_fileHandle) {
                _fileHandle = await window.showSaveFilePicker({
                    suggestedName: this._buildFilename(),
                    types: [{ description: 'Archivo de revisión Clauger', accept: { 'application/json': ['.json'] } }]
                });
                this._updateSaveBtn();
            }
            const blob = new Blob([JSON.stringify(this._buildExportData(), null, 2)], { type: 'application/json' });
            const writable = await _fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
            this.showToast('Guardado ✓', 'success');
        } catch (err) {
            if (err.name === 'AbortError') return;
            // Handle puede haberse vuelto inválido (archivo eliminado, etc.)
            _fileHandle = null;
            this._updateSaveBtn();
            this.showToast('No se pudo guardar — elige el archivo de nuevo', 'error');
        }
    },

    // Actualiza la apariencia del botón Guardar y el badge con el nombre del archivo
    _updateSaveBtn() {
        const btn   = document.getElementById('btnGuardar');
        const label = document.getElementById('btnGuardarLabel');
        const badge = document.getElementById('autosaveBadge');
        if (!btn) return;
        if (_fileHandle) {
            btn.style.cssText += ';background:var(--navy,#1a2744);color:#fff;border-color:var(--navy,#1a2744)';
            if (label) label.textContent = 'Guardar';
            btn.title = `Guardando en: ${_fileHandle.name}`;
            if (badge) {
                badge.style.display = 'inline-block';
                badge.textContent   = _fileHandle.name;
                badge.title         = `Sesión vinculada a: ${_fileHandle.name}`;
            }
        } else {
            btn.style.background   = '';
            btn.style.color        = '';
            btn.style.borderColor  = '';
            if (label) label.textContent = 'Guardar';
            btn.title = 'Guardar sesión en archivo';
            if (badge) badge.style.display = 'none';
        }
    },

    async generateActaInicial() {
        this.showToast('Generando documento...', 'success');

        const logoBase64 = await fetch('imagenes/clauger-color.png').then(r=>r.blob()).then(b=>new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.readAsDataURL(b);})).catch(()=>null);

        try {
            const delegacion  = AppState.sectionsData['datos_datos_delegacion']  || {};
            const cliente     = AppState.sectionsData['datos_datos_cliente']     || {};
            const instalacion = AppState.sectionsData['datos_datos_instalacion'] || {};
            const revision    = AppState.sectionsData['datos_datos_revision']    || {};
            const certificado = AppState.sectionsData['datos_datos_certificado'] || {};
            const informe     = AppState.sectionsData['datos_datos_instalacion']  || {};

            const checklistItems  = [];
            const itemsConImagenes = [];

            Object.keys(PAGES_CONFIG.checklist.sections).forEach(sec => {
                const secDef  = PAGES_CONFIG.checklist.sections[sec];
                const secKey  = `checklist_${secDef.id}`;
                const secData = AppState.sectionsData[secKey] || {};

                secDef.items.forEach(item => {
                    const d = secData[item.id] || { estado: '', gravedad: '', correccion: '', observaciones: '', imagenes: [] };
                    const estado = d.estado || '';
                    // Defecto real solo si el estado FINAL es NEGATIVO o RECOMENDACIÓN
                    const esDefecto = estado.includes('NEGATIVO') || estado.includes('RECOMENDACIÓN');

                    checklistItems.push({
                        seccion:      secDef.name,
                        id:           item.id,
                        descripcion:  item.desc,
                        estado,
                        gravedad:     esDefecto ? (d.gravedad    || '') : '',
                        correccion:   esDefecto ? (d.correccion  || '') : '',
                        observaciones: esDefecto ? (d.observaciones || '') : ''
                    });

                    const imagenesPdf = d.imagenes ? d.imagenes.filter(img => img.incluirEnPdf !== false) : [];
                    if (esDefecto && imagenesPdf.length > 0) {
                        itemsConImagenes.push({
                            seccion:      secDef.name,
                            id:           item.id,
                            descripcion:  item.desc,
                            estado,
                            gravedad:     d.gravedad    || '',
                            correccion:   d.correccion  || '',
                            observaciones: d.observaciones || '',
                            imagenes:     imagenesPdf
                        });
                    }
                });
            });

            // Categorías de items por apartado
            const IDS_REVISION = new Set(['A06','A09','B14','B23','B24','B25','B26','C01','C02','C05','D08','D09','D11','D12','D13','D14','E07','E08','E09']);
            const IDS_DOCUMENTAL = new Set(['A01','A02','A03','A04','A05','A07','A08','A10','A11','A12','A13','A14','A15','A16','A17']);
            const IDS_CONTROL = new Set(['B01','B02','B03','B04','B05','B06','B07','B08','B09','B10','B11','B12','B13','B15','B16','B17','B18','B19','B20','B21','B22','B27','C03','C04','C06','C07','C08','C09','C10','C11','C12','D01','D02','D03','D04','D05','D06','D07','D10','D15','D16','D17','D18','D19','D20','D21','D22','D23','E01','E02','E03','E04','E05','E06','E10','E11','E12','F01','F02','F03','F04','F05','F06','F07','G01','G02','G03','G04']);

            const negativos      = checklistItems.filter(i => i.estado.includes('NEGATIVO'));
            const recomendaciones = checklistItems.filter(i => i.estado.includes('RECOMENDACIÓN'));

            const grpRevision    = negativos.filter(i => IDS_REVISION.has(i.id));
            const grpDocumental  = negativos.filter(i => IDS_DOCUMENTAL.has(i.id));
            const grpControl     = negativos.filter(i => IDS_CONTROL.has(i.id));

            const hayDeficiencias = negativos.length > 0 || recomendaciones.length > 0;

            const sharedCols = '<thead><tr>' +
                '<th style="width:5%;text-align:center">ID</th>' +
                '<th style="width:9%;text-align:center">Gravedad</th>' +
                '<th style="width:12%">A Corregir</th>' +
                '<th style="width:34%">Descripción</th>' +
                '<th style="width:40%">Observación</th>' +
                '</tr></thead>';

            const buildDefRow = (item) => {
                const rc = item.gravedad === 'Grave' ? 'r-grave' : 'r-leve';
                return '<tr class="' + rc + '">' +
                    '<td style="text-align:center;font-weight:700">' + item.id + '</td>' +
                    '<td style="text-align:center">' + (item.gravedad||'—') + '</td>' +
                    '<td>' + (item.correccion||'—') + '</td>' +
                    '<td>' + item.descripcion + '</td>' +
                    '<td>' + (item.observaciones||'—') + '</td>' +
                    '</tr>';
            };
            const buildRecomRow = (item) =>
                '<tr class="r-recom">' +
                '<td style="text-align:center;font-weight:700">' + item.id + '</td>' +
                '<td style="text-align:center">—</td>' +
                '<td>' + (item.correccion||'—') + '</td>' +
                '<td>' + item.descripcion + '</td>' +
                '<td>' + (item.observaciones||'—') + '</td>' +
                '</tr>';

            const defCols   = sharedCols;
            const recomCols = sharedCols;

            const tblDef   = (items) => items.length === 0
                ? '<div class="empty-sub">Sin defectos en este apartado.</div>'
                : '<table class="tbl" style="table-layout:fixed;width:100%">' + defCols + '<tbody>' + items.map(buildDefRow).join('') + '</tbody></table>';
            const tblRecom = (items) => items.length === 0
                ? '<div class="empty-sub">Sin recomendaciones.</div>'
                : '<table class="tbl" style="table-layout:fixed;width:100%">' + recomCols + '<tbody>' + items.map(buildRecomRow).join('') + '</tbody></table>';

            const fmtEstado = (e) => {
                const t = e.replace(/✔️|❌|⚠️|➖/g, '').trim();
                if (t === 'POSITIVO')     return '<span style="color:#1a5c2a;font-weight:600">POSITIVO</span>';
                if (t === 'NEGATIVO')     return '<span style="color:#8b0000;font-weight:600">NEGATIVO</span>';
                if (t === 'RECOMENDACIÓN') return '<span style="color:#7a4500;font-weight:600">RECOMEND.</span>';
                if (t === 'NO PROCEDE')   return '<span style="color:#888">N/P</span>';
                return '<span style="color:#aaa">—</span>';
            };

            const NORMAS = {
                'A01': 'RD 3099/1977 Art.26<br>RD 138/2011 IF-10<br>RD 552/2019 IF-10',
                'A02': 'RD 3099/1977 Art.28<br>RD 138/2011 Art.21<br>RD 552/2019 Art.21, IF-15',
                'A03': 'RD 3099/1977 IF-Art.30<br>RD 138/2011 Art.21<br>RD 552/2019 Art.18, IF-15',
                'A04': 'RD 3099/1977 IF-013<br>RD 138/2011 Art.21, IF-10<br>RD 552/2019 Art.21, IF-10',
                'A05': 'RD 3099/1977 IF-Art.25<br>RD 138/2011 Art.20 / Art.21<br>RD 552/2019 Art.20 / Art.21',
                'A06': 'RD 3099/1977 IF-006<br>RD 138/2011 IF-10<br>RD 552/2019 IF-10',
                'A07': 'RD 138/2011 IF-XXX<br>RD 552/2019 IF-06',
                'A08': 'RD 3099/1977 IF-Art.25<br>RD 138/2011 IF-14<br>RD 552/2019 IF-14',
                'A09': 'RD 138/2011 IF-14<br>RD 552/2019 IF-14',
                'A10': 'RD 138/2011 IF-XXX<br>RD 552/2019 Art.18',
                'A11': 'RD 3099/1977 IF-013<br>RD 138/2011 Art.18<br>RD 552/2019 Art.18',
                'A12': 'RD 138/2011 Art.18<br>RD 552/2019 Art.18',
                'A13': 'RD 3099/1977 IF-Art.33<br>RD 138/2011 Art.18<br>RD 552/2019 Art.18',
                'A14': 'RD 3099/1977 IF-015<br>RD 138/2011 Art.26<br>RD 552/2019 Art.18, Art.26',
                'A15': 'RD 138/2011 Art.12<br>RD 552/2019 Art.13<br>RD 865/2003',
                'A16': 'RD 138/2011 IF-14<br>RD 552/2019 IF-14<br>RD 865/2003',
                'A17': 'RD 2267/2004',
                'B01': 'RD 3099/1977 IF-004<br>RD 138/2011 IF-07<br>RD 552/2019 IF-07',
                'B02': 'RD 3099/1977 IF-006<br>RD 138/2011 IF-10<br>RD 552/2019 IF-10',
                'B03': 'RD 138/2011 IF-10<br>RD 552/2019 IF-10',
                'B04': 'RD 3099/1977 IF-XXX<br>RD 138/2011 Art.28; IF-16<br>RD 552/2019 Art.28; IF-10',
                'B05': 'RD 3099/1977 IF-007<br>RD 138/2011 IF-07<br>RD 552/2019 IF-07',
                'B06': 'RD 3099/1977 IF-007<br>RD 138/2011 IF-07<br>RD 552/2019 IF-07',
                'B07': 'RD 138/2011 IF-06<br>RD 552/2019 IF-06',
                'B08': 'RD 138/2011 IF-08<br>RD 552/2019 IF-07',
                'B09': 'RD 3099/1977 Art.34, Art.35<br>RD 138/2011 Art.18; Art.27<br>RD 552/2019 Art.27',
                'B10': 'RD 138/2011 IF-07; IF-08<br>RD 552/2019 IF-07',
                'B11': 'RD 3099/1977 IF-006<br>RD 138/2011 IF-08<br>RD 552/2019 IF-07',
                'B12': 'RD 3099/1977 IF-010<br>RD 138/2011 IF-04; IF-16<br>RD 552/2019 IF-16',
                'B13': 'RD 138/2011 IF-16<br>RD 552/2019 IF-16',
                'B14': 'RD 138/2011 IF-14<br>RD 552/2019 IF-14',
                'B15': 'RD 3099/1977 IF-007<br>RD 138/2011 IF-08<br>RD 552/2019 IF-07',
                'B16': 'RD 3099/1977 IF-012<br>RD 138/2011 IF-07<br>RD 552/2019 IF-07',
                'B17': 'RD 3099/1977 IF-012<br>RD 138/2011 IF-07<br>RD 552/2019 IF-07',
                'B18': 'RD 3099/1977 IF-012<br>RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'B19': 'RD 138/2011 IF-07<br>RD 552/2019 IF-07',
                'B20': 'RD 138/2011 IF-07<br>RD 552/2019 IF-07',
                'B21': 'RD 3099/1977 IF-007<br>RD 138/2011 IF-08<br>RD 552/2019 IF-06; IF-07',
                'B22': 'RD 3099/1977 IF-007<br>RD 138/2011 IF-07<br>RD 552/2019 IF-07',
                'B23': 'RD 3099/1977 IF-016<br>RD 138/2011 IF-16<br>RD 552/2019 IF-16',
                'B24': 'RD 3099/1977 IF-016<br>RD 138/2011 IF-16<br>RD 552/2019 IF-16',
                'B25': 'RD 3099/1977 IF-016<br>RD 138/2011 IF-16<br>RD 552/2019 IF-11; IF-16',
                'B26': 'RD 138/2011 IF-16<br>RD 552/2019 IF-16',
                'B27': 'RD 3099/1977 IF-016<br>RD 138/2011 IF-16<br>RD 552/2019 IF-07',
                'C01': 'RD 138/2011 IF-08; IF-14<br>RD 552/2019 IF-08; IF-14',
                'C02': 'RD 138/2011 IF-14<br>RD 552/2019 IF-14',
                'C03': 'RD 3099/1977 IF-009<br>RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'C04': 'RD 138/2011 IF-08<br>RD 552/2019 IF-14',
                'C05': 'RD 3099/1977 IF-009<br>RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'C06': 'RD 3099/1977 IF-009<br>RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'C07': 'RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'C08': 'RD 3099/1977 IF-009<br>RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'C09': 'RD 3099/1977 IF-009<br>RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'C10': 'RD 3099/1977 IF-009<br>RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'C11': 'RD 3099/1977 IF-009<br>RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'C12': 'RD 3099/1977 IF-009<br>RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'D01': '(Sin norma específica)',
                'D02': '(Sin norma específica)',
                'D03': 'RD 3099/1977 IF-007<br>RD 138/2011 IF-06<br>RD 552/2019 IF-06',
                'D04': 'RD 3099/1977 IF-006<br>RD 138/2011 IF-06<br>RD 552/2019 IF-06',
                'D05': 'RD 138/2011 IF-18<br>RD 552/2019 IF-18',
                'D06': 'RD 138/2011 IF-14<br>RD 552/2019 IF-06; IF-14',
                'D07': '(Sin norma específica)',
                'D08': 'RD 138/2011 IF-06<br>RD 552/2019 IF-06',
                'D09': 'RD 138/2011 IF-06<br>RD 552/2019 IF-06',
                'D10': '(Sin norma específica)',
                'D11': 'RD 138/2011 IF-06<br>RD 552/2019 IF-06',
                'D12': 'RD 138/2011 IF-14<br>RD 552/2019 IF-14',
                'D13': 'RD 138/2011 IF-14<br>RD 552/2019 IF-14',
                'D14': 'RD 138/2011 IF-14<br>RD 552/2019 IF-14',
                'D15': 'RD 138/2011 IF-08<br>RD 552/2019 IF-08',
                'D16': 'RD 138/2011 IF-06<br>RD 552/2019 IF-06',
                'D17': 'RD 138/2011 Art.28<br>RD 552/2019 Art.28',
                'D18': 'RD 138/2011 IF-07<br>RD 552/2019 IF-14',
                'D19': '(Sin norma específica)',
                'D20': 'RD 3099/1977 IF-003<br>RD 138/2011 IF-07<br>RD 552/2019 IF-07',
                'D21': 'RD 138/2011 IF-16<br>RD 552/2019 IF-16',
                'D22': 'RD 138/2011 IF-17<br>RD 552/2019 IF-17',
                'D23': 'RD 138/2011 IF-Art.15<br>RD 552/2019 IF-Art.13<br>RD 865/2003',
                'E01': 'RD 3099/1977 IF-011<br>RD 138/2011 IF-11<br>RD 552/2019 IF-11',
                'E02': 'RD 3099/1977 IF-011<br>RD 138/2011 IF-11<br>RD 552/2019 IF-11',
                'E03': 'RD 138/2011 IF-11<br>RD 552/2019 IF-11',
                'E04': 'RD 3099/1977 IF-012<br>RD 138/2011 IF-12; IF-14<br>RD 552/2019 IF-11',
                'E05': 'RD 138/2011 IF-12; IF-14<br>RD 552/2019 IF-11',
                'E06': 'RD 3099/1977 IF-010<br>RD 138/2011 IF-16<br>RD 552/2019 IF-12; IF-16',
                'E07': 'RD 3099/1977 IF-012<br>RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'E08': 'RD 3099/1977 IF-012<br>RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'E09': 'RD 3099/1977 IF-006<br>RD 138/2011 IF-12<br>RD 552/2019 IF-11',
                'E10': '(Sin norma específica)',
                'E11': 'RD 3099/1977 IF-011<br>RD 138/2011 IF-11<br>RD 552/2019 IF-11',
                'E12': 'RD 3099/1977 IF-011<br>RD 138/2011 IF-11<br>RD 552/2019 IF-11',
                'F01': 'RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'F02': 'RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'F03': 'RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'F04': 'RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'F05': 'RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'F06': 'RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'F07': 'RD 138/2011 IF-12<br>RD 552/2019 IF-12',
                'G01': 'RD 138/2011 IF-17<br>RD 552/2019 IF-17',
                'G02': 'RD 138/2011 IF-17<br>RD 552/2019 IF-17',
                'G03': 'RD 138/2011 IF-17<br>RD 552/2019 IF-17',
                'G04': 'RD 138/2011 IF-17<br>RD 552/2019 IF-17'
            };

            const rowStyle = (item) => {
                const t = item.estado.replace(/✔️|❌|⚠️|➖/g, '').trim();
                if (t === 'NEGATIVO' && item.gravedad === 'Grave') return 'border-left:3px solid #8b0000;background:#fff8f8';
                if (t === 'NEGATIVO') return 'border-left:3px solid #b85000;background:#fffbf5';
                if (t === 'RECOMENDACIÓN') return 'border-left:3px solid #777;background:#f9f9f9';
                return '';
            };

            const infoRow = (label, value, last = false) =>
                `<tr><td style="width:145px;background:#f2f2f2;font-weight:600;font-size:8pt;color:#333;padding:4px 8px;border:0.5px solid #ccc;white-space:nowrap">${label}</td><td style="font-size:8.5pt;padding:4px 8px;border:0.5px solid #ccc;">${value || '<span style="color:#bbb">—</span>'}</td></tr>`;

            const sectionHead = (title) =>
                `<tr><td colspan="4" style="background:#1a2744;color:#fff;font-size:8pt;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 8px;border:1px solid #1a2744">${title}</td></tr>`;

            const CHKHEAD = `<thead><tr>
  <th style="width:5%;text-align:center">ID</th>
  <th style="width:13%">Sección</th>
  <th style="width:35%">Descripción</th>
  <th style="width:26%">Norma</th>
  <th style="width:11%;text-align:center">Resultado</th>
  <th style="width:10%;text-align:center">Gravedad</th>
</tr></thead>`;

            const buildChkRows = (subset) => {
                let rows = '', lastSec = '';
                subset.forEach(item => {
                    if (item.seccion !== lastSec) {
                        rows += `<tr><td colspan="6" style="background:var(--soft);font-weight:700;font-size:8.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);padding:6px 10px;border-bottom:2px solid var(--navy)">${item.seccion}</td></tr>`;
                        lastSec = item.seccion;
                    }
                    const t = item.estado.replace(/✔️|❌|⚠️|➖/g,'').trim();
                    let rc = '';
                    if (t === 'NEGATIVO' && item.gravedad === 'Grave') rc = 'r-grave';
                    else if (t === 'NEGATIVO') rc = 'r-leve';
                    else if (t === 'RECOMENDACIÓN') rc = 'r-recom';
                    else if (t === 'NO PROCEDE') rc = 'r-np';
                    rows += `<tr class="${rc}"><td style="text-align:center;font-weight:700;font-size:8px">${item.id}</td><td style="font-size:9px;color:var(--ink-3)">${item.seccion}</td><td style="font-size:9.5px">${item.descripcion}</td><td style="font-size:8px;line-height:1.4">${NORMAS[item.id]||'<span style="color:var(--line-2)">—</span>'}</td><td style="text-align:center">${fmtEstado(item.estado)}</td><td style="text-align:center;font-size:8.5px">${item.gravedad||'<span style="color:var(--line-2)">—</span>'}</td></tr>`;
                });
                return rows;
            };

            const grpA     = checklistItems.filter(i => i.id.startsWith('A'));
            const grpB1_23 = checklistItems.filter(i => i.id.startsWith('B') && parseInt(i.id.slice(1)) <= 22);
            const grpB24_C = checklistItems.filter(i => (i.id.startsWith('B') && parseInt(i.id.slice(1)) >= 23) || i.id.startsWith('C'));
            const grpD     = checklistItems.filter(i => i.id.startsWith('D'));
            const grpE     = checklistItems.filter(i => i.id.startsWith('E'));
            const grpFG    = checklistItems.filter(i => i.id.startsWith('F') || i.id.startsWith('G'));

            // ── Datos portada/índice/contraportada ──
            const _pdDefaults = this._getPortadaDefaults();
            const _pdData = AppState.portadaData || {};
            const pvL = (k) => _pdData[k] || _pdDefaults[k] || '';
            const _indItemsL = (() => {
                if (!AppState.indiceData.items || !AppState.indiceData.items.length) return [
                    {key:'acta',label:'ACTA',num:'1'},{key:'equipos',label:'CERTIFICADO EQUIPOS A PRESIÓN',num:'2'},
                    {key:'valvulas',label:'CERTIFICADO VÁLVULAS DE SEGURIDAD',num:'3'},{key:'detectores',label:'CERTIFICADO DETECTOR',num:'4'},
                    {key:'termografia',label:'TERMOGRAFÍA',num:'5'},{key:'planificacion',label:'PLANIFICACIÓN',num:'6'}
                ];
                return AppState.indiceData.items;
            })();
            const _contraTextoL = (AppState.contraportadaData || {}).texto || 'CLAUGER REFRIGERACIÓN IBERIA S.A.\nEmpresa Frigorista Autorizada\n\nPara cualquier consulta o información adicional relacionada con este informe, no dude en ponerse en contacto con nuestro departamento técnico.\n\nwww.clauger.com';

            const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${(()=>{const _f=revision['FECHA REVISIÓN']||'';const _y=(_f.match(/\d{4}/)||[new Date().getFullYear()])[0];const _d=(certificado['DICTAMEN']||'ACTA').toUpperCase().replace(/[()]/g,'').replace(/\s+/g,' ').trim();const _s=(informe['SISTEMA']||'SIN_SISTEMA').trim();const _n=(certificado['NÚMERO REVISIÓN']||'SIN_REV').trim();return `${_y}_${_d}_${_s}_${_n}`;})()}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
:root{--navy:#1a2744;--navy-2:#0f1830;--accent:#2f5aa6;--accent-2:#5b86c9;--ink:#1a2744;--ink-2:#515b73;--ink-3:#8b93a7;--line:#e7eaf1;--line-2:#d9dee9;--soft:#f3f5f9;--ok:#1f8a4c;--bad:#c0392b;--warn:#c2871a;--rouge:#d32525}
body{font-family:Arial,Helvetica,sans-serif;font-size:10pt;color:var(--ink);background:#e8e8e8}
.page{width:794px;min-height:1123px;background:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;margin:0 auto}
.page-cover{background:#fff;color:var(--ink)}.page-back{background:#fff;color:var(--ink)}
.pad-pg{padding:54px 60px 70px;flex:1;display:flex;flex-direction:column}
.rh-pg{display:flex;align-items:center;justify-content:space-between;padding:18px 60px;border-bottom:1px solid var(--line)}
.rh-pg img{height:20px;object-fit:contain;display:block}
.rh-pg .meta{font-size:10px;color:var(--ink-3);letter-spacing:.04em;text-transform:uppercase;text-align:right;line-height:1.5}
.rh-pg .meta b{color:var(--ink-2);font-weight:600}
.rf-pg{position:absolute;left:60px;right:60px;bottom:22px;display:flex;justify-content:space-between;font-size:9.5px;color:var(--ink-3);letter-spacing:.03em;padding-top:9px;border-top:1px solid var(--line)}
.toc .it{display:flex;align-items:baseline;gap:10px;padding:9px 0;border-bottom:1px solid var(--line)}
.toc .it .n{font-size:11px;font-weight:700;color:var(--ink-3);width:26px}
.toc .it .t{font-size:12.5px;font-weight:500}
.toc .it .dots{flex:1;border-bottom:1px dotted var(--line-2);transform:translateY(-3px)}
.toc .it .pg{font-size:11.5px;font-weight:600;color:var(--ink-2)}
.peyebrow-pg{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:5px}
.ptitle-pg{font-size:21px;font-weight:800;letter-spacing:-.01em;margin-bottom:16px}
.wrap{width:794px;margin:0 auto;background:#fff;box-shadow:0 2px 12px rgba(0,0,0,.18)}
.rh{display:flex;align-items:center;justify-content:space-between;padding:16px 56px;border-bottom:1px solid var(--line)}
.rh img{height:20px;object-fit:contain;display:block}
.rh .meta{font-size:10px;color:var(--ink-3);letter-spacing:.04em;text-align:right;line-height:1.6}
.rh .meta b{color:var(--ink-2);font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.body{padding:28px 56px 90px}
.blk{margin-top:22px}.blk:first-child{margin-top:0}
.blk-h{display:flex;align-items:center;gap:14px;margin-bottom:12px}
.blk-h .t{font-size:9.5px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:var(--accent);white-space:nowrap}
.blk-h::after{content:"";flex:1;height:1px;background:var(--line)}
.spec{display:grid;grid-template-columns:1fr 1fr;gap:0 48px}
.spec .r{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--line)}
.spec .k{font-size:9px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-3);white-space:nowrap}
.spec .v{font-size:11px;font-weight:600;color:var(--ink);text-align:right}
.spec.one{grid-template-columns:1fr}
table.tbl{width:100%;border-collapse:collapse}
.tbl thead th{font-size:8.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);text-align:left;padding:7px 10px 6px;border-bottom:2px solid var(--navy);background:var(--soft)}
.tbl thead th.num{text-align:right}
.tbl tbody td{font-size:10px;padding:7px 10px;border-bottom:1px solid var(--line);color:var(--ink);vertical-align:top}
.tbl tbody td.num{text-align:right;font-variant-numeric:tabular-nums}
.tbl .lead{font-weight:600}.tbl .muted{color:var(--ink-3)}
tr.r-grave td{background:#ffd0d0!important}
tr.r-leve td{background:#ffe4b8!important}
tr.r-recom td{background:#ebebeb!important}
tr.r-np td{color:inherit}
.dictamen{border:1px solid var(--line-2);margin-bottom:16px;margin-top:4px;page-break-inside:avoid}
.dictamen-head{background:var(--navy);color:#fff;padding:7px 12px;font-weight:700;font-size:10px;letter-spacing:.3px}
.dictamen-body{padding:10px 12px;font-size:10px;line-height:1.65;text-align:justify}
.sigs{display:table;width:100%;margin-top:28px;border-top:2px solid var(--navy);padding-top:8px}
.sig{display:table-cell;width:50%;text-align:center}
.sig-line{border-top:1.5px solid #222;margin:52px 22px 5px}
.sig-name{font-weight:700;font-size:9.5px}
.sig-sub{font-size:8.5px;color:var(--ink-3)}
.notice{border:1px solid var(--line);padding:10px 14px;text-align:center;font-size:10px;background:var(--soft);margin-bottom:14px}
.sub-block{margin:8px 0 0;border:1px solid #b0c4de;page-break-inside:avoid}
.sub-title{background:#b0c8e8;color:var(--navy);font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 10px}
.sub-sub-block{margin:0;border-top:1px solid #c8d8eb}
.sub-sub-title{background:#dce8f8;color:var(--navy);font-size:7.5px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:4px 10px;border-bottom:1px solid #ccc}
.empty-sub{font-size:8px;color:#888;padding:6px 10px;background:#fafafa;font-style:italic}
.dcard{border:1px solid var(--line-2);margin-bottom:10px;page-break-inside:avoid}
.dcard-head{background:var(--accent);color:#fff;padding:6px 10px;display:table;width:100%}
.dcard-id{display:table-cell;font-size:12px;font-weight:700;width:44px;vertical-align:middle}
.dcard-desc{display:table-cell;font-size:8.5px;vertical-align:middle}
.dcard-badge{display:table-cell;text-align:right;vertical-align:middle;white-space:nowrap}
.badge{display:inline-block;font-size:7.5px;font-weight:700;padding:2px 8px;letter-spacing:.5px}
.b-grave{background:#8b0000;color:#fff}.b-leve{background:#b06000;color:#fff}.b-recom{background:var(--navy);color:#fff}
.dcard-body{padding:8px 10px}
.dcard-meta{display:table;width:100%;font-size:8.5px;margin-bottom:8px}
.dcard-meta-cell{display:table-cell;width:50%;padding:2px 0}
.dcard-meta-cell span{font-weight:600;color:var(--ink)}
.dcard-obs{font-size:8.5px;background:var(--soft);border-left:2px solid var(--accent);padding:5px 8px;margin-bottom:8px}
.img-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.img-cell img{width:100%;height:280px;object-fit:contain;background:#f0f0f0;display:block;border:1px solid var(--line)}
.print-bar{position:fixed;bottom:0;left:0;right:0;background:var(--navy);padding:10px;text-align:center;display:flex;justify-content:center;gap:12px;z-index:999}
.btn-p{padding:7px 28px;background:#fff;color:var(--navy);border:none;font-size:10px;font-weight:700;cursor:pointer;letter-spacing:.5px}
.btn-c{padding:7px 20px;background:transparent;color:#fff;border:1px solid #fff;font-size:10px;cursor:pointer}
.print-ftr{display:none}
@media print{
  body{background:#fff}
  .page{width:210mm;min-height:296.6mm;box-sizing:border-box;margin:0;box-shadow:none;overflow:visible;page-break-after:always;break-after:page;page-break-inside:avoid;break-inside:avoid}
  .page:last-child{page-break-after:avoid;break-after:auto}
  .page-cover,.page-back{min-height:296.6mm;overflow:hidden}
  .wrap{width:210mm;margin:0;box-shadow:none}
  .print-bar{display:none}
  .page-break{page-break-before:always;padding-top:20px}
  .sub-block{page-break-inside:avoid}
  .dictamen{page-break-inside:avoid}
  .dcard{page-break-inside:avoid}
  tr{page-break-inside:avoid;break-inside:avoid}
  thead{display:table-header-group}
  img{image-rendering:high-quality}
  .print-ftr{display:flex!important;position:fixed;bottom:0;left:0;right:0;padding:6px 56px;border-top:1px solid var(--line);font-size:8.5px;color:var(--ink-3);background:#fff;justify-content:space-between;align-items:center;z-index:999}
  @page{size:A4;margin:0}
}
</style>
</head>
<body>
<!-- ══ PORTADA ══ -->
<div class="page page-cover">
  <div style="display:flex;height:5px"><i style="width:120px;background:var(--rouge)"></i><i style="flex:1;background:var(--accent)"></i></div>
  <div style="display:flex;align-items:flex-start;justify-content:space-between;padding:46px 60px 0">
    ${logoBase64?`<img src="${logoBase64}" style="height:30px;object-fit:contain;display:block" alt="CLAUGER">`:`<span style="font-weight:800;font-size:22px;color:var(--navy)">CLAUGER</span>`}
    <div style="text-align:right;font-size:10px;line-height:1.7;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-3)">
      ${pvL('referencia')?`<b style="display:block;color:var(--ink-2);font-weight:700;font-size:11px">${pvL('referencia')}</b>`:''}Informe técnico${pvL('anio')?' &middot; '+pvL('anio'):''}
    </div>
  </div>
  <img src="imagenes/clauger-macaron-faint.png" style="position:absolute;top:120px;right:-70px;width:430px;opacity:.5" alt="">
  <div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;padding:0 60px;position:relative;z-index:1">
    <div style="font-size:11px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:var(--accent)">Informe técnico reglamentario</div>
    <div style="font-size:46px;font-weight:800;line-height:1.06;letter-spacing:-.02em;color:var(--navy);margin-top:22px">${pvL('titulo')}</div>
    <div style="font-size:16px;color:var(--ink-2);margin-top:16px">${pvL('subtitulo')}</div>
    <div style="display:flex;align-items:center;gap:14px;margin:32px 0 40px">
      <i style="width:60px;height:3px;background:var(--accent)"></i>
      <span style="font-weight:700;color:var(--accent);font-size:20px;line-height:1">&#8600;</span>
    </div>
    <div style="border:1px solid var(--line-2);border-radius:10px;padding:26px 30px;max-width:430px">
      <div style="font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:14px">Datos del cliente</div>
      ${pvL('cliente')?`<div style="font-size:18px;font-weight:700;color:var(--navy)">${pvL('cliente')}</div>`:''}
      ${pvL('direccion')?`<div style="font-size:13px;color:var(--ink-2);line-height:1.6;margin-top:6px">${pvL('direccion')}</div>`:''}
      ${(pvL('cp')||pvL('localidad'))?`<div style="font-size:13px;color:var(--ink-2);line-height:1.6">${[pvL('cp'),pvL('localidad')].filter(Boolean).join(' &mdash; ')}</div>`:''}
      ${pvL('provincia')?`<div style="font-size:13px;color:var(--ink-2);line-height:1.6">${pvL('provincia')}</div>`:''}
      <div style="display:flex;gap:30px;margin-top:20px;padding-top:18px;border-top:1px solid var(--line)">
        ${pvL('referencia')?`<div><div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);font-weight:700">Referencia</div><div style="font-size:14px;font-weight:700;color:var(--navy);margin-top:4px">${pvL('referencia')}</div></div>`:''}
        ${pvL('anio')?`<div><div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);font-weight:700">Año</div><div style="font-size:14px;font-weight:700;color:var(--navy);margin-top:4px">${pvL('anio')}</div></div>`:''}
      </div>
    </div>
  </div>
  <div style="padding:18px 60px 40px">
    <div style="border-top:1px solid var(--line);padding-top:16px;display:flex;justify-content:space-between;font-size:10px;color:var(--ink-3);letter-spacing:.04em">
      <span><b style="color:var(--ink-2)">CLAUGER Refrigeración Iberia S.A.</b> &middot; Empresa Frigorista Autorizada</span>
      <span>Documento confidencial</span>
    </div>
  </div>
</div>

<!-- ══ ÍNDICE ══ -->
<div class="page">
  <div class="rh-pg">
    ${logoBase64?`<img src="${logoBase64}" alt="CLAUGER">`:`<span style="font-weight:800;font-size:15px;color:var(--navy)">CLAUGER</span>`}
    <div class="meta"><b>Índice de documentos</b> &middot; Revisión Final</div>
  </div>
  <div class="pad-pg">
    <div class="peyebrow-pg">Contenido</div>
    <div class="ptitle-pg">Índice de documentos</div>
    <div class="toc">
      ${_indItemsL.map(item=>`<div class="it"><span class="n">${String(item.num||'').padStart(2,'0')}</span><span class="t">${item.label}</span><span class="dots"></span><span class="pg">&mdash;</span></div>`).join('')}
    </div>
  </div>
  <div class="rf-pg">
    <span><b>CLAUGER Ibérica, S.L.U.</b> &middot; Documento confidencial</span>
    <span>${pvL('referencia')||''}</span>
  </div>
</div>

<div class="print-ftr"><span><b>CLAUGER Ibérica, S.L.U.</b> &middot; Documento confidencial</span><span>${certificado['ID INFORME']||''}</span></div>
<div class="wrap">

<div class="rh">
  ${logoBase64?`<img src="${logoBase64}" alt="CLAUGER">`:`<span style="font-weight:800;font-size:15px;color:var(--navy)">CLAUGER</span>`}
  <div class="meta">
    <b>${certificado['TIPO DE ACTA']||'ACTA INICIAL'}</b><br>
    N.º&nbsp;${certificado['ID INFORME']||'—'} &middot; Rev.&nbsp;${certificado['REVISIÓN']||'—'} &middot; ${revision['FECHA REVISIÓN']||'—'}
  </div>
</div>

<div class="body">

<!-- DELEGACIÓN + CLIENTE -->
<div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">
  <div>
    <div class="blk"><div class="blk-h"><span class="t">Datos de delegación</span></div>
    <div class="spec one">
      <div class="r"><span class="k">Delegación</span><span class="v">${delegacion['DELEGACIÓN']||'&mdash;'}</span></div>
      <div class="r"><span class="k">Dirección</span><span class="v">${delegacion['DIRECCIÓN']||'&mdash;'}</span></div>
      <div class="r"><span class="k">Población</span><span class="v">${delegacion['POBLACIÓN']||'&mdash;'}</span></div>
      <div class="r"><span class="k">Provincia / C.P.</span><span class="v">${[delegacion['PROVINCIA'],delegacion['C.P.']].filter(Boolean).join(' &middot; ')||'&mdash;'}</span></div>
    </div></div>
  </div>
  <div>
    <div class="blk"><div class="blk-h"><span class="t">Datos del cliente</span></div>
    <div class="spec one">
      <div class="r"><span class="k">Cliente</span><span class="v">${cliente['CLIENTE']||'&mdash;'}</span></div>
      <div class="r"><span class="k">CIF</span><span class="v">${cliente['CIF']||'&mdash;'}</span></div>
      <div class="r"><span class="k">Dirección</span><span class="v">${cliente['DIRECCIÓN']||'&mdash;'}</span></div>
      <div class="r"><span class="k">Localidad / C.P.</span><span class="v">${[cliente['LOCALIDAD'],cliente['CP']].filter(Boolean).join(' &middot; ')||'&mdash;'}</span></div>
      <div class="r"><span class="k">Provincia</span><span class="v">${cliente['PROVINCIA']||'&mdash;'}</span></div>
    </div></div>
  </div>
</div>

<!-- INSTALACIÓN -->
<div class="blk"><div class="blk-h"><span class="t">Datos de la instalación</span></div>
<div class="spec">
  <div class="r"><span class="k">Ref. EFA</span><span class="v">${instalacion['REF. EFA']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Ref. Titular</span><span class="v">${instalacion['REF. TITULAR']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Descripción</span><span class="v">${instalacion['DESCRIPCIÓN']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Finalidad</span><span class="v">${instalacion['FINALIDAD']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Reglamento</span><span class="v">${instalacion['REGLAMENTO']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Fecha PS</span><span class="v">${instalacion['FECHA PS']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Clas. Emplazamiento</span><span class="v">${instalacion['CLAS. EMPLAZ.']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Clas. Local</span><span class="v">${instalacion['CLAS. LOCAL']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Nivel</span><span class="v">${instalacion['NIVEL']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Pot. Abs. (kW)</span><span class="v">${instalacion['POT. ABS (kW)']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Sistema</span><span class="v">${instalacion['SISTEMA REFRIG.']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Tipo</span><span class="v">${instalacion['TIPO']||'&mdash;'}</span></div>
</div></div>

<!-- CIRCUITOS -->
<div class="blk"><div class="blk-h"><span class="t">Circuitos de refrigeración</span></div>
<table class="tbl">
  <thead><tr>
    <th style="width:38px;text-align:center">#</th>
    <th>Refrigerante</th><th class="num">Carga (kg)</th><th class="num">PCA</th><th class="num">Tn eq. CO₂</th><th>Detector</th>
  </tr></thead>
  <tbody>
  ${AppState.instalacionCircuitos.map((c, i) => {
      if (!c.refrigerante && !c.carga) return '';
      const pca = REFRIGERANTES_PCA[c.refrigerante] || '';
      const kg  = parseFloat(c.carga) || 0;
      const tn  = pca && kg > 0 ? ((kg * pca) / 1000).toFixed(3) : '—';
      return `<tr><td style="text-align:center;font-weight:700">${i+1}</td><td class="lead">${c.refrigerante||'—'}</td><td class="num">${c.carga||'—'}</td><td class="num muted">${pca||'—'}</td><td class="num">${tn}</td><td>${c.detector||'—'}</td></tr>`;
  }).join('')}
  </tbody>
</table></div>

${AppState.instalacionSalas.length > 0 ? `
<div class="blk"><div class="blk-h"><span class="t">Salas de máquinas</span></div>
<table class="tbl">
  <thead><tr><th>Nombre</th><th>Descripción</th></tr></thead>
  <tbody>${AppState.instalacionSalas.map(s => `<tr><td class="lead">${s.nombre}</td><td>${s.valor}</td></tr>`).join('')}</tbody>
</table></div>` : ''}

<!-- REVISIÓN -->
<div class="blk"><div class="blk-h"><span class="t">Datos de revisión</span></div>
<div class="spec">
  <div class="r"><span class="k">Fecha revisión</span><span class="v">${revision['FECHA REVISIÓN']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Periodicidad rev.</span><span class="v">${revision['PERIODICIDAD REVISIÓN']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Próxima revisión</span><span class="v">${revision['PRÓXIMA REVISIÓN']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Última inspección</span><span class="v">${revision['ÚLTIMA INSPECCIÓN']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Periodicidad insp.</span><span class="v">${revision['PERIODICIDAD INSPECCIÓN']||'&mdash;'}</span></div>
  <div class="r"><span class="k">Próxima inspección</span><span class="v">${revision['PRÓXIMA INSPECCIÓN']||'&mdash;'}</span></div>
</div></div>

<!-- DICTAMEN -->
<div class="dictamen">
  <div class="dictamen-head">DICTAMEN: ${certificado['DICTAMEN']||'No especificado'}</div>
  <div class="dictamen-body">
    ${certificado['FECHA LÍMITE CORRECCIÓN'] ? `<div style="margin-bottom:8px"><strong>Fecha límite de corrección:</strong> ${certificado['FECHA LÍMITE CORRECCIÓN']}</div>` : ''}
    ${certificado['COMENTARIOS']||'No se ha especificado comentario para este dictamen.'}
  </div>
</div>

<!-- FIRMAS -->
<div class="sigs">
  <div class="sig"><div class="sig-line"></div><div class="sig-name">Técnico Inspector</div><div class="sig-sub">CLAUGER</div></div>
  <div class="sig"><div class="sig-line"></div><div class="sig-name">Titular de la Instalación</div><div class="sig-sub">${cliente['CLIENTE']||''}</div></div>
</div>

<!-- CHECKLIST A (A01–A17) -->
<div class="blk page-break"><div class="blk-h"><span class="t">Checklist de inspección</span></div>
<table class="tbl" style="table-layout:fixed">
  ${CHKHEAD}
  <tbody>${buildChkRows(grpA)}</tbody>
</table></div>

<!-- CHECKLIST B01–B23 -->
<div class="blk page-break">
<table class="tbl" style="table-layout:fixed">
  ${CHKHEAD}
  <tbody>${buildChkRows(grpB1_23)}</tbody>
</table></div>

<!-- CHECKLIST B24–C12 -->
<div class="blk page-break">
<table class="tbl" style="table-layout:fixed">
  ${CHKHEAD}
  <tbody>${buildChkRows(grpB24_C)}</tbody>
</table></div>

<!-- CHECKLIST D -->
<div class="blk page-break">
<table class="tbl" style="table-layout:fixed">
  ${CHKHEAD}
  <tbody>${buildChkRows(grpD)}</tbody>
</table></div>

<!-- CHECKLIST E -->
<div class="blk page-break">
<table class="tbl" style="table-layout:fixed">
  ${CHKHEAD}
  <tbody>${buildChkRows(grpE)}</tbody>
</table></div>

<!-- CHECKLIST F+G -->
<div class="blk page-break">
<table class="tbl" style="table-layout:fixed">
  ${CHKHEAD}
  <tbody>${buildChkRows(grpFG)}</tbody>
</table></div>

<!-- DEFICIENCIAS DETECTADAS -->
<div class="blk page-break"><div class="blk-h"><span class="t">Deficiencias detectadas</span></div>
  ${!hayDeficiencias ? '<div class="notice"><strong>Sin deficiencias detectadas.</strong> La instalación no presenta deficiencias en ninguno de los puntos inspeccionados.</div>' : ''}

  ${hayDeficiencias ? `
  <div class="sub-block">
    <div class="sub-title">Revisión Periódica</div>
    ${tblDef(grpRevision)}
  </div>

  <div class="sub-block">
    <div class="sub-title">Previa Inspección Periódica</div>
    <div class="sub-sub-block">
      <div class="sub-sub-title">Documentales</div>
      ${tblDef(grpDocumental)}
    </div>
    <div class="sub-sub-block">
      <div class="sub-sub-title">Control Instalación</div>
      ${tblDef(grpControl)}
    </div>
  </div>

  <div class="sub-block">
    <div class="sub-title">Recomendaciones / Mejoras</div>
    ${tblRecom(recomendaciones)}
  </div>
  ` : ''}
</div>

<!-- RESPONSABILIDADES Y SANCIONES -->
<div class="blk page-break"><div class="blk-h"><span class="t">Responsabilidades, obligaciones y sanciones</span></div>

<div style="font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid var(--navy)">Responsabilidades y obligaciones del titular &mdash; RD 552/2019 Art. 17</div>
<div style="font-size:10.5px;line-height:1.7;color:var(--ink-2);margin-bottom:14px">
  <div style="margin-bottom:5px"><b style="color:var(--ink)">a)</b> Conocer y aplicar las disposiciones del presente Reglamento en lo que se refiere al funcionamiento y acondicionamiento de las instalaciones.</div>
  <div><b style="color:var(--ink)">m)</b> Ordenar la realización de las inspecciones periódicas que les correspondan, de acuerdo con lo dispuesto en el artículo 26.3.</div>
</div>

<div style="font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid var(--navy)">Sanciones</div>
<div style="font-size:10.5px;line-height:1.75;color:var(--ink-2);margin-bottom:10px;text-align:justify">El incumplimiento de lo establecido en RD 552/2019 será sancionado de acuerdo con lo establecido en el título V de la Ley 21/1992, de 16 de julio, y en el texto refundido de la Ley sobre Infracciones y Sanciones en el Orden Social, aprobado por el Real Decreto Legislativo 5/2000, de 4 de agosto, en este último caso en la medida que dicho incumplimiento constituya violación de norma jurídico-técnica que incida en las condiciones de trabajo en materia de prevención de riesgos laborales.</div>
<div style="font-size:10.5px;line-height:1.75;color:var(--ink-2);margin-bottom:10px;text-align:justify">La comprobación del incumplimiento de las obligaciones establecidas en el presente Reglamento, con independencia de las sanciones indicadas en la Ley citada anteriormente, podrá dar lugar a que, de acuerdo con el artículo 10.2 de dicha Ley, por el órgano competente de la correspondiente Comunidad Autónoma se acuerde la paralización temporal de la actividad, total o parcial, requiriendo a los responsables para que corrijan las deficiencias o ajusten su funcionamiento a las normas reguladoras, en tanto no compruebe dicho órgano competente que se han subsanado las causas que hubieran dado lugar a la suspensión.</div>
<div style="font-size:10.5px;line-height:1.75;color:var(--ink-2);margin-bottom:16px;text-align:justify">Cuando se haya dictado una resolución sancionadora en vía administrativa en la que se acuerde la paralización o no de la actividad, se establecerá el plazo en el que debe corregirse la causa que haya dado lugar a la infracción, salvo que pueda y deba hacerse de oficio y así se determine. Una vez que dicha resolución sancionadora sea ejecutiva en vía administrativa, de no haberse corregido en plazo la conducta que motivó aquella, podrá considerarse que la persistencia en esa conducta constituye reincidencia.</div>

<div style="background:var(--soft);border:1px solid var(--line-2);padding:14px 20px;font-size:10.5px;line-height:1.8;color:var(--ink-2);text-align:center">
  <div style="font-weight:700;color:var(--ink);margin-bottom:6px">Ley 21-1992 &nbsp;&middot;&nbsp; Artículo 34. Sanciones.</div>
  <div>1. Las infracciones serán sancionadas en la forma siguiente:</div>
  <div>a) Las infracciones leves con multas de hasta <b style="color:var(--ok)">60.000 euros</b>.</div>
  <div>b) Las infracciones graves con multas de hasta <b style="color:var(--warn)">6.000.000 euros</b>.</div>
  <div>c) Las infracciones muy graves con multas de hasta <b style="color:var(--bad)">100.000.000 euros</b>.</div>
</div>

</div>

<!-- EVIDENCIAS FOTOGRÁFICAS -->
${(() => {
  if (!itemsConImagenes.length) return '';
  const buildDcard = (item) => {
    const t = item.estado.replace(/✔️|❌|⚠️|➖/g,'').trim();
    const badgeCls = t === 'RECOMENDACIÓN' ? 'b-recom' : item.gravedad === 'Grave' ? 'b-grave' : 'b-leve';
    const badgeTxt = t === 'NEGATIVO' ? `NEGATIVO${item.gravedad ? ' · ' + item.gravedad : ''}` : 'RECOMENDACIÓN';
    return `<div class="dcard">
  <div class="dcard-head">
    <div class="dcard-id">${item.id}</div>
    <div class="dcard-desc">${item.descripcion}<br><span style="font-size:7.5px;opacity:.75">${item.seccion}</span></div>
    <div class="dcard-badge"><span class="badge ${badgeCls}">${badgeTxt}</span></div>
  </div>
  <div class="dcard-body">
    ${item.correccion ? `<div class="dcard-meta"><div class="dcard-meta-cell"><span>A corregir: </span>${item.correccion}</div></div>` : ''}
    ${item.observaciones ? `<div class="dcard-obs"><strong>Observaciones:</strong> ${item.observaciones}</div>` : ''}
    <div class="img-grid">
      ${item.imagenes.map((img, idx) => `
      <div class="img-cell">
        <img src="${img.data}" alt="Img ${idx+1}">
      </div>`).join('')}
    </div>
  </div>
</div>`;
  };
  let html = '';
  for (let i = 0; i < itemsConImagenes.length; i += 2) {
    const chunk = itemsConImagenes.slice(i, i + 2);
    const title = i === 0 ? '<div class="blk-h"><span class="t">Defectos detectados — fotografías</span></div>' : '';
    html += `<div class="blk page-break">${title}${chunk.map(buildDcard).join('')}</div>`;
  }
  return html;
})()}


</div><!-- /body -->
</div><!-- /wrap -->

<!-- ══ CONTRAPORTADA ══ -->
<div class="page page-back">
  <div style="display:flex;height:5px"><i style="width:120px;background:var(--rouge)"></i><i style="flex:1;background:var(--accent)"></i></div>
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 60px;text-align:center">
    <img src="imagenes/clauger-macaron-color.png" style="width:78px;object-fit:contain;display:block;margin-bottom:30px" alt="CLAUGER">
    <div style="font-size:24px;font-weight:700;color:var(--navy);line-height:1.3;max-width:440px;letter-spacing:-.02em;white-space:pre-line">${_contraTextoL.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
    <div style="width:60px;height:3px;background:var(--accent);margin:34px auto"></div>
    <div style="display:flex;gap:64px;justify-content:center;text-align:left">
      <div>
        <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:10px">Contacto</div>
        <div style="font-size:13px;color:var(--ink-2);line-height:1.7"><b style="color:var(--navy)">CLAUGER Refrigeración Iberia S.A.</b><br>Empresa Frigorista Autorizada<br>www.clauger.com</div>
      </div>
      ${pvL('referencia')?`<div>
        <div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:700;margin-bottom:10px">Documento</div>
        <div style="font-size:13px;color:var(--ink-2);line-height:1.7">Ref. <b style="color:var(--navy)">${pvL('referencia')}</b>${pvL('anio')?`<br>Emitido en ${pvL('anio')}`:''}
<br>Confidencial — uso del cliente</div>
      </div>`:''}
    </div>
  </div>
  <div style="padding:22px 60px 40px">
    <div style="border-top:1px solid var(--line);padding-top:16px;display:flex;justify-content:space-between;font-size:10px;color:var(--ink-3);letter-spacing:.04em">
      <span><b style="color:var(--ink-2)">CLAUGER Refrigeración Iberia S.A.</b></span>
      <span>www.clauger.com &middot; Documento confidencial</span>
    </div>
  </div>
</div>

<div class="print-bar">
  <span style="color:#ffdd57;font-size:9px;font-weight:600;letter-spacing:.02em">&#9888; En Destino elige &laquo;Guardar como PDF&raquo; (no &laquo;Microsoft Print to PDF&raquo;) &middot; M&aacute;rgenes: Ninguno &middot; Gr&aacute;ficos de fondo: activado</span>
  <button class="btn-p" onclick="window.print()">IMPRIMIR / GUARDAR PDF</button>
  <button class="btn-c" onclick="window.close()">CERRAR</button>
</div>
</body>
</html>`;

            const w = window.open('', '_blank', 'width=1050,height=860');
            if (w) {
                w.document.write(html);
                w.document.close();
            } else {
                this.showToast('Permite ventanas emergentes en el navegador', 'error');
            }
        } catch (err) {
            console.error('Error generando Acta:', err);
            this.showToast('Error al generar el documento', 'error');
        }
    },

    async generateInformeFinal() {
        this.showToast('Procesando PDFs adjuntos...', 'success');
        try {
            const instalacion = AppState.sectionsData['datos_datos_instalacion'] || {};
            const revision    = AppState.sectionsData['datos_datos_revision']    || {};
            const certificadoIF = AppState.sectionsData['datos_datos_certificado'] || {};
            const informeIF     = AppState.sectionsData['datos_datos_instalacion'] || {};

            const defaults = this._getPortadaDefaults();
            const pd = AppState.portadaData;
            const pv = (key) => pd[key] || defaults[key] || '';

            if (!AppState.indiceData.items || AppState.indiceData.items.length === 0) {
                AppState.indiceData.items = [
                    { key: 'acta',          label: 'ACTA',                             num: '1' },
                    { key: 'equipos',       label: 'CERTIFICADO EQUIPOS A PRESIÓN',     num: '2' },
                    { key: 'valvulas',      label: 'CERTIFICADO VÁLVULAS DE SEGURIDAD', num: '3' },
                    { key: 'detectores',    label: 'CERTIFICADO DETECTOR',              num: '4' },
                    { key: 'termografia',   label: 'TERMOGRAFÍA',                       num: '5' },
                    { key: 'planificacion', label: 'PLANIFICACIÓN',                     num: '6' }
                ];
            } else {
                const _VK = ['acta','equipos','valvulas','detectores','termografia','planificacion'];
                const _LKM = {'ACTA':'acta','CERTIFICADO EQUIPOS A PRESIÓN':'equipos','CERTIFICADO VÁLVULAS DE SEGURIDAD':'valvulas','CERTIFICADO DETECTOR':'detectores','TERMOGRAFÍA':'termografia','PLANIFICACIÓN':'planificacion'};
                AppState.indiceData.items.forEach((item, idx) => {
                    if (!item.key || !_VK.includes(item.key)) {
                        item.key = _LKM[(item.label||'').toUpperCase().trim()] || 'custom_' + idx;
                    }
                });
            }
            const indiceItems = AppState.indiceData.items;

            const nivel     = instalacion['NIVEL'] || '—';
            const periodRev  = revision['PERIODICIDAD REVISIÓN']   || '5 años';
            const periodInsp = revision['PERIODICIDAD INSPECCIÓN'] || '—';
            const proxRev    = revision['PRÓXIMA REVISIÓN']        || '';
            const proxInsp   = revision['PRÓXIMA INSPECCIÓN']      || '';

            const formatFecha = (dateStr) => {
                if (!dateStr) return '— / — / ——';
                const d = new Date(dateStr);
                const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
                               'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
                return `${String(d.getDate()).padStart(2,'0')} / ${meses[d.getMonth()]} / ${d.getFullYear()}`;
            };

            const plan = AppState.planificacionData || { textoRevision: '', textoInspeccion: '' };
            const textoRev  = plan.textoRevision  || `La periodicidad para realizar las revisiones periódicas será como norma general de ${periodRev}, salvo que los sistemas que utilicen una carga de refrigerante superior a 3000 kg y posean una antigüedad superior a quince años se revisarán al menos cada dos años.\nLa próxima revisión obligatoria de la instalación frigorífica, realizada por parte de una empresa frigorista autorizada de Nivel ${nivel} deberá realizarse antes de ${formatFecha(proxRev)}.`;
            const textoInsp = plan.textoInspeccion || `Como norma general las instalaciones de Nivel 2 se inspeccionarán por parte de un Órgano de Control cada 10 años, salvo las que utilicen gases de tipo HFC, las cuales, independientemente de su nivel, se inspeccionarán en función de las Tn equivalentes de CO2, ver tabla 1.\n\nLa próxima inspección periódica obligatoria de la instalación frigorífica, realizada por parte de Órgano de Control deberá realizarse antes de ${formatFecha(proxInsp)}.`;
            const contraTexto = AppState.contraportadaData.texto || 'CLAUGER REFRIGERACIÓN IBERIA S.A.\nEmpresa Frigorista Autorizada\n\nPara cualquier consulta o información adicional relacionada con este informe, no dude en ponerse en contacto con nuestro departamento técnico.\n\nwww.clauger.com';

            // ── Datos para tabla de periodicidad revisión en planificación ──
            const _fechaPS = instalacion['FECHA PS'] || '';
            const _totalKg = (AppState.instalacionCircuitos || []).reduce((s, c) => s + (parseFloat(c.carga) || 0), 0);
            let _ageYears = null;
            if (_fechaPS) { const _dp = new Date(_fechaPS); if (!isNaN(_dp)) _ageYears = (Date.now() - _dp.getTime()) / (1000*60*60*24*365.25); }
            const _isAntigua = _ageYears !== null && _ageYears >= 15;
            const _isHeavy   = _totalKg >= 3000;

            // ── Índice dinámico ──
            const _defaultIndItems = [
                {key:'acta',label:'ACTA',num:'1'},{key:'equipos',label:'CERTIFICADO EQUIPOS A PRESIÓN',num:'2'},
                {key:'valvulas',label:'CERTIFICADO VÁLVULAS DE SEGURIDAD',num:'3'},{key:'detectores',label:'CERTIFICADO DETECTOR',num:'4'},
                {key:'termografia',label:'TERMOGRAFÍA',num:'5'},{key:'planificacion',label:'PLANIFICACIÓN',num:'6'}
            ];
            const _indItems = (AppState.indiceData && AppState.indiceData.items && AppState.indiceData.items.length > 0)
                ? AppState.indiceData.items
                : _defaultIndItems;
            const _hasSec = (key) => _indItems.some(i => i.key === key);
            const _secNum = (key) => { const idx = _indItems.findIndex(i => i.key === key); return idx >= 0 ? idx + 1 : 0; };

            // ── Render PDF attachments to images ──
            const _renderPdfPages = async (archivos) => {
                const imgs = [];
                for (const f of archivos) {
                    try {
                        const pages = await this._pdfToImages(f.data);
                        pages.forEach(img => imgs.push(img));
                    } catch(e) {
                        console.warn('Error rendering PDF:', f.name, e);
                    }
                }
                return imgs;
            };

            // ── Logo paths ──
            const LOGO_COLOR         = 'imagenes/clauger-color.png';
            const LOGO_WHITE         = 'imagenes/clauger-logo-white.png';
            const LOGO_MACARON       = 'imagenes/clauger-macaron-color.png';
            const LOGO_MACARON_FAINT = 'imagenes/clauger-macaron-faint.png';

            const actaInicialImgs = await _renderPdfPages(AppState.actaInicialArchivos);
            const certPsvImgs     = await _renderPdfPages(AppState.certPsvArchivos);
            const detectorCertImgs = [];
            for (const det of AppState.detectorsData) {
                detectorCertImgs.push(await _renderPdfPages(det.certArchivos || []));
            }

            // ── Shared CSS ──
            const SHARED_CSS = `
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
:root{--navy:#1a2744;--navy-2:#0f1830;--accent:#2f5aa6;--accent-2:#5b86c9;--ink:#1a2744;--ink-2:#515b73;--ink-3:#8b93a7;--line:#e7eaf1;--line-2:#d9dee9;--soft:#f3f5f9;--ok:#1f8a4c;--bad:#c0392b;--warn:#c2871a;--rouge:#d32525}
body{font-family:Arial,Helvetica,sans-serif;font-size:10pt;color:var(--ink);background:#e8e8e8}
.page{width:794px;min-height:1123px;background:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;margin:0 auto}
.pad{padding:54px 60px 70px;flex:1;display:flex;flex-direction:column}
.rh{display:flex;align-items:center;justify-content:space-between;padding:18px 60px;border-bottom:1px solid var(--line)}
.rh img{height:20px;object-fit:contain;display:block}
.rh .meta{font-size:10px;color:var(--ink-3);letter-spacing:.04em;text-transform:uppercase;text-align:right;line-height:1.5}
.rh .meta b{color:var(--ink-2);font-weight:600}
.rf{position:absolute;left:60px;right:60px;bottom:22px;display:flex;justify-content:space-between;font-size:9.5px;color:var(--ink-3);letter-spacing:.03em;padding-top:9px;border-top:1px solid var(--line)}
.rf b{color:var(--ink-2);font-weight:600}
.blk{margin-top:26px}
.blk:first-child{margin-top:8px}
.blk-h{display:flex;align-items:center;gap:14px;margin-bottom:14px}
.blk-h .t{font-size:10px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:var(--accent);white-space:nowrap}
.blk-h::after{content:"";flex:1;height:1px;background:var(--line)}
.spec{display:grid;grid-template-columns:1fr 1fr;gap:0 48px}
.spec .r{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid var(--line)}
.spec .k{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--ink-3);white-space:nowrap}
.spec .v{font-size:11.5px;font-weight:600;color:var(--ink);text-align:right}
.spec.one{grid-template-columns:1fr}
table.tbl{width:100%;border-collapse:collapse}
.tbl thead th{font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);text-align:left;padding:8px 12px 7px;border-bottom:2px solid var(--navy);background:var(--soft)}
.tbl thead th.num{text-align:right}
.tbl tbody td{font-size:11px;padding:8px 12px;border-bottom:1px solid var(--line);color:var(--ink);vertical-align:top}
.tbl tbody td.num{text-align:right;font-variant-numeric:tabular-nums}
.tbl tbody tr:last-child td{border-bottom:1.5px solid var(--line-2)}
.tbl .lead{font-weight:600}
.tbl .muted{color:var(--ink-3)}
.tbl.ab thead th.side{text-align:left}
.tbl.ab thead th.side b{color:var(--accent)}
.tbl.ab tbody th{text-align:left;font-size:10px;font-weight:600;color:var(--ink-2);padding:8px 12px;border-bottom:1px solid var(--line);width:36%;background:var(--soft)}
.tbl.ab tbody td{border-left:1px solid var(--line)}
.note{font-size:10.5px;color:var(--ink-2);background:var(--soft);border-left:3px solid var(--accent);padding:10px 13px;margin-top:12px;line-height:1.55;border-radius:0 4px 4px 0}
.note b{color:var(--ink)}
.peyebrow{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:5px}
.ptitle{font-size:21px;font-weight:800;letter-spacing:-.01em;margin-bottom:0}
.chip{display:inline-flex;align-items:center;font-size:9px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:3px 9px;border-radius:999px}
.chip.cat{color:var(--accent);background:#eaf0fa}
.photos{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:4px}
.ph{border:1px solid var(--line);border-radius:5px;overflow:hidden;background:var(--soft)}
.ph .img{height:130px;background-size:cover;background-position:center}
.ph .cap{font-size:9.5px;color:var(--ink-2);padding:7px 11px;border-top:1px solid var(--line)}
.ph.empty{display:flex;align-items:center;justify-content:center;min-height:200px;border-style:dashed;color:var(--ink-3);font-size:10.5px}
.toc .grp{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin:20px 0 5px}
.toc .it{display:flex;align-items:baseline;gap:10px;padding:9px 0;border-bottom:1px solid var(--line)}
.toc .it .n{font-size:11px;font-weight:700;color:var(--ink-3);width:26px}
.toc .it .t{font-size:12.5px;font-weight:500}
.toc .it .dots{flex:1;border-bottom:1px dotted var(--line-2);transform:translateY(-3px)}
.toc .it .pg{font-size:11.5px;font-weight:600;color:var(--ink-2)}
.page-cover{background:#fff;color:var(--ink)}
.page-divider{background:#fff;color:var(--ink);align-items:flex-start}
.page-back{background:#fff;color:var(--ink)}
.page-img{padding:0;align-items:center;justify-content:center}
.page-img img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block}
tr.r-grave td{background:#ffd0d0!important}
tr.r-leve td{background:#ffe4b8!important}
tr.r-recom td{background:#ebebeb!important}
.dictamen{border:1px solid var(--line-2);margin-bottom:16px}
.dictamen-head{background:var(--navy);color:#fff;padding:7px 12px;font-weight:700;font-size:10px;letter-spacing:.3px}
.dictamen-body{padding:10px 12px;font-size:10px;line-height:1.65;text-align:justify}
.sigs{display:table;width:100%;margin-top:32px;border-top:2px solid var(--navy);padding-top:8px}
.sig{display:table-cell;width:50%;text-align:center}
.sig-line{border-top:1.5px solid #222;margin:52px 22px 5px}
.sig-name{font-weight:700;font-size:9.5px}
.sig-sub{font-size:8.5px;color:var(--ink-3)}
.dcard{border:1px solid var(--line-2);margin-bottom:10px;page-break-inside:avoid}
.dcard-head{background:var(--accent);color:#fff;padding:6px 10px;display:table;width:100%}
.dcard-id{display:table-cell;font-size:12px;font-weight:700;width:44px;vertical-align:middle}
.dcard-desc{display:table-cell;font-size:8.5px;vertical-align:middle}
.dcard-badge{display:table-cell;text-align:right;vertical-align:middle;white-space:nowrap}
.badge{display:inline-block;font-size:7.5px;font-weight:700;padding:2px 8px;letter-spacing:.5px}
.b-grave{background:#8b0000;color:#fff}
.b-leve{background:#b06000;color:#fff}
.b-recom{background:var(--navy);color:#fff}
.dcard-body{padding:8px 10px}
.dcard-obs{font-size:8.5px;background:var(--soft);border-left:2px solid var(--accent);padding:5px 8px;margin-bottom:7px}
.img-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.img-cell img{width:100%;height:200px;object-fit:contain;background:#f0f0f0;display:block;border:1px solid var(--line)}
.sub-block{margin:8px 0 0;border:1px solid #b0c4de}
.sub-title{background:#b0c8e8;color:var(--navy);font-size:8px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 10px}
.sub-sub-block{margin:0;border-top:1px solid #c8d8eb}
.sub-sub-title{background:#dce8f8;color:var(--navy);font-size:7.5px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:4px 10px;border-bottom:1px solid #ccc}
.empty-sub{font-size:8px;color:#888;padding:6px 10px;background:#fafafa;font-style:italic}
.print-bar{position:fixed;bottom:0;left:0;right:0;background:var(--navy);padding:10px;text-align:center;display:flex;justify-content:center;gap:12px;z-index:999}
.btn-p{padding:7px 28px;background:#fff;color:var(--navy);border:none;font-size:10px;font-weight:700;cursor:pointer;letter-spacing:.5px}
.btn-c{padding:7px 20px;background:transparent;color:#fff;border:1px solid #fff;font-size:10px;cursor:pointer}
@media print{
  html,body{margin:0;padding:0;background:#fff}
  .page{width:210mm;min-height:296.6mm;box-sizing:border-box;margin:0;box-shadow:none;overflow:visible;page-break-after:always;break-after:page;page-break-inside:avoid;break-inside:avoid}
  .page:last-child{page-break-after:avoid;break-after:auto}
  .page-cover,.page-divider,.page-back{min-height:296.6mm;overflow:hidden}
  .page-img{height:296.6mm;min-height:0;overflow:hidden}
  .print-bar{display:none}
  tr,.dcard,.dictamen,.sub-block{page-break-inside:avoid;break-inside:avoid}
  .blk,.spec,.photos,.note,table.tbl{page-break-inside:avoid;break-inside:avoid}
  thead{display:table-header-group}
  img{image-rendering:high-quality}
  @page{size:A4;margin:0}
}`;

            // ── Shared helpers ──
            const rh = (section, detail) => `
<div class="rh">
  <img src="${LOGO_COLOR}" alt="CLAUGER">
  <div class="meta"><b>${section}</b> &middot; ${detail}</div>
</div>`;

            const rf = (pageRef) => `
<div class="rf">
  <span><b>CLAUGER Ibérica, S.L.U.</b> &middot; Documento confidencial</span>
  <span>${pageRef||''}</span>
</div>`;

            const blkH = (title) => `<div class="blk"><div class="blk-h"><span class="t">${title}</span></div>`;

            const specR = (k, v) => `<div class="r"><span class="k">${k}</span><span class="v">${(!v||v==='-')?'&mdash;':v}</span></div>`;

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

            const valvTbl = (vv, lado) => {
                if (!vv || !vv.items || !vv.items.length) return '';
                const lab = lado === 'A' ? ' &mdash; Lado A' : lado === 'B' ? ' &mdash; Lado B' : '';
                const lbl = (text) => `<span style="display:block;font-size:8px;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-3);margin-bottom:1px">${text}</span>`;
                return `${blkH('Válvulas de seguridad'+lab)}
  <table class="tbl">
    <thead>
      <tr>
        <th colspan="3" style="text-align:center;border-right:2px solid var(--line-2)">Válvula existente</th>
        <th style="text-align:center;width:12%">Acción</th>
        <th colspan="3" style="text-align:center;border-left:2px solid var(--line-2)">Válvula nueva</th>
      </tr>
    </thead>
    <tbody>${vv.items.map((v,vi)=>{
      const accion=[v.sustitucion==='SI'?'Sustitución':'',v.verificacionDisparo==='SI'?'Retarada':'',v.inspVisual==='SI'?'Inspección visual':''].filter(Boolean).join(' · ')||'&mdash;';
      return `<tr>
        <td style="width:20%">${lbl('Nº Serie')}<span style="font-weight:600">${v.serieExistente||'&mdash;'}</span></td>
        <td style="width:12%">${lbl('Fecha fab.')}<span>${v.fechaFabricacionExistente||'&mdash;'}</span></td>
        <td style="width:10%;border-right:2px solid var(--line-2)">${lbl('P. Tarado')}<span style="font-weight:600">${v.presionExistente?v.presionExistente+' bar':'&mdash;'}</span></td>
        <td style="text-align:center;font-weight:700;font-size:9px;color:var(--accent)">${accion}</td>
        <td style="width:20%;border-left:2px solid var(--line-2)">${lbl('Nº Serie')}<span style="font-weight:600">${v.serieNueva||'&mdash;'}</span></td>
        <td style="width:12%">${lbl('Fecha fab.')}<span>${v.fechaFabricacionNueva||'&mdash;'}</span></td>
        <td style="width:10%">${lbl('P. Tarado')}<span style="font-weight:600">${v.presionNueva?v.presionNueva+' bar':'&mdash;'}</span></td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
            };

            // ── Equipment HTML ──
            const equipHtml = (() => {
                const renderEquip = (eq, idx, label, tpl, equipType='') => {
                    const valvHtml = tpl === 'plantilla2'
                        ? (valvTbl(eq.valvulasA,'A') + valvTbl(eq.valvulasB,'B'))
                        : valvTbl(eq.valvulas,'single');
                    const photos = eq.photos || {};
                    const fields = tpl === 'plantilla2' ? [
                        ['Fabricante', eq.fabricante],
                        ['Modelo', eq.modelo],
                        ['Nº Serie', eq.numSerie],
                        ...(AppState.isLegalMode && eq.categoria ? [['Categoría', eq.categoria]] : []),
                        ['Fecha Fabricación', eq.fechaFabricacion],
                        ['Normativa', eq.normativa],
                        ['Fluido Lado A', eq.fluidoA],
                        ['Fluido Lado B', eq.fluidoB],
                        ['Volumen Interno (L) A', eq.volInternoA],
                        ['Volumen Interno (L) B', eq.volInternoB],
                        ['Presión Max (bar) A', eq.presionMaxA],
                        ['Presión Min (bar) A', eq.presionMinA],
                        ['Presión Max (bar) B', eq.presionMaxB],
                        ['Presión Min (bar) B', eq.presionMinB],
                        ['Ubicación', eq.ubicacion]
                    ] : [
                        ['Fabricante', eq.fabricante],
                        ['Modelo', eq.modelo],
                        ['Nº Serie', eq.numSerie],
                        ...(AppState.isLegalMode && eq.categoria ? [['Categoría', eq.categoria]] : []),
                        ['Fecha Fabricación', eq.fechaFabricacion],
                        ['Normativa', eq.normativa],
                        ['Fluido', eq.fluido],
                        ['Volumen Interno (L)', eq.volInterno],
                        ['Presión Max (bar)', eq.presionMax],
                        ['Presión Min (bar)', eq.presionMin],
                        ['Ubicación', eq.ubicacion],
                        ...(eq.presostato !== undefined ? [['Presostato AP', eq.presostato]] : [])
                    ];
                    const abFields = tpl === 'plantilla2' ? [
                        ['Fluido', eq.fluidoA, eq.fluidoB],
                        ['Volumen Interno (L)', eq.volInternoA, eq.volInternoB],
                        ['Presión Max (bar)', eq.presionMaxA, eq.presionMaxB],
                        ['Presión Min (bar)', eq.presionMinA, eq.presionMinB]
                    ] : null;
                    const specFields = tpl === 'plantilla2' ? [
                        ['Fabricante', eq.fabricante],
                        ['Modelo', eq.modelo],
                        ['Nº Serie', eq.numSerie],
                        ...(AppState.isLegalMode && eq.categoria ? [['Categoría', eq.categoria]] : []),
                        ['Fecha Fabricación', eq.fechaFabricacion],
                        ['Normativa', eq.normativa],
                        ['Ubicación', eq.ubicacion]
                    ] : fields;
                    const identHtml = `${blkH('Identificación')}
  <div class="spec">${specFields.map(([k,v]) => specR(k,v)).join('')}</div></div>`;
                    const condHtml = (tpl === 'plantilla2' && abFields) ? `${blkH('Condiciones de operación')}
  <table class="tbl ab">
    <thead><tr>
      <th style="width:36%;background:var(--soft);color:var(--ink-2)">Parámetro</th>
      <th class="side"><b>Lado A</b></th>
      <th class="side"><b>Lado B</b></th>
    </tr></thead>
    <tbody>${abFields.map(([k,a,b])=>`<tr><th>${k}</th><td>${a||'—'}</td><td>${b||'—'}</td></tr>`).join('')}</tbody>
  </table></div>` : '';
                    const obsHtml = eq.observacionesLegal ? `<div class="note"><b>Observaciones:</b> ${eq.observacionesLegal}</div>` : '';
                    const certBandHtml = AppState.isLegalMode ? (() => {
                        const certItems = App._certChecklistItems(equipType, label);
                        const rfv = eq.resultadoForzado === true ? 'favorable' : (eq.resultadoForzado || '');
                        const rfColor = rfv === 'favorable' ? 'var(--ok)' : rfv === 'desfavorable' ? 'var(--bad)' : 'var(--ink-3)';
                        const rfLabel = rfv === 'favorable' ? 'FAVORABLE' : rfv === 'desfavorable' ? 'DESFAVORABLE' : 'SIN RESULTADO';
                        const cl = eq.certChecklist || [];
                        return `<div style="margin-top:20px;border:1px solid var(--line-2);border-radius:6px;overflow:hidden">
  <div style="background:var(--navy);color:#fff;padding:7px 14px;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Certificación RD 552/2019</div>
  <div style="padding:12px 14px">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
      <p style="font-size:10px;color:var(--ink-2);line-height:1.55;flex:1"><b style="color:var(--ink)">Clauger Refrigeración Ibérica S.A.</b>, empresa frigorista habilitada, certifica la revisión del aparato a presión (RD&nbsp;552/2019).</p>
      <div style="text-align:center;flex-shrink:0">
        <div style="font-size:8.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-3);margin-bottom:4px">Resultado</div>
        <div style="font-size:12px;font-weight:800;color:${rfColor};letter-spacing:.03em">${rfLabel}</div>
      </div>
    </div>
    ${certItems.length > 0 ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:6px">
      ${certItems.map((item,i) => `<div style="display:flex;align-items:flex-start;gap:8px;font-size:9.5px;color:var(--ink-2)"><span style="width:12px;height:12px;border:1.5px solid ${cl[i]?'var(--ok)':'var(--line-2)'};border-radius:2px;background:${cl[i]?'var(--ok)':'#fff'};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">${cl[i]?'<span style="color:#fff;font-size:9px;line-height:1">&#10003;</span>':''}</span><span>${item}</span></div>`).join('')}
    </div>` : ''}
  </div>
</div>`;
                    })() : '';
                    const ptsPhotos = ['placa','general'].filter(t => photos[t] && photos[t+'Incluir'] !== false);
                    const photosHtml = ptsPhotos.length ? `${blkH('Fotografías')}
  <div class="photos">${ptsPhotos.map(t=>`<div class="ph"><div class="img" style="background-image:url('${photos[t]}')"></div><div class="cap">${t==='placa'?'Placa de características':'Vista general'}</div></div>`).join('')}</div></div>` : '';
                    const extraImgs = (eq.imagenes||[]).filter(i=>i.incluirEnPdf!==false);
                    const extraHtml = extraImgs.length ? `<div class="photos">${extraImgs.map(img=>`<div class="ph"><div class="img" style="background-image:url('${img.data}')"></div></div>`).join('')}</div>` : '';
                    return `<div class="peyebrow">Equipo &middot; ${label}</div>
<div style="display:flex;align-items:center;gap:14px;margin-bottom:4px">
  <div class="ptitle">${eq.modelo||label||'—'}</div>
  ${eq.categoria?`<span class="chip cat">${eq.categoria}</span>`:''}
</div>
${identHtml}${condHtml}${certBandHtml}${obsHtml}${valvHtml}${photosHtml}${extraHtml}`;
                };
                const pages = [];
                Object.entries(EQUIPMENT_TYPES).forEach(([typeName, typeData]) => {
                    if (typeData.isComposite) {
                        const units = AppState.equipmentData['Unidad Compresora'] || [];
                        if (!units.length) return;
                        units.forEach((unit, ui) => {
                            const ucFields = [
                                ['Fabricante', unit.fabricante],
                                ['Modelo', unit.modelo],
                                ['Nº Serie', unit.numSerie]
                            ];
                            const compresores = (unit.subEquipments||{})['Bloque Compresor'] || [];
                            const comp0 = compresores[0];
                            pages.push(`${rh('Equipos a Presión', pv('cliente')||'')}
<div class="pad">
<div class="peyebrow">Unidad Compresora &middot; N.º ${ui+1}</div>
<div class="ptitle" style="margin-bottom:4px">${unit.modelo||'Unidad Compresora'}</div>
${blkH('Identificación')}<div class="spec">${ucFields.map(([k,v])=>specR(k,v)).join('')}</div></div>
${comp0 ? renderEquip(comp0, 0, 'Bloque Compresor', 'plantilla1', 'Unidad Compresora') : ''}`);
                            compresores.slice(1).forEach((comp, ci) => {
                                pages.push(`${rh('Equipos a Presión', pv('cliente')||'')}<div class="pad">${renderEquip(comp, ci + 1, 'Bloque Compresor', 'plantilla1', 'Unidad Compresora')}</div>`);
                            });
                            Object.keys(unit.subEquipments||{}).forEach(subType => {
                                if (subType === 'Bloque Compresor') return;
                                const subs = unit.subEquipments[subType];
                                if (!subs || !subs.length) return;
                                const tpl = subType.includes('Enfriador Aceite') ? 'plantilla2' : 'plantilla1';
                                subs.forEach((sub, si) => {
                                    pages.push(`${rh('Equipos a Presión', pv('cliente')||'')}<div class="pad">${renderEquip(sub, si, subType, tpl, 'Unidad Compresora')}</div>`);
                                });
                            });
                        });
                    } else if (typeData.isSingle) {
                        const svcItems = AppState.equipmentData[typeName] || [];
                        if (!svcItems.length) return;
                        svcItems.forEach((svc, si) => {
                            const svcFields = [
                                ['Marca', svc.marca],
                                ['Modelo', svc.modelo],
                                ['Nº Serie', svc.numSerie],
                                ...(AppState.isLegalMode && svc.categoria ? [['Categoría', svc.categoria]] : []),
                                ['Fecha Fabricación', svc.fechaFabricacion],
                                ...(AppState.isLegalMode && svc.normativa ? [['Normativa', svc.normativa]] : []),
                                ['Volumen (dm³)', svc.volumen],
                                ['Presión Máx (bar)', svc.presionMax],
                                ['Presión Mín (bar)', svc.presionMin],
                                ['Ubicación', svc.ubicacion]
                            ];
                            const svcCertBand = AppState.isLegalMode ? (() => {
                                const certItems = App._certChecklistItems('Servicios', 'Servicios');
                                const rfv = svc.resultadoForzado === true ? 'favorable' : (svc.resultadoForzado || '');
                                const rfColor = rfv === 'favorable' ? 'var(--ok)' : rfv === 'desfavorable' ? 'var(--bad)' : 'var(--ink-3)';
                                const rfLabel = rfv === 'favorable' ? 'FAVORABLE' : rfv === 'desfavorable' ? 'DESFAVORABLE' : 'SIN RESULTADO';
                                const cl = svc.certChecklist || [];
                                return `<div style="margin-top:20px;border:1px solid var(--line-2);border-radius:6px;overflow:hidden">
  <div style="background:var(--navy);color:#fff;padding:7px 14px;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">Certificación RD 552/2019</div>
  <div style="padding:12px 14px">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
      <p style="font-size:10px;color:var(--ink-2);line-height:1.55;flex:1"><b style="color:var(--ink)">Clauger Refrigeración Ibérica S.A.</b>, empresa frigorista habilitada, certifica la revisión del aparato a presión (RD&nbsp;552/2019).</p>
      <div style="text-align:center;flex-shrink:0">
        <div style="font-size:8.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--ink-3);margin-bottom:4px">Resultado</div>
        <div style="font-size:12px;font-weight:800;color:${rfColor};letter-spacing:.03em">${rfLabel}</div>
      </div>
    </div>
    ${certItems.length > 0 ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:6px">
      ${certItems.map((item,i) => `<div style="display:flex;align-items:flex-start;gap:8px;font-size:9.5px;color:var(--ink-2)"><span style="width:12px;height:12px;border:1.5px solid ${cl[i]?'var(--ok)':'var(--line-2)'};border-radius:2px;background:${cl[i]?'var(--ok)':'#fff'};display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px">${cl[i]?'<span style="color:#fff;font-size:9px;line-height:1">&#10003;</span>':''}</span><span>${item}</span></div>`).join('')}
    </div>` : ''}
  </div>
</div>`;
                            })() : '';
                            const svcObs = svc.observacionesLegal ? `<div class="note"><b>Observaciones:</b> ${svc.observacionesLegal}</div>` : '';
                            const svcValv = valvTbl(svc.valvulas, 'single');
                            const svcPhotos = svc.photos || {};
                            const svcPts = ['placa','general'].filter(t => svcPhotos[t] && svcPhotos[t+'Incluir'] !== false);
                            const svcPhotosHtml = svcPts.length ? `${blkH('Fotografías')}<div class="photos">${svcPts.map(t=>`<div class="ph"><div class="img" style="background-image:url('${svcPhotos[t]}')"></div><div class="cap">${t==='placa'?'Placa de características':'Vista general'}</div></div>`).join('')}</div></div>` : '';
                            const svcExtras = (svc.imagenes||[]).filter(i=>i.incluirEnPdf!==false);
                            const svcExtraHtml = svcExtras.length ? `<div class="photos">${svcExtras.map(img=>`<div class="ph"><div class="img" style="background-image:url('${img.data}')"></div></div>`).join('')}</div>` : '';
                            pages.push(`${rh('Equipos a Presión', pv('cliente')||'')}
<div class="pad">
<div class="peyebrow">Servicio &middot; N.º ${si+1}</div>
<div class="ptitle" style="margin-bottom:4px">${svc.identificador || svc.modelo || 'Servicio'}</div>
${blkH('Identificación')}<div class="spec">${svcFields.map(([k,v])=>specR(k,v)).join('')}</div></div>
${svcCertBand}${svcObs}${svcValv}${svcPhotosHtml}${svcExtraHtml}`);
                        });
                    } else {
                        typeData.subTypes.forEach(subType => {
                            const items = AppState.equipmentData[subType] || [];
                            if (!items.length) return;
                            items.forEach((eq, ei) => {
                                pages.push(`${rh('Equipos a Presión', pv('cliente')||'')}<div class="pad">${renderEquip(eq, ei, subType, typeData.template, typeName)}</div>`);
                            });
                        });
                    }
                });
                if (!pages.length) return `<div class="page page-break">${rh('Equipos a Presión','')}<div class="pad"><p style="color:var(--ink-3);font-style:italic;text-align:center;padding:16px 0">No hay equipos registrados.</p></div>${rf(pv('referencia'))}</div>`;
                return pages.map(content => `<div class="page page-break">${content}${rf(pv('referencia'))}</div>`).join('');
            })();

            // ── Detectors HTML ──
            const detectoresHtml = (() => {
                if (!AppState.detectorsData.length) return `<div class="page page-break">${rh('Verificación Detectores de Fugas','')}<div class="pad"><p style="color:var(--ink-3);font-style:italic;text-align:center;padding:16px 0">No hay detectores registrados.</p></div>${rf(pv('referencia'))}</div>`;
                const opColor = (v) => v==='SI'?'var(--ok)':v==='NO'?'var(--bad)':'var(--ink-3)';
                return AppState.detectorsData.map((det, di) => {
                    const certPages = (detectorCertImgs[di] || []).map(img => `<div class="page page-break page-img"><img src="${img}"></div>`).join('');
                    if (det.tipo === 'pdf') {
                        return certPages || `<div class="page page-break">${rh('Verificación Detectores de Fugas','')}<div class="pad"><p style="color:var(--ink-3);font-style:italic;text-align:center;padding:16px 0">Detector ${di+1} — sin certificados PDF adjuntos.</p></div></div>`;
                    }
                    const datosFields = [['Marca',det.marca],['Modelo',det.modelo],['Nº Serie',det.numSerie],['Refrigerante',det.refrigerante],['Pre-Alarma',det.preAlarma?det.preAlarma+' ppm':''],['Alarma',det.alarma?det.alarma+' ppm':''],['Tensión alim.',det.tensionAlimentacion],['Fecha verif.',det.fechaVerificacion],['Próxima verif.',det.fechaProximaVerificacion],['Técnico',det.respVerificacion]];
                    const opFields = [['Correcta ubicación',det.operaciones?.correctaUbicacion],['Tiempo respuesta ≤ 60 s',det.operaciones?.tiempoRespuesta],['Estado general',det.operaciones?.estadoGeneral],['Verif. tensión alimentación',det.operaciones?.verificacionTension],['Test leds y display',det.operaciones?.testLedsDisplay],['Prueba activación maniobras',det.operaciones?.pruebaActivacion],['Señal óptica y acústica',det.operaciones?.senalOpticoAcustica],['Reglaje a punto 0',det.operaciones?.reglajePunto0],['Reglaje Pre-Alarma',det.operaciones?.reglajePreAlarma],['Reglaje Alarma',det.operaciones?.reglajeAlarma],['Activación extractor',det.operaciones?.activacionExtractor]];
                    const _detImgs = (det.imagenes||[]).filter(img=>img.incluirEnPdf!==false);
                    const photosHtml = _detImgs.length ? `${blkH('Imágenes')}<div class="photos">${_detImgs.map(img=>`<div class="ph"><div class="img" style="background-image:url('${img.data}')"></div></div>`).join('')}</div></div>` : '';
                    return `<div class="page page-break">
${rh('Verificación Detectores de Fugas', pv('cliente')||'')}
<div class="pad">
<div class="peyebrow">Detector / Centralita &middot; N.º ${di+1}</div>
<div class="ptitle" style="margin-bottom:4px">${det.marca||'Detector'} ${det.modelo||''}</div>
${blkH('Datos del detector')}<div class="spec">${datosFields.map(([k,v])=>specR(k,v)).join('')}</div></div>
${blkH('Operaciones realizadas')}
<table class="tbl">
  <thead><tr><th>Operación</th><th style="width:70px;text-align:center">Resultado</th></tr></thead>
  <tbody>${opFields.map(([l,v])=>`<tr><td>${l}</td><td style="text-align:center;font-weight:700;color:${opColor(v)}">${v||'—'}</td></tr>`).join('')}</tbody>
</table></div>
${det.observacionesLegal?`<div class="note" style="margin:0 60px"><b>Observaciones:</b> ${det.observacionesLegal}</div>`:''}
${photosHtml}
</div>
${rf(pv('referencia'))}
</div>`;
                }).join('');
            })();

            // ── Termografía HTML ──
            const termografiaHtml = await (async () => {
                if (!AppState.termografiaData.length) return `<div class="page page-break">${rh('Termografía','')}<div class="pad"><p style="color:var(--ink-3);font-style:italic;text-align:center;padding:16px 0">No hay puntos de termografía registrados.</p></div>${rf(pv('referencia'))}</div>`;
                const pages = await Promise.all(AppState.termografiaData.map(async (p, pi) => {
                    if (p.tipo === 'informe') {
                        const informeImgs = await _renderPdfPages(p.informeArchivos || []);
                        const label = p.equipo || ('Punto ' + (pi + 1));
                        if (!informeImgs.length) {
                            return `<div class="page page-break">${rh('Termografía', pv('cliente')||'')}
<div class="pad">
<div class="peyebrow">Termografía &middot; ${label}${p.fecha?' &middot; '+p.fecha:''}</div>
<p style="color:var(--ink-3);font-style:italic;padding:12px 0">Sin informes PDF adjuntos.</p>
${p.observacionesLegal?`<div class="note"><b>Observaciones:</b> ${p.observacionesLegal}</div>`:''}
</div>${rf(pv('referencia'))}</div>`;
                        }
                        return informeImgs.map((img, ii) => `<div class="page page-break">
${ii===0?rh('Termografía', pv('cliente')||''):''}
${ii===0?`<div style="padding:18px 60px 0"><div class="blk-h"><span class="t">${label}${p.fecha?' &middot; '+p.fecha:''}</span></div></div>`:''}
<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:0 60px"><img src="${img}" style="max-width:100%;height:auto;display:block;margin:0 auto"></div>
${ii===0&&p.observacionesLegal?`<div class="note" style="margin:0 60px 22px"><b>Observaciones:</b> ${p.observacionesLegal}</div>`:''}
${rf(pv('referencia'))}
</div>`).join('');
                    }
                    const res = p.resultados;
                    if (res && res.Tr !== null) p._pcImg = this._termoPCToDataUrl(res, true);
                    const sc = res ? ({ok:'var(--ok)',warn:'var(--warn)',crit:'var(--bad)'}[res.sc]||'var(--ink-2)') : 'var(--ink-2)';
                    const tc = (res && res.Tr !== null) ? (res.Ts <= res.Tr ? '#E8002D' : res.Ts <= res.Tr+2 ? '#f59e0b' : '#10b981') : '#10b981';
                    const imgSrc = p.imgIncluirEnPdf !== false ? (p._processedImg || p.imagen) : null;
                    const medicionFields = [['T interior (Tin)',p.tin!==''&&p.tin!==undefined?p.tin+' °C':''],['T ambiente (Tamb)',p.tamb!==''&&p.tamb!==undefined?p.tamb+' °C':''],['T superficie (Ts)',p.ts!==''&&p.ts!==undefined?p.ts+' °C':''],['Humedad rel. (HR)',p.hr!==''&&p.hr!==undefined?p.hr+' %':'']];
                    const resultadoFields = res?[
                        ['Índice aislamiento (I)',`<span style="font-weight:700;color:${sc}">${res.I.toFixed(3)}</span>`],
                        ['Eficiencia aislamiento',`<span style="font-weight:700;color:${sc}">${res.eff} %</span>`],
                        ['ΔT (Tamb - Ts)',res.dT.toFixed(1)+' °C'],
                        ...(res.Tr!==null?[['Punto de Rocío (Tr)',res.Tr.toFixed(1)+' °C']]:[] ),
                        ...(res.mg!==null?[['Margen anti-rocío (Ts-Tr)',res.mg.toFixed(1)+' °C']]:[] ),
                        ...(res.cr!==null?[['Riesgo condensación',`<span style="font-weight:700;color:${({ok:'var(--ok)',warn:'var(--warn)',crit:'var(--bad)'}[res.cc]||'var(--ink-2)')}">${res.cr}</span>`]]:[] ),
                        ['Diagnóstico',`<span style="font-weight:700;color:${sc}">${res.st}</span>`]
                    ]:[];
                    return `<div class="page page-break">
${rh('Termografía', pv('cliente')||'')}
<div class="pad">
<div class="peyebrow">Termografía &middot; ${p.equipo||('Punto '+(pi+1))}${p.fecha?' &middot; '+p.fecha:''}</div>
<div class="ptitle" style="margin-bottom:16px">${p.equipo||('Punto '+(pi+1))}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 48px">
  <div>
    ${blkH('Datos de medición')}<div class="spec one">${medicionFields.map(([k,v])=>specR(k,v)).join('')}</div></div>
  </div>
  ${res?`<div>
    ${blkH('Resultados del análisis')}<div class="spec one">${resultadoFields.map(([k,v])=>`<div class="r"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('')}</div></div>
  </div>`:''}
</div>
${p.observacionesLegal?`<div class="note"><b>Observaciones:</b> ${p.observacionesLegal}</div>`:''}
${imgSrc?`${blkH('Imagen termográfica')}<div style="text-align:center"><div style="display:inline-block;max-width:55%;border:1px solid var(--line);border-radius:5px;overflow:hidden;background:#0a0a0a"><img src="${imgSrc}" style="max-width:100%;max-height:220px;object-fit:contain;display:block"></div></div></div>`:''}
${(p._pcImg && res)?`${blkH('Diagrama psicrométrico')}<div style="border:1px solid var(--line);border-radius:5px;overflow:hidden"><img src="${p._pcImg}" style="width:100%;height:auto;display:block"></div>
<div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:10px;color:var(--ink-2)">
  <div style="display:flex;align-items:center;gap:7px"><span style="width:10px;height:10px;border-radius:50%;background:#00B2FF;flex-shrink:0"></span><div><b>Tamb</b> ${res.Tamb.toFixed(1)} °C${res.HR!==null?' · '+res.HR+' % HR':''}</div></div>
  ${res.Tr!==null?`<div style="display:flex;align-items:center;gap:7px"><span style="width:10px;height:10px;border-radius:50%;background:#E8002D;flex-shrink:0"></span><div><b>Tr</b> ${res.Tr.toFixed(1)} °C — Punto de rocío</div></div>`:''}
  <div style="display:flex;align-items:center;gap:7px"><span style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:9px solid ${tc};flex-shrink:0"></span><div><b>Ts</b> ${res.Ts.toFixed(1)} °C — Superficie</div></div>
</div></div>`:''}
</div>
${rf(pv('referencia'))}
</div>`;
                }));
                return pages.join('');
            })();

            // ── Planificación HTML ──
            const planificacionHtml = `
<div class="pad">
${blkH('Planificación próxima revisión obligatoria')}
<div style="font-size:11.5px;line-height:1.75;color:var(--ink-2);white-space:pre-line">${textoRev}</div></div>

${blkH('Tabla — Periodicidad de revisión según antigüedad y carga')}
<table class="tbl" style="margin-bottom:14px">
  <caption style="caption-side:top;font-size:9.5px;font-weight:600;color:var(--ink-3);letter-spacing:.04em;text-transform:uppercase;padding-bottom:6px">Antigüedad: ${_ageYears !== null ? Math.floor(_ageYears) + ' años' : 'sin FECHA PS'} · Carga: ${_totalKg.toFixed(0)} kg · Resultado: ${periodRev}</caption>
  <thead><tr><th>Antigüedad</th><th>Carga de refrigerante</th><th>Periodicidad</th></tr></thead>
  <tbody>
    <tr${(!_isAntigua&&!_isHeavy)?' style="background:#fef3cd;font-weight:700"':''}><td>Inferior a 15 años</td><td>Inferior a 3.000 kg</td><td>Cada 5 años</td></tr>
    <tr${(!_isAntigua&&_isHeavy)?' style="background:#fef3cd;font-weight:700"':''}><td>Inferior a 15 años</td><td>Superior a 3.000 kg</td><td>Cada 5 años</td></tr>
    <tr${(_isAntigua&&!_isHeavy)?' style="background:#fef3cd;font-weight:700"':''}><td>Superior a 15 años</td><td>Inferior a 3.000 kg</td><td>Cada 5 años</td></tr>
    <tr${(_isAntigua&&_isHeavy)?' style="background:#fef3cd;font-weight:700"':''}><td>Superior a 15 años</td><td>Superior a 3.000 kg</td><td>Cada 2 años</td></tr>
  </tbody>
</table></div>

${blkH('Planificación próxima inspección obligatoria')}
<div style="font-size:11.5px;line-height:1.75;color:var(--ink-2);white-space:pre-line">${textoInsp}</div></div>

${blkH('Tabla 1 — Periodicidad según Tn eq. CO₂')}
<table class="tbl" style="margin-bottom:14px">
  <caption style="caption-side:top;font-size:10px;font-weight:600;color:var(--ink-3);letter-spacing:.04em;text-transform:uppercase;padding-bottom:8px">Tabla 1 — Periodicidad según Tn eq. CO₂</caption>
  <thead><tr><th>Tn eq. CO₂</th><th>Periodicidad</th></tr></thead>
  <tbody>
    ${[['Más de 5.000','Anual','1 año'],['Entre 5.000 y 500','Cada 2 años','2 años'],['Entre 500 y 50','Cada 5 años','5 años'],['Inferior a 50 (Nivel 2)','Cada 10 años','10 años'],['Inferior a 50 (otros)','Exentas','Exento']].map(([r,t,k])=>`<tr${periodInsp===k?' style="background:#fef3cd;font-weight:700"':''}><td>${r}</td><td>${t}</td></tr>`).join('')}
  </tbody>
</table></div>
</div>`;

            // ── Full HTML ──────────────────────────────────────────────────────────
            const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${(()=>{const _f=revision['FECHA REVISIÓN']||'';const _y=(_f.match(/\d{4}/)||[new Date().getFullYear()])[0];const _d=(certificadoIF['DICTAMEN']||'INFORME').toUpperCase().replace(/[()]/g,'').replace(/\s+/g,' ').trim();const _rawCif=(informeIF['CIF']||'').trim();const _cif=_rawCif?(/^CIF\s/i.test(_rawCif)?_rawCif:'CIF '+_rawCif):'SIN_CIF';return `${_y}_${_d}_${_cif}`;})()}</title>
<style>${SHARED_CSS}</style></head><body>

<!-- ══ PORTADA ══ -->
${this._buildPortadaHtml(pv)}

<!-- ══ ÍNDICE ══ -->
<div class="page page-break">
  ${rh('Índice de documentos','Informe Final')}
  <div class="pad">
    <div class="peyebrow">Contenido</div>
    <div class="ptitle">Índice de documentos</div>
    <div class="toc">
      ${(_indItems).map(item => `<div class="it"><span class="n">${String(item.num||'').padStart(2,'0')}</span><span class="t">${item.label}</span><span class="dots"></span><span class="pg">&mdash;</span></div>`).join('')}
    </div>
  </div>
  ${rf(pv('referencia'))}
</div>

${_hasSec('acta') ? `
<!-- ══ ACTA ══ -->
${divider(_secNum('acta'),'Acta','Documentación de la inspección periódica reglamentaria.')}
${actaInicialImgs.length===0
  ? `<div class="page page-break">${rh('Acta','')}<div class="pad"><p style="color:var(--ink-3);font-style:italic;text-align:center;padding:16px 0">No se han adjuntado archivos de Acta.</p></div>${rf(pv('referencia'))}</div>`
  : actaInicialImgs.map(img=>`<div class="page page-break page-img"><img src="${img}"></div>`).join('')
}` : ''}

${_hasSec('equipos') ? `
<!-- ══ EQUIPOS ══ -->
${divider(_secNum('equipos'),'Equipos a Presión','Identificación, condiciones de operación y válvulas de seguridad.')}
${equipHtml}` : ''}

${_hasSec('valvulas') ? `
<!-- ══ CERTIFICADOS VÁLVULAS DE SEGURIDAD ══ -->
${divider(_secNum('valvulas'),'Certificados Válvulas de Seguridad','Verificación y tarado de válvulas PSV.')}
${certPsvImgs.length===0
  ? `<div class="page page-break">${rh('Cert. Válvulas de Seguridad','')}<div class="pad"><p style="color:var(--ink-3);font-style:italic;text-align:center;padding:16px 0">No se han adjuntado certificados PSV.</p></div>${rf(pv('referencia'))}</div>`
  : certPsvImgs.map(img=>`<div class="page page-break page-img"><img src="${img}"></div>`).join('')
}` : ''}

${_hasSec('detectores') ? `
<!-- ══ CERTIFICADOS DETECTORES DE FUGAS ══ -->
${divider(_secNum('detectores'),'Detectores de Fugas','Verificación y calibración de detectores y centralitas.')}
${detectoresHtml}` : ''}

${_hasSec('termografia') ? `
<!-- ══ TERMOGRAFÍA ══ -->
${divider(_secNum('termografia'),'Termografía','Análisis del aislamiento térmico mediante termografía.')}
${termografiaHtml}` : ''}

${_hasSec('planificacion') ? `
<!-- ══ PLANIFICACIÓN ══ -->
${divider(_secNum('planificacion'),'Planificación','Próximas revisiones e inspecciones obligatorias.')}
<div class="page page-break">
  ${rh('Planificación', pv('cliente')||'')}
  ${planificacionHtml}
  ${rf(pv('referencia'))}
</div>` : ''}

<!-- ══ CONTRAPORTADA ══ -->
${this._buildContraportadaHtml(pv, contraTexto)}

<div class="print-bar">
  <span style="color:#ffdd57;font-size:9px;font-weight:600;letter-spacing:.02em">&#9888; En Destino elige &laquo;Guardar como PDF&raquo; (no &laquo;Microsoft Print to PDF&raquo;) &middot; M&aacute;rgenes: Ninguno &middot; Gr&aacute;ficos de fondo: activado</span>
  <button class="btn-p" onclick="window.print()">IMPRIMIR / GUARDAR PDF</button>
  <button class="btn-c" onclick="window.close()">CERRAR</button>
</div>
</body></html>`;

            const w = window.open('', '_blank', 'width=1100,height=900');
            if (w) {
                w.document.write(html);
                w.document.close();
            } else {
                this.showToast('Permite ventanas emergentes en el navegador', 'error');
            }
        } catch (err) {
            console.error('Error generando Informe Final:', err);
            this.showToast('Error al generar el Informe Final', 'error');
        }
    },

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

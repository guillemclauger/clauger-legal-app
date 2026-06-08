/**
 * ============================================================================
 * CLAUGER - Sistema de Informes Técnicos
 * ============================================================================
 * Archivo: app.js
 * Descripción: Lógica principal de la aplicación
 * Versión: 1.2 - CORREGIDO PARA MODO LEGAL
 * ============================================================================
 */

const App = {
    init() {
        console.log('🎯 Inicializando App - Modo Legal:', AppState.isLegalMode);
        this.initializeSectionsData();
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
    },

    // ── Autosave ──────────────────────────────────────────────────────────────
    _badgeFadeTimer: null,

    _doAutosave() {
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
        // Auto-fill SISTEMA en modo legal desde lo que anotó el técnico
        if (AppState.isLegalMode) {
            const _inf  = AppState.sectionsData['datos_datos_informe']     || {};
            const _inst = AppState.sectionsData['datos_datos_instalacion'] || {};
            if (_inf['SISTEMA'] && !_inst['SISTEMA']) _inst['SISTEMA'] = _inf['SISTEMA'];
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
        this.showToast('✅ Sesión restaurada', 'success');
    },
    // ─────────────────────────────────────────────────────────────────────────

    _renderFieldInput(f, data) {
        const value = data[f.name] !== undefined ? data[f.name] : '';
        if (f.type === 'textarea') {
            return `<textarea class="form-input" data-field="${f.name}" rows="${f.rows || 4}" ${f.readonly ? 'readonly style="background:#f3f4f6;cursor:not-allowed"' : ''}>${value}</textarea>`;
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
            const roStyle = f.readonly ? ' readonly style="background:#f3f4f6;color:#6b7280;cursor:not-allowed"' : '';
            const inputType = f.type || 'text';
            return `<input type="${inputType}" class="form-input" data-field="${f.name}" value="${value}"${roStyle}>`;
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
        const items = valvulas?.items || [];
        const colors = lado === 'A' ? {bg: '#fef3c7', border: '#fde68a', text: '#92400e'} 
                     : lado === 'B' ? {bg: '#e0e7ff', border: '#c7d2fe', text: '#3730a3'} 
                     : {bg: '#fef3c7', border: '#fde68a', text: '#92400e'};
        
        const addFunc = isSubEquip ? `App.addValvulaSub('${equipKey}',${index},'${subType}',${subIdx},'${lado}')` 
                                   : `App.addValvula('${equipKey}',${index},'${lado}')`;
        const removeFunc = (vIdx) => isSubEquip ? `App.removeValvulaSub('${equipKey}',${index},'${subType}',${subIdx},'${lado}',${vIdx})` 
                                                : `App.removeValvula('${equipKey}',${index},'${lado}',${vIdx})`;
        const dataAttr = isSubEquip ? 'data-subfield' : 'data-field';
        const basePath = isSubEquip ? `${subType}.${subIdx}.valvulas${lado !== 'single' ? lado : ''}` : `valvulas${lado !== 'single' ? lado : ''}`;
        
        return `
            <div class="lado-section${lado === 'B' ? ' lado-b' : ''}" style="background:${colors.bg};border-color:${colors.border}">
                <div style="display:flex;justify-content:space-between;margin-bottom:1rem">
                    <div style="color:${colors.text};font-weight:600">${lado === 'A' ? '🟠️ Lado A' : lado === 'B' ? '🟡️ Lado B' : '⚠️ Válvulas de Seguridad'}</div>
                    <button class="add-vs-btn" onclick="${addFunc}" style="margin:0">➕ Añadir Válvula</button>
                </div>
                ${items.map((valv, vIdx) => `
                    <div class="vs-unit">
                        <div style="display:flex;justify-content:space-between;margin-bottom:1rem">
                            <span style="background:#f59e0b;color:white;padding:0.375rem 0.75rem;border-radius:0.5rem;font-weight:600">Válvula #${vIdx + 1}</span>
                            <button class="remove-vs-btn" onclick="${removeFunc(vIdx)}">🗑️</button>
                        </div>
                        <div class="form-row">
                            ${this.createFormFields([
                                {name: 'Marca', path: `${basePath}.items.${vIdx}.marca`},
                                {name: 'Modelo', path: `${basePath}.items.${vIdx}.modelo`},
                                {name: 'Indicador Descarga PSV', type: 'select', path: `${basePath}.items.${vIdx}.indicadorDescarga`, options: ['', 'Sifón', 'Luz', 'No']}
                            ], [valv.marca, valv.modelo, valv.indicadorDescarga], dataAttr)}
                        </div>
                        <div style="font-size:0.75rem;font-weight:700;color:#92400e;text-transform:uppercase;margin:0.5rem 0 0.25rem">PSV Existente</div>
                        <div class="form-row">
                            ${this.createFormFields([
                                {name: 'Nº serie Existente', path: `${basePath}.items.${vIdx}.serieExistente`},
                                {name: 'Fecha', type: 'text', path: `${basePath}.items.${vIdx}.fechaExistente`},
                                {name: 'Presión tarado (bar)', path: `${basePath}.items.${vIdx}.presionExistente`},
                                {name: 'DN entrada', path: `${basePath}.items.${vIdx}.dnEntradaExistente`},
                                {name: 'DN salida', path: `${basePath}.items.${vIdx}.dnSalidaExistente`},
                                {name: 'Acción', type: 'select', path: `${basePath}.items.${vIdx}.accionExistente`, options: ['', 'Revisión visual', 'Retimbrada', 'Substitución']}
                            ], [valv.serieExistente, valv.fechaExistente, valv.presionExistente, valv.dnEntradaExistente||'', valv.dnSalidaExistente||'', valv.accionExistente||''], dataAttr)}
                        </div>
                        <div style="font-size:0.75rem;font-weight:700;color:#92400e;text-transform:uppercase;margin:0.5rem 0 0.25rem">PSV Nueva</div>
                        <div class="form-row">
                            ${this.createFormFields([
                                {name: 'Nº serie Nueva', path: `${basePath}.items.${vIdx}.serieNueva`},
                                {name: 'Fecha', type: 'text', path: `${basePath}.items.${vIdx}.fechaNueva`},
                                {name: 'Presión tarado (bar)', path: `${basePath}.items.${vIdx}.presionNueva`},
                                {name: 'DN entrada', path: `${basePath}.items.${vIdx}.dnEntradaNueva`},
                                {name: 'DN salida', path: `${basePath}.items.${vIdx}.dnSalidaNueva`},
                                {name: 'Acción', type: 'select', path: `${basePath}.items.${vIdx}.accionNueva`, options: ['', 'Revisión visual', 'Retimbrada', 'Substitución']}
                            ], [valv.serieNueva, valv.fechaNueva, valv.presionNueva, valv.dnEntradaNueva||'', valv.dnSalidaNueva||'', valv.accionNueva||''], dataAttr)}
                        </div>
                    </div>
                `).join('')}
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
            <div ondragover="event.preventDefault();this.style.borderColor='#1d4ed8';this.style.background='#eff6ff'"
                 ondragleave="this.style.borderColor='#d1d5db';this.style.background='#fafafa'"
                 ondrop="event.preventDefault();this.style.borderColor='#d1d5db';this.style.background='#fafafa';${dropFnStr}"
                 onclick="${clickFnStr}"
                 style="border:2px dashed #d1d5db;border-radius:0.75rem;padding:1.2rem;text-align:center;cursor:pointer;background:#fafafa;transition:border-color .15s,background .15s;margin-bottom:0.5rem">
                <div style="font-size:2rem;margin-bottom:0.3rem;color:#6b7280">📷</div>
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
                    this.showToast(`📷 ${imgFiles.length} imagen${imgFiles.length>1?'es':''} añadida${imgFiles.length>1?'s':''}`, 'success');
                }
            };
            reader.readAsDataURL(file);
        });
    },

    _pickImages(onFiles) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = e => { if (e.target.files.length) onFiles(Array.from(e.target.files)); };
        input.click();
    },

    renderPhotoSection(photos, context) {
        const {equipKey, index, isSubEquip, subType, subIdx} = context;
        const uploadFunc = (type) => isSubEquip ? `App.uploadPhotoSub('${equipKey}',${index},'${subType}',${subIdx},'${type}')`
                                                : `App.uploadPhoto('${equipKey}',${index},'${type}')`;
        const removeFunc = (type) => isSubEquip ? `App.removePhotoSub('${equipKey}',${index},'${subType}',${subIdx},'${type}')`
                                                : `App.removePhoto('${equipKey}',${index},'${type}')`;
        const togglePhotoFunc = (type) => isSubEquip
            ? `App.toggleEquipSubPhotoIncluir('${equipKey}',${index},'${subType}',${subIdx},'${type}')`
            : `App.toggleEquipPhotoIncluir('${equipKey}',${index},'${type}')`;

        const galImages = isSubEquip
            ? (AppState.equipmentData[equipKey]?.[index]?.subEquipments?.[subType]?.[subIdx]?.imagenes || [])
            : (AppState.equipmentData[equipKey]?.[index]?.imagenes || []);

        const galleryHtml = AppState.isLegalMode ? `
            <div style="margin-top:1rem">
                <div class="form-section-title">📸 Imágenes Adicionales</div>
                ${this._legalImgSectionHtml(
                    '',
                    galImages,
                    isSubEquip ? `App.dropEquipSubImages(event,'${equipKey}',${index},'${subType}',${subIdx})` : `App.dropEquipImages(event,'${equipKey}',${index})`,
                    isSubEquip ? `App.uploadEquipSubImages('${equipKey}',${index},'${subType}',${subIdx})` : `App.uploadEquipImages('${equipKey}',${index})`,
                    isSubEquip ? `App.removeEquipSubImage('${equipKey}',${index},'${subType}',${subIdx},{i})` : `App.removeEquipImage('${equipKey}',${index},{i})`,
                    isSubEquip ? `App.toggleEquipSubImagePdf('${equipKey}',${index},'${subType}',${subIdx},{i})` : `App.toggleEquipImagePdf('${equipKey}',${index},{i})`
                )}
            </div>
        ` : '';

        return `
            <div class="photo-section">
                <div class="form-section-title">📸 Fotografías</div>
                <div class="photo-grid">
                    ${['placa', 'general'].map(type => `
                        <div>
                            <label class="form-label">${type === 'placa' ? 'Placa de Características' : 'General'}</label>
                            ${photos[type] ? `
                                <div class="photo-preview" style="position:relative">
                                    <img src="${photos[type]}" onclick="App.viewImage('${photos[type]}')">
                                    <button class="photo-remove" onclick="${removeFunc(type)}">×</button>
                                    ${AppState.isLegalMode ? `
                                        <div style="position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:flex-end;padding:4px 6px;background:rgba(0,0,0,0.55)">
                                            <button onclick="${togglePhotoFunc(type)}" style="background:${photos[type+'Incluir']===false?'#6b7280':'#16a34a'};color:white;border:none;border-radius:3px;padding:1px 7px;font-size:0.68rem;cursor:pointer;font-weight:700">${photos[type+'Incluir']===false?'PDF ✗':'PDF ✓'}</button>
                                        </div>
                                    ` : ''}
                                </div>
                            ` : `
                                <div class="photo-upload" onclick="${uploadFunc(type)}">
                                    <div style="font-size:2.5rem;margin-bottom:0.5rem;color:#6b7280">📷</div>
                                    <div style="font-size:0.875rem;color:#6b7280;font-weight:600">Subir Foto ${type === 'placa' ? 'Placa' : 'General'}</div>
                                </div>
                            `}
                        </div>
                    `).join('')}
                </div>
                ${galleryHtml}
            </div>
        `;
    },

    manageValvula(action, equipKey, index, lado, valvIdx, subType, subIdx) {
        const isSubEquip = subType !== undefined;
        const equipment = isSubEquip ? AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx] 
                                     : AppState.equipmentData[equipKey][index];
        const valvKey = lado === 'single' ? 'valvulas' : `valvulas${lado}`;
        
        if (action === 'add') {
            if (!equipment[valvKey]) equipment[valvKey] = {items: []};
            equipment[valvKey].items.push({marca: '', modelo: '', indicadorDescarga: '', serieExistente: '', fechaExistente: '', presionExistente: '', dnEntradaExistente: '', dnSalidaExistente: '', accionExistente: '', serieNueva: '', fechaNueva: '', presionNueva: '', dnEntradaNueva: '', dnSalidaNueva: '', accionNueva: ''});
            this.showToast('✔️ Válvula añadida', 'success');
        } else if (action === 'remove' && confirm('¿Eliminar esta válvula?')) {
            equipment[valvKey].items.splice(valvIdx, 1);
            this.showToast('🗑️ Válvula eliminada', 'success');
        }
        
        isSubEquip ? this.renderCompositeUnitsList() : this.renderEquipmentList();
    },

    addValvula(equipKey, index, lado) { this.manageValvula('add', equipKey, index, lado); },
    removeValvula(equipKey, index, lado, valvIdx) { this.manageValvula('remove', equipKey, index, lado, valvIdx); },
    addValvulaSub(equipKey, index, subType, subIdx, lado) { this.manageValvula('add', equipKey, index, lado, undefined, subType, subIdx); },
    removeValvulaSub(equipKey, index, subType, subIdx, lado, valvIdx) { this.manageValvula('remove', equipKey, index, lado, valvIdx, subType, subIdx); },

    managePhoto(action, equipKey, index, photoType, subType, subIdx) {
        const isSubEquip = subType !== undefined;
        const equipment = isSubEquip ? AppState.equipmentData[equipKey][index].subEquipments[subType][subIdx] 
                                     : AppState.equipmentData[equipKey][index];
        
        if (action === 'upload') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (!equipment.photos) equipment.photos = {};
                        equipment.photos[photoType] = event.target.result;
                        isSubEquip ? this.renderCompositeUnitsList() : this.renderEquipmentList();
                        this.showToast('📷 Foto añadida', 'success');
                        this._doAutosave();
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        } else if (action === 'remove') {
            equipment.photos[photoType] = null;
            isSubEquip ? this.renderCompositeUnitsList() : this.renderEquipmentList();
            this.showToast('🗑️ Foto eliminada', 'success');
            this._doAutosave();
        }
    },

    uploadPhoto(equipKey, index, photoType) { this.managePhoto('upload', equipKey, index, photoType); },
    removePhoto(equipKey, index, photoType) { this.managePhoto('remove', equipKey, index, photoType); },
    uploadPhotoSub(equipKey, index, subType, subIdx, photoType) { this.managePhoto('upload', equipKey, index, photoType, subType, subIdx); },
    removePhotoSub(equipKey, index, subType, subIdx, photoType) { this.managePhoto('remove', equipKey, index, photoType, subType, subIdx); },

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
            sidebar.innerHTML = '<div class="sidebar-title">⚙️ EQUIPOS</div>';
            Object.entries(EQUIPMENT_TYPES).forEach(([typeName, typeData]) => {
                const mainBtn = document.createElement('button');
                mainBtn.className = 'sidebar-btn' + (AppState.currentEquipmentType === typeName ? ' active' : '');
                mainBtn.innerHTML = `<span class="icon">${typeData.icon}</span><span>${typeName}</span>`;
                mainBtn.onclick = () => {
                    AppState.currentEquipmentType = typeName;
                    AppState.currentSubType = typeData.isComposite ? typeName : null;
                    this.renderSidebar();
                    this.renderWorkspace();
                };
                sidebar.appendChild(mainBtn);

                if (!typeData.isComposite && AppState.currentEquipmentType === typeName) {
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
        } else if (AppState.currentPage === 'verif_fugas') {
            sidebar.innerHTML = '<div class="sidebar-title">🔍 DETECTORES</div>';
            
            const addDetectorBtn = document.createElement('button');
            addDetectorBtn.className = 'sidebar-btn';
            addDetectorBtn.innerHTML = '<span class="icon">➕</span><span>Agregar Detector</span>';
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
            sidebar.innerHTML = '<div class="sidebar-title">📋 REVISIÓN FINAL</div>';
            const rfTabs = [
                { id: 'portada',       icon: '🏠', label: 'Portada'                },
                { id: 'indice',        icon: '📑', label: 'Índice'                 },
                { id: 'acta_inicial',  icon: '📋', label: 'Acta Final'             },
                { id: 'equipos',       icon: '⚙️', label: 'Equipos'               },
                { id: 'cert_psv',      icon: '📎', label: 'Cert PSV'              },
                { id: 'verif_fugas',   icon: '🔍', label: 'Verif. Detector Fugas' },
                { id: 'termografia',   icon: '🌡️', label: 'Termografía'          },
                { id: 'planificacion', icon: '📅', label: 'Planificación'          },
                { id: 'contraportada', icon: '🔚', label: 'Contraportada'          }
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
                        AppState.currentSubType = typeData.isComposite ? typeName : null;
                        this.renderSidebar();
                        this.renderWorkspace();
                    };
                    sidebar.appendChild(mainBtn);
                    if (!typeData.isComposite && AppState.currentEquipmentType === typeName) {
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
                addBtn.innerHTML = '<span class="icon">➕</span><span>Agregar Detector</span>';
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
                addBtn.innerHTML = '<span class="icon">➕</span><span>Agregar Punto</span>';
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
            sidebar.innerHTML = '<div class="sidebar-title">🌡️ TERMOGRAFÍA</div>';
            const addBtn = document.createElement('button');
            addBtn.className = 'sidebar-btn';
            addBtn.innerHTML = '<span class="icon">➕</span><span>Agregar Punto</span>';
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
            sidebar.innerHTML = '<div class="sidebar-title">❄️ SERVICIOS</div>';
            
            const addServicioBtn = document.createElement('button');
            addServicioBtn.className = 'sidebar-btn';
            addServicioBtn.innerHTML = '<span class="icon">➕</span><span>Agregar Servicio</span>';
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
                workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">⚙️</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona un tipo de equipo</div><p>Usa el menú lateral para comenzar</p></div></div>';
                return;
            }
            
            const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
            workspace.innerHTML = `
                <div class="section-card">
                    <div class="section-title">${typeData.icon} ${AppState.currentSubType}</div>
                    <button class="add-equipment-btn" onclick="App.${typeData.isComposite ? 'addCompositeUnit' : 'addEquipment'}()">
                        ➕ Añadir ${AppState.currentSubType}
                    </button>
                    <div class="equipment-list" id="equipmentList"></div>
                </div>
            `;
            typeData.isComposite ? this.renderCompositeUnitsList() : this.renderEquipmentList();
        } else if (AppState.currentPage === 'verif_fugas') {
            if (AppState.currentDetector === null) {
                workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">🔍</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un detector</div><p>Usa el menú lateral para comenzar</p></div></div>';
                return;
            }
            this.renderDetectorForm();
        } else if (AppState.currentPage === 'revision_final') {
            const tab = AppState.currentRevisionFinalTab;
            if (!tab) {
                workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">📋</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Revisión Final</div><p>Selecciona una sección en el menú lateral</p></div></div>';
            } else if (tab === 'portada')       { this.renderPortada();       }
              else if (tab === 'indice')        { this.renderIndice();        }
              else if (tab === 'acta_inicial')  { this.renderActaInicial();   }
              else if (tab === 'cert_psv')      { this.renderCertPsv();       }
              else if (tab === 'planificacion') { this.renderPlanificacion(); }
              else if (tab === 'contraportada') { this.renderContraportada(); }
              else if (tab === 'equipos') {
                  if (!AppState.currentSubType) {
                      workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">⚙️</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona un tipo de equipo</div><p>Usa el menú lateral para comenzar</p></div></div>';
                  } else {
                      const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
                      workspace.innerHTML = `
                          <div class="section-card">
                              <div class="section-title">${typeData.icon} ${AppState.currentSubType}</div>
                              <button class="add-equipment-btn" onclick="App.${typeData.isComposite ? 'addCompositeUnit' : 'addEquipment'}()">
                                  ➕ Añadir ${AppState.currentSubType}
                              </button>
                              <div class="equipment-list" id="equipmentList"></div>
                          </div>`;
                      typeData.isComposite ? this.renderCompositeUnitsList() : this.renderEquipmentList();
                  }
              } else if (tab === 'verif_fugas') {
                  if (AppState.currentDetector === null) {
                      workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">🔍</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un detector</div><p>Usa el menú lateral para comenzar</p></div></div>';
                  } else {
                      this.renderDetectorForm();
                  }
              } else if (tab === 'termografia') {
                  if (AppState.currentTermografia !== null) {
                      this.renderTermografia();
                  } else {
                      workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">🌡️</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un punto</div><p>Usa el menú lateral para comenzar</p></div></div>';
                  }
              }
        } else if (AppState.currentPage === 'termografia') {
            if (AppState.currentTermografia !== null) {
                this.renderTermografia();
            } else {
                workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">🌡️</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un punto</div><p>Usa el menú lateral para comenzar</p></div></div>';
            }
        } else if (AppState.currentPage === 'servicios') {
            if (AppState.currentServicio !== null) {
                this.renderServicioForm();
            } else {
                workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">❄️</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona o agrega un Servicio</div><p>Usa el menú lateral para comenzar</p></div></div>';
            }
        } else {
            if (!AppState.currentSection) {
                workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">📋</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Selecciona una sección</div><p>Usa el menú lateral para comenzar</p></div></div>';
                return;
            }
            
            const [pageKey, ...sectionParts] = AppState.currentSection.split('_');
            const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sectionParts.join('_'));
            
            // CRÍTICO: Verificar si la sección es solo para legal
            if (section.legalOnly && !AppState.isLegalMode) {
                workspace.innerHTML = '<div class="empty-workspace"><div><div class="empty-icon">🔒</div><div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem">Sección no disponible</div><p>Esta sección solo está disponible en modo Legal</p></div></div>';
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
        this.showToast('✔️ Servicio añadido', 'success');
        this._doAutosave();
    },

    removeServicio(index) {
        if (confirm('¿Eliminar este servicio?')) {
            AppState.serviciosData.splice(index, 1);
            AppState.currentServicio = AppState.serviciosData.length > 0 ? 0 : null;
            this.renderSidebar();
            this.renderWorkspace();
            this.showToast('🗑️ Servicio eliminado', 'success');
            this._doAutosave();
        }
    },

    renderServicioForm() {
        const workspace = document.getElementById('workspace');
        const servicio = AppState.serviciosData[AppState.currentServicio];
        
        workspace.innerHTML = `
            <div class="section-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
                    <div class="section-title">❄️ Servicio ${AppState.currentServicio + 1}</div>
                    <button class="equipment-remove-btn" onclick="App.removeServicio(${AppState.currentServicio})">🗑️ Eliminar Servicio</button>
                </div>

                <div class="form-section">
                    <div class="form-section-title">📋 Datos del Servicio / Cámara</div>
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
                    <div class="form-section-title">✔️ Equipamiento de Seguridad</div>
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
                    </div>
                    <div class="form-row">
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
                    <div class="section-title" style="margin-bottom:0.75rem">➕ Nuevo Detector</div>
                    <p style="color:#6b7280;margin-bottom:2rem;font-size:0.9rem">Selecciona el tipo de certificado para este detector:</p>
                    <div style="display:flex;gap:1.5rem;justify-content:center">
                        <button onclick="App.addDetectorWithType('pdf')"
                            style="flex:1;padding:2rem 1rem;background:#eff6ff;border:2px solid #1d4ed8;border-radius:1rem;cursor:pointer">
                            <div style="font-size:2.5rem;margin-bottom:0.75rem">📄</div>
                            <div style="font-size:1rem;font-weight:700;color:#1d4ed8">Adjuntar PDF(s)</div>
                            <div style="font-size:0.78rem;color:#6b7280;margin-top:0.4rem">Sube uno o varios certificados PDF del fabricante/laboratorio</div>
                        </button>
                        <button onclick="App.addDetectorWithType('formulario')"
                            style="flex:1;padding:2rem 1rem;background:#f0fdf4;border:2px solid #16a34a;border-radius:1rem;cursor:pointer">
                            <div style="font-size:2.5rem;margin-bottom:0.75rem">📝</div>
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
        this.showToast('✔️ Detector añadido', 'success');
        this._doAutosave();
    },

    removeDetector(index) {
        if (confirm('¿Eliminar este detector?')) {
            AppState.detectorsData.splice(index, 1);
            AppState.currentDetector = AppState.detectorsData.length > 0 ? 0 : null;
            this.renderSidebar();
            this.renderWorkspace();
            this.showToast('🗑️ Detector eliminado', 'success');
            this._doAutosave();
        }
    },

    renderDetectorForm() {
        const workspace = document.getElementById('workspace');
        const detector = AppState.detectorsData[AppState.currentDetector];
        const idx = AppState.currentDetector;
        const isPdf = detector.tipo === 'pdf';

        const _certPdfList = (det, detIdx) => `
            <div ondragover="event.preventDefault();this.style.borderColor='#1d4ed8';this.style.background='#eff6ff'"
                 ondragleave="this.style.borderColor='#d1d5db';this.style.background='#fafafa'"
                 ondrop="event.preventDefault();this.style.borderColor='#d1d5db';this.style.background='#fafafa';App.dropDetectorCert(event,${detIdx})"
                 onclick="App.uploadDetectorCert(${detIdx})"
                 style="border:2px dashed #d1d5db;border-radius:0.75rem;padding:1.5rem;text-align:center;cursor:pointer;background:#fafafa;transition:border-color .15s,background .15s;margin-bottom:1rem">
                <div style="font-size:2rem;margin-bottom:0.3rem">📄</div>
                <div style="font-size:0.85rem;color:#6b7280;font-weight:600">Arrastra PDF(s) aquí o haz clic para seleccionar</div>
                <div style="font-size:0.72rem;color:#9ca3af;margin-top:0.2rem">Puedes adjuntar varios certificados a la vez</div>
            </div>
            ${(det.certArchivos && det.certArchivos.length) ? `
                <div style="display:flex;flex-direction:column;gap:0.5rem">
                    ${det.certArchivos.map((pdf, ci) => `
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:0.6rem 0.8rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:0.5rem">
                            <div style="display:flex;align-items:center;gap:0.5rem;overflow:hidden">
                                <span style="font-size:1.1rem">📄</span>
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
                        <div class="section-title">🔍 Detector ${idx + 1} <span style="font-size:0.75rem;background:#1d4ed8;color:#fff;border-radius:4px;padding:2px 8px;vertical-align:middle">PDF</span></div>
                        <button class="equipment-remove-btn" onclick="App.removeDetector(${idx})">🗑️ Eliminar Detector</button>
                    </div>
                    <div class="verification-header">
                        <h3 style="font-size:1.25rem;margin-bottom:0.5rem">📄 CERTIFICADO PDF — DETECTOR / CENTRALITA</h3>
                        <p style="font-size:0.875rem;opacity:0.9">Normativa: RD 552/2019 IF-16 Pto 3.3</p>
                    </div>
                    <div class="form-section">
                        <div class="form-section-title">📄 Certificados PDF</div>
                        <p style="font-size:0.8rem;color:#6b7280;margin-bottom:0.75rem">Adjunta los certificados oficiales del fabricante o laboratorio en formato PDF.</p>
                        ${_certPdfList(detector, idx)}
                    </div>
                </div>`;
            return;
        }

        workspace.innerHTML = `
            <div class="section-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
                    <div class="section-title">🔍 Detector ${idx + 1}${AppState.isLegalMode ? ' <span style="font-size:0.75rem;background:#16a34a;color:#fff;border-radius:4px;padding:2px 8px;vertical-align:middle">Form</span>' : ''}</div>
                    <button class="equipment-remove-btn" onclick="App.removeDetector(${idx})">🗑️ Eliminar Detector</button>
                </div>

                <div class="verification-header">
                    <h3 style="font-size:1.25rem;margin-bottom:0.5rem">📡 DETECTOR / CENTRALITA</h3>
                    <p style="font-size:0.875rem;opacity:0.9">Normativa: RD 552/2019 IF-16 Pto 3.3</p>
                </div>

                <div class="form-section">
                    <div class="form-section-title">📋 Datos del Detector</div>
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
                    <div class="form-section-title">✔️ OPERACIONES REALIZADAS</div>
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
                    <div class="form-section-title">📸 Imágenes</div>
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
                          <div class="photo-upload" onclick="App.uploadDetectorImage(${idx})" style="margin-bottom:1rem">
                              <div style="font-size:2.5rem;margin-bottom:0.5rem;color:#6b7280">📷</div>
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
                    <div class="form-section-title">💬 OBSERVACIONES / COMENTARIOS</div>
                    <textarea class="form-input" data-detector="observaciones" rows="6">${detector.observaciones}</textarea>
                </div>

                <div class="form-section">
                    <div class="form-section-title">📅 Fechas y Responsables</div>
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
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="${fieldName}" value="SI" ${value === 'SI' ? 'checked' : ''}> SI
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="${fieldName}" value="NO" ${value === 'NO' ? 'checked' : ''}> NO
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="${fieldName}" value="N/A" ${value === 'N/A' ? 'checked' : ''}> N/A
                    </label>
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
                    this.showToast('📷 Imagen añadida', 'success');
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
            this.showToast('🗑️ Imagen eliminada', 'success');
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
                    this.showToast('📄 Certificado adjuntado', 'success');
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
                this.showToast('📄 Certificado adjuntado', 'success');
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
            this.showToast('🗑️ Certificado eliminado', 'success');
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
        this.showToast('✔️ Local agregado', 'success');
    },

    removeLocal(index) {
        if (confirm('¿Eliminar este local?')) {
            AppState.instalacionSalas.splice(index, 1);
            const [pageKey, ...sectionParts] = AppState.currentSection.split('_');
            const section = PAGES_CONFIG[pageKey].sections.find(s => s.id === sectionParts.join('_'));
            this.renderFormSection(section);
            this.showToast('🗑️ Local eliminado', 'success');
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
                                    <div class="form-col">
                                        <label class="form-label">${f.name}${f.computed ? ' <span style="font-size:0.75rem;color:#6b7280;font-weight:normal">(auto)</span>' : ''}</label>
                                        ${this._renderFieldInput(f, data)}
                                    </div>
                                `).join('') + '</div>';
                                tempFields = [];
                            }
                            
                            // Renderizar campo fullWidth
                            html += `<div class="form-row">
                                <div class="form-col" style="grid-column: 1 / -1;">
                                    <label class="form-label">${field.name}${field.computed ? ' <span style="font-size:0.75rem;color:#6b7280;font-weight:normal">(auto)</span>' : ''}</label>
                                    ${this._renderFieldInput(field, data)}
                                </div>
                            </div>`;
                        } else {
                            // Acumular campos normales
                            tempFields.push(field);
                            
                            // Si llegamos a 3 campos o es el último, renderizar la fila
                            if (tempFields.length === 3 || idx === section.fields.length - 1) {
                                html += '<div class="form-row">' + tempFields.map(f => `
                                    <div class="form-col">
                                        <label class="form-label">${f.name}${f.computed ? ' <span style="font-size:0.75rem;color:#6b7280;font-weight:normal">(auto)</span>' : ''}</label>
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
                        <div class="form-section-title">⚙️ CIRCUITOS</div>
                        <div style="overflow-x:auto">
                            <table style="width:100%;border-collapse:collapse;background:white">
                                <thead>
                                    <tr style="background:#1f2937;color:white">
                                        <th style="padding:0.75rem;text-align:left;border:1px solid #374151">Circuito</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid #374151">Refrigerante</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid #374151">Carga (kg)</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid #374151">PCA</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid #374151">Tn eq. CO2</th>
                                        <th style="padding:0.75rem;text-align:left;border:1px solid #374151">Detector</th>
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
                                                <input type="text" class="form-input" value="${pca}" style="margin:0;padding:0.5rem;background:#f3f4f6;color:#6b7280" readonly>
                                            </td>
                                            <td style="padding:0.5rem;border:1px solid #e5e7eb">
                                                <input type="text" class="form-input" value="${tnCO2}" style="margin:0;padding:0.5rem;background:#f3f4f6;color:#6b7280" readonly>
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
                            <div class="sm-card-title">🏭 SALAS DE MÁQUINAS O ESPACIOS EQUIVALENTES</div>
                            <button class="add-vs-btn" onclick="App.addLocal()" style="margin-bottom:1rem;width:100%">➕ Agregar Local</button>
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
                                    <button class="remove-vs-btn" onclick="App.removeLocal(${idx})" style="height:fit-content;margin-bottom:0.25rem">🗑️</button>
                                </div>
                            `).join('')}
                            ${AppState.instalacionSalas.length === 0 ? '<p style="text-align:center;color:#9ca3af;padding:1rem">No hay locales agregados</p>' : ''}
                        </div>

                        <div class="sm-card">
                            <div class="sm-card-title">❄️ CÁMARAS O ESPACIOS ACONDICIONADOS</div>
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
        
        workspace.innerHTML = `
            <div class="section-card">
                <div class="section-title">${section.icon} ${section.name}</div>
                ${section.items.map(item => {
                    const itemData = data[item.id] || {estado: '', gravedad: '', correccion: '', observaciones: '', imagenes: []};
                    const estados = ['', '✔️ POSITIVO', '❌ NEGATIVO', '⚠️ RECOMENDACIÓN', '➖ NO PROCEDE'];
                    const selectClass = itemData.estado === '✔️ POSITIVO' ? 'result-valid' 
                                      : itemData.estado === '❌ NEGATIVO' ? 'result-invalid' 
                                      : itemData.estado === '⚠️ RECOMENDACIÓN' ? 'result-warning' : '';
                    const showExtraFields = itemData.estado === '❌ NEGATIVO' || itemData.estado === '⚠️ RECOMENDACIÓN';
                    const forceShowImages = alwaysShowImages.includes(item.id);
                    const shouldShowImages = showExtraFields || forceShowImages;
                    
                    return `
                        <div style="background:white;border:2px solid #e5e7eb;border-radius:0.75rem;padding:1.5rem;margin-bottom:1.5rem">
                            <div class="checklist-item-container">
                                <div class="checklist-item-badge">${item.id}</div>
                                <div style="flex:1;min-width:0">
                                    <div style="font-weight:bold;margin-bottom:0.5rem">${item.desc}</div>
                                    <div style="background:#f0f9ff;border-left:4px solid #3b82f6;padding:0.875rem;border-radius:0.375rem;font-size:0.875rem;white-space:pre-line">${item.comment}</div>
                                </div>
                            </div>
                            
                            ${showExtraFields && isLegalMode ? `
                                <div class="checklist-extra-fields" style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:1rem;margin-bottom:1rem">
                                    <div>
                                        <label class="form-label">Estado</label>
                                        <select class="form-input ${selectClass}" data-item="${item.id}" data-field-type="estado" style="width:100%">
                                            ${estados.map(est => `<option value="${est}" ${est === itemData.estado ? 'selected' : ''}>${est || 'Seleccione estado...'}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label">Gravedad</label>
                                        <select class="form-input ${itemData.gravedad === 'Leve' ? 'checklist-gravedad-leve' : itemData.gravedad === 'Grave' ? 'checklist-gravedad-grave' : ''}" data-item="${item.id}" data-field-type="gravedad" style="width:100%">
                                            <option value="">Seleccionar...</option>
                                            <option value="Leve" ${itemData.gravedad === 'Leve' ? 'selected' : ''}>⚠️ Leve</option>
                                            <option value="Grave" ${itemData.gravedad === 'Grave' ? 'selected' : ''}>🔴 Grave</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="form-label">Corrección</label>
                                        <select class="form-input" data-item="${item.id}" data-field-type="correccion" style="width:100%">
                                            <option value="">Seleccionar...</option>
                                            <option value="Titular" ${itemData.correccion === 'Titular' ? 'selected' : ''}>👤 Titular</option>
                                            <option value="Clauger" ${itemData.correccion === 'Clauger' ? 'selected' : ''}>🔧 Clauger</option>
                                            <option value="Clauger/Titular" ${itemData.correccion === 'Clauger/Titular' ? 'selected' : ''}>🤝 Clauger/Titular</option>
                                            <option value="A determinar" ${itemData.correccion === 'A determinar' ? 'selected' : ''}>❓ A determinar</option>
                                            <option value="Mantenedor" ${itemData.correccion === 'Mantenedor' ? 'selected' : ''}>⚙️ Mantenedor</option>
                                        </select>
                                    </div>
                                </div>
                            ` : `
                                <select class="form-input ${selectClass}" data-item="${item.id}" data-field-type="estado" style="width:100%;margin-bottom:1rem">
                                    ${estados.map(est => `<option value="${est}" ${est === itemData.estado ? 'selected' : ''}>${est || 'Seleccione estado...'}</option>`).join('')}
                                </select>
                            `}
                            
                            ${showExtraFields ? `
                                <div style="margin-top:1rem">
                                    <label class="form-label">Observaciones</label>
                                    <textarea class="form-input" data-item="${item.id}" data-field-type="observaciones" rows="4">${itemData.observaciones || ''}</textarea>
                                </div>
                            ` : ''}
                            
                            ${shouldShowImages ? (() => {
                                const imgLabel = 'Imágenes' + (forceShowImages && !showExtraFields ? ' (Obligatorio)' : '');
                                const imgContent = AppState.isLegalMode
                                    ? this._legalImgSectionHtml(
                                        '',
                                        itemData.imagenes || [],
                                        "App.dropChecklistImages(event,'" + sectionId + "','" + item.id + "')",
                                        "App.uploadChecklistImages('" + sectionId + "','" + item.id + "')",
                                        "App.removeChecklistImage('" + sectionId + "','" + item.id + "',{i})",
                                        "App.toggleImagePdf('" + sectionId + "','" + item.id + "',{i})"
                                      )
                                    : '<div class="photo-upload" onclick="App.uploadChecklistImage(\'' + sectionId + '\',\'' + item.id + '\')" style="margin-bottom:1rem">'
                                        + '<div style="font-size:2.5rem;margin-bottom:0.5rem;color:#6b7280">📷</div>'
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
                                return '<div style="margin-top:1.5rem"><label class="form-label">' + imgLabel + '</label>' + imgContent + '</div>';
                            })() : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        workspace.querySelectorAll('select[data-item]').forEach(select => {
            select.onchange = (e) => {
                const itemId = e.target.dataset.item;
                const fieldType = e.target.dataset.fieldType;
                
                AppState.sectionsData[sectionId][itemId][fieldType] = e.target.value;
                
                if (fieldType === 'estado') {
                    e.target.className = 'form-input ' + (e.target.value === '✔️ POSITIVO' ? 'result-valid' 
                                       : e.target.value === '❌ NEGATIVO' ? 'result-invalid' 
                                       : e.target.value === '⚠️ RECOMENDACIÓN' ? 'result-warning' : '');
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
                    this.showToast('📷 Imagen añadida', 'success');
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
            this.showToast('🗑️ Imagen eliminada', 'success');
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
                <div class="section-title">📅 Planificación</div>

                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
                    <div style="font-size:0.85rem;color:#6b7280">Los datos resaltados se calculan automáticamente desde <b>Datos de Instalación</b> y <b>Datos de Revisión</b>.</div>
                    <button class="add-vs-btn" onclick="App.regenerarPlanificacion()" style="margin:0">🔄 Regenerar texto automático</button>
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
        this.showToast('🔄 Texto regenerado con datos actuales', 'success');
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
            <!-- Toolbar -->
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;background:#f9fafb">
                <span style="font-weight:600;color:#374151">🏠 Portada</span>
                <button class="add-vs-btn" onclick="App.regenerarPortada()" style="margin:0">🔄 Regenerar datos automáticos</button>
            </div>

            <!-- Preview de portada -->
            <div style="padding:2rem;background:#f3f4f6;display:flex;justify-content:center">
                <div id="portada-preview" style="width:595px;min-height:842px;background:white;box-shadow:0 4px 24px rgba(0,0,0,0.13);position:relative;display:flex;flex-direction:column;font-family:'Segoe UI',Arial,sans-serif;overflow:hidden">

                    <!-- Barra superior azul oscuro -->
                    <div style="background:#1a2744;height:12px;width:100%"></div>

                    <!-- Header: logo + título empresa -->
                    <div style="display:flex;align-items:center;justify-content:space-between;padding:1.5rem 2rem 1rem">
                        <img src="Clauger.png" style="height:48px;object-fit:contain" alt="CLAUGER">
                        <div style="text-align:right;color:#6b7280;font-size:0.7rem;line-height:1.5">
                            <div style="font-weight:700;color:#1a2744;font-size:0.8rem">CLAUGER IBÉRICA S.L.U.</div>
                        </div>
                    </div>

                    <!-- Banda azul central con título principal -->
                    <div style="background:#1a2744;color:white;padding:3rem 2.5rem;flex:1;display:flex;flex-direction:column;justify-content:center;margin:0 0 0 0;position:relative">
                        <div style="position:absolute;top:0;right:0;width:180px;height:100%;background:rgba(255,255,255,0.04)"></div>
                        <div style="font-size:0.7rem;letter-spacing:0.2em;color:#93c5fd;text-transform:uppercase;margin-bottom:0.5rem">Informe Técnico</div>
                        <div style="font-size:1.6rem;font-weight:800;line-height:1.2;margin-bottom:0.4rem">
                            <input id="port-titulo" value="${v('titulo')}" style="background:transparent;border:none;border-bottom:2px solid rgba(255,255,255,0.3);color:white;font-size:inherit;font-weight:inherit;width:100%;outline:none;padding:0.2rem 0" placeholder="Título principal">
                        </div>
                        <div style="font-size:1rem;color:#93c5fd;font-weight:500;margin-bottom:2.5rem">
                            <input id="port-subtitulo" value="${v('subtitulo')}" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.2);color:#93c5fd;font-size:inherit;font-weight:inherit;width:100%;outline:none;padding:0.15rem 0" placeholder="Subtítulo">
                        </div>

                        <!-- Caja de datos cliente (abajo derecha) -->
                        <div style="align-self:flex-end;background:rgba(255,255,255,0.09);border:1px solid rgba(255,255,255,0.18);border-radius:6px;padding:1rem 1.25rem;min-width:260px;max-width:340px">
                            <div style="font-size:0.65rem;letter-spacing:0.12em;color:#93c5fd;text-transform:uppercase;margin-bottom:0.75rem;font-weight:700">Datos del cliente</div>

                            <div style="font-size:0.7rem;color:rgba(255,255,255,0.6);margin-bottom:2px">Cliente</div>
                            <input id="port-cliente" value="${v('cliente')}" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.2);color:white;font-weight:600;font-size:0.85rem;width:100%;outline:none;padding:0.15rem 0;margin-bottom:0.6rem" placeholder="Nombre de cliente">

                            <div style="font-size:0.7rem;color:rgba(255,255,255,0.6);margin-bottom:2px">Dirección</div>
                            <input id="port-direccion" value="${v('direccion')}" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.2);color:white;font-size:0.8rem;width:100%;outline:none;padding:0.15rem 0;margin-bottom:0.6rem" placeholder="Dirección">

                            <div style="display:grid;grid-template-columns:80px 1fr;gap:0.5rem;margin-bottom:0.6rem">
                                <div>
                                    <div style="font-size:0.7rem;color:rgba(255,255,255,0.6);margin-bottom:2px">C.P.</div>
                                    <input id="port-cp" value="${v('cp')}" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.2);color:white;font-size:0.8rem;width:100%;outline:none;padding:0.15rem 0" placeholder="00000">
                                </div>
                                <div>
                                    <div style="font-size:0.7rem;color:rgba(255,255,255,0.6);margin-bottom:2px">Población</div>
                                    <input id="port-localidad" value="${v('localidad')}" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.2);color:white;font-size:0.8rem;width:100%;outline:none;padding:0.15rem 0" placeholder="Localidad">
                                </div>
                            </div>

                            <div style="font-size:0.7rem;color:rgba(255,255,255,0.6);margin-bottom:2px">Provincia</div>
                            <input id="port-provincia" value="${v('provincia')}" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.2);color:white;font-size:0.8rem;width:100%;outline:none;padding:0.15rem 0;margin-bottom:0.75rem" placeholder="Provincia">

                            <div style="display:grid;grid-template-columns:1fr 70px;gap:0.5rem">
                                <div>
                                    <div style="font-size:0.7rem;color:rgba(255,255,255,0.6);margin-bottom:2px">Nº Referencia</div>
                                    <input id="port-referencia" value="${v('referencia')}" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.2);color:white;font-size:0.8rem;width:100%;outline:none;padding:0.15rem 0" placeholder="REF-XXXX">
                                </div>
                                <div>
                                    <div style="font-size:0.7rem;color:rgba(255,255,255,0.6);margin-bottom:2px">Año</div>
                                    <input id="port-anio" value="${v('anio')}" style="background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.2);color:white;font-size:0.8rem;width:100%;outline:none;padding:0.15rem 0" placeholder="${new Date().getFullYear()}">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pie de página -->
                    <div style="background:#1a2744;height:8px;width:100%"></div>
                </div>
            </div>
        </div>`;

        // Guardar cambios en AppState.portadaData
        ['titulo','subtitulo','cliente','direccion','cp','localidad','provincia','referencia','anio'].forEach(key => {
            const el = document.getElementById('port-' + key);
            if (el) el.addEventListener('input', (e) => { AppState.portadaData[key] = e.target.value; });
        });
    },

    regenerarPortada() {
        AppState.portadaData = { titulo:'',subtitulo:'',cliente:'',direccion:'',cp:'',localidad:'',provincia:'',referencia:'',anio:'' };
        this.renderPortada();
        this.showToast('🔄 Datos regenerados desde el formulario', 'success');
    },

    renderIndice() {
        const workspace = document.getElementById('workspace');

        const defaultItems = [
            { label: 'ACTA',                                           num: '1' },
            { label: 'CERTIFICADO EQUIPOS A PRESIÓN',                  num: '2' },
            { label: 'CERTIFICADO VÁLVULAS DE SEGURIDAD',              num: '3' },
            { label: 'CERTIFICADO DETECTOR',                           num: '4' },
            { label: 'TERMOGRAFÍA',                                    num: '5' },
            { label: 'PLANIFICACIÓN',                                  num: '6' }
        ];

        if (!AppState.indiceData.items || AppState.indiceData.items.length === 0) {
            AppState.indiceData.items = defaultItems.map(i => ({...i}));
        }
        const items = AppState.indiceData.items;

        const filas = items.map((item, idx) => `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.7rem 1rem;border-bottom:1px solid #e5e7eb;background:${idx%2===0?'white':'#f9fafb'}">
                <input value="${item.label}" data-indice="${idx}" data-indice-field="label"
                    style="flex:1;border:none;background:transparent;font-size:0.92rem;font-weight:500;color:#1f2937;outline:none;padding:0.15rem 0.3rem;border-radius:3px"
                    onfocus="this.style.background='#eff6ff'" onblur="this.style.background='transparent'">
                <div style="display:flex;align-items:center;gap:0.5rem;flex-shrink:0">
                    <span style="color:#9ca3af;font-size:0.8rem">Pág.</span>
                    <input value="${item.num}" data-indice="${idx}" data-indice-field="num"
                        style="width:44px;text-align:center;border:1px solid #e5e7eb;border-radius:4px;font-size:0.85rem;padding:0.25rem;color:#1f2937;background:white;outline:none"
                        onfocus="this.style.borderColor='#3b82f6'" onblur="this.style.borderColor='#e5e7eb'">
                    <button onclick="App.removeIndiceItem(${idx})" style="background:#fee2e2;color:#ef4444;border:none;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:0.9rem;line-height:1;display:flex;align-items:center;justify-content:center">×</button>
                </div>
            </div>`).join('');

        workspace.innerHTML = `
        <div class="section-card" style="padding:0">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;background:#f9fafb">
                <span style="font-weight:600;color:#374151">📑 Índice de documentos</span>
                <button class="add-vs-btn" onclick="App.addIndiceItem()" style="margin:0">➕ Añadir entrada</button>
            </div>

            <!-- Preview índice -->
            <div style="padding:2rem;background:#f3f4f6;display:flex;justify-content:center">
                <div style="width:595px;min-height:842px;background:white;box-shadow:0 4px 24px rgba(0,0,0,0.13);display:flex;flex-direction:column;font-family:'Segoe UI',Arial,sans-serif;overflow:hidden">

                    <div style="background:#1a2744;height:12px;width:100%"></div>

                    <div style="padding:2.5rem 2.5rem 1.5rem;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #e5e7eb">
                        <img src="Clauger.png" style="height:40px;object-fit:contain" alt="CLAUGER">
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
        AppState.indiceData.items.push({ label: 'Nuevo documento', num: '' });
        this.renderIndice();
    },

    removeIndiceItem(idx) {
        AppState.indiceData.items.splice(idx, 1);
        this.renderIndice();
    },

    renderContraportada() {
        const workspace = document.getElementById('workspace');
        const defaultTexto = AppState.contraportadaData.texto ||
`CLAUGER IBÉRICA S.L.U.
Empresa Frigorista Autorizada

Para cualquier consulta o información adicional relacionada con este informe, no dude en ponerse en contacto con nuestro departamento técnico.

www.clauger.com`;

        workspace.innerHTML = `
        <div class="section-card" style="padding:0">
            <div style="padding:1rem 1.5rem;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;background:#f9fafb">
                <span style="font-weight:600;color:#374151">🔚 Contraportada</span>
                <span style="font-size:0.8rem;color:#9ca3af">Edita el texto libremente</span>
            </div>

            <div style="padding:2rem;background:#f3f4f6;display:flex;justify-content:center">
                <div style="width:595px;min-height:842px;background:white;box-shadow:0 4px 24px rgba(0,0,0,0.13);display:flex;flex-direction:column;font-family:'Segoe UI',Arial,sans-serif;overflow:hidden">

                    <div style="background:#1a2744;height:12px;width:100%"></div>

                    <!-- Contenido central -->
                    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem 2.5rem;text-align:center">

                        <img src="Clauger.png" style="height:64px;object-fit:contain;margin-bottom:2rem;opacity:0.9" alt="CLAUGER">

                        <div style="width:48px;height:3px;background:#1a2744;border-radius:2px;margin-bottom:2rem"></div>

                        <textarea id="contra-texto" class="form-input"
                            style="width:100%;min-height:200px;text-align:center;font-size:0.9rem;line-height:1.8;resize:vertical;border:1px dashed #d1d5db;background:#fafafa;color:#374151"
                            placeholder="Texto de contraportada...">${defaultTexto}</textarea>

                        <div style="width:48px;height:3px;background:#e5e7eb;border-radius:2px;margin-top:2rem"></div>
                    </div>

                    <div style="background:#1a2744;padding:1rem 2rem;display:flex;align-items:center;justify-content:center">
                        <span style="color:rgba(255,255,255,0.5);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase">CLAUGER IBÉRICA S.L.U. — Empresa Frigorista Autorizada</span>
                    </div>
                    <div style="background:#1a2744;height:8px;width:100%;border-top:1px solid rgba(255,255,255,0.1)"></div>
                </div>
            </div>
        </div>`;

        document.getElementById('contra-texto').addEventListener('input', (e) => {
            AppState.contraportadaData.texto = e.target.value;
        });
    },

    _pdfDropZoneHtml(dropType, clickFn) {
        return `<div id="dropzone-${dropType}"
            style="border:2px dashed #d1d5db;border-radius:0.75rem;padding:2rem;text-align:center;cursor:pointer;background:#fafafa;transition:border-color .15s,background .15s;margin-bottom:1.5rem"
            onclick="${clickFn}">
            <div style="font-size:2.5rem;margin-bottom:0.5rem;pointer-events:none">📄</div>
            <div style="font-size:0.9rem;color:#374151;font-weight:600;pointer-events:none">Arrastra los PDF aquí o haz clic</div>
            <div style="font-size:0.75rem;color:#9ca3af;margin-top:0.35rem;pointer-events:none">Se admiten varios archivos a la vez</div>
        </div>`;
    },

    _setupDropZone(dropType, renderFn) {
        const zone = document.getElementById('dropzone-' + dropType);
        if (!zone) return;
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.borderColor = '#1d4ed8';
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
            this.showToast(`📄 ${file.name} adjuntado`, 'success');
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
            <span style="font-size:1.6rem;flex-shrink:0">📄</span>
            <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:0.875rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${pdf.name}">${pdf.name}</div>
                <div style="font-size:0.75rem;color:#6b7280">${(pdf.size/1024).toFixed(0)} KB · ${new Date(pdf.timestamp).toLocaleDateString('es-ES')}</div>
            </div>
            <button onclick="${downloadFn}(${idx})" style="background:#1d4ed8;color:#fff;border:none;border-radius:0.375rem;padding:0.35rem 0.75rem;font-size:0.8rem;cursor:pointer;font-weight:600">⬇ Descargar</button>
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
                <div class="section-title">📎 Certificado PSV</div>
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
            this.showToast('🗑️ Archivo eliminado', 'success');
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
                <div class="section-title">📋 Acta Inicial</div>
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
            this.showToast('🗑️ Archivo eliminado', 'success');
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
            this.showToast('❌ Librería XLSX no cargada. Comprueba conexión a internet.', 'error');
            return;
        }
        try {
            const wb = XLSX.read(arrayBuffer, {type: 'array'});
            const ws = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(ws, {defval: ''});
            if (!rows.length) { this.showToast('❌ El archivo XLS está vacío', 'error'); return; }

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

            if (!points.length) { this.showToast('❌ No se encontraron puntos con temperatura válida', 'error'); return; }

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
            this.showToast(`📊 ${points.length} puntos cargados de Testo`, 'success');
            this._doAutosave();
        } catch(e) {
            console.error('Error parsing Testo XLS:', e);
            this.showToast('❌ Error al leer el archivo XLS', 'error');
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
                    <div class="section-title">➕ Nueva Termografía</div>
                    <p style="color:#6b7280;font-size:0.9rem;margin-bottom:1.5rem">Selecciona el tipo de registro</p>
                    <div style="display:flex;gap:1.5rem;justify-content:center">
                        <button onclick="App._createTermografia('informe')"
                            style="flex:1;padding:1.2rem 1rem;background:#fff;border:2px solid #1c2b3a;border-radius:0.75rem;cursor:pointer;font-size:0.95rem;font-weight:700;color:#1c2b3a;transition:background 0.15s"
                            onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='#fff'">
                            📄 Adjuntar Informe
                        </button>
                        <button onclick="App._createTermografia('analisis')"
                            style="flex:1;padding:1.2rem 1rem;background:#fff;border:2px solid #1c2b3a;border-radius:0.75rem;cursor:pointer;font-size:0.95rem;font-weight:700;color:#1c2b3a;transition:background 0.15s"
                            onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='#fff'">
                            📋 Justificar Deficiencia de Aislamiento
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
        this.showToast('🌡️ Punto de termografía añadido', 'success');
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
            this.showToast('🗑️ Punto eliminado', 'success');
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
        this.showToast('✅ Cálculo realizado', 'success');
        this._doAutosave();
    },

    renderTermografiaInforme(idx) {
        const p = AppState.termografiaData[idx];
        const workspace = document.getElementById('workspace');
        const archivos = p.informeArchivos || [];
        workspace.innerHTML = `
            <div class="section-card" style="max-width:600px">
                <div class="section-title" style="display:flex;justify-content:space-between;align-items:center">
                    <span>📄 Informe Termografía ${idx + 1}</span>
                    <button onclick="App.removeTermografia(${idx})" style="background:#fee2e2;color:#dc2626;border:none;border-radius:0.5rem;padding:0.35rem 0.75rem;font-size:0.8rem;cursor:pointer">🗑️ Eliminar</button>
                </div>
                <div id="termo-drop-${idx}"
                    ondragover="event.preventDefault();this.style.borderColor='#1c2b3a';this.style.background='#f0f4ff'"
                    ondragleave="this.style.borderColor='#d1d5db';this.style.background='#fafafa'"
                    ondrop="event.preventDefault();this.style.borderColor='#d1d5db';this.style.background='#fafafa';App._dropTermografiaInforme(event,${idx})"
                    style="border:2px dashed #d1d5db;border-radius:0.75rem;background:#fafafa;padding:2.5rem;text-align:center;cursor:pointer;transition:all 0.2s;margin-bottom:1rem"
                    onclick="App.uploadTermografiaInforme(${idx})">
                    <div style="font-size:2.5rem;margin-bottom:0.5rem">📎</div>
                    <div style="font-weight:600;color:#374151;margin-bottom:0.25rem">Arrastra PDFs aquí o haz clic para seleccionar</div>
                    <div style="font-size:0.8rem;color:#9ca3af">Se pueden adjuntar varios archivos a la vez</div>
                </div>
                ${archivos.length ? `<div style="display:flex;flex-direction:column;gap:0.5rem">
                    ${archivos.map((f, fi) => `
                        <div style="display:flex;align-items:center;justify-content:space-between;background:#f8fafc;border:1px solid #e5e7eb;border-radius:0.5rem;padding:0.6rem 0.9rem">
                            <span style="font-size:0.875rem;color:#374151">📄 ${f.name}</span>
                            <button onclick="App.removeTermografiaInforme(${idx},${fi})" style="background:none;border:none;color:#dc2626;cursor:pointer;font-size:1.1rem;line-height:1">🗑️</button>
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
                    <button onclick="App.uploadTermografiaImagen(${idx})" style="flex:1;padding:6px;border-radius:6px;background:#e8f4ff;border:1px solid #b3d9ff;color:#0070b8;font-size:11px;font-weight:600;cursor:pointer">🔄 Cambiar imagen</button>
                    <button onclick="App.removeTermografiaImagen(${idx})" style="padding:6px 10px;border-radius:6px;background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;font-size:11px;font-weight:600;cursor:pointer">🗑️</button>
                    ${AppState.isLegalMode ? `<button onclick="App.toggleTermografiaImgPdf(${idx})" style="padding:6px 10px;border-radius:6px;background:${p.imgIncluirEnPdf===false?'#6b7280':'#16a34a'};color:white;border:none;font-size:11px;font-weight:600;cursor:pointer">${p.imgIncluirEnPdf===false?'PDF ✗':'PDF ✓'}</button>` : ''}
                </div>
            </div>` : `
            <div>
                <label class="form-label">Imagen Termográfica</label>
                <div style="aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;border:2px dashed #d1d5db;border-radius:8px;background:#f9fafb;cursor:pointer" onclick="App.uploadTermografiaImagen(${idx})">
                    <div style="text-align:center;padding:1rem">
                        <div style="font-size:2.5rem;margin-bottom:0.5rem">📷</div>
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
            const ico = {ok:'✅',warn:'⚠️',crit:'🚨'}[res.sc];
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
            if (res.cr==='CONDENSA')     recos.push({c:'crit',i:'💧',t:'Condensación activa detectada',d:'Ts bajo punto de rocío. Riesgo inmediato de corrosión bajo aislamiento. Inspeccionar urgente.'});
            if (res.cr==='MUY PROBABLE') recos.push({c:'warn',i:'💦',t:'Riesgo muy alto de condensación',d:`Margen de solo ${res.mg.toFixed(1)}°C. Verificar sellado de vapor y barrera antivapor.`});
            if (res.I>=0.6)              recos.push({c:'crit',i:'🔴',t:'Fallo grave del aislamiento',d:`I=${res.I.toFixed(3)}. Pérdida severa de material o daño estructural. Reposición urgente.`});
            else if (res.I>=0.35)        recos.push({c:'warn',i:'🟡',t:'Aislamiento deficiente',d:`I=${res.I.toFixed(3)}. Posible humedad absorbida o pérdida de espesor. Planificar revisión.`});
            else if (res.I<0.15)         recos.push({c:'ok', i:'✅',t:'Aislamiento excelente',d:`I=${res.I.toFixed(3)} — rendimiento óptimo. Mantener inspecciones periódicas.`});
            else                          recos.push({c:'ok', i:'🟢',t:'Aislamiento aceptable',d:`I=${res.I.toFixed(3)} dentro de rango normal.`});
            if (res.mg!==null && res.mg>5) recos.push({c:'ok', i:'🌡️',t:'Margen de condensación suficiente',d:`${res.mg.toFixed(1)}°C sobre el punto de rocío. Sin riesgo en condiciones actuales.`});
            if (res.HR===null)             recos.push({c:'info'||'ok',i:'💧',t:'Humedad relativa no disponible',d:'Sin HR no se calcula punto de rocío ni riesgo de condensación. Introduce HR para análisis completo.'});
            if (res.sc==='crit')           recos.push({c:'crit',i:'🔧',t:'Intervención técnica inmediata',d:'Revisar aislamiento. Medición de espesores con ultrasonidos.'});
            else                            recos.push({c:'ok', i:'📋',t:'Mantener registro de inspecciones',d:'Documentar con fecha, condiciones e imagen termográfica.'});
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
                    <div class="section-title" style="margin-bottom:0">🌡️ ${p.equipo || 'Punto ' + (idx + 1)}</div>
                    <button onclick="App.removeTermografia(${idx})" style="background:#ef4444;color:#fff;border:none;border-radius:0.375rem;padding:0.4rem 0.9rem;font-size:0.85rem;cursor:pointer;font-weight:600">🗑️ Eliminar</button>
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
                                style="display:flex;align-items:center;gap:5px;padding:5px 10px;background:#fff;border:1.5px solid #1d4ed8;border-radius:6px;color:#1d4ed8;font-size:0.75rem;font-weight:700;cursor:pointer">
                                📊 Importar Testo
                            </button>
                        </div>

                        ${p._testoPoints && p._testoPoints.length ? (() => {
                            const typeOf = id => /^CS\d/i.test(id)?'cold':/^HS\d/i.test(id)?'hot':/^M\d/i.test(id)?'manual':'other';
                            const typeStyle = t => ({
                                cold:   {bg:'#eff6ff',border:'#93c5fd',color:'#1d4ed8',icon:'❄️',label:'Frío'},
                                hot:    {bg:'#fff7ed',border:'#fdba74',color:'#c2410c',icon:'🔥',label:'Caliente'},
                                manual: {bg:'#f0fdf4',border:'#86efac',color:'#15803d',icon:'📍',label:'Manual'},
                                other:  {bg:'#f9fafb',border:'#d1d5db',color:'#6b7280',icon:'⚪',label:'Área'}
                            })[t] || {bg:'#f9fafb',border:'#d1d5db',color:'#6b7280',icon:'⚪',label:''};

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
                                            style="flex:1;padding:3px 6px;border-radius:4px;font-size:0.68rem;font-weight:700;cursor:pointer;border:1.5px solid ${isTin?'#1d4ed8':'#d1d5db'};background:${isTin?'#1d4ed8':'#fff'};color:${isTin?'#fff':'#6b7280'}">
                                            ${isTin?'✓ ':''}→ Temperatura Interior
                                        </button>
                                        <button onclick="App.applyTestoPoint(${idx},'ts',${pt.temp})"
                                            style="flex:1;padding:3px 6px;border-radius:4px;font-size:0.68rem;font-weight:700;cursor:pointer;border:1.5px solid ${isTs?'#1d4ed8':'#d1d5db'};background:${isTs?'#1d4ed8':'#fff'};color:${isTs?'#fff':'#6b7280'}">
                                            ${isTs?'✓ ':''}→ Temperatura Superficie
                                        </button>
                                    </div>
                                </div>`;
                            }).join('');

                            return `<div style="background:#e0f2fe;border:1px solid #7dd3fc;border-radius:8px;padding:8px 10px;margin-bottom:10px">
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                                    <span style="font-size:0.78rem;font-weight:700;color:#0369a1">📊 Puntos de medición Testo</span>
                                    <button onclick="App.clearTestoImport(${idx})" style="font-size:0.7rem;color:#0369a1;background:none;border:none;cursor:pointer;text-decoration:underline">Limpiar</button>
                                </div>
                                ${p._testoTamb !== null && p._testoTamb !== undefined ? `<div style="font-size:0.72rem;color:#0369a1;margin-bottom:6px">🌡️ Temp. reflejada → <strong>Tamb = ${p._testoTamb} °C</strong> (auto-rellenado)</div>` : ''}
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
                        <button onclick="App.calcularTermografia(${idx})" style="margin-top:0.5rem;width:100%;background:#1d4ed8;color:#fff;border:none;border-radius:0.5rem;padding:0.6rem 1rem;font-size:0.9rem;font-weight:700;cursor:pointer">
                            ⚡ Analizar aislamiento
                        </button>
                    </div>
                </div>

                <!-- Observaciones -->
                <div class="form-group">
                    <label class="form-label">Observaciones</label>
                    <textarea class="form-input" rows="4" oninput="App.updateTermografiaField(${idx},'observaciones',this.value)" placeholder="Observaciones adicionales...">${p.observaciones}</textarea>
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
        
        AppState.equipmentData[equipKey].push({fabricante: '', modelo: '', numSerie: '', subEquipments: {}});
        const newIndex = AppState.equipmentData[equipKey].length - 1;
        AppState.expandedEquipment[`${equipKey}_${newIndex}`] = true;
        
        this.renderCompositeUnitsList();
        this.showToast('✔️ Unidad Compresora añadida', 'success');
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
                        <div class="equipment-header-title">🔧 Unidad Compresora #${index + 1}</div>
                        <div class="equipment-header-controls">
                            <button class="equipment-toggle">${isExpanded ? '▼' : '▶'}</button>
                            <button class="equipment-remove-btn" onclick="event.stopPropagation();App.removeEquipment('${equipKey}',${index})">🗑️ Eliminar</button>
                        </div>
                    </div>
                    <div class="equipment-content ${isExpanded ? 'show' : ''}" id="equipment_${equipKey}_${index}">
                        <div class="form-section">
                            <div class="form-section-title">📋 Datos Generales</div>
                            <div class="form-row">
                                ${this.createFormFields([
                                    {name: 'Fabricante', path: 'fabricante'},
                                    {name: 'Modelo', path: 'modelo'},
                                    {name: 'Nº Serie', path: 'numSerie'}
                                ], [unit.fabricante, unit.modelo, unit.numSerie])}
                            </div>
                        </div>
                        <div class="form-section">
                            <div class="form-section-title">⚙️ Componentes</div>
                            <div class="components-grid">
                                ${typeData.subTypes.map(subType => {
                                    const count = unit.subEquipments[subType]?.length || 0;
                                    return `<button class="component-btn" onclick="App.addSubEquipment('${equipKey}',${index},'${subType}')">➕ ${subType} (${count})</button>`;
                                }).join('')}
                            </div>
                        </div>
                        ${Object.keys(unit.subEquipments || {}).map(subType => 
                            unit.subEquipments[subType]?.length > 0 ? `
                                <div class="form-section">
                                    <div class="form-section-title">📦 ${subType}</div>
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

    renderSubEquipmentForm(subEquip, unitKey, unitIndex, subType, subIdx) {
        const isCompresor = subType === 'Bloque Compresor';
        const isIntercambiador = subType.includes('Enfriador Aceite');
        const template = isIntercambiador ? 'plantilla2' : 'plantilla1';
        const context = {equipKey: unitKey, index: unitIndex, isSubEquip: true, subType, subIdx};
        
        const isOtro = subType === 'Otro';
        const subTitle = isOtro ? (subEquip.nombreEquipo || `Otro #${subIdx + 1}`) : `${subType} #${subIdx + 1}`;

        return `
            <div style="background:#f9fafb;border:2px solid #e5e7eb;border-radius:0.75rem;padding:1.5rem;margin-bottom:1rem">
                <div style="display:flex;justify-content:space-between;margin-bottom:1rem">
                    <h4 id="subequip-title-${unitKey}-${unitIndex}-${subIdx}" style="font-weight:600">${subTitle}</h4>
                    <button class="remove-vs-btn" onclick="App.removeSubEquipment('${unitKey}',${unitIndex},'${subType}',${subIdx})">Eliminar</button>
                </div>
                ${isOtro ? `<div class="form-row">${this.createFormFields([{name: 'Nombre equipo', path: `${subType}.${subIdx}.nombreEquipo`}], [subEquip.nombreEquipo||''], 'data-subfield')}</div>` : ''}
                <div class="form-row">
                    ${this.createFormFields([
                        {name: 'Fabricante', path: `${subType}.${subIdx}.fabricante`},
                        {name: 'Modelo', path: `${subType}.${subIdx}.modelo`},
                        {name: 'Nº Serie', path: `${subType}.${subIdx}.numSerie`},
                        ...(AppState.isLegalMode ? [{name: 'Categoría', type: 'select', path: `${subType}.${subIdx}.categoria`, options: ['', 'I', 'II', 'III', 'IV', '-']}] : [])
                    ], [subEquip.fabricante, subEquip.modelo, subEquip.numSerie, ...(AppState.isLegalMode ? [subEquip.categoria||''] : [])], 'data-subfield')}
                </div>
                ${template === 'plantilla2' ? `
                <div class="form-row">
                    ${this.createFormFields([
                        {name: 'Nº Placa Industria', path: `${subType}.${subIdx}.numPlaca`},
                        {name: 'Fecha Fabricación', path: `${subType}.${subIdx}.fechaFabricacion`},
                        {name: 'Ubicación', path: `${subType}.${subIdx}.ubicacion`},
                        ...(AppState.isLegalMode ? [{name: 'Normativa', type: 'select', path: `${subType}.${subIdx}.normativa`, options: ['', 'RD3099/1977', 'RD138/2011', 'RD552/2019']}] : [])
                    ], [subEquip.numPlaca, subEquip.fechaFabricacion, subEquip.ubicacion, ...(AppState.isLegalMode ? [subEquip.normativa||''] : [])], 'data-subfield')}
                </div>
                <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:0.5rem;padding:0.75rem;margin-bottom:0.75rem">
                    <div style="font-size:0.75rem;font-weight:700;color:#92400e;text-transform:uppercase;margin-bottom:0.5rem">🟠 Lado A</div>
                    <div class="form-row">
                        ${this.createFormFields([
                            {name: 'Fluido A', type: 'select', path: `${subType}.${subIdx}.fluidoA`, options: this._getFluidOptions()},
                            {name: 'Volumen Interno (Lts) A', path: `${subType}.${subIdx}.volInternoA`},
                            {name: 'Presión Max (bar) A', path: `${subType}.${subIdx}.presionMaxA`},
                            {name: 'Presión Min (bar) A', path: `${subType}.${subIdx}.presionMinA`}
                        ], [subEquip.fluidoA||'', subEquip.volInternoA||'', subEquip.presionMaxA||'', subEquip.presionMinA||''], 'data-subfield')}
                    </div>
                </div>
                <div style="background:#e0e7ff;border:1px solid #c7d2fe;border-radius:0.5rem;padding:0.75rem;margin-bottom:0.75rem">
                    <div style="font-size:0.75rem;font-weight:700;color:#3730a3;text-transform:uppercase;margin-bottom:0.5rem">🟡 Lado B</div>
                    <div class="form-row">
                        ${this.createFormFields([
                            {name: 'Fluido B', type: 'select', path: `${subType}.${subIdx}.fluidoB`, options: this._getFluidOptions()},
                            {name: 'Volumen Interno (Lts) B', path: `${subType}.${subIdx}.volInternoB`},
                            {name: 'Presión Max (bar) B', path: `${subType}.${subIdx}.presionMaxB`},
                            {name: 'Presión Min (bar) B', path: `${subType}.${subIdx}.presionMinB`}
                        ], [subEquip.fluidoB||'', subEquip.volInternoB||'', subEquip.presionMaxB||'', subEquip.presionMinB||''], 'data-subfield')}
                    </div>
                </div>` : `
                <div class="form-row">
                    ${this.createFormFields([
                        ...(isCompresor ? [] : [{name: 'Nº Placa Industria', path: `${subType}.${subIdx}.numPlaca`}]),
                        {name: 'Fecha Fabricación', path: `${subType}.${subIdx}.fechaFabricacion`},
                        ...(AppState.isLegalMode ? [{name: 'Normativa', type: 'select', path: `${subType}.${subIdx}.normativa`, options: ['', 'RD3099/1977', 'RD138/2011', 'RD552/2019']}] : [{name: 'Fluido', type: 'select', path: `${subType}.${subIdx}.fluido`, options: this._getFluidOptions()}])
                    ], [...(isCompresor ? [] : [subEquip.numPlaca]), subEquip.fechaFabricacion, AppState.isLegalMode ? (subEquip.normativa||'') : subEquip.fluido], 'data-subfield')}
                </div>
                ${AppState.isLegalMode ? `<div class="form-row">
                    ${this.createFormFields([
                        {name: 'Fluido', type: 'select', path: `${subType}.${subIdx}.fluido`, options: this._getFluidOptions()},
                        ...(isCompresor ? [] : [{name: 'Vol. Interno (Lts)', path: `${subType}.${subIdx}.volInterno`}]),
                        {name: 'Presión Max (bar)', path: `${subType}.${subIdx}.presionMax`},
                        {name: 'Presión Min (bar)', path: `${subType}.${subIdx}.presionMin`}
                    ], [subEquip.fluido, ...(isCompresor ? [] : [subEquip.volInterno]), subEquip.presionMax||'', subEquip.presionMin||''], 'data-subfield')}
                </div>
                <div class="form-row">
                    ${this.createFormFields([
                        {name: 'Ubicación', path: `${subType}.${subIdx}.ubicacion`}
                    ], [subEquip.ubicacion], 'data-subfield')}
                </div>` : `
                <div class="form-row">
                    ${this.createFormFields([
                        ...(isCompresor ? [] : [{name: 'Vol. Interno (Lts)', path: `${subType}.${subIdx}.volInterno`}]),
                        {name: 'Presión Max (bar)', path: `${subType}.${subIdx}.presionMax`},
                        {name: 'Presión Min (bar)', path: `${subType}.${subIdx}.presionMin`},
                        {name: 'Ubicación', path: `${subType}.${subIdx}.ubicacion`}
                    ], [...(isCompresor ? [] : [subEquip.volInterno]), subEquip.presionMax||'', subEquip.presionMin||'', subEquip.ubicacion], 'data-subfield')}
                </div>`}`}
                ${template === 'plantilla1' 
                    ? this.renderValvulas(subEquip.valvulas, context, 'single')
                    : `<div class="vs-section">
                        ${this.renderValvulas(subEquip.valvulasA, context, 'A')}
                        ${this.renderValvulas(subEquip.valvulasB, context, 'B')}
                       </div>`
                }
                ${isCompresor ? `
                    <div class="presostato-section">
                        <div style="font-weight:600;margin-bottom:1rem">⚡ Presostato AP</div>
                        <div class="form-row">
                            ${this.createFormFields([
                                {name: 'Tipo', type: 'select', path: `${subType}.${subIdx}.presostato`, options: ['', 'Simple', 'Doble', 'No']}
                            ], [subEquip.presostato], 'data-subfield')}
                        </div>
                    </div>
                ` : ''}
                <div class="form-section">
                    <div class="form-section-title">💬 Observaciones</div>
                    ${this.createFormFields([
                        {name: '', type: 'textarea', path: `${subType}.${subIdx}.observaciones`, rows: 4}
                    ], [subEquip.observaciones], 'data-subfield')}
                </div>
                ${this.renderPhotoSection(subEquip.photos || {placa: null, general: null}, context)}
            </div>
        `;
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
            newSubEquip.valvulasA = {items: []};
            newSubEquip.valvulasB = {items: []};
        } else {
            newSubEquip.fluido = ''; newSubEquip.volInterno = '';
            newSubEquip.presionMax = ''; newSubEquip.presionMin = '';
            newSubEquip.valvulas = {items: []};
        }
        
        if (subType === 'Bloque Compresor') newSubEquip.presostato = '';
        if (subType === 'Otro') newSubEquip.nombreEquipo = '';

        unit.subEquipments[subType].push(newSubEquip);
        this.renderCompositeUnitsList();
        this.showToast(`✔️ ${subType} añadido`, 'success');
    },

    removeSubEquipment(unitKey, unitIndex, subType, subIdx) {
        if (confirm(`¿Eliminar este ${subType}?`)) {
            const unit = AppState.equipmentData[unitKey][unitIndex];
            unit.subEquipments[subType].splice(subIdx, 1);
            if (unit.subEquipments[subType].length === 0) delete unit.subEquipments[subType];
            this.renderCompositeUnitsList();
            this.showToast('🗑️ Componente eliminado', 'success');
        }
    },

    renderEquipmentList() {
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
                        <div class="equipment-header-title">${typeData.icon} ${equipKey} #${index + 1}</div>
                        <div class="equipment-header-controls">
                            <button class="equipment-toggle">${isExpanded ? '▼' : '▶'}</button>
                            <button class="equipment-remove-btn" onclick="event.stopPropagation();App.removeEquipment('${equipKey}',${index})">🗑️ Eliminar</button>
                        </div>
                    </div>
                    <div class="equipment-content ${isExpanded ? 'show' : ''}" id="equipment_${equipKey}_${index}">
                        <div class="form-section">
                            <div class="form-section-title">📋 Descripción</div>
                            <div class="form-row">
                                ${this.createFormFields([
                                    {name: 'Fabricante', path: 'fabricante'},
                                    {name: 'Modelo', path: 'modelo'},
                                    {name: 'Nº Serie', path: 'numSerie'},
                                    ...(AppState.isLegalMode ? [{name: 'Categoría', type: 'select', path: 'categoria', options: ['', 'I', 'II', 'III', 'IV', '-']}] : [])
                                ], [equip.fabricante, equip.modelo, equip.numSerie, ...(AppState.isLegalMode ? [equip.categoria||''] : [])])}
                            </div>
                            ${template === 'plantilla2' ? `
                            <div class="form-row">
                                ${this.createFormFields([
                                    {name: 'Nº Placa Industria', path: 'numPlaca'},
                                    {name: 'Fecha Fabricación', path: 'fechaFabricacion'},
                                    {name: 'Ubicación', path: 'ubicacion'},
                                    ...(AppState.isLegalMode ? [{name: 'Normativa', type: 'select', path: 'normativa', options: ['', 'RD3099/1977', 'RD138/2011', 'RD552/2019']}] : [])
                                ], [equip.numPlaca, equip.fechaFabricacion, equip.ubicacion, ...(AppState.isLegalMode ? [equip.normativa||''] : [])])}
                            </div>
                            <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:0.5rem;padding:0.75rem;margin-bottom:0.75rem">
                                <div style="font-size:0.75rem;font-weight:700;color:#92400e;text-transform:uppercase;margin-bottom:0.5rem">🟠 Lado A</div>
                                <div class="form-row">
                                    ${this.createFormFields([
                                        {name: 'Fluido A', type: 'select', path: 'fluidoA', options: this._getFluidOptions()},
                                        {name: 'Volumen Interno (Lts) A', path: 'volInternoA'},
                                        {name: 'Presión Max (bar) A', path: 'presionMaxA'},
                                        {name: 'Presión Min (bar) A', path: 'presionMinA'}
                                    ], [equip.fluidoA||'', equip.volInternoA||'', equip.presionMaxA||'', equip.presionMinA||''])}
                                </div>
                            </div>
                            <div style="background:#e0e7ff;border:1px solid #c7d2fe;border-radius:0.5rem;padding:0.75rem;margin-bottom:0.75rem">
                                <div style="font-size:0.75rem;font-weight:700;color:#3730a3;text-transform:uppercase;margin-bottom:0.5rem">🟡 Lado B</div>
                                <div class="form-row">
                                    ${this.createFormFields([
                                        {name: 'Fluido B', type: 'select', path: 'fluidoB', options: this._getFluidOptions()},
                                        {name: 'Volumen Interno (Lts) B', path: 'volInternoB'},
                                        {name: 'Presión Max (bar) B', path: 'presionMaxB'},
                                        {name: 'Presión Min (bar) B', path: 'presionMinB'}
                                    ], [equip.fluidoB||'', equip.volInternoB||'', equip.presionMaxB||'', equip.presionMinB||''])}
                                </div>
                            </div>` : `
                            <div class="form-row">
                                ${this.createFormFields([
                                    {name: 'Nº Placa Industria', path: 'numPlaca'},
                                    {name: 'Fecha Fabricación', path: 'fechaFabricacion'},
                                    ...(AppState.isLegalMode ? [{name: 'Normativa', type: 'select', path: 'normativa', options: ['', 'RD3099/1977', 'RD138/2011', 'RD552/2019']}] : [{name: 'Fluido', type: 'select', path: 'fluido', options: this._getFluidOptions()}])
                                ], [equip.numPlaca, equip.fechaFabricacion, AppState.isLegalMode ? (equip.normativa||'') : equip.fluido])}
                            </div>
                            ${AppState.isLegalMode ? `<div class="form-row">
                                ${this.createFormFields([
                                    {name: 'Fluido', type: 'select', path: 'fluido', options: this._getFluidOptions()},
                                    {name: 'Vol. Interno (Lts)', path: 'volInterno'},
                                    {name: 'Presión Max (bar)', path: 'presionMax'},
                                    {name: 'Presión Min (bar)', path: 'presionMin'}
                                ], [equip.fluido, equip.volInterno, equip.presionMax||'', equip.presionMin||''])}
                            </div>
                            <div class="form-row">
                                ${this.createFormFields([
                                    {name: 'Ubicación', path: 'ubicacion'}
                                ], [equip.ubicacion])}
                            </div>` : `
                            <div class="form-row">
                                ${this.createFormFields([
                                    {name: 'Vol. Interno (Lts)', path: 'volInterno'},
                                    {name: 'Presión Max (bar)', path: 'presionMax'},
                                    {name: 'Presión Min (bar)', path: 'presionMin'},
                                    {name: 'Ubicación', path: 'ubicacion'}
                                ], [equip.volInterno, equip.presionMax||'', equip.presionMin||'', equip.ubicacion])}
                            </div>`}`}
                        </div>
                        ${template === 'plantilla1' 
                            ? this.renderValvulas(equip.valvulas, context, 'single')
                            : `<div class="vs-section">
                                ${this.renderValvulas(equip.valvulasA, context, 'A')}
                                ${this.renderValvulas(equip.valvulasB, context, 'B')}
                               </div>`
                        }
                        ${isCompresor ? `
                            <div class="presostato-section">
                                <div style="font-weight:600;margin-bottom:1rem">⚡ Presostato AP</div>
                                <div class="form-row">
                                    ${this.createFormFields([
                                        {name: 'Valor', path: 'presostato'}
                                    ], [equip.presostato])}
                                </div>
                            </div>
                        ` : ''}
                        <div class="form-section">
                            <div class="form-section-title">💬 Observaciones</div>
                            ${this.createFormFields([
                                {name: '', type: 'textarea', path: 'observaciones', rows: 4}
                            ], [equip.observaciones])}
                        </div>
                        ${this.renderPhotoSection(equip.photos || {placa: null, general: null}, context)}
                    </div>
                </div>
            `;
        }).join('');
        
        this.attachFormListeners();
    },

    attachFormListeners() {
        document.querySelectorAll('.form-input[data-field], select[data-field], textarea[data-field]').forEach(input => {
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
            };
        });

        document.querySelectorAll('.form-input[data-subfield], select[data-subfield], textarea[data-subfield]').forEach(input => {
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
            fabricante: '', modelo: '', numSerie: '', numPlaca: '', fechaFabricacion: '',
            normativa: '', ubicacion: '', categoria: '', observaciones: '',
            photos: {placa: null, general: null},
            imagenes: []
        };

        if (typeData.template === 'plantilla1') {
            newEquip.fluido = ''; newEquip.volInterno = '';
            newEquip.presionMax = ''; newEquip.presionMin = '';
            newEquip.valvulas = {items: []};
        } else if (typeData.template === 'plantilla2') {
            newEquip.fluidoA = ''; newEquip.fluidoB = '';
            newEquip.volInternoA = ''; newEquip.volInternoB = '';
            newEquip.presionMaxA = ''; newEquip.presionMinA = '';
            newEquip.presionMaxB = ''; newEquip.presionMinB = '';
            newEquip.valvulasA = {items: []};
            newEquip.valvulasB = {items: []};
        }

        if (equipKey === 'Bloque Compresor') newEquip.presostato = '';
        
        AppState.equipmentData[equipKey].push(newEquip);
        const newIndex = AppState.equipmentData[equipKey].length - 1;
        AppState.expandedEquipment[`${equipKey}_${newIndex}`] = true;
        
        this.renderEquipmentList();
        this.showToast('✔️ Equipo añadido', 'success');
    },

    removeEquipment(equipKey, index) {
        if (confirm('¿Eliminar este equipo?')) {
            AppState.equipmentData[equipKey].splice(index, 1);
            delete AppState.expandedEquipment[`${equipKey}_${index}`];
            const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
            typeData?.isComposite ? this.renderCompositeUnitsList() : this.renderEquipmentList();
            this.showToast('🗑️ Equipo eliminado', 'success');
        }
    },

    toggleEquipment(equipKey, index) {
        const key = `${equipKey}_${index}`;
        AppState.expandedEquipment[key] = !AppState.expandedEquipment[key];
        const typeData = EQUIPMENT_TYPES[AppState.currentEquipmentType];
        typeData?.isComposite ? this.renderCompositeUnitsList() : this.renderEquipmentList();
    },

    exportJSON() {
        // Captura cualquier campo que aún tenga el foco y no haya disparado onchange
        if (AppState.currentSection && AppState.sectionsData[AppState.currentSection]) {
            const workspace = document.getElementById('workspace');
            if (workspace) {
                workspace.querySelectorAll('.form-input[data-field]').forEach(input => {
                    AppState.sectionsData[AppState.currentSection][input.dataset.field] = input.value;
                });
            }
        }
        // Strip non-serializable _termoImgCache (ImageData) before export; keep base64 fields
        const termografiaExport = (AppState.termografiaData || []).map(p => {
            const { ...copy } = p;
            return copy;
        });
        const data = {
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
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        let filename;
        if (AppState.isLegalMode) {
            const _inst = AppState.sectionsData['datos_datos_instalacion'] || {};
            const _rev = AppState.sectionsData['datos_datos_revision'] || {};
            const _cert = AppState.sectionsData['datos_datos_certificado'] || {};
            const _fRev = _rev['FECHA REVISIÓN'] || '';
            const _ano = (_fRev.match(/\d{4}/) || [new Date().getFullYear()])[0];
            const _sis = (_inst['SISTEMA'] || '').trim().replace(/\s+/g, '_') || 'SIN_SISTEMA';
            const _dMap = {'Favorable (Sin defectos)':'F','Favorable (Defectos leves)':'FDL','Desfavorable':'D','Negativa':'N','Condicionado':'C','Comunicación deficiencias':'CD'};
            const _dIni = _dMap[_cert['DICTAMEN']] || ((_cert['DICTAMEN']||'SIN_DICTAMEN').replace(/[\s()]+/g,'_'));
            const _nRev = (_cert['NÚMERO REVISIÓN'] || '').trim().replace(/\s+/g, '_') || 'SIN_REV';
            filename = `${_ano}_Legal_${_sis}_${_dIni}_${_nRev}.json`;
        } else {
            const informe = AppState.sectionsData['datos_datos_informe'] || {};
            const sistema = (informe['SISTEMA'] || '').trim().replace(/\s+/g, '_') || 'SIN_SISTEMA';
            const numRev = (informe['NÚMERO REVISIÓN'] || '').trim().replace(/\s+/g, '_') || 'SIN_REV';
            filename = `${new Date().getFullYear()}_Técnico_${sistema}_${numRev}.json`;
        }
        a.download = filename;
        a.click();
        this.showToast('💾 Datos exportados', 'success');
    },

    loadJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        
                        if (data.isLegalMode && !AppState.isLegalMode) {
                            if (!confirm('Este archivo fue creado en Modo Legal. Algunas secciones no estarán disponibles en Modo Técnico. ¿Desea continuar?')) {
                                return;
                            }
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
                        
                        Object.keys(AppState.equipmentData).forEach(equipKey => {
                            AppState.equipmentData[equipKey].forEach(equip => {
                                ['valvulas', 'valvulasA', 'valvulasB'].forEach(valvKey => {
                                    if (equip[valvKey]?.items) {
                                        equip[valvKey].items = equip[valvKey].items.map(valv => {
                                            if (valv.serieAntigua !== undefined) {
                                                return {
                                                    marca: valv.marca || '',
                                                    modelo: valv.modelo || '',
                                                    indicadorDescarga: valv.indicadorSifon === 'SI' ? 'Sifón' : valv.indicadorLuz === 'SI' ? 'Luz' : '',
                                                    serieExistente: valv.serieAntigua || '',
                                                    fechaExistente: valv.fecha || '',
                                                    presionExistente: valv.presionTarado || '',
                                                    serieNueva: valv.serieNueva || '',
                                                    fechaNueva: '',
                                                    presionNueva: ''
                                                };
                                            }
                                            return valv;
                                        });
                                    }
                                });
                                
                                if (equip.subEquipments) {
                                    Object.keys(equip.subEquipments).forEach(subType => {
                                        equip.subEquipments[subType].forEach(subEquip => {
                                            ['valvulas', 'valvulasA', 'valvulasB'].forEach(valvKey => {
                                                if (subEquip[valvKey]?.items) {
                                                    subEquip[valvKey].items = subEquip[valvKey].items.map(valv => {
                                                        if (valv.serieAntigua !== undefined) {
                                                            return {
                                                                marca: valv.marca || '',
                                                                modelo: valv.modelo || '',
                                                                indicadorDescarga: valv.indicadorSifon === 'SI' ? 'Sifón' : valv.indicadorLuz === 'SI' ? 'Luz' : '',
                                                                serieExistente: valv.serieAntigua || '',
                                                                fechaExistente: valv.fecha || '',
                                                                presionExistente: valv.presionTarado || '',
                                                                serieNueva: valv.serieNueva || '',
                                                                fechaNueva: '',
                                                                presionNueva: ''
                                                            };
                                                        }
                                                        return valv;
                                                    });
                                                }
                                            });
                                        });
                                    });
                                }
                            });
                        });
                        
                        AppState.detectorsData = data.detectorsData || [];

                        AppState.detectorsData.forEach(detector => {
                            if (!detector.imagenes) detector.imagenes = [];
                        });

                        AppState.instalacionCircuitos = data.instalacionCircuitos || AppState.instalacionCircuitos;
                        AppState.instalacionSalas = data.instalacionSalas || AppState.instalacionSalas;
                        AppState.instalacionCamaras = data.instalacionCamaras || AppState.instalacionCamaras;
                        AppState.serviciosData = data.serviciosData || [];
                        AppState.portadaData = data.portadaData || { titulo:'',subtitulo:'',cliente:'',direccion:'',cp:'',localidad:'',provincia:'',referencia:'',anio:'' };
                        AppState.indiceData = data.indiceData || { items: [] };
                        AppState.contraportadaData = data.contraportadaData || { texto: '' };
                        AppState.certPsvArchivos = data.certPsvArchivos || [];
                        AppState.actaInicialArchivos = data.actaInicialArchivos || [];
                        AppState.termografiaData = data.termografiaData || [];
                        AppState.planificacionData = data.planificacionData || { textoRevision: '', textoInspeccion: '' };

                        // Rebuild _termoImgCache from saved base64 images
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
                        this.showToast('📂 Datos cargados', 'success');
                        this._doAutosave();
                    } catch {
                        this.showToast('❌ Error al cargar', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    },

    async generateActaInicial() {
        this.showToast('Generando documento...', 'success');

        const logoBase64 = await fetch('Clauger.png').then(r=>r.blob()).then(b=>new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.readAsDataURL(b);})).catch(()=>null);

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
                : '<table style="table-layout:fixed;width:100%">' + defCols + '<tbody>' + items.map(buildDefRow).join('') + '</tbody></table>';
            const tblRecom = (items) => items.length === 0
                ? '<div class="empty-sub">Sin recomendaciones.</div>'
                : '<table style="table-layout:fixed;width:100%">' + recomCols + '<tbody>' + items.map(buildRecomRow).join('') + '</tbody></table>';

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
                `<tr><td colspan="4" style="background:#1c2b3a;color:#fff;font-size:8pt;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 8px;border:1px solid #1c2b3a">${title}</td></tr>`;

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
                        rows += `<tr><td colspan="6" style="background:#dce8f8;font-weight:700;font-size:7.5pt;letter-spacing:.8px;text-transform:uppercase;color:#1f3864;padding:4px 7px;border:0.5px solid #ccc;font-family:Calibri,Arial,sans-serif">${item.seccion}</td></tr>`;
                        lastSec = item.seccion;
                    }
                    const t = item.estado.replace(/✔️|❌|⚠️|➖/g,'').trim();
                    let rc = '';
                    if (t === 'NEGATIVO' && item.gravedad === 'Grave') rc = 'r-grave';
                    else if (t === 'NEGATIVO') rc = 'r-leve';
                    else if (t === 'RECOMENDACIÓN') rc = 'r-recom';
                    else if (t === 'NO PROCEDE') rc = 'r-np';
                    rows += `<tr class="${rc}"><td style="text-align:center;font-weight:700;font-size:8pt">${item.id}</td><td style="font-size:7.5pt;color:#555">${item.seccion}</td><td style="font-size:8pt">${item.descripcion}</td><td style="font-size:7pt;line-height:1.4">${NORMAS[item.id]||'<span style="color:#ccc">—</span>'}</td><td style="text-align:center">${fmtEstado(item.estado)}</td><td style="text-align:center;font-size:8pt">${item.gravedad||'<span style="color:#ccc">—</span>'}</td></tr>`;
                });
                return rows;
            };

            const grpA     = checklistItems.filter(i => i.id.startsWith('A'));
            const grpB1_23 = checklistItems.filter(i => i.id.startsWith('B') && parseInt(i.id.slice(1)) <= 22);
            const grpB24_C = checklistItems.filter(i => (i.id.startsWith('B') && parseInt(i.id.slice(1)) >= 23) || i.id.startsWith('C'));
            const grpD     = checklistItems.filter(i => i.id.startsWith('D'));
            const grpE     = checklistItems.filter(i => i.id.startsWith('E'));
            const grpFG    = checklistItems.filter(i => i.id.startsWith('F') || i.id.startsWith('G'));

            const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${(()=>{const _f=revision['FECHA REVISIÓN']||'';const _y=(_f.match(/\d{4}/)||[new Date().getFullYear()])[0];const _d=(certificado['DICTAMEN']||'ACTA').toUpperCase().replace(/[()]/g,'').replace(/\s+/g,' ').trim();const _s=(informe['SISTEMA']||'SIN_SISTEMA').trim();const _n=(certificado['NÚMERO REVISIÓN']||'SIN_REV').trim();return `${_y}_${_d}_${_s}_${_n}`;})()}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
body{font-family:'Calibri Light',Calibri,'Trebuchet MS',Arial,sans-serif;font-size:10pt;color:#1a1a1a;background:#e8e8e8;font-weight:300}
.page{max-width:21cm;margin:1.5rem auto;background:#fff;padding:2cm 2cm;box-shadow:0 2px 12px rgba(0,0,0,.18)}
.print-phdr{display:none}.print-pftr{display:none}.pgspacer{display:none}
/* header */
.doc-header{display:table;width:100%;border-bottom:3px solid #1f3864;padding-bottom:10px;margin-bottom:18px}
.doc-header-left{display:table-cell;vertical-align:middle}
.doc-header-right{display:table-cell;vertical-align:middle;text-align:right}
.logo{font-size:22pt;font-weight:700;letter-spacing:3px;color:#1f3864;line-height:1;font-family:Calibri,Arial,sans-serif}
.logo-sub{font-size:7.5pt;letter-spacing:2px;color:#555;text-transform:uppercase;margin-top:2px}
.doc-type{font-size:12pt;font-weight:700;color:#1f3864;text-transform:uppercase;letter-spacing:.5px;font-family:Calibri,Arial,sans-serif}
.doc-ids{font-size:8pt;color:#555;margin-top:3px}
/* section block */
.block{margin-bottom:14px}
.block-title{background:#1f3864;color:#fff;font-size:8pt;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:5px 8px;margin-bottom:0;font-family:Calibri,Arial,sans-serif}
/* two-col layout */
.two-col{display:table;width:100%;border-spacing:12px;margin:-12px;margin-bottom:2px}
.two-col-cell{display:table-cell;width:50%;vertical-align:top;padding:0 6px}
/* tables */
table{width:100%;border-collapse:collapse;font-size:8.5pt}
th{background:#c5d9f1;color:#1f3864;padding:5px 7px;text-align:left;font-size:8pt;font-weight:700;letter-spacing:.3px;border:0.5px solid #ccc;font-family:Calibri,Arial,sans-serif}
td{padding:4px 7px;border:0.5px solid #ccc;vertical-align:top}
tr:nth-child(even) td{background:#f7f7f7}
tr.r-grave td{background:#ffd0d0!important}
tr.r-leve td{background:#ffe4b8!important}
tr.r-recom td{background:#ebebeb!important}
tr.r-np td{color:inherit}
/* defect card */
.dcard{border:0.5px solid #ccc;margin-bottom:12px;page-break-inside:avoid}
.dcard-head{background:#1a4a8a;color:#fff;padding:6px 10px;display:table;width:100%}
.dcard-id{display:table-cell;font-size:11pt;font-weight:700;width:50px;vertical-align:middle;font-family:Calibri,Arial,sans-serif}
.dcard-desc{display:table-cell;font-size:8.5pt;vertical-align:middle}
.dcard-badge{display:table-cell;text-align:right;vertical-align:middle;white-space:nowrap}
.badge{display:inline-block;font-size:7.5pt;font-weight:700;padding:2px 8px;letter-spacing:.5px;font-family:Calibri,Arial,sans-serif}
.b-grave{background:#8b0000;color:#fff}
.b-leve{background:#b06000;color:#fff}
.b-recom{background:#1f3864;color:#fff}
.dcard-body{padding:8px 10px}
.dcard-meta{display:table;width:100%;font-size:8.5pt;margin-bottom:8px}
.dcard-meta-cell{display:table-cell;width:50%;padding:2px 0}
.dcard-meta-cell span{font-weight:600;color:#333}
.dcard-obs{font-size:8.5pt;background:#f5f5f5;border-left:2px solid #1f3864;padding:6px 8px;margin-bottom:8px}
.img-grid{display:table;width:100%;border-spacing:8px;margin:-8px}
.img-cell{display:table-cell;width:50%;padding:4px}
.img-cell img{width:100%;height:300px;object-fit:contain;background:#f0f0f0;display:block;border:0.5px solid #ddd}
.img-cap{font-size:7.5pt;color:#666;text-align:center;padding:4px;border:0.5px solid #ddd;border-top:none;background:#f5f7fa}
/* dictamen */
.dictamen{border:2px solid #1f3864;margin-bottom:16px;page-break-inside:avoid}
.dictamen-head{background:#1f3864;color:#fff;padding:6px 10px;font-weight:700;font-size:9.5pt;letter-spacing:.3px;font-family:Calibri,Arial,sans-serif}
.dictamen-body{padding:10px;font-size:9pt;line-height:1.65;text-align:justify}
/* signatures */
.sigs{display:table;width:100%;margin-top:36px;border-top:2px solid #1f3864;padding-top:10px}
.sig{display:table-cell;width:50%;text-align:center}
.sig-line{border-top:1.5px solid #222;margin:56px 24px 6px}
.sig-name{font-weight:700;font-size:9pt;font-family:Calibri,Arial,sans-serif}
.sig-sub{font-size:8pt;color:#666}
/* no-defects notice */
.notice{border:1px solid #ccc;padding:10px 14px;text-align:center;font-size:9pt;background:#f9f9f9;margin-bottom:14px}
/* print bar */
.print-bar{position:fixed;bottom:0;left:0;right:0;background:#1f3864;padding:10px;text-align:center;display:flex;justify-content:center;gap:12px;z-index:999;box-shadow:0 -2px 8px rgba(0,0,0,.3)}
.btn-p{padding:7px 28px;background:#fff;color:#1f3864;border:none;font-size:9.5pt;font-weight:700;cursor:pointer;letter-spacing:.5px;font-family:Calibri,Arial,sans-serif}
.btn-c{padding:7px 20px;background:transparent;color:#fff;border:1px solid #fff;font-size:9.5pt;cursor:pointer}
/* sub-sections deficiencias */
.sub-block{margin:8px 0 0 0;border:0.5px solid #b0c4de}
.sub-title{background:#b0c8e8;color:#1f3864;font-size:7.5pt;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 10px;font-family:Calibri,Arial,sans-serif}
.sub-sub-block{margin:0;border-top:0.5px solid #c8d8eb}
.sub-sub-title{background:#dce8f8;color:#1f3864;font-size:7.5pt;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:4px 10px;border-bottom:0.5px solid #ccc;font-family:Calibri,Arial,sans-serif}
.empty-sub{font-size:8pt;color:#888;padding:6px 10px;background:#fafafa;font-style:italic}
@media print{
  body{background:#fff}
  .page{max-width:none;margin:0;padding:2cm;box-shadow:none}
  .print-bar{display:none}
  .print-phdr,.print-pftr{display:none}
  .page-break{page-break-before:always;padding-top:2cm}
  .sub-block{page-break-inside:avoid}
  .dictamen{page-break-inside:avoid}
  .dcard{page-break-inside:avoid}
  tr{page-break-inside:avoid;break-inside:avoid}
  thead{display:table-header-group}
  img{image-rendering:-webkit-optimize-contrast;image-rendering:high-quality}
  .img-cell img{height:300px}
  .logo-print{display:block!important;position:fixed;top:0.7cm;left:1.5cm;z-index:9999;pointer-events:none}
  @page{size:A4;margin:0}
}
</style>
</head>
<body>
${logoBase64?`<div class="logo-print" style="display:none"><img src="${logoBase64}" style="height:30px;object-fit:contain" alt="CLAUGER"></div>`:''}
<div class="page">

<!-- CABECERA -->
<div class="doc-header">
  <div class="doc-header-left">
    <div class="logo">CLAUGER</div>
    <div class="logo-sub">Ingeniería de Frío Industrial</div>
  </div>
  <div class="doc-header-right">
    <div class="doc-type">${certificado['TIPO DE ACTA'] || 'ACTA INICIAL'}</div>
    <div class="doc-ids">
      N.º Informe: <strong>${certificado['ID INFORME'] || '—'}</strong> &nbsp;·&nbsp;
      Rev.: <strong>${certificado['REVISIÓN'] || '—'}</strong> &nbsp;·&nbsp;
      Fecha: <strong>${revision['FECHA REVISIÓN'] || '—'}</strong>
    </div>
  </div>
</div>

<!-- DELEGACIÓN + CLIENTE (dos columnas) -->
<div style="display:table;width:100%;border-spacing:0;margin-bottom:14px">
  <div style="display:table-cell;width:50%;padding-right:7px;vertical-align:top">
    <div class="block-title">Datos de Delegación</div>
    <table><tbody>
      ${infoRow('Delegación', delegacion['DELEGACIÓN'])}
      ${infoRow('Dirección',  delegacion['DIRECCIÓN'])}
      ${infoRow('Población',  delegacion['POBLACIÓN'])}
      ${infoRow('Provincia / C.P.', [delegacion['PROVINCIA'], delegacion['C.P.']].filter(Boolean).join(' &nbsp;·&nbsp; '), true)}
    </tbody></table>
  </div>
  <div style="display:table-cell;width:50%;padding-left:7px;vertical-align:top">
    <div class="block-title">Datos del Cliente</div>
    <table><tbody>
      ${infoRow('Cliente',    cliente['CLIENTE'])}
      ${infoRow('CIF',        cliente['CIF'])}
      ${infoRow('Dirección',  cliente['DIRECCIÓN'])}
      ${infoRow('Localidad / C.P.', [cliente['LOCALIDAD'], cliente['CP']].filter(Boolean).join(' &nbsp;·&nbsp; '))}
      ${infoRow('Provincia',  cliente['PROVINCIA'], true)}
    </tbody></table>
  </div>
</div>

<!-- INSTALACIÓN -->
<div class="block">
  <div class="block-title">Datos de la Instalación</div>
  <table><tbody>
    <tr>
      ${infoRow('Ref. EFA',     instalacion['REF. EFA']).replace(/<tr>/,'')}
      ${infoRow('Ref. Titular', instalacion['REF. TITULAR']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
    </tr>
    <tr>
      ${infoRow('Descripción',  instalacion['DESCRIPCIÓN']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
      ${infoRow('Finalidad',    instalacion['FINALIDAD']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
    </tr>
    <tr>
      ${infoRow('Reglamento',   instalacion['REGLAMENTO']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
      ${infoRow('Fecha PS',     instalacion['FECHA PS']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
    </tr>
    <tr>
      ${infoRow('Clas. Emplaz.', instalacion['CLAS. EMPLAZ.']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
      ${infoRow('Clas. Local',   instalacion['CLAS. LOCAL']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
    </tr>
    <tr>
      ${infoRow('Nivel',         instalacion['NIVEL']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
      ${infoRow('Pot. Abs. (kW)',instalacion['POT. ABS (kW)']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
    </tr>
    <tr>
      ${infoRow('Sistema Refrig.', instalacion['SISTEMA REFRIG.']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
      ${infoRow('Tipo',            instalacion['TIPO']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
    </tr>
  </tbody></table>
</div>

<!-- CIRCUITOS -->
<div class="block">
  <div class="block-title">Circuitos de Refrigeración</div>
  <table>
    <thead><tr>
      <th style="width:40px;text-align:center">Circ.</th>
      <th>Refrigerante</th><th>Carga (kg)</th><th>PCA</th><th>Tn eq. CO₂</th><th>Detector</th>
    </tr></thead>
    <tbody>
    ${AppState.instalacionCircuitos.map((c, i) => {
        if (!c.refrigerante && !c.carga) return '';
        const pca = REFRIGERANTES_PCA[c.refrigerante] || '';
        const kg  = parseFloat(c.carga) || 0;
        const tn  = pca && kg > 0 ? ((kg * pca) / 1000).toFixed(3) : '—';
        return `<tr><td style="text-align:center;font-weight:700">${i+1}</td><td>${c.refrigerante||'—'}</td><td>${c.carga||'—'}</td><td>${pca||'—'}</td><td>${tn}</td><td>${c.detector||'—'}</td></tr>`;
    }).join('')}
    </tbody>
  </table>
</div>

${AppState.instalacionSalas.length > 0 ? `
<div class="block">
  <div class="block-title">Salas de Máquinas</div>
  <table>
    <thead><tr><th>Nombre</th><th>Descripción</th></tr></thead>
    <tbody>${AppState.instalacionSalas.map(s => `<tr><td style="font-weight:600">${s.nombre}</td><td>${s.valor}</td></tr>`).join('')}</tbody>
  </table>
</div>` : ''}

<!-- REVISIÓN -->
<div class="block">
  <div class="block-title">Datos de Revisión</div>
  <table><tbody>
    <tr>
      ${infoRow('Fecha Revisión',       revision['FECHA REVISIÓN']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
      ${infoRow('Periodicidad Rev.',    revision['PERIODICIDAD REVISIÓN']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
    </tr>
    <tr>
      ${infoRow('Próxima Revisión',     revision['PRÓXIMA REVISIÓN']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
      ${infoRow('Última Inspección',    revision['ÚLTIMA INSPECCIÓN']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
    </tr>
    <tr>
      ${infoRow('Periodicidad Insp.',   revision['PERIODICIDAD INSPECCIÓN']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
      ${infoRow('Próxima Inspección',   revision['PRÓXIMA INSPECCIÓN']).replace(/<tr>/,'').replace(/<\/tr>/,'')}
    </tr>
  </tbody></table>
</div>

<!-- DICTAMEN -->
<div class="dictamen">
  <div class="dictamen-head">DICTAMEN: ${certificado['DICTAMEN'] || 'No especificado'}</div>
  <div class="dictamen-body">
    ${certificado['FECHA LÍMITE CORRECCIÓN'] ? `<div style="margin-bottom:8px"><strong>Fecha límite de corrección:</strong> ${certificado['FECHA LÍMITE CORRECCIÓN']}</div>` : ''}
    ${certificado['COMENTARIOS'] || 'No se ha especificado comentario para este dictamen.'}
  </div>
</div>

<!-- FIRMAS -->
<div class="sigs">
  <div class="sig">
    <div class="sig-line"></div>
    <div class="sig-name">Técnico Inspector</div>
    <div class="sig-sub">CLAUGER</div>
  </div>
  <div class="sig">
    <div class="sig-line"></div>
    <div class="sig-name">Titular de la Instalación</div>
    <div class="sig-sub">${cliente['CLIENTE'] || ''}</div>
  </div>
</div>

<!-- CHECKLIST A (A01–A17) -->
<div class="block page-break">
  <div class="block-title">Checklist de Inspección</div>
  <table style="table-layout:fixed;width:100%">
    ${CHKHEAD}
    <tbody>${buildChkRows(grpA)}</tbody>
  </table>
</div>

<!-- CHECKLIST B01–B23 -->
<div class="block page-break">
  <table style="table-layout:fixed;width:100%">
    ${CHKHEAD}
    <tbody>${buildChkRows(grpB1_23)}</tbody>
  </table>
</div>

<!-- CHECKLIST B24–C12 -->
<div class="block page-break">
  <table style="table-layout:fixed;width:100%">
    ${CHKHEAD}
    <tbody>${buildChkRows(grpB24_C)}</tbody>
  </table>
</div>

<!-- CHECKLIST D -->
<div class="block page-break">
  <table style="table-layout:fixed;width:100%">
    ${CHKHEAD}
    <tbody>${buildChkRows(grpD)}</tbody>
  </table>
</div>

<!-- CHECKLIST E -->
<div class="block page-break">
  <table style="table-layout:fixed;width:100%">
    ${CHKHEAD}
    <tbody>${buildChkRows(grpE)}</tbody>
  </table>
</div>

<!-- CHECKLIST F+G -->
<div class="block page-break">
  <table style="table-layout:fixed;width:100%">
    ${CHKHEAD}
    <tbody>${buildChkRows(grpFG)}</tbody>
  </table>
</div>

<!-- DEFICIENCIAS DETECTADAS -->
<div class="block page-break">
  <div class="block-title">Deficiencias Detectadas</div>
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
    <div class="dcard-desc">${item.descripcion}<br><span style="font-size:7.5pt;opacity:.75">${item.seccion}</span></div>
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
    const title = i === 0 ? '<div class="block-title">Defectos Detectados — Fotografías</div>' : '';
    html += `<div class="block page-break">${title}${chunk.map(buildDcard).join('')}</div>`;
  }
  return html;
})()}


</div><!-- /page -->

<div class="print-bar">
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
                    { label: 'ACTA', num: '1' },
                    { label: 'CERTIFICADO EQUIPOS A PRESIÓN', num: '2' },
                    { label: 'CERTIFICADO VÁLVULAS DE SEGURIDAD', num: '3' },
                    { label: 'CERTIFICADO DETECTOR', num: '4' },
                    { label: 'TERMOGRAFÍA', num: '5' },
                    { label: 'PLANIFICACIÓN', num: '6' }
                ];
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
            const contraTexto = AppState.contraportadaData.texto || 'CLAUGER IBÉRICA S.L.U.\nEmpresa Frigorista Autorizada\n\nPara cualquier consulta o información adicional relacionada con este informe, no dude en ponerse en contacto con nuestro departamento técnico.\n\nwww.clauger.com';

            // ── Section divider page ──
            const divider = (num, title) => `
<div class="page page-divider page-break">
  <div style="position:absolute;font-size:120pt;font-weight:900;color:rgba(255,255,255,0.05);line-height:1;letter-spacing:-6px;user-select:none;top:50%;left:50%;transform:translate(-50%,-50%)">${String(num).padStart(2,'0')}</div>
  <div style="position:relative;z-index:1;text-align:center;padding:3cm">
    <div style="font-size:8pt;letter-spacing:4px;color:#93c5fd;text-transform:uppercase;margin-bottom:1.2cm;font-weight:600">Sección ${num}</div>
    <div style="font-size:26pt;font-weight:900;color:white;letter-spacing:5px;text-transform:uppercase;line-height:1.25;margin-bottom:0.8cm">${title}</div>
    <div style="width:56px;height:3px;background:#3b82f6;margin:0 auto;border-radius:2px"></div>
  </div>
</div>`;

            // ── Shared helpers ──
            const hdr = (tipo) => `
  <div class="doc-header">
    <div class="doc-header-left">${logoBase64?`<img src="${logoBase64}" style="height:38px;object-fit:contain;display:block;margin-bottom:2px" alt="CLAUGER">`:`<div class="logo">CLAUGER</div>`}<div class="logo-sub">Ibérica S.L.U.</div></div>
    <div class="doc-header-right"><div class="doc-type">${tipo}</div></div>
  </div>`;

            const infoRow = (l, v) => `<tr><td style="width:140px;background:#f2f2f2;font-weight:600;font-size:8pt;padding:3px 7px;border:0.5px solid #ccc;white-space:nowrap">${l}</td><td style="font-size:8.5pt;padding:3px 7px;border:0.5px solid #ccc">${v||'<span style="color:#bbb">—</span>'}</td></tr>`;

            const fileList = (arr, emptyMsg) => arr.length === 0
                ? `<p style="color:#777;font-style:italic;text-align:center;padding:16px 0">${emptyMsg}</p>`
                : `<table style="width:100%;border-collapse:collapse;font-size:9pt">
                    <thead><tr>
                      <th style="background:#1c2b3a;color:#fff;padding:5px 9px;border:1px solid #1c2b3a">Archivo</th>
                      <th style="background:#1c2b3a;color:#fff;padding:5px 9px;border:1px solid #1c2b3a;width:80px;text-align:center">Tamaño</th>
                      <th style="background:#1c2b3a;color:#fff;padding:5px 9px;border:1px solid #1c2b3a;width:110px;text-align:center">Fecha</th>
                    </tr></thead>
                    <tbody>${arr.map((f, i) => `<tr style="${i%2?'background:#f7f7f7':''}"><td style="padding:5px 9px;border:0.5px solid #ddd">📄 ${f.name}</td><td style="padding:5px 9px;border:0.5px solid #ddd;text-align:center">${(f.size/1024).toFixed(0)} KB</td><td style="padding:5px 9px;border:0.5px solid #ddd;text-align:center">${new Date(f.timestamp).toLocaleDateString('es-ES')}</td></tr>`).join('')}
                    </tbody></table>`;

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
            // ── Logo Clauger (base64 para usar en páginas del informe) ──
            const logoBase64 = await fetch('Clauger.png').then(r=>r.blob()).then(b=>new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.readAsDataURL(b);})).catch(()=>null);

            const actaInicialImgs = await _renderPdfPages(AppState.actaInicialArchivos);
            const certPsvImgs     = await _renderPdfPages(AppState.certPsvArchivos);
            const detectorCertImgs = [];
            for (const det of AppState.detectorsData) {
                detectorCertImgs.push(await _renderPdfPages(det.certArchivos || []));
            }

            // ── Equipment HTML ──
            const equipHtml = (() => {
                const eRow = (l, v) => `<tr><td style="width:135px;background:#f2f2f2;font-weight:600;font-size:8pt;padding:3px 6px;border:0.5px solid #ccc">${l}</td><td style="font-size:8.5pt;padding:3px 6px;border:0.5px solid #ccc">${v||'—'}</td></tr>`;
                const valvTbl = (vv, lado) => {
                    if (!vv || !vv.items || !vv.items.length) return '';
                    const lab = lado === 'A' ? ' — Lado A' : lado === 'B' ? ' — Lado B' : '';
                    return `<div style="margin-top:7px"><div style="font-size:7.5pt;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:3px">Válvulas de Seguridad${lab}</div>
                        <table style="width:100%;border-collapse:collapse;font-size:7.5pt">
                          <thead><tr>${['#','Marca','Modelo','Indicador','Serie exist.','Pres. exist.','Serie nueva','Pres. nueva'].map(h=>`<th style="background:#e8ecf0;padding:3px 5px;border:0.5px solid #ccc">${h}</th>`).join('')}</tr></thead>
                          <tbody>${vv.items.map((v,vi)=>`<tr style="${vi%2?'background:#f7f7f7':''}">
                            <td style="padding:3px 5px;border:0.5px solid #ddd;text-align:center;font-weight:700">${vi+1}</td>
                            <td style="padding:3px 5px;border:0.5px solid #ddd">${v.marca||'—'}</td>
                            <td style="padding:3px 5px;border:0.5px solid #ddd">${v.modelo||'—'}</td>
                            <td style="padding:3px 5px;border:0.5px solid #ddd">${v.indicadorDescarga||'—'}</td>
                            <td style="padding:3px 5px;border:0.5px solid #ddd">${v.serieExistente||'—'}</td>
                            <td style="padding:3px 5px;border:0.5px solid #ddd">${v.presionExistente||'—'}</td>
                            <td style="padding:3px 5px;border:0.5px solid #ddd">${v.serieNueva||'—'}</td>
                            <td style="padding:3px 5px;border:0.5px solid #ddd">${v.presionNueva||'—'}</td>
                          </tr>`).join('')}</tbody>
                        </table></div>`;
                };
                const renderEquip = (eq, idx, label, tpl) => {
                    const valvHtml = tpl === 'plantilla2'
                        ? (valvTbl(eq.valvulasA,'A') + valvTbl(eq.valvulasB,'B'))
                        : valvTbl(eq.valvulas,'single');
                    const photos = eq.photos || {};
                    const hasPhoto = photos.placa || photos.general;
                    const fields = tpl === 'plantilla2' ? [
                        ['Fabricante', eq.fabricante],
                        ['Modelo', eq.modelo],
                        ['Nº Serie', eq.numSerie],
                        ...(AppState.isLegalMode && eq.categoria ? [['Categoría', eq.categoria]] : []),
                        ['Nº Placa Industria', eq.numPlaca],
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
                        ['Nº Placa Industria', eq.numPlaca],
                        ['Fecha Fabricación', eq.fechaFabricacion],
                        ['Normativa', eq.normativa],
                        ['Fluido', eq.fluido],
                        ['Volumen Interno (L)', eq.volInterno],
                        ['Presión Max (bar)', eq.presionMax],
                        ['Presión Min (bar)', eq.presionMin],
                        ['Ubicación', eq.ubicacion],
                        ...(eq.presostato !== undefined ? [['Presostato AP', eq.presostato]] : [])
                    ];
                    return `
                    <div class="block">
                      <div class="block-title">${label} — Nº ${idx+1}</div>
                      <table style="width:100%;border-collapse:collapse">
                        ${fields.map(([l,v],i) => `<tr>
                          <td style="width:220px;background:${i%2===0?'#eef2f7':'#f7f9fc'};font-weight:700;padding:8px 10px;border:0.5px solid #c8d0da;color:#1c2b3a;font-size:8.5pt">${l}</td>
                          <td style="padding:8px 10px;border:0.5px solid #c8d0da;font-size:9pt">${v||'<span style="color:#bbb">—</span>'}</td>
                        </tr>`).join('')}
                      </table>
                      ${eq.observaciones?`<div style="margin-top:8px;font-size:8.5pt;background:#f9f9f9;border-left:3px solid #1c2b3a;padding:6px 10px"><strong>Observaciones:</strong> ${eq.observaciones}</div>`:''}
                    </div>
                    ${valvHtml}
                    ${(()=>{const pts=['placa','general'].filter(t=>photos[t]&&photos[t+'Incluir']!==false);return pts.length?`<div style="margin-top:10px;display:grid;grid-template-columns:${pts.length===1?'1fr':'1fr 1fr'};gap:8px">${pts.map(t=>`<div><div style="font-size:7.5pt;font-weight:700;color:#555;text-transform:uppercase;margin-bottom:3px">${t==='placa'?'Placa':'General'}</div><div style="height:160px;border:0.5px solid #ddd;border-radius:3px;overflow:hidden;background:#f8f9fa"><img src="${photos[t]}" style="width:100%;height:100%;object-fit:contain;display:block"></div></div>`).join('')}</div>`:''})()}
                    ${(()=>{const imgs=(eq.imagenes||[]).filter(i=>i.incluirEnPdf!==false);return imgs.length?`<div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px">${imgs.map(img=>`<div style="height:160px;border:0.5px solid #ddd;border-radius:3px;overflow:hidden;background:#f8f9fa"><img src="${img.data}" style="width:100%;height:100%;object-fit:contain;display:block"></div>`).join('')}</div>`:''})()}
                    `;
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
                            // UC header + Bloque Compresor(es) → misma página
                            const compresores = (unit.subEquipments||{})['Bloque Compresor'] || [];
                            let ucPage = `${hdr('Equipos a Presión')}
                                <div class="block">
                                  <div class="block-title">Unidad Compresora — Nº ${ui+1}</div>
                                  <table style="width:100%;border-collapse:collapse">
                                    ${ucFields.map(([l,v],i) => `<tr>
                                      <td style="width:220px;background:${i%2===0?'#eef2f7':'#f7f9fc'};font-weight:700;padding:8px 10px;border:0.5px solid #c8d0da;color:#1c2b3a;font-size:8.5pt">${l}</td>
                                      <td style="padding:8px 10px;border:0.5px solid #c8d0da;font-size:9pt">${v||'<span style="color:#bbb">—</span>'}</td>
                                    </tr>`).join('')}
                                  </table>
                                </div>`;
                            compresores.forEach((comp, ci) => { ucPage += renderEquip(comp, ci, 'Bloque Compresor', 'plantilla1'); });
                            pages.push(ucPage);
                            // Resto de sub-equipos → cada uno su propia página
                            Object.keys(unit.subEquipments||{}).forEach(subType => {
                                if (subType === 'Bloque Compresor') return;
                                const subs = unit.subEquipments[subType];
                                if (!subs || !subs.length) return;
                                const tpl = subType.includes('Enfriador Aceite') ? 'plantilla2' : 'plantilla1';
                                subs.forEach((sub, si) => {
                                    pages.push(`${hdr('Equipos a Presión')}${renderEquip(sub, si, subType, tpl)}`);
                                });
                            });
                        });
                    } else {
                        typeData.subTypes.forEach(subType => {
                            const items = AppState.equipmentData[subType] || [];
                            if (!items.length) return;
                            items.forEach((eq, ei) => {
                                pages.push(`${hdr('Equipos a Presión')}${renderEquip(eq, ei, subType, typeData.template)}`);
                            });
                        });
                    }
                });
                if (!pages.length) return `<div class="page page-break">${hdr('Equipos a Presión')}<p style="color:#777;font-style:italic;text-align:center;padding:16px 0">No hay equipos registrados.</p></div>`;
                return pages.map(content => `<div class="page page-break">${content}</div>`).join('');
            })();

            // ── Detectors HTML ──
            const detectoresHtml = (() => {
                if (!AppState.detectorsData.length) return `<div class="page page-break">${hdr('Verificación Detectores de Fugas')}<p style="color:#777;font-style:italic;text-align:center;padding:16px 0">No hay detectores registrados.</p></div>`;
                const opRow = (l, v) => {
                    const c = v==='SI'?'#1a5c2a':v==='NO'?'#8b0000':'#888';
                    return `<tr><td style="padding:5px 10px;border:0.5px solid #c8d0da;font-size:8.5pt;background:#f2f2f2;font-weight:600;width:200px">${l}</td><td style="padding:5px 10px;border:0.5px solid #c8d0da;font-weight:700;color:${c};width:70px;text-align:center">${v||'—'}</td></tr>`;
                };
                return AppState.detectorsData.map((det, di) => {
                    const certPages = (detectorCertImgs[di] || []).map(img => `<div class="page page-break" style="padding:0;height:29.7cm;overflow:hidden"><img src="${img}" style="width:100%;height:100%;object-fit:contain;display:block"></div>`).join('');
                    // PDF-type: only render the attached PDF pages
                    if (det.tipo === 'pdf') {
                        return certPages || `<div class="page page-break">${hdr('Verificación Detectores de Fugas')}<p style="color:#777;font-style:italic;text-align:center;padding:16px 0">Detector ${di+1} — sin certificados PDF adjuntos.</p></div>`;
                    }
                    // Formulario type (or legacy detectors with no tipo)
                    const datosRows = [['Marca',det.marca],['Modelo',det.modelo],['Nº Serie',det.numSerie],['Refrigerante',det.refrigerante],['Pre-Alarma',det.preAlarma?det.preAlarma+' ppm':''],['Alarma',det.alarma?det.alarma+' ppm':''],['Tensión alim.',det.tensionAlimentacion],['Fecha verif.',det.fechaVerificacion],['Próxima verif.',det.fechaProximaVerificacion],['Técnico',det.respVerificacion]];
                    const _detImgs=(det.imagenes||[]).filter(img=>img.incluirEnPdf!==false);
                    const photosHtml = _detImgs.length?`<div class="block"><div class="block-title">Imágenes</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">${_detImgs.map(img=>`<div style="height:160px;border:0.5px solid #ddd;border-radius:3px;overflow:hidden;background:#f8f9fa"><img src="${img.data}" style="width:100%;height:100%;object-fit:contain;display:block"></div>`).join('')}</div></div>`:'';
                    return `<div class="page page-break">
                      ${hdr('Verificación Detectores de Fugas')}
                      <div class="block">
                        <div class="block-title">Detector / Centralita — Nº ${di+1}</div>
                        <div style="display:table;width:100%;table-layout:fixed">
                          <div style="display:table-cell;width:55%;vertical-align:top;padding-right:12px">
                            <div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#555;margin-bottom:6px">Datos del Detector</div>
                            <table style="width:100%;border-collapse:collapse">
                              ${datosRows.map(([l,v],i)=>`<tr><td style="background:${i%2===0?'#eef2f7':'#f7f9fc'};font-weight:700;padding:6px 10px;border:0.5px solid #c8d0da;color:#1c2b3a;font-size:8.5pt;width:145px">${l}</td><td style="padding:6px 10px;border:0.5px solid #c8d0da;font-size:9pt">${v||'<span style="color:#bbb">—</span>'}</td></tr>`).join('')}
                            </table>
                          </div>
                          <div style="display:table-cell;width:45%;vertical-align:top">
                            <div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#555;margin-bottom:6px">Operaciones Realizadas</div>
                            <table style="width:100%;border-collapse:collapse">
                              ${opRow('Correcta ubicación',det.operaciones?.correctaUbicacion)}
                              ${opRow('Tiempo respuesta ≤ 60 s',det.operaciones?.tiempoRespuesta)}
                              ${opRow('Estado general',det.operaciones?.estadoGeneral)}
                              ${opRow('Verif. tensión alimentación',det.operaciones?.verificacionTension)}
                              ${opRow('Test leds y display',det.operaciones?.testLedsDisplay)}
                              ${opRow('Prueba activación maniobras',det.operaciones?.pruebaActivacion)}
                              ${opRow('Señal óptica y acústica',det.operaciones?.senalOpticoAcustica)}
                              ${opRow('Reglaje a punto 0',det.operaciones?.reglajePunto0)}
                              ${opRow('Reglaje Pre-Alarma',det.operaciones?.reglajePreAlarma)}
                              ${opRow('Reglaje Alarma',det.operaciones?.reglajeAlarma)}
                              ${opRow('Activación extractor',det.operaciones?.activacionExtractor)}
                            </table>
                          </div>
                        </div>
                        ${det.observaciones?`<div style="font-size:8.5pt;background:#f9f9f9;border-left:3px solid #1c2b3a;padding:6px 10px;margin-top:10px"><strong>Observaciones:</strong> ${det.observaciones}</div>`:''}
                      </div>
                      ${photosHtml}
                    </div>`;
                }).join('');
            })();

            // ── Termografía HTML ──
            const termografiaHtml = await (async () => {
                if (!AppState.termografiaData.length) return `<div class="page page-break">${hdr('Termografía')}<p style="color:#777;font-style:italic;text-align:center;padding:16px 0">No hay puntos de termografía registrados.</p></div>`;
                const pages = await Promise.all(AppState.termografiaData.map(async (p, pi) => {
                    // ── Tipo informe: páginas con los PDFs adjuntos ──
                    if (p.tipo === 'informe') {
                        const informeImgs = await _renderPdfPages(p.informeArchivos || []);
                        const label = p.equipo || ('Punto ' + (pi + 1));
                        if (!informeImgs.length) {
                            return `<div class="page page-break">${hdr('Termografía')}
                              <div class="block"><div class="block-title">${label}${p.fecha?' — '+p.fecha:''}</div>
                              <p style="color:#777;font-style:italic;padding:12px 0">Sin informes PDF adjuntos.</p>
                              ${p.observaciones?`<div style="font-size:8.5pt;background:#f9f9f9;border-left:3px solid #1c2b3a;padding:6px 10px"><strong>Observaciones:</strong> ${p.observaciones}</div>`:''}
                              </div></div>`;
                        }
                        return informeImgs.map((img, ii) => `<div class="page page-break">
                          ${ii===0?hdr('Termografía'):''}
                          ${ii===0?`<div class="block-title" style="background:#1c2b3a;color:#fff;font-size:8pt;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:5px 8px;margin-bottom:8px">${label}${p.fecha?' — '+p.fecha:''}</div>`:''}
                          <div style="width:100%;text-align:center"><img src="${img}" style="max-width:100%;height:auto;display:block;margin:0 auto"></div>
                          ${ii===0&&p.observaciones?`<div style="font-size:8.5pt;background:#f9f9f9;border-left:3px solid #1c2b3a;padding:6px 10px;margin-top:8px"><strong>Observaciones:</strong> ${p.observaciones}</div>`:''}
                        </div>`).join('');
                    }
                    const res = p.resultados;
                    if (res && res.Tr !== null) p._pcImg = this._termoPCToDataUrl(res, true);
                    const sc = res ? ({ok:'#10b981',warn:'#f59e0b',crit:'#ef4444'}[res.sc]||'#374151') : '#374151';
                    const tc = (res && res.Tr !== null) ? (res.Ts <= res.Tr ? '#E8002D' : res.Ts <= res.Tr+2 ? '#f59e0b' : '#10b981') : '#10b981';
                    const imgSrc = p.imgIncluirEnPdf !== false ? (p._processedImg || p.imagen) : null;
                    const medicionRows = [['T interior (Tin)',p.tin!==''&&p.tin!==undefined?p.tin+' °C':''],['T ambiente (Tamb)',p.tamb!==''&&p.tamb!==undefined?p.tamb+' °C':''],['T superficie (Ts)',p.ts!==''&&p.ts!==undefined?p.ts+' °C':''],['Humedad rel. (HR)',p.hr!==''&&p.hr!==undefined?p.hr+' %':'']];
                    const resultadoRows = res?[
                        ['Índice aislamiento (I)',`<span style="font-weight:700;color:${sc}">${res.I.toFixed(3)}</span>`],
                        ['Eficiencia aislamiento',`<span style="font-weight:700;color:${sc}">${res.eff} %</span>`],
                        ['ΔT (Tamb - Ts)',res.dT.toFixed(1)+' °C'],
                        ...(res.Tr!==null?[['Punto de Rocío (Tr)',res.Tr.toFixed(1)+' °C']]:[] ),
                        ...(res.mg!==null?[['Margen anti-rocío (Ts-Tr)',res.mg.toFixed(1)+' °C']]:[] ),
                        ...(res.cr!==null?[['Riesgo condensación',`<span style="font-weight:700;color:${({ok:'#10b981',warn:'#f59e0b',crit:'#ef4444'}[res.cc]||'#374151')}">${res.cr}</span>`]]:[] ),
                        ['Diagnóstico',`<span style="font-weight:700;color:${sc}">${res.st}</span>`]
                    ]:[];
                    return `<div class="page page-break">
                      ${hdr('Termografía')}
                      <div class="block">
                        <div class="block-title">${p.equipo||('Punto '+(pi+1))}${p.fecha?' — '+p.fecha:''}</div>
                        <!-- Fila 1: tablas de datos y resultados lado a lado -->
                        <div style="display:table;width:100%;table-layout:fixed;margin-bottom:14px">
                          <div style="display:table-cell;width:50%;vertical-align:top;padding-right:10px">
                            <div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#555;margin-bottom:6px">Datos de Medición</div>
                            <table style="width:100%;border-collapse:collapse">
                              ${medicionRows.map(([l,v],i)=>`<tr><td style="background:${i%2===0?'#eef2f7':'#f7f9fc'};font-weight:700;padding:6px 10px;border:0.5px solid #c8d0da;color:#1c2b3a;font-size:8.5pt">${l}</td><td style="padding:6px 10px;border:0.5px solid #c8d0da;font-size:9pt">${v||'<span style="color:#bbb">—</span>'}</td></tr>`).join('')}
                            </table>
                          </div>
                          <div style="display:table-cell;width:50%;vertical-align:top;padding-left:10px">
                            ${res?`<div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#555;margin-bottom:6px">Resultados del Análisis</div>
                            <table style="width:100%;border-collapse:collapse">
                              ${resultadoRows.map(([l,v],i)=>`<tr><td style="background:${i%2===0?'#eef2f7':'#f7f9fc'};font-weight:700;padding:6px 10px;border:0.5px solid #c8d0da;color:#1c2b3a;font-size:8.5pt">${l}</td><td style="padding:6px 10px;border:0.5px solid #c8d0da;font-size:9pt">${v}</td></tr>`).join('')}
                            </table>`:''}
                          </div>
                        </div>
                        ${p.observaciones?`<div style="font-size:8.5pt;background:#f9f9f9;border-left:3px solid #1c2b3a;padding:6px 10px;margin-bottom:14px"><strong>Observaciones:</strong> ${p.observaciones}</div>`:''}
                        <!-- Fila 2: imagen termográfica centrada -->
                        ${imgSrc?`<div style="text-align:center;margin-bottom:14px">
                          <div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#555;margin-bottom:6px">Imagen Termográfica</div>
                          <div style="display:inline-block;max-width:60%;border:0.5px solid #ddd;border-radius:3px;overflow:hidden;background:#0a0a0a"><img src="${imgSrc}" style="max-width:100%;max-height:220px;object-fit:contain;display:block"></div>
                        </div>`:''}
                        <!-- Fila 3: diagrama psicrométrico ancho completo + leyenda debajo izquierda -->
                        ${(p._pcImg && res)?`<div style="margin-top:4px">
                          <div style="font-size:8pt;font-weight:700;text-transform:uppercase;color:#555;margin-bottom:6px">Diagrama Psicrométrico</div>
                          <div style="border:0.5px solid #ddd;border-radius:3px;overflow:hidden;background:#f8fafc"><img src="${p._pcImg}" style="width:100%;height:auto;display:block"></div>
                          <div style="margin-top:8px;width:45%">
                            <div style="border:0.5px solid #c8d0da;border-radius:4px;overflow:hidden;font-size:8.5pt">
                              <div style="background:#1c2b3a;color:#fff;padding:5px 10px;font-size:7.5pt;font-weight:700;letter-spacing:0.8px">LEYENDA</div>
                              <div style="padding:8px 10px;display:flex;flex-direction:column;gap:6px">
                                <div style="display:flex;align-items:flex-start;gap:8px">
                                  <span style="width:11px;height:11px;border-radius:50%;background:#00B2FF;display:inline-block;flex-shrink:0;margin-top:1px"></span>
                                  <div><strong>Tamb</strong> — ${res.Tamb.toFixed(1)} °C${res.HR!==null?' · '+res.HR+' % HR':''}<br><span style="color:#888;font-size:7.5pt">Temperatura y humedad del aire</span></div>
                                </div>
                                ${res.Tr!==null?`<div style="display:flex;align-items:flex-start;gap:8px">
                                  <span style="width:11px;height:11px;border-radius:50%;background:#E8002D;display:inline-block;flex-shrink:0;margin-top:1px"></span>
                                  <div><strong>Tr</strong> — ${res.Tr.toFixed(1)} °C<br><span style="color:#888;font-size:7.5pt">Punto de rocío (condensación)</span></div>
                                </div>`:''}
                                <div style="display:flex;align-items:flex-start;gap:8px">
                                  <span style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:11px solid ${tc};display:inline-block;flex-shrink:0;margin-top:1px"></span>
                                  <div><strong>Ts</strong> — ${res.Ts.toFixed(1)} °C<br><span style="color:#888;font-size:7.5pt">Temperatura de la superficie</span></div>
                                </div>
                              </div>
                              <div style="border-top:0.5px solid #c8d0da;padding:6px 10px;background:#f7f9fc;font-size:8pt;display:flex;flex-direction:column;gap:3px">
                                ${res.mg!==null?`<div>Margen anti-rocío: <strong>${res.mg.toFixed(1)} °C</strong></div>`:''}
                                <div>Diagnóstico: <strong style="color:${sc}">${res.st}</strong></div>
                                ${res.cr!==null?`<div style="color:#666;font-size:7.5pt">Condensación: ${res.cr}</div>`:''}
                              </div>
                            </div>
                          </div>
                        </div>`:''}
                      </div>
                    </div>`;
                }));
                return pages.join('');
            })();

            // ── Planificación HTML ──
            const planificacionHtml = `
              <div class="block">
                <div class="block-title">Planificación Próxima Revisión Obligatoria</div>
                <div style="padding:10px 0;font-size:9.5pt;line-height:1.7;white-space:pre-line;color:#222">${textoRev}</div>
              </div>
              <div class="block">
                <div class="block-title">Planificación Próxima Inspección Obligatoria</div>
                <div style="overflow-x:auto;margin:10px 0 14px">
                  <table style="border-collapse:collapse;font-size:8.5pt">
                    <caption style="caption-side:top;text-align:left;font-weight:600;font-size:8pt;padding-bottom:4px">Tabla 1 — Periodicidad según Tn eq. CO₂</caption>
                    <thead><tr><th style="background:#1c2b3a;color:#fff;padding:5px 10px;border:1px solid #1c2b3a">Tn eq. CO₂</th><th style="background:#1c2b3a;color:#fff;padding:5px 10px;border:1px solid #1c2b3a">Periodicidad</th></tr></thead>
                    <tbody>
                      ${[['Más de 5.000','Anual','1 año'],['Entre 5.000 y 500','Cada 2 años','2 años'],['Entre 500 y 50','Cada 5 años','5 años'],['Inferior a 50 (Nivel 2)','Cada 10 años','10 años'],['Inferior a 50 (otros)','Exentas','Exento']].map(([r,t,k])=>`<tr style="${periodInsp===k?'background:#fef9c3;font-weight:700':''}"><td style="padding:4px 10px;border:0.5px solid #ddd">${r}</td><td style="padding:4px 10px;border:0.5px solid #ddd">${t}</td></tr>`).join('')}
                    </tbody>
                  </table>
                </div>
                <div style="font-size:9.5pt;line-height:1.7;white-space:pre-line;color:#222">${textoInsp}</div>
              </div>`;

            // ── Full HTML ──────────────────────────────────────────────────────────
            const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>${(()=>{const _f=revision['FECHA REVISIÓN']||'';const _y=(_f.match(/\d{4}/)||[new Date().getFullYear()])[0];const _d=(certificadoIF['DICTAMEN']||'INFORME').toUpperCase().replace(/[()]/g,'').replace(/\s+/g,' ').trim();const _rawCif=(informeIF['CIF']||'').trim();const _cif=_rawCif?(/^CIF\s/i.test(_rawCif)?_rawCif:'CIF '+_rawCif):'SIN_CIF';return `${_y}_${_d}_${_cif}`;})()}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
body{font-family:Arial,Helvetica,sans-serif;font-size:10pt;color:#1a1a1a;background:#e8e8e8}
.page{max-width:21cm;margin:0 auto;background:#fff;padding:1.8cm 2cm;box-shadow:0 2px 12px rgba(0,0,0,.18);min-height:29.7cm;position:relative}
.page-divider{background:#1a2744;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:0}
.doc-header{display:table;width:100%;border-bottom:3px solid #1c2b3a;padding-bottom:10px;margin-bottom:18px}
.doc-header-left{display:table-cell;vertical-align:middle}
.doc-header-right{display:table-cell;vertical-align:middle;text-align:right}
.logo{font-size:22pt;font-weight:900;letter-spacing:3px;color:#1c2b3a;line-height:1}
.logo-sub{font-size:7.5pt;letter-spacing:2px;color:#555;text-transform:uppercase;margin-top:2px}
.doc-type{font-size:12pt;font-weight:700;color:#1c2b3a;text-transform:uppercase;letter-spacing:.5px}
.block{margin-bottom:14px}
.block-title{background:#1c2b3a;color:#fff;font-size:8pt;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:5px 8px;margin-bottom:0}
table{width:100%;border-collapse:collapse;font-size:8.5pt}
th{background:#1c2b3a;color:#fff;padding:5px 7px;text-align:left;font-size:8pt;font-weight:700;border:1px solid #1c2b3a}
td{padding:4px 7px;border:1px solid #ccc;vertical-align:top}
tr:nth-child(even) td{background:#f7f7f7}
.print-bar{position:fixed;bottom:0;left:0;right:0;background:#1c2b3a;padding:10px;text-align:center;display:flex;justify-content:center;gap:12px;z-index:999;box-shadow:0 -2px 8px rgba(0,0,0,.3)}
.btn-p{padding:7px 28px;background:#fff;color:#1c2b3a;border:none;font-size:9.5pt;font-weight:700;cursor:pointer;letter-spacing:.5px}
.btn-c{padding:7px 20px;background:transparent;color:#fff;border:1px solid #fff;font-size:9.5pt;cursor:pointer}
@media print{
  body{background:#fff}
  .page{max-width:none;margin:0;padding:1.8cm 2cm;box-shadow:none}
  .page-divider{padding:0}
  .print-bar{display:none}
  .page-break{page-break-before:always}
  .page-divider{min-height:100vh;height:100vh}
  img{image-rendering:-webkit-optimize-contrast;image-rendering:high-quality}
  @page{size:A4;margin:0}
}
</style></head><body>

<!-- ══ PORTADA ══ -->
<div class="page" style="padding:0;background:#1a2744;color:white;font-family:'Segoe UI',Arial,sans-serif;display:flex;flex-direction:column">
  <div style="height:10px;background:#1d4ed8"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;padding:1.5rem 2.2cm 1rem">
    <div><div style="font-size:22pt;font-weight:900;letter-spacing:3px;line-height:1">CLAUGER</div><div style="font-size:7pt;letter-spacing:3px;color:rgba(255,255,255,0.5);margin-top:3px">IBÉRICA S.L.U.</div></div>
    <div style="font-size:7.5pt;color:rgba(255,255,255,0.5)">Ingeniería de Frío Industrial</div>
  </div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:3rem 2.2cm;position:relative">
    <div style="position:absolute;top:0;right:0;width:180px;height:100%;background:rgba(255,255,255,0.03)"></div>
    <div style="font-size:7pt;letter-spacing:3px;color:#93c5fd;text-transform:uppercase;margin-bottom:0.5rem">Informe Técnico</div>
    <div style="font-size:24pt;font-weight:900;line-height:1.2;margin-bottom:0.4rem">${pv('titulo')}</div>
    <div style="font-size:13pt;color:#93c5fd;font-weight:500;margin-bottom:3rem">${pv('subtitulo')}</div>
    <div style="align-self:flex-end;background:rgba(255,255,255,0.09);border:1px solid rgba(255,255,255,0.18);border-radius:8px;padding:1.2rem 1.5rem;min-width:260px;max-width:360px">
      <div style="font-size:7pt;letter-spacing:2px;color:#93c5fd;text-transform:uppercase;margin-bottom:1rem;font-weight:700">Datos del cliente</div>
      ${pv('cliente')?`<div style="font-weight:700;font-size:11pt;margin-bottom:0.5rem">${pv('cliente')}</div>`:''}
      ${pv('direccion')?`<div style="font-size:9pt;color:rgba(255,255,255,0.7);margin-bottom:0.2rem">${pv('direccion')}</div>`:''}
      ${(pv('cp')||pv('localidad'))?`<div style="font-size:9pt;color:rgba(255,255,255,0.7);margin-bottom:0.2rem">${[pv('cp'),pv('localidad')].filter(Boolean).join(' — ')}</div>`:''}
      ${pv('provincia')?`<div style="font-size:9pt;color:rgba(255,255,255,0.7);margin-bottom:0.9rem">${pv('provincia')}</div>`:''}
      <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.15);padding-top:0.7rem">
        ${pv('referencia')?`<div><div style="font-size:6.5pt;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px">Referencia</div><div style="font-size:9pt;font-weight:600">${pv('referencia')}</div></div>`:''}
        ${pv('anio')?`<div style="text-align:right"><div style="font-size:6.5pt;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px">Año</div><div style="font-size:16pt;font-weight:900;line-height:1">${pv('anio')}</div></div>`:''}
      </div>
    </div>
  </div>
  <div style="height:8px;background:#1d4ed8"></div>
</div>

<!-- ══ ÍNDICE ══ -->
<div class="page page-break" style="font-family:'Segoe UI',Arial,sans-serif">
  ${hdr('Índice de Documentos')}
  <div class="block">
    <div class="block-title">Documentos incluidos en este informe</div>
    <table><thead><tr>
      <th style="width:40px;text-align:center">#</th>
      <th>Documento</th>
      <th style="width:80px;text-align:center">Página</th>
    </tr></thead><tbody>
      ${indiceItems.map((item,i)=>`<tr><td style="text-align:center;font-weight:700">${i+1}</td><td>${item.label||'—'}</td><td style="text-align:center">${item.num||'—'}</td></tr>`).join('')}
    </tbody></table>
  </div>
</div>

<!-- ══ 1. ACTA INICIAL ══ -->
${divider(1,'ACTA INICIAL')}
${actaInicialImgs.length===0
  ? `<div class="page page-break">${hdr('Acta Inicial')}<p style="color:#777;font-style:italic;text-align:center;padding:16px 0">No se han adjuntado archivos de Acta Inicial.</p></div>`
  : actaInicialImgs.map(img=>`<div class="page page-break" style="padding:0;height:29.7cm;overflow:hidden"><img src="${img}" style="width:100%;height:100%;object-fit:contain;display:block"></div>`).join('')
}

<!-- ══ 2. EQUIPOS ══ -->
${divider(2,'EQUIPOS')}
${equipHtml}

<!-- ══ 3. CERTIFICADOS VÁLVULAS DE SEGURIDAD ══ -->
${divider(3,'CERTIFICADOS VÁLVULAS DE SEGURIDAD')}
${certPsvImgs.length===0
  ? `<div class="page page-break">${hdr('Cert. Válvulas de Seguridad')}<p style="color:#777;font-style:italic;text-align:center;padding:16px 0">No se han adjuntado certificados PSV.</p></div>`
  : certPsvImgs.map(img=>`<div class="page page-break" style="padding:0;height:29.7cm;overflow:hidden"><img src="${img}" style="width:100%;height:100%;object-fit:contain;display:block"></div>`).join('')
}

<!-- ══ 4. CERTIFICADOS DETECTORES DE FUGAS ══ -->
${divider(4,'CERTIFICADOS DETECTORES DE FUGAS')}
${detectoresHtml}

<!-- ══ 5. TERMOGRAFÍA ══ -->
${divider(5,'TERMOGRAFÍA')}
${termografiaHtml}

<!-- ══ 6. PLANIFICACIÓN ══ -->
${divider(6,'PLANIFICACIÓN')}
<div class="page page-break">
  ${hdr('Planificación')}
  ${planificacionHtml}
</div>

<!-- ══ CONTRAPORTADA ══ -->
<div class="page page-break" style="padding:0;background:#1a2744;display:flex;flex-direction:column;font-family:'Segoe UI',Arial,sans-serif;color:#ffffff;min-height:29.7cm">
  <div style="height:12px;background:#1d4ed8"></div>

  <!-- zona superior: logo centrado -->
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3cm 2.5cm 1.5cm;text-align:center;flex:1">

    <!-- Elemento decorativo superior -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:2.2cm">
      <div style="width:40px;height:1px;background:#3b82f6"></div>
      <div style="width:6px;height:6px;background:#3b82f6;transform:rotate(45deg)"></div>
      <div style="font-size:6.5pt;letter-spacing:4px;color:#93c5fd;text-transform:uppercase;font-weight:700">Informe Técnico</div>
      <div style="width:6px;height:6px;background:#3b82f6;transform:rotate(45deg)"></div>
      <div style="width:40px;height:1px;background:#3b82f6"></div>
    </div>

    <!-- Logo -->
    <div style="font-size:42pt;font-weight:900;letter-spacing:8px;color:#ffffff;line-height:1;margin-bottom:6px">CLAUGER</div>
    <div style="font-size:8pt;letter-spacing:4px;color:#93c5fd;text-transform:uppercase;margin-bottom:2cm">Ibérica S.L.U.</div>

    <!-- Separador doble -->
    <div style="width:64px;height:3px;background:#1d4ed8;border-radius:2px;margin-bottom:4px"></div>
    <div style="width:32px;height:2px;background:#3b82f6;border-radius:2px;margin-bottom:1.8cm"></div>

    <!-- Texto personalizable -->
    <div style="font-size:9.5pt;line-height:2;color:#cbd5e1;white-space:pre-line;max-width:400px;font-weight:400">${contraTexto.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>

    <!-- Separador inferior -->
    <div style="width:64px;height:2px;background:#1e3a6e;border-radius:2px;margin-top:2cm"></div>
  </div>

  <!-- Footer sólido -->
  <div style="background:#0f1f3d;padding:0.85rem 2.5rem;display:flex;justify-content:space-between;align-items:center;border-top:2px solid #1d4ed8">
    <span style="color:#93c5fd;font-size:7.5pt;letter-spacing:2px;text-transform:uppercase;font-weight:700">Empresa Frigorista Autorizada</span>
    <span style="color:#64748b;font-size:7pt;letter-spacing:1px">www.clauger.com</span>
  </div>
  <div style="height:12px;background:#1d4ed8"></div>
</div>

<div class="print-bar">
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

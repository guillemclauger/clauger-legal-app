/**
 * ============================================================================
 * CLAUGER - Sistema de Informes Técnicos
 * ============================================================================
 * Archivo: state.js
 * Descripción: Gestión del estado global de la aplicación
 * Versión: 1.1
 * ============================================================================
 */

// ============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ============================================================================
const AppState = {
    // Modo de acceso
    isLegalMode: false,
    
    // Navegación
    currentPage: 'datos',
    currentSection: null,
    currentEquipmentType: null,
    currentSubType: null,
    currentDetector: null,
    currentServicio: null,
    currentRevisionFinalTab: null,
    
    // Datos de formularios
    sectionsData: {},
    
    // Datos de equipos
    equipmentData: {},
    expandedEquipment: {},
    
    // Datos de detectores
    detectorsData: [],
    
    // Datos de servicios
    serviciosData: [],

    // Cert PSV
    certPsvArchivos: [],

    // Acta Inicial
    actaInicialArchivos: [],

    // Portada / Índice / Contraportada
    portadaData: { titulo: '', subtitulo: '', cliente: '', direccion: '', cp: '', localidad: '', provincia: '', referencia: '', anio: '' },
    indiceData: { items: [] },
    contraportadaData: { texto: '' },

    // Fotos y Archivos Generales
    fotosGeneralesData: [],
    archivosGeneralesData: [],

    // Termografía
    termografiaData: [],
    currentTermografia: null,

    // Planificación
    planificacionData: { textoRevision: '', textoInspeccion: '' },
    
    // Datos de instalación
    instalacionCircuitos: [
        {refrigerante: '', carga: '', pca: '', tnCO2: '', detector: ''},
        {refrigerante: '', carga: '', pca: '', tnCO2: '', detector: ''},
        {refrigerante: '', carga: '', pca: '', tnCO2: '', detector: ''}
    ],
    
    instalacionSalas: [],
    
    instalacionCamaras: [
        {tipo: 'Cámaras > 0ºC (POS)', num: '', volumen: '', atmosfera: ''},
        {tipo: 'Cámaras ≤ 0ºC (NEG)', num: '', volumen: '', atmosfera: ''},
        {tipo: 'Salas o espacios acondicionados', num: '', volumen: '', atmosfera: ''},
        {tipo: 'Otros', num: '', volumen: '', atmosfera: ''}
    ]
};

// ============================================================================
// FUNCIONES DE GESTIÓN DEL ESTADO
// ============================================================================

/**
 * Actualiza el estado global
 * @param {Object} newState - Objeto con las propiedades a actualizar
 */
function updateState(newState) {
    Object.assign(AppState, newState);
}

/**
 * Obtiene el estado actual
 * @returns {Object} Estado actual de la aplicación
 */
function getState() {
    return AppState;
}

/**
 * Resetea el estado a valores iniciales
 */
function resetState() {
    AppState.sectionsData = {};
    AppState.equipmentData = {};
    AppState.detectorsData = [];
    AppState.serviciosData = [];
    AppState.certPsvArchivos = [];
    AppState.actaInicialArchivos = [];
    AppState.portadaData = { titulo: '', subtitulo: '', cliente: '', direccion: '', cp: '', localidad: '', provincia: '', referencia: '', anio: '' };
    AppState.indiceData = { items: [] };
    AppState.contraportadaData = { texto: '' };
    AppState.fotosGeneralesData = [];
    AppState.archivosGeneralesData = [];
    AppState.termografiaData = [];
    AppState.currentTermografia = null;
    AppState.planificacionData = { textoRevision: '', textoInspeccion: '' };
    AppState.instalacionCircuitos = [
        {refrigerante: '', carga: '', pca: '', tnCO2: '', detector: ''},
        {refrigerante: '', carga: '', pca: '', tnCO2: '', detector: ''},
        {refrigerante: '', carga: '', pca: '', tnCO2: '', detector: ''}
    ];
    AppState.instalacionSalas = [];
    AppState.instalacionCamaras = [
        {tipo: 'Cámaras > 0ºC (POS)', num: '', volumen: '', atmosfera: ''},
        {tipo: 'Cámaras ≤ 0ºC (NEG)', num: '', volumen: '', atmosfera: ''},
        {tipo: 'Salas o espacios acondicionados', num: '', volumen: '', atmosfera: ''},
        {tipo: 'Otros', num: '', volumen: '', atmosfera: ''}
    ];
}

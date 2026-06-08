/**
 * ============================================================================
 * CLAUGER - Sistema de Informes Técnicos
 * ============================================================================
 * Archivo: config.js
 * Descripción: Configuraciones globales del sistema
 * Versión: 1.1
 * ============================================================================
 */

// ============================================================================
// CONFIGURACIÓN GENERAL DE LA APLICACIÓN
// ============================================================================
const CONFIG = {
    APP_NAME: 'CLAUGER',
    VERSION: '1.1',
    APP_VERSION: '26_01',
    LEGAL_PASSWORD: '1234'
};

// ============================================================================
// TIPOS DE EQUIPOS Y SUS PLANTILLAS
// ============================================================================
const EQUIPMENT_TYPES = {
    'Unidad Compresora': {
        icon: '🔧',
        template: 'unidad_compresora',
        isComposite: true,
        subTypes: [
            'Bloque Compresor',
            'Sep. Aceite',
            'Sep. Aceite Sec.',
            'Enfriador Aceite',
            'Enfriador Aceite Sec.',
            'Filtro Aceite',
            'Filtro Aspiración',
            'Otro'
        ]
    },
    'Recipiente': {
        icon: '🛢️',
        template: 'plantilla1',
        subTypes: [
            'Recipiente de Líquido',
            'Separador Aspiración',
            'Economizador',
            'Recipiente Purga Aceite',
            'Flotador',
            'Otro'
        ]
    },
    'Intercambiador': {
        icon: '🔄',
        template: 'plantilla2',
        subTypes: [
            'Int. Placas',
            'Int. Multitubular'
        ]
    },
    'Condensador': {
        icon: '❄️',
        template: 'plantilla1',
        subTypes: [
            'Condensador Evaporativo',
            'Condensador Aire',
            'Condensador Adiabático'
        ]
    },
};

// ============================================================================
// REFRIGERANTES Y SUS VALORES PCA
// ============================================================================
const REFRIGERANTES_PCA = {
    'R134a': 1430,
    'R404A': 3922,
    'R407A': 2107,
    'R407C': 1774,
    'R407F': 1825,
    'R410A': 2088,
    'R507A': 3985,
    'R717': 0,
    'R744': 1,
    'R290': 3,
    'R600a': 3,
    'R1234yf': 4,
    'R1234ze': 7,
    'R32': 675,
    'R449A': 1397,
    'R450A': 605,
    'R513A': 631,
    'R452A': 2141,
    'R454B': 466,
    'R455A': 148,
    'R1233zd': 7,
    'R1336mzz': 9
};

// ============================================================================
// CONFIGURACIÓN DE PÁGINAS Y SECCIONES
// ============================================================================
const PAGES_CONFIG = {
    datos: {
        title: "📄 DATOS",
        sections: [
            {
                id: "datos_delegacion",
                name: "Datos de Delegación",
                icon: "🏢",
                type: "form",
                legalOnly: true,
                fields: [
                    {name: "DELEGACIÓN", type: "select", options: ["", "A CORUÑA", "BARCELONA", "HUELVA", "MADRID", "MÁLAGA", "MURCIA", "VALLADOLID", "VALENCIA", "VIGO", "ZARAGOZA"]},
                    {name: "DIRECCIÓN", type: "text"},
                    {name: "POBLACIÓN", type: "text"},
                    {name: "C.P.", type: "text"},
                    {name: "PROVINCIA", type: "text"}
                ]
            },
            {
                id: "datos_informe",
                name: "Datos del Informe",
                icon: "📝",
                type: "form",
                technicalOnly: true,
                fields: [
                    {name: "SISTEMA", type: "text"},
                    {name: "CIF", type: "text"},
                    {name: "NÚMERO REVISIÓN", type: "select", options: ["", "R0", "R1", "R2"]}
                ]
            },
            {
                id: "datos_cliente",
                name: "Datos del Cliente",
                icon: "📋",
                type: "form",
                fields: [
                    {name: "CLIENTE", type: "text"},
                    {name: "DIRECCIÓN", type: "text"},
                    {name: "LOCALIDAD", type: "text"},
                    {name: "PROVINCIA", type: "text"},
                    {name: "CP", type: "text"}
                ]
            },
            {
                id: "datos_instalacion",
                name: "Datos de la Instalación",
                icon: "🏗️",
                type: "form",
                legalOnly: true,
                fields: [
                    {name: "SISTEMA", type: "text"},
                    {name: "REF. TITULAR", type: "text"},
                    {name: "DESCRIPCIÓN", type: "select", options: ["", "Industria cárnica", "Industria láctea", "Industria Agrícola (Frutas / verduras)", "Industria pesquera", "Industria conservera", "Industria alimentaria", "Industria química", "Industria Petroquímica", "Industria Panadera / Pastelera", "Almacén frigorífico"]},
                    {name: "FINALIDAD", type: "select", options: ["", "Tratamiento de productos perecederos", "Proceso industrial", "Fabricación de hielo", "Climatización"]},
                    {name: "REGLAMENTO", type: "select", options: ["", "RD3099/1977", "RD138/2011", "RD552/2019", "RD3099/1977 + RD138/2011", "RD3099/1977 + RD552/2019", "RD3099/1977 + RD138/2011 + RD552/2019", "RD138/2011 + RD552/2019"]},
                    {name: "FECHA PS", type: "date"},
                    {name: "CIF", type: "text"},
                    {name: "CLAS. EMPLAZ.", type: "select", options: ["", "Tipo 1", "Tipo 2", "Tipo 3", "Tipo 4"]},
                    {name: "CLAS. LOCAL", type: "select", options: ["", "Cat. A", "Cat. B", "Cat. C", "Cat. D"]},
                    {name: "NIVEL", type: "select", options: ["", "1", "2"]},
                    {name: "POT. ABS (kW)", type: "text"},
                    {name: "SISTEMA REFRIG. 1", type: "select", options: ["", "Directo", "Indirecto cerrado", "Indirecto abierto", "Doble indirecto abierto", "Indirecto cerrado ventilado", "Indirecto abierto ventilado"]},
                    {name: "SISTEMA REFRIG. 2", type: "select", options: ["", "Directo", "Indirecto cerrado", "Indirecto abierto", "Doble indirecto abierto", "Indirecto cerrado ventilado", "Indirecto abierto ventilado"]},
                    {name: "SISTEMA REFRIG. 3", type: "select", options: ["", "Directo", "Indirecto cerrado", "Indirecto abierto", "Doble indirecto abierto", "Indirecto cerrado ventilado", "Indirecto abierto ventilado"]},
                    {name: "TIPO", type: "select", options: ["", "1 Etapa", "2 Etapa", "3 Etapa", "Cascada / Booster"]}
                ]
            },
            {
                id: "datos_revision",
                name: "Datos de Revisión",
                icon: "📅",
                type: "form",
                legalOnly: true,
                fields: [
                    {name: "FECHA REVISIÓN", type: "date"},
                    {name: "PERIODICIDAD REVISIÓN", type: "text", readonly: true, computed: true},
                    {name: "PRÓXIMA REVISIÓN", type: "date", readonly: true, computed: true},
                    {name: "ÚLTIMA INSPECCIÓN", type: "date_or_never"},
                    {name: "PERIODICIDAD INSPECCIÓN", type: "text", readonly: true, computed: true},
                    {name: "PRÓXIMA INSPECCIÓN", type: "date", readonly: true, computed: true}
                ]
            },
            {
                id: "datos_certificado",
                name: "Certificado",
                icon: "📜",
                type: "form",
                legalOnly: true,
                fields: [
                    {name: "TIPO DE ACTA", type: "select", options: ["", "CERTIFICADO DE REVISIÓN PERIÓDICA", "INFORME TÉCNICO / LEGAL"]},
                    {name: "NÚMERO REVISIÓN", type: "text"},
                    {name: "DICTAMEN", type: "select", options: ["", "Favorable (Sin defectos)", "Favorable (Defectos leves)", "Desfavorable", "Negativa", "Condicionado", "Comunicación deficiencias"]},
                    {name: "FECHA LÍMITE CORRECCIÓN", type: "text"},
                    {name: "COMENTARIOS", type: "textarea", rows: 6, readonly: true, fullWidth: true}
                ]
            }
        ]
    },
    checklist: {
        title: "✅ CHECKLIST",
        sections: [
            {
                id: "seccion_a",
                name: "A - Documental",
                icon: "📋",
                type: "checklist",
                items: [
                    {id: "A01", desc: "Libro registro de usuario (LRU)", comment: "Se debe hacer o solicitar una copia del LRU.\nEl usuario deberá disponer del LRU, actualizado con las operaciones realizadas.\nEl libro de registro deberá estar sellado por Industria, o deberán disponer de algún documento anexo, que indique la legalización."},
                    {id: "A02", desc: "Documentación justificativa alta en Industria", comment: "Documentacion justificativa del registro de la instalacion o de su modificacion / ampliación."},
                    {id: "A03", desc: "Proyecto / Memoria", comment: "Proyecto sellado por el colegio de ingenieros.\nMemoria sellada y firmada por la empresa instaladora"},
                    {id: "A04", desc: "Manual de instrucciones", comment: "La instalación debe disponer de manual de instrucciones y seguridad."},
                    {id: "A05", desc: "Certificados equipos", comment: "En instalaciones o equipos no suministrados por Clauger Ibérica , se deberá solicitar una copia.\nEn el caso de equipos anteriores al año 2001, deberán disponer de \"Placa de Industria\".\nLos posteriores a 2011, deberán tener marcado CE."},
                    {id: "A06", desc: "Placas de caracteristicas de equipos (OC)", comment: "Deberá existir una Placa de Características legible y  de facil visualizacion en cada equipo a presion . \nComprobar que los datos de la placa, coinciden con los de la documentación."},
                    {id: "A07", desc: "Certificado CE del sistema de tuberías", comment: "Solo exigible en instalaciones en las que aplique el RD138/2011.\nNo es necesario solicitarlo en el caso de revisiones periódicas."},
                    {id: "A08", desc: "Certificados de ajuste de válvulas de seguridad", comment: "No es necesario solicitarlo en el caso de revisiones periódicas."},
                    {id: "A09", desc: "Certificado de calibración detectores refrigerante (OC)", comment: "En nueva instalación, se deberá suministrar el certificado de calibración del fabricante.\nEn revisiones, será uno de los documento de la revisión."},
                    {id: "A10", desc: "Certificados instalación eléctrica", comment: "El cuadro eléctrico deberá disponer de marcado CE, y certificado de conformidad con esta normativa, y el Reglamento de Baja Tensión.\nEn revisiones, bastará comprobar el marcado CE en el cuadro eléctrico."},
                    {id: "A11", desc: "Contrato de mantenimiento o autocontrol (Solo instalaciones de Nivel 2)", comment: "Firmado, y en vigor."},
                    {id: "A12", desc: "Póliza de responsabilidad civil", comment: "El cliente deberá facilitar una copia de la póliza de responsabilidad civil."},
                    {id: "A13", desc: "Asignación persona responsable (Documentada)", comment: "El cliente debe asignar un responsable de la instalación perteneciente a la plantilla de la empresa, y este deberá dispone de \"Diploma\" que lo acredite, emitido por empresa frigorista autorizada."},
                    {id: "A14", desc: "Certificados de Inspección periódica", comment: "Se solicitará copia de la última inspección periódica por una OCA, para comprobar si está pendiente de realización (solo en revisiones periódicas)."},
                    {id: "A15", desc: "Notificación y revisión de condensadores evaporativos y torres de refrigeración", comment: "El usuario debe haber notificado la existencia de estos equipos a la administración, y tener un contrato con empresa autorizada."},
                    {id: "A16", desc: "Acta revisión control legionela de condensadores evaporativos y torres de refrigeración", comment: "-"},
                    {id: "A17", desc: "Acta Inspeccion instalacíón Protección Contra Incendios PCI (RD 2267/2004)", comment: "En sala de máquinas específica de instalaciones ubicadas en establecimientos industriales a las que le sea de aplicación el Real Decreto 2267/2004, comprobación de la existencia del certificado de inspección periódica la instalación de protección contra incendios en establecimientos industriales\nSolicitar copia al titular o que confirme su existencia."}
                ]
            },
            {
                id: "seccion_b",
                name: "B - Sala de Máquinas",
                icon: "🏭",
                type: "checklist",
                items: [
                    {id: "B01", desc: "Sala de máquinas específica (L2, L3)", comment: "Para refrigerantes del grupo L2 (Ej. R717) o L3 (Ej. Propano) se debe disponer de una Sala de Máquinas específica.\nSe puede considerar como válido la existencia de SM situadas en el exterior, sin cerramiento, necesitando cumplir los mismos requisitos de seguridad."},
                    {id: "B02", desc: "Placa de características de la instalación frigorifica", comment: "Deberá existir una Placa de Características actualizada en la Sala de Máquinas.\nComprobar que los datos de la placa, coinciden con los de la documentación."},
                    {id: "B03", desc: "Esquema frigorífico", comment: "En Sala de Máquinas debe existir un esquema frigorífico actualizado."},
                    {id: "B04", desc: "Cartel de seguridad", comment: "Situado a la entrada de Sala de Máquinas, o espacio equivalente."},
                    {id: "B05", desc: "Puertas de acceso", comment: "Serán de tipo \"antipánico\", abrir hacia fuera y cerrar solas.\nTamaño suficiente para la extracción de elementos que requieran su extracción para mantenimiento (compresores,…). \nAl menos una salida debe comunicar directamente con el exterior o de lo contrario conducir a un pasillo de salida de emergencia."},
                    {id: "B06", desc: "Cerramientos y aberturas", comment: "No debe haber aberturas o comunicación con otras salas, incluyendo el paso de tuberías que debe ser estanco."},
                    {id: "B07", desc: "Comunicación con exterior refrigerantes L3", comment: "Grupo L3 si existe posibilidad de alcanzar el limite inferior de inflamabilidad el recinto debe disponer de una comunicación directa con el exterior con amin 0,001xvolumen local."},
                    {id: "B08", desc: "Existencia exclusiva del equipo frigorífico", comment: "Solo existirán componentes de la instalación frigorífica y equipos auxiliares."},
                    {id: "B09", desc: "Almacenamiento de refrigerante", comment: "La cantidad máxima de refrigerante almacenado en la SM, no puede ser superior al 20% de la carga de la instalación, con un máximo de 150 kg.\nEn el caso de HFC, comprobar que el usuario dispone de certificado de depósito del refrigerante por parte de empresa frigorista autorizada."},
                    {id: "B10", desc: "Accesibilidad a equipos", comment: "Acceso adecuado a todos los elementos de la sala de máquinas para asegurar su servicio y mantenimiento."},
                    {id: "B11", desc: "Alturas libres mínimas", comment: "Altura libre mínima 2,3 m en zonas de acceso o trabajo permanente"},
                    {id: "B12", desc: "Existencia detector de fugas", comment: "Necesario en instalaciones con R717, R744 y refrigerantes L3.\nEn instalaciones con HFC, será obligado si se da alguna de estas condiciones:\n- Carga refrig ≥ 300 Kg\n- Carga refrig./Volumen  >0.25 R134a  ; > 0.49 R507  ; > 0.48 R404A."},
                    {id: "B13", desc: "Detector fugas antiflagrante para refrigerantes L3", comment: "-"},
                    {id: "B14", desc: "Ajuste y comprobación detector de fugas (OC)", comment: "Ajuste y comprobación. \nNiveles min/máx. R717: 500 / (máx. norma 30.000 ppm)\nNiveles min/máx. R744: 5.000 /  (máx. norma 10.000 ppm)\nHFC y Grupo L3: Confirmar dependiendo de volumen de la SM."},
                    {id: "B15", desc: "Ventilación", comment: "En instalaciones con R717 o fluidos explosivos (Grupo L3)  se debe disponer de ventiladores EExdII.\nEn instalaciones con HFC puede ser natural (ver Libro de Registro)., siempre que no se trate de sótanos, en los que deberá ser forzada.\nDebe haber buena circulación (comprobar ubicación entrada de aire), y evitar recirculaciones de aire en el extractor.\nCon R717, se debe disponer de entrada de aire en la zona inferior, y salida en la superior (extractor).\nCon HFC y R744, la entrada de aire se realizará por la parte superior, y la salida por la inferior."},
                    {id: "B16", desc: "Cuadro de emergencia y/o pulsadores de emergencia en puertas acceso", comment: "En instalaciones de R717 el cuadro de emergencias deberá poder forzar la ventilación, pero no se podrá anular (Manual/Auto).\nDispondrá de seta de emergencia que parará la instalación.\nEn caso de detección de fuga, o paro por seta, la SM (o zona de seguridad en instalaciones exteriores) debe quedar sin corriente.\nDebe haber un pulsador de paro en cada puerta de acceso.\nEn SM exteriores, no existirá selector para extractor, pero el resto de funciones serán las mismas."},
                    {id: "B17", desc: "Interruptor marcha/paro extractor en interior de Sala de Máquinas", comment: "Se deberá poder forzar la ventilación forzada, pero no anular (Interruptor Manual/Auto), desde el interior de la Sala de Máquinas.\nEste interruptor puede estar en el mismo cuadro."},
                    {id: "B18", desc: "Iluminación de emergencia", comment: "Debe ser Atex en el caso de R717"},
                    {id: "B19", desc: "Sala de recogida de líquidos", comment: "La Sala de Recogida de Líquidos es obligatoria en instalaciones de más de 2000 Kg de carga de R717 en las que aplique el RD138/2011."},
                    {id: "B20", desc: "Existencia toma de agua", comment: "Solo exigible en instalaciones en las que aplique el RD138/2011.\nDebe existir una toma de agua con sistema antiretorno para evitar el retorno de agua contaminada a la red."},
                    {id: "B21", desc: "Separación de focos de calor", comment: "No puede haber calderas u otros sistemas similares en la Sala de Máquinas"},
                    {id: "B22", desc: "Ausencia de materiales inflamables", comment: "No puede haber elementos inflamables en la Sala de Máquinas."},
                    {id: "B23", desc: "Equipos de respiración autónomos (OC)", comment: "Necesarios en instalaciones con carga de refrigerante mayor a:\n-   Fluidos grupo L1: > 100 Kg      -   Fluidos grupo L2/L3 : >  200 Kg\nSituados a la entrada de SM en armario.\n\nComprobar estado de correas, mascarilla, válvulas y revisión anual de la botella (Retimbrado cada 3 años)\n\nMínimo 2 unidades."},
                    {id: "B24", desc: "Trajes de protección estancos (OC)", comment: "Necesarios en el caso de instalaciones con refrigerante R717.\nSituados a la entrada de SM en armario.\nMínimo 2 unidades. Deberan cumplir con norma UNE EN943-1 Tipo 1 Estancos de pies y manos."},
                    {id: "B25", desc: "Máscaras de respiración (OC)", comment: "Solo en plantas con más de 50 Kg de R717.\nComprobar que corre el agua durante 10 min.\nSolo exigible en instalaciones en las que aplique el RD138/2011."},
                    {id: "B26", desc: "Ducha/lavaojos de emergencia (OC)", comment: "Solo en plantas con más de 50 Kg de R717.\nComprobar que corre el agua durante 10 min.\nSolo exigible en instalaciones en las que aplique el RD138/2011."},
                    {id: "B27", desc: "Extintores polivalentes (ABC)", comment: "Situados 1 a la entrada de SM, y otro en el extremo contrario.\nDeben tener las revisiones periódicas al día."}
                ]
            },
            {
                id: "seccion_c",
                name: "C - Protección Sobrepresiones",
                icon: "🛡️",
                type: "checklist",
                items: [
                    {id: "C01", desc: "Válvulas de seguridad (OC)", comment: "Comprobación presion tarado y presión del equipo a proteger"},
                    {id: "C02", desc: "Válvulas de seguridad con descarga al exterior (OC)", comment: " Fecha timbrado. \nNo necesaria para equipos con diámetro inferior a 150mm. \nNo hay válv. de cierre entre recipiente y la vs si descarga al exterior."},
                    {id: "C03", desc: "Válvulas de tres vias", comment: "Instalaciones en las que aplique el RD138/2011:\n- Doble con válvula de 3 vías en recipientes de volumen mayor o igual a 100 lts. \nInstalaciones en las que aplique el RD3099/1977:\n- Doble con válvula de 3 vías en recipientes de volumen mayor o igual a 280 lts."},
                    {id: "C04", desc: "Válvula de seguridad con descarga al interior", comment: "Las válvulas de cierre situadas antes y/o después de una válvula de seguridad que descargue al interior deberán estar precintadas."},
                    {id: "C05", desc: "Válvula de seguridad protección compresor (OC)", comment: "Válvula de seguridad de descarga al interior (AP/BP), o válvula compartida con el separador. Para compresores de más 90m3/h de desplazamiento."},
                    {id: "C06", desc: "Tuberías Descarga válvula. Seguridad", comment: "Comprobación descarga al exterior en lugar seguro.\nSe permite la descarga en la misma sala si  Carga refrigerante/Volumen:\n<0.25 R134a  ; < 0.49 R507  ; < 0.48 R404A (otros consultar)"},
                    {id: "C07", desc: "Indicadores descarga de válvulas de seguridad", comment: "Las válvulas de seguridad que descarguen al exterior, deberán disponer de un indicado de disparo (sifón o similar).\nSolo exigible en instalaciones en las que aplique el RD138/2011."},
                    {id: "C08", desc: "Tapones fusibles", comment: "Deberán indicar la fecha de \"fabricación\"."},
                    {id: "C09", desc: "Discos de rotura", comment: "Indicación presión de rotura y fecha de \"fabricación\".\nMontados antes de válvulas de seguridad si la instalación tiene más de 1000 Kg de HFC. (Solo exigible en instalaciones en las que aplique el RD138/2011)."},
                    {id: "C10", desc: "Protección bombas de refrigerante", comment: "Válvula de alivio en bombas de instalaciones con refrigerante CO2."},
                    {id: "C11", desc: "Protección bombas de desplazamiento positivo", comment: "Válvula de alivio en bombas de desplazamiento positivo, para cualquier tipo de refrigerante (bombas de engranaje, pistón, …)"},
                    {id: "C12", desc: "Limitadores de alta presión (presostatos)", comment: "Los compresores con desplazamiento > 90 m3/h deberán disponer presostato de seguridad de alta doble (KP7ABS o similar).\nAjuste de acuerdo con el libro de registro (0,9 x PS). No puede existir válv. cierre entre presostato y el equipo que protege. Presostato tiene que ser de rearme manual."}
                ]
            },
            {
                id: "seccion_d",
                name: "D - General",
                icon: "⚙️",
                type: "checklist",
                items: [
                    {id: "D01", desc: "Verificación de adecuación de esquemas frigoríficos y eléctricos", comment: "Deben estar actualizados y coincidir con lo realmente instalado."},
                    {id: "D02", desc: "Comprobación de componentes según especificaciones", comment: "En instalaciones de nueva ejecución y modificaciones."},
                    {id: "D03", desc: "Accesibilidad de equipos, tuberías y paneles de válvulas", comment: "Accesibilidad para el mantenimiento, reparación e inspección"},
                    {id: "D04", desc: "Ubicación tuberías", comment: "No puede haber tuberías de refrig. En vestíbulos, entradas, escaleras, huecos como elevadores como objetos móviles sin disponer de protección de tubo rígido metálico."},
                    {id: "D05", desc: "Marcado tuberías", comment: "Indicación de fluido, dirección, …\nSolo exigible en instalaciones en las que aplique el RD138/2011 y RD 552/2019"},
                    {id: "D06", desc: "Comprobación de soportes y anclaje de componentes y tuberías", comment: "Comprobación de vibraciones y movimientos producidos por la temperatura y presión bajo condiciones de trabajo."},
                    {id: "D07", desc: "Material equipos frigoríficos, tuberías y válvulas", comment: "Verificación general de equipos, tuberías, automatismos, válvulas, …"},
                    {id: "D08", desc: "Verificación de equipos de medida (OC)", comment: "Estado exterior, ausencia de corrosión, existencia placa características, …"},
                    {id: "D09", desc: "Ausencia de corrosión en tuberías sin aislar (OC)", comment: "Verificación del estado superficial de las tuberías que no disponen de aislamiento (corrosión, …)"},
                    {id: "D10", desc: "Revisión uniones y soldaduras (Solo en inst. de nueva ejecución o modificaciones)", comment: "En instalaciones de nueva ejecución y modificaciones."},
                    {id: "D11", desc: "Protección contra corrosión de tuberías no aisladas. (OC)", comment: "Existencia de protección mediante pintura u otros medios"},
                    {id: "D12", desc: "Revisión del aislamiento y su barrera de vapor (OC)", comment: "Se deberán realizar termografías de las zonas dudosas por muestreo, y en caso necesario \"catas\" para comprobar el estado."},
                    {id: "D13", desc: "Verificación equipos a presión (OC)", comment: "Estado exterior, ausencia de corrosión, existencia placa características, …"},
                    {id: "D14", desc: "Verificación equipos multitubulares. (OC)", comment: "Revisión del estado interior de los aparatos multitubulares, una vez vaciados y desmontados los cabezales y las tapas de estos.\nNo debe considerarse para equipos que trabajen en circuito cerrado en el lado de los tubos (Enfriadores de aceite, …)"},
                    {id: "D15", desc: "Verificación precintado de válvulas", comment: "Las válvulas de cierre que aíslen válvulas de seguridad de descarga hacia el interior del circuito, válvulas de orificio mínimo de bombas y otras válvulas que cierren equipos a presión que no dispongan de válvula de seguridad propia, deben precintarse en posición abierta."},
                    {id: "D16", desc: "Válvulas de cierre rápido en puntos de puga", comment: "En puntos de purga habitual (Recipientes de aceite, bajantes separador)\nSolo exigible en instalaciones en las que aplique el RD138/2011 y Cataluña."},
                    {id: "D17", desc: "Señalización de riesgos / Iluminación", comment: "Iluminación y señalización de riesgos y equipos de uso obligatorio en aquellos lugares donde existan cuadros de válvulas, condensadores, …"},
                    {id: "D18", desc: "Verificación de protecciones contra daños mecánicos", comment: "Protección motores, transmisiones y otras partes móviles."},
                    {id: "D19", desc: "Verificación de protecciones de partes calientes", comment: "Protección de tuberías en zonas accesibles al público"},
                    {id: "D20", desc: "Salidas de emergencia", comment: "En aquellos lugares como falsos techos, etc. en los que existan cuadros de válvulas, condensadores,…  se dispondrá de más de una salida."},
                    {id: "D21", desc: "Detectores de fuga en circuitos secundarios", comment: "En circuitos secundarios en los que el primario sea R717 y tenga una carga superior a 500 Kg, debe haber detectores Glicol/R717.\nSolo exigible en instalaciones en las que aplique el RD138/2011."},
                    {id: "D22", desc: "Purgadores de incondensables", comment: "Obligatorio en instalaciones que trabajen con presiones inferiores a la atmosférica con más de 1000 Kg de R717.\nSolo exigible en instalaciones en las que aplique el RD138/2011."},
                    {id: "D23", desc: "Tratamiento agua condensadores evaporativos y torres de refrigeración", comment: "El usuario debe tener un sistema de tratamiento antilegionela del agua en balsas."}
                ]
            },
            {
                id: "seccion_e",
                name: "E - Cámaras",
                icon: "❄️",
                type: "checklist",
                items: [
                    {id: "E01", desc: "Aislamiento", comment: "Comprobación de estado general del panel. \nExistencia barrera vapor."},
                    {id: "E02", desc: "Válvulas de sobrepresión cámaras", comment: "Obligatorio solo si  el volumen es superior a 20m3.\nSuficientes, libres de obstrucciones (hielo), y con su resistencia conectada."},
                    {id: "E03", desc: "Termómetros y registradores de temperatura homologados", comment: "En Cámaras de Productos perecederos:\nTemperatura < 0º --> Registrador homologado.\nTemp.> 0 ºC ; V.Cámara > 10 m3 ; Almacenamiento > 8 días  --> Registrador homologado\nTemp.> 0 ºC ; Almacenamiento < 8 días --> Termómetro homologado"},
                    {id: "E04", desc: "Resistencias eléctricas puertas", comment: "En cámaras con Temperatura < -5ºC."},
                    {id: "E05", desc: "Apertura puertas", comment: "Comprobación de apertura desde el interior sin necesidad de llave."},
                    {id: "E06", desc: "Detectores de refrigerante", comment: "No necesario para R717 segun RD 3099/1977 y RD 138/2011.\nObligatorio para cámaras instaladas según RD 552/2019.\nEn cámaras con refrigerante HFC o CO2 si:\n Carga refrigerante/Volumen \n>0.25 R134a  ; > 0.49 R507  ; > 0.48 R404A\n> 0,07 CO2 (Si Volumen > 30 m3)"},
                    {id: "E07", desc: "Dispositivo de petición de auxilio cámara Tª Positva", comment: "Deberán disponer de pulsador iluminado en el interior de la cámara, y una señal acústica y luminosa en el exterior.\n0ºC < Temperatura < 5ºC --> 1 Dispositivo (Solo exigible en instalaciones en las que aplique el RD138/2011.)"},
                    {id: "E08", desc: "Dispositivos de petición de auxilio cámara Tª Negativa", comment: "Deberán disponer de dos pulsadores iluminados en el interior de la cámara, y una señal acústica y luminosa en el exterior.\nTemperatura < 0ºC --> 2 Dispositivos (1 con batería)"},
                    {id: "E09", desc: "Hacha bomberos", comment: "En cámaras con Temperatura < 0ºC.\nHacha tipo bombero, con mango sanitario y longitud mínima mango 800 mm. Una en cada puerta."},
                    {id: "E10", desc: "Accesibilidad paneles válvulas y válv. control.", comment: "Accesibilidad paneles válvulas y válv. control."},
                    {id: "E11", desc: "Cámaras de atmosfera artificial: apagado lámparas ultravioletas.", comment: "Al abrir la puerta de la cámara se deben apagar las lámparas de rayos ultravioletas."},
                    {id: "E12", desc: "Indicación cámaras de atmosfera artificial.", comment: "Deben disponer de un rotulo con la indicación \"Peligro, Atmosfera Artificial\" prohibiendo la entrada sin previa ventilación."}
                ]
            },
            {
                id: "seccion_f",
                name: "F - Eléctrico",
                icon: "⚡",
                type: "checklist",
                items: [
                    {id: "F01", desc: "Verificación general de líneas eléctricas", comment: "Verificación de la capa de aislamiento del cableado.\nVerificación apriete borneros (termografía posible).\nAusencia de humedad en el recorrido.\nComprobación de aislamiento de cables, cajas interconexión, canalizaciones y tubos según:\n-  Locales húmedos: cámaras y antecámaras."},
                    {id: "F02", desc: "Independencia circuitos instalación frigorífica", comment: "Los circuitos eléctricos de alimentación de los sistemas frigoríficos se instalarán de forma que la corriente se establezca o interrumpa Independientemente de la alimentación de otras partes de la instalación, y, en especial, de la red de alumbrado, (normal y de emergencia), dispositivos de ventilación y sistemas de alarma"},
                    {id: "F03", desc: "Independencia circuitos resistencias puertas y desagüe", comment: "Diferencial independiente del resto del circuito, exigible en instalaciones en las que aplique el RD138/2011."},
                    {id: "F04", desc: "Protección contra contactos directos", comment: "No puede existir ningún tipo de cable o elemento que pueda producir descarga por contacto."},
                    {id: "F05", desc: "Protección contra contactos indirectos", comment: "Verificación de existencia de elementos de protección (diferenciales, ...)\nEn instalaciones en las que aplique el RD138/2011:\n-  En instalaciones centralizadas, cada elemento principal deberá estar debidamente protegido: compresor, condensador, evaporador y bomba de circulación de fluido.\n-  En caso de circuitos independientes constituidos por un único conjunto compresor, condensador y evaporador, será suficiente una única protección para el conjunto."},
                    {id: "F06", desc: "Puesta a tierra", comment: "Existencia y colocación adecuada."},
                    {id: "F07", desc: "Protección EExd", comment: "Todos los elementos en instalaciones con refrigerantes del grupo L3.\nCableado y sistema de ventilación en Sala de Máquinas de instalaciones con R717, y otros cables que puedan quedar con tensión en caso de fuga (Iluminación de emergencia, …)."}
                ]
            },
            {
                id: "seccion_g",
                name: "G - Control Fugas",
                icon: "🔍",
                type: "checklist",
                items: [
                    {id: "G01", desc: "Registro de operaciones de carga y extracción", comment: "Existencia de libro, o equivalente en el que se registren las cargas y extracción de refrigerante."},
                    {id: "G02", desc: "Registro seguimiento control de fugas", comment: "Existencia de libro, o equivalente en el que se registren las fugas de refrigerante."},
                    {id: "G03", desc: "Comunicado a organo competente de fugas > 5% carga. (Comunicado por el mantenedor)", comment: "Existencia de certificado, carta o similar, comunicando a Industria la existencia de la fuga."},
                    {id: "G04", desc: "Comunicado a organo competente de fugas > 5% carga. (Comunicado por el titular)", comment: "Existencia de certificado, carta o similar, comunicando a Industria la existencia de la fuga."}
                ]
            }
        ]
    },
    equipos: { title: "⚙️ EQUIPOS", sections: [] },
    servicios: { title: "❄️ SERVICIOS", sections: [] },
    verif_fugas: { title: "🔍 VERIFICACIÓN DETECTOR FUGAS", sections: [] }
};

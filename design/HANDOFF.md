# Handoff de rediseño — CLAUGER Sistema de Informes Técnicos

> Para Claude Code (VSCode). Objetivo: **unificar la estética** de la app sobre el
> navy `#1a2744`, **sin cambiar la lógica ni la estructura de datos**.
> Solo se tocan CSS y el HTML/markup de presentación.

## Reglas globales (aplican a todo)

- **NO** cambies JavaScript de lógica, nombres de campos, IDs, ni la estructura de datos / JSON.
- **NO** alteres la generación de PDFs en cuanto a qué datos salen; solo su CSS visual.
- Trabaja **un archivo por sesión** y **muéstrame el diff antes de aplicar**.
- Sustituye **todos los emojis** por iconos SVG de línea (trazo 1.6). Ver tabla abajo.
- Elimina los degradados (header morado `#667eea→#764ba2`, botones arcoíris). Colores planos.

---

## 1. Tokens de diseño (pega esto al principio de `styles/main.css`, dentro de `:root`)

```css
:root {
  /* Marca / navy */
  --navy: #1a2744;        /* header, tabs, sidebar oscuro */
  --navy-800: #22314f;
  --navy-700: #2c3a5c;
  --accent: #2f5aa6;      /* azul interactivo: links, foco, activo */
  --accent-700: #244a8c;
  --accent-soft: #eaf0fa;

  /* Superficies */
  --ecru: #f7f5f1;        /* fondo de página (sustituye al gris) */
  --surface: #ffffff;
  --surface-2: #fbfaf8;

  /* Tinta */
  --ink: #1a2744;
  --ink-2: #4d5670;
  --ink-3: #8189a0;
  --on-dark: #f4f6fb;

  /* Líneas */
  --line: rgba(26,39,68,.10);
  --line-2: rgba(26,39,68,.18);
  --line-3: rgba(26,39,68,.30);

  /* Campo calculado (readonly) */
  --calc-bg: #eef1f7;
  --calc-line: #c8d2e6;
  --calc-ink: #3b4663;

  /* Feedback */
  --ok: #1f8a4c;   --ok-bg: #e9f5ee;
  --bad: #c0392b;  --bad-bg: #fbecea;
  --warn: #c2871a; --warn-bg: #fbf2e0;
  --na: #6b7280;

  /* Tipografía */
  --display: 'Inter', system-ui, Arial, sans-serif;  /* títulos, etiquetas */
  --body: 'Lato', system-ui, Arial, sans-serif;       /* cuerpo, datos */

  /* Radios y sombras */
  --r-sm:4px; --r-md:7px; --r-lg:10px; --r-pill:999px;
  --sh-sm: 0 1px 2px rgba(26,39,68,.06), 0 1px 1px rgba(26,39,68,.04);
  --sh-md: 0 4px 14px rgba(26,39,68,.08), 0 1px 3px rgba(26,39,68,.05);
  --focus: 0 0 0 3px rgba(47,90,166,.28);
}
```

Carga las fuentes (en `<head>` de `index.html`):
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap" rel="stylesheet">
```

> El archivo `clauger-app.css` adjunto es la **referencia visual completa**: contiene
> ya escritos todos los componentes (header, tabs, sidebar, campos, checklist,
> equipos, tablas). Cópialo a tu repo y úsalo como guía de estilos a imitar.

---

## 2. Cambios por archivo (en este orden)

### `styles/main.css` — esqueleto
- `body` → fondo `var(--ecru)`, color `var(--ink)`, fuente `var(--body)`.
- `.header` → fondo plano `var(--navy)` (quita el degradado), altura ~58px.
- `.header-btn` → borde `1px solid var(--line)` translúcido sobre navy; un botón principal sólido écru.
- `.tabs-navigation` → fondo `var(--navy)`. Tabs sin fondo; la activa lleva **borde inferior 2px `var(--accent)`** (no degradado).
- `.sidebar` → fondo `var(--surface)` (claro), no oscuro. Ítem activo: fondo `var(--accent-soft)` + borde izquierdo 2px `var(--accent)`.
- `.section-card`, `.section-title` → radios `var(--r-lg)`, sombra `var(--sh-sm)`, títulos en `var(--display)`.

### `styles/forms.css` — campos
- `.form-input` → borde `1px solid var(--line-2)`, radio `var(--r-md)`; foco: `border-color var(--accent)` + `box-shadow var(--focus)`.
- `.form-label` → `var(--display)`, 12px, `var(--ink-2)`.
- **Campo calculado:** crea clase `.is-computed` con `background var(--calc-bg)`, `border:1px dashed var(--calc-line)`, color `var(--calc-ink)`, y una etiqueta "auto". Aplícala a los inputs readonly (periodicidad, próxima revisión, etc.).
- Campos numéricos: `text-align:right; font-variant-numeric:tabular-nums;` y unidad (bar, L, kg) como sufijo.

### `styles/equipment.css` — equipos
- `.equipment-header` → fondo plano `var(--navy)` o blanco con borde izq. `var(--accent)` (quita el degradado azul-morado).
- Cuando esté plegado, muestra una **línea-resumen** (fabricante · modelo · nº serie) bajo el título.
- Cajas Lado A / Lado B → conviértelas en **una tabla comparativa** (parámetros en filas, A y B en columnas). Quita los fondos amarillo/morado.
- Válvulas y presostato → tabla compacta, sin cajas de color.

### `styles/checklist.css` — checklist
- Cabecera de sección con **barra de progreso** + filtros (Todos / OK / No OK / N/A / Pendientes).
- Cada ítem: badge de ID, descripción, **control segmentado OK·No OK·N/A** (verde/rojo/gris).
- Si "No OK", despliega gravedad + corrección debajo. Borde izquierdo de color según estado.

### `styles/login.css` y `photos.css`
- Login: fondo navy plano, botones según tokens.
- Photos: slots con borde discontinuo `var(--line-2)`, sin emojis.

---

## 3. Sustitución de emojis → iconos de línea

Usa SVG de [Lucide](https://lucide.dev) (trazo 1.6, 24×24) o copia los del `clauger-app.css` adjunto.

| Emoji actual | Icono |
|---|---|
| 📄 Datos | `file-text` |
| ✅ Checklist | `clipboard-check` |
| ⚙️ Equipos | `settings` |
| ❄️ Servicios | `snowflake` |
| 🔍 Verificación | `search` |
| 🌡️ Termografía | `thermometer` |
| 📋 Revisión Final | `layout` |
| 💾 / 📂 / 🚪 | `save` / `download` / `log-out` |
| 🗑️ Eliminar | `trash-2` |
| 📷 Foto | `camera` |
| 🟠🟡⚡💬 | quítalos; usa etiquetas de texto |

---

## 4. PDFs (solo CSS, NO cambies qué datos salen)

- **Portada** Informe Final: fondo navy a sangre, logo en blanco, título grande Inter, filete azul `var(--accent)`, pie con datos legales.
- **Páginas de equipo:** cabecera en franja navy con el nombre; ficha en tabla de 2 columnas (etiqueta gris claro / valor); válvulas en tabla compacta; fotos al pie.
- **Divisorias de sección:** página oscura con el número de sección gigante en azul acento + título.

---

## 5. Cómo pedírselo a Claude Code (ejemplo de prompt)

> Lee `design/HANDOFF.md` y `design/clauger-app.css`. Aplica SOLO el punto 2 →
> `styles/main.css` (header, tabs, sidebar). No toques JavaScript ni la estructura
> de datos. Muéstrame el diff antes de aplicar.

Repite cambiando el archivo objetivo en cada sesión.

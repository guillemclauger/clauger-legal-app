# Arreglar el PDF del Informe Final — páginas y portadas

Esta guía resuelve **dos cosas** del generador de PDF (`src/scripts/app.js`):

1. **Páginas en blanco y contenido cortado a la mitad** (lo principal).
2. **Las portadas no se volvieron blancas** con el handoff anterior.

> Pega el **PROMPT** del final en Claude Code. Antes, copia la carpeta
> `imagenes/` de aquí a la carpeta `imagenes/` de tu app (junto a
> `clauger-color.png`). Pide siempre el diff antes de aplicar.

---

## Por qué pasaba (en cristiano)

- **El `about:blank` NO es el problema.** Tu app construye todo el informe como
  una página HTML que se abre en una ventana nueva y desde ahí imprimes. Eso es
  correcto y habitual. El fallo está en el **CSS de impresión**.

- **Páginas en blanco:** el CSS fija la altura de cada hoja en `1123px` y en
  `297mm` exactos. `1123px` equivale a `297,07mm`, un pelín **más** que una hoja
  A4. Chrome empuja ese sobrante a una hoja nueva → sale una página en blanco
  **después de cada página**.

- **Contenido cortado:** las hojas llevan `overflow:hidden` con altura fija. Si
  el contenido pasa de una hoja, se corta o se reparte mal.

- **Las portadas siguieron en navy** porque sus estilos están escritos *dentro*
  de `app.js` (en el texto `SHARED_CSS` y en los `style="..."` de cada portada).
  Un archivo `.css` externo nunca llega a esa ventana emergente, y además los
  `style` en línea ganan a las clases. Hay que editar **dentro de `app.js`**.

---

## La solución de las páginas (lo más importante)

Regla de oro: **nunca fijar `297mm` ni `1123px` exactos**. Usar un poco menos
(`296.6mm`) y dejar que el contenido fluya. Una sola dirección de salto de
página (`después`) y la última página sin salto.

### Cambio 1 — bloque `@media print`

**Busca** este bloque dentro de `SHARED_CSS`:

```css
@media print{
  body{background:#fff}
  .page{margin:0;box-shadow:none;width:210mm;min-height:297mm}
  .page-cover,.page-divider{height:297mm;min-height:297mm}
  .print-bar{display:none}
  .page-break{page-break-before:always}
  tr{page-break-inside:avoid;break-inside:avoid}
  thead{display:table-header-group}
  img{image-rendering:high-quality}
  @page{size:A4;margin:0}
}
```

**Sustitúyelo por** este:

```css
@media print{
  html,body{margin:0;padding:0;background:#fff}
  /* Cada .page = una hoja A4. 296.6mm (NO 297mm, NO 1123px) absorbe el
     redondeo del navegador, que era lo que metía una hoja en blanco
     después de cada página. */
  .page{
    width:210mm;
    min-height:296.6mm;
    box-sizing:border-box;
    margin:0;
    box-shadow:none;
    overflow:visible;            /* no recortar el contenido impreso */
    page-break-after:always;
    break-after:page;
  }
  .page:last-child{page-break-after:avoid;break-after:auto}
  /* Las portadas/divisorias/contraportada sí ocupan una hoja entera y
     nunca deben desbordar: se recortan en vez de crear hoja en blanco. */
  .page-cover,.page-divider,.page-back{min-height:296.6mm;overflow:hidden}
  .print-bar{display:none}
  tr,.dcard,.dictamen,.sub-block{page-break-inside:avoid;break-inside:avoid}
  thead{display:table-header-group}
  img{image-rendering:high-quality}
  @page{size:A4;margin:0}
}
```

### Cambio 2 — quitar las alturas fijas en línea

En todo `app.js`, **elimina** los `min-height:1123px` y `height:297mm` que
aparezcan dentro de atributos `style="..."` (en la portada, contraportada y en
las páginas de imágenes tipo
`style="padding:0;overflow:hidden;min-height:1123px"`). Déjalo así:
`style="padding:0;overflow:hidden"`. La regla `.page` de arriba ya pone la
altura correcta.

> Con los Cambios 1 y 2 desaparecen las hojas en blanco y los cortes. Si una
> página de contenido legítimamente no cabe en una hoja, fluirá a la siguiente
> de forma normal (sin hoja en blanco intermedia).

---

## La solución de las portadas blancas (dentro de `app.js`)

### Cambio 3 — variables y logos

En la zona donde se definen los logos:

```js
const LOGO_COLOR = 'imagenes/clauger-color.png';
const LOGO_WHITE = 'imagenes/clauger-logo-white.png';
```

**Añade debajo:**

```js
const LOGO_MACARON       = 'imagenes/clauger-macaron-color.png';
const LOGO_MACARON_FAINT = 'imagenes/clauger-macaron-faint.png';
```

En `:root` de `SHARED_CSS`, **añade** la variable del rojo de marca (al final,
antes del `}`):  `;--rouge:#d32525`

### Cambio 4 — fondos de portada

**Busca:**

```css
.page-cover{background:var(--navy);color:#fff}
.page-divider{background:var(--navy);color:#fff;align-items:flex-start}
```

**Sustituye por:**

```css
.page-cover{background:#fff;color:var(--ink)}
.page-divider{background:#fff;color:var(--ink);align-items:flex-start}
.page-back{background:#fff;color:var(--ink)}
```

### Cambio 5 — PORTADA

Reemplaza todo el bloque que empieza en `<!-- ══ PORTADA ══ -->` (la `<div>`
con clase `page page-cover` y todo su contenido) por el de
`snippets/portada.html`.

### Cambio 6 — DIVISORIAS

Reemplaza la función `const divider = (num, title, desc='') => ...` por la de
`snippets/divider.js`.

### Cambio 7 — CONTRAPORTADA

Reemplaza todo el bloque `<!-- ══ CONTRAPORTADA ══ -->` por el de
`snippets/contraportada.html`. (Ahora usa la clase `page-back` y el logo a
color sobre blanco.)

> El **índice** ya existe como página propia en tu `app.js` y se queda igual;
> solo cambia a fondo blanco automáticamente porque ya no es `page-cover`.

---

## Sobre "¿se puede pasar a PDF más directamente?"

- Lo que tienes (ventana nueva + *Imprimir → Guardar como PDF*) es válido y es
  lo que usa la mayoría de apps sin servidor. Tras los Cambios 1–2 funcionará
  bien.
- **Mejora opcional** (si quieres evitar el `about:blank` y el bloqueo de
  ventanas emergentes): en vez de `window.open`, renderiza el informe en un
  `<iframe>` oculto dentro de la misma página y llama a
  `iframe.contentWindow.print()`. Mismo resultado, sin ventana aparte.
- Un PDF "de verdad" generado en el navegador (sin diálogo de impresión)
  necesitaría una librería pesada y suele dar peor calidad tipográfica que
  *Imprimir → PDF*. **No lo recomiendo** para este caso.
- Truco al imprimir: en el diálogo de Chrome, **Márgenes: Ninguno** y
  **Gráficos de fondo: activado**.

---

## PROMPT para Claude Code

```
Trabaja solo en src/scripts/app.js (generador del Informe Final). NO cambies
lógica, nombres de campos, IDs ni qué datos salen. Muéstrame el diff antes de
aplicar cada cambio.

Tienes en design/ los archivos de referencia (LEER... .md y la carpeta
snippets/). Copia design/imagenes/* a la carpeta imagenes/ de la app.

Aplica en este orden:

1) PÁGINAS (lo primero): sustituye el bloque @media print de SHARED_CSS por el
   "Cambio 1" del .md. Luego elimina todos los min-height:1123px y height:297mm
   que estén en atributos style="..." en línea (Cambio 2). Objetivo: que cada
   <div class="page"> sea exactamente una hoja A4, sin páginas en blanco ni
   contenido cortado.

2) PORTADAS BLANCAS: aplica Cambios 3, 4, 5, 6 y 7 del .md usando los archivos
   de snippets/ (portada.html, divider.js, contraportada.html). Las portadas
   deben quedar mayoritariamente blancas, con el logo a color, filete fino
   rojo+azul arriba, título navy y flecha ↘.

Al terminar, abre el informe e imprime con Márgenes: Ninguno y Gráficos de
fondo activados para comprobar que no hay hojas en blanco.
```

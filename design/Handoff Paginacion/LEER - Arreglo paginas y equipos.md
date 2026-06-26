# Arreglar el PDF — hojas en blanco, cortes y mejor distribución de equipos

Tres problemas en `src/scripts/app.js` (función que genera el **Informe Final**,
la del `window.open` + `SHARED_CSS`):

1. **Hojas en blanco entre páginas de imágenes** (Acta, certificados PSV,
   detectores). → FIX A
2. **Cortes raros (p. 22/23) en las fichas de equipos a presión.** → FIX B
3. **Distribución de la ficha de equipo poco aprovechada.** → FIX C (mejora)

> Maqueta del objetivo: `equipos-layout-referencia.html` (ábrela en el navegador).
> Pega el PROMPT del final en Claude Code. Pide el diff antes de aplicar.

---

## Por qué pasa

- **Hojas en blanco (lo más visible en el listado de Acta/certificados):** cada
  página escaneada se mete así:
  `<div class="page page-break" style="padding:0;overflow:hidden"><img style="width:100%;height:100%;object-fit:contain;display:block">`
  Pero la regla de impresión de `.page` es `min-height:296.6mm; overflow:visible`.
  Una imagen con `height:100%` dentro de un contenedor *flex* con `min-height`
  (sin altura fija) calcula unos píxeles de más → desborda el A4 → el navegador
  añade **una hoja en blanco después de cada imagen**. Como hay muchas imágenes
  seguidas, salen muchas hojas en blanco.

- **Cortes raros en equipos:** cada equipo es **una sola** `<div class="page">`
  con identificación + condiciones + válvulas + fotos + imágenes extra. Si todo
  eso mide más que un A4, como la página es `overflow:visible` y además lleva
  `page-break-after:always`, el contenido se parte por la mitad (mitad de una
  tabla o de una foto) y encima fuerza salto → corte feo. Las fotos actuales son
  muy grandes (`.ph .img{height:180px}`, `.img-cell img{height:280px}`), por eso
  el equipo no cabe en una hoja.

---

## FIX A — Páginas de imagen sin hojas en blanco  ★ obligatorio

**1)** En `SHARED_CSS`, junto a `.page-cover/.page-divider/.page-back`, añade:

```css
.page-img{padding:0;align-items:center;justify-content:center}
.page-img img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block}
```

**2)** En el bloque `@media print` de `SHARED_CSS`, añade esta línea
(altura FIJA, no min-height, y recorta lo que sobre):

```css
.page-img{height:296.6mm;min-height:0;overflow:hidden}
```

**3)** Cambia las **tres** plantillas de página-imagen. Busca este patrón
(aparece en Acta, Cert. Válvulas PSV y Detectores):

```js
`<div class="page page-break" style="padding:0;overflow:hidden"><img src="${img}" style="width:100%;height:100%;object-fit:contain;display:block"></div>`
```

y déjalo así (clase nueva, sin estilos en línea de tamaño):

```js
`<div class="page page-break page-img"><img src="${img}"></div>`
```

> Con esto la imagen se centra y nunca desborda → desaparecen las hojas en blanco.

---

## FIX B — Que no se corten las fichas de equipo  ★ obligatorio

En el bloque `@media print` de `SHARED_CSS`, añade:

```css
.blk,.spec,.photos,.note,table.tbl{page-break-inside:avoid;break-inside:avoid}
```

Y reduce el tamaño de las fotos (en `SHARED_CSS`, fuera del @media):

```css
.ph .img{height:150px}            /* antes 180px */
.img-cell img{height:200px}       /* antes 280px */
```

> Así, si un equipo no cabe, el salto ocurre **entre bloques** (nunca a mitad de
> una tabla o foto) y, al ser las fotos más pequeñas, casi siempre cabe entero
> en una hoja.

---

## FIX C — Mejor distribución de la ficha de equipo (recomendado)

Objetivo: identificación y condiciones en **dos columnas**, y las fotos en una
**tira compacta** abajo. Es lo que muestra `equipos-layout-referencia.html`.

En `SHARED_CSS` añade/ajusta:

```css
/* dos columnas para identificación + condiciones */
.eq-cols{display:grid;grid-template-columns:1fr 1fr;gap:30px}
/* tira de fotos compacta a 3 (ó 2) columnas */
.photos{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.photos.dos{grid-template-columns:1fr 1fr}
.ph .img{height:150px}
```

En la función `renderEquip` (dentro de `equipHtml`), envuelve la
identificación y las condiciones en el contenedor de dos columnas. Es decir,
donde hoy se concatena:

```js
`...${identHtml}${condHtml}${obsHtml}${valvHtml}${photosHtml}${extraHtml}`
```

cámbialo por:

```js
`...
<div class="eq-cols">${identHtml}${condHtml||''}</div>
${valvHtml}${obsHtml}${photosHtml}${extraHtml}`
```

(Si un equipo no tiene `condHtml`, la columna izquierda ocupa el ancho; déjalo
como está, funciona igual.)

> No cambies los datos ni los nombres de campo: solo el envoltorio visual.

---

## Sobre el `about:blank` al imprimir

El `window.open` + *Imprimir → Guardar como PDF* **no es el problema** y es un
método válido. Con los FIX A y B desaparecen blancos y cortes. Si en algún
momento quieres evitar la ventana emergente, la única alternativa limpia es
renderizar el mismo HTML en un `<iframe>` oculto y llamar a
`iframe.contentWindow.print()` — mismo resultado, sin ventana aparte. No hace
falta para resolver esto.

Al imprimir: **Márgenes: Ninguno** y **Gráficos de fondo: activado**.

---

## PROMPT para Claude Code

```
Lee design/Handoff Paginacion/LEER - Arreglo paginas y equipos.md y trabaja SOLO
en src/scripts/app.js, en la función que genera el Informe Final (la del
window.open con SHARED_CSS). NO cambies lógica, nombres de campos, IDs ni qué
datos salen. Muéstrame el diff antes de aplicar cada cambio.

Aplica en este orden:

1) FIX A (obligatorio): añade la clase .page-img en SHARED_CSS (versión pantalla
   y dentro de @media print con height:296.6mm fijo) y cambia las TRES plantillas
   de página-imagen (Acta, Cert. Válvulas PSV, Detectores) por
   <div class="page page-break page-img"><img src="${img}"></div>.
   Objetivo: que NO aparezcan hojas en blanco entre páginas escaneadas.

2) FIX B (obligatorio): en @media print añade
   .blk,.spec,.photos,.note,table.tbl{page-break-inside:avoid;break-inside:avoid}
   y reduce .ph .img a 150px y .img-cell img a 200px. Objetivo: que las fichas de
   equipo no se corten a mitad de tabla/foto.

3) FIX C (mejora): en renderEquip, coloca identificación y condiciones en un
   contenedor .eq-cols (dos columnas) y deja las fotos en .photos (tira de 3),
   tal como muestra design/Handoff Paginacion/equipos-layout-referencia.html.

Al terminar, abre el Informe Final, imprime con Márgenes: Ninguno y Gráficos de
fondo activados, y revisa las páginas de Acta/certificados (sin blancos) y las de
equipos (sin cortes).
```

# Guías de examen — reglas de trabajo

Sitio estático (HTML) de guías de estudio + exámenes interactivos para primaria.
Se despliega a Vercel desde `jgarciab2/guias-examen`, rama `master`.

## Estructura
- Un archivo HTML por página: `index.html` (portal), `examen.html` (Ética/Humano),
  `saberes.html`, `lenguajes.html`. Todo inline: `<style>` y `<script>` dentro del HTML.
- Sin build, sin dependencias externas, sin frameworks. Solo HTML/CSS/JS nativo.
- Código compartido en un archivo propio en vez de duplicar (ej. `fiesta.js`). Se carga con `<script src>`.

## Rutas (parámetros de URL)
- Materia: `examen.html?m=<clave>` (ej. `etica4a`, `etica4b`, `etica4c`).
- Grado: `saberes.html?g=<n>`, `lenguajes.html?g=<n>`, `index.html?g=<n>`.
- El link "Menú de materias" del pie debe regresar al **grado del que vino**: `index.html?g=<n>`.

## Banco de preguntas
- Tipos: opción múltiple (`mc`, con radio buttons) y relacionar (`match`).
- Preguntas **directas**: "¿Qué es la prevención de riesgos?" — nunca "Elige la opción correcta sobre X:".
- Las etiquetas de tema son concretas, sin prefijo "Elige la correcta ·".
- Al reformular, **no cambies el índice de respuesta** (`ans`).
- **Regla: cada examen nuevo se genera en 3 versiones** (Examen 1/2/3, sufijos de clave a/b/c),
  con **guía de estudio compartida** y preguntas distintas que cubren los mismos temas.
  En el portal se agrupan en una sola tarjeta desplegable.
- **No** colorear las parejas en "relacionar" — se rechazó (relleno y bordes). Dejar el estilo original.

## Portal (index.html)
- Botones de grado, **sin dropdown**.
- Materia con variantes: una sola tarjeta que se despliega con `<details>` nativo (sin JS de toggle).
- Materia sin variantes: link directo.

## Estilo
- Tokens de color en `:root`; tema oscuro bajo `@media (prefers-color-scheme: dark)`.
- Respetar `prefers-reduced-motion`.
- Al terminar cualquier examen: celebración de `fiesta()` (confeti + globos reventables).

## Verificación
- `file://` está bloqueado en el navegador de pruebas → servir con `python -m http.server <puerto>` y abrir `localhost`.
- `node --check archivo.html` no aplica; validar JS extrayendo el `<script>` o con `node --check` sobre `.js`.
- El 404 de `favicon.ico` del servidor local es benigno.

## Git
- Trabajamos en local. **No hacer push salvo que se pida explícitamente.**
- Los mensajes de commit terminan con la línea `Co-Authored-By` indicada en la sesión.

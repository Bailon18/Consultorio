# Umbrales — Contexto del proyecto (para IA / handoff)

Sitio web estático de **Umbrales**, espacio de psicoterapia clínica de la **Lic. Carmen Valenzuela Avalos** (San Isidro, Lima, Perú).

Este documento resume stack, estructura, decisiones de marca/UX y pendientes para continuar el trabajo en otra sesión o con otra IA **sin reinventar**.

---

## Stack

| Pieza | Detalle |
|--------|---------|
| Framework | **Astro 4** (salida estática) |
| Estilos | **Tailwind 3** + CSS propio en `src/styles/global.css` |
| Hosting | **Vercel** (gratis). Dominio propio pendiente de compra/conexión |
| i18n | Cliente: `public/js/i18n.js` (`es` / `en`) + `data-i18n` en HTML |
| Config editable | `public/js/config.js` (WhatsApp, email, FormSubmit, redes, precio) |
| Lógica UI | `public/js/main.js` (menú, WA widget, tabs, formulario, to-top, reveal) |

Comandos:

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

Repo GitHub (histórico): `https://github.com/Bailon18/Consultorio.git` (rama `main`).

---

## Estructura relevante

```
src/
  layouts/BaseLayout.astro   # meta SEO, schema.org, OG, sprite SVG de iconos
  pages/index.astro          # página única (portada + sobre + tabs)
  styles/global.css          # paleta, layout, tabs, WA, responsive
public/
  js/config.js
  js/i18n.js
  js/main.js
  images/
    umbrales-mark.png        # header: emblema + Umbrales (PNG transparente)
    umbrales-logo-hero.png   # portada: logo completo con Lic. (PNG transparente)
    carmen-bw-cutout.png     # Sobre Carmen (recorte B/N)
    carmen-bw-cutout.webp    # misma foto WebP
```

No hay backend propio. Formulario → **FormSubmit** AJAX.

---

## Marca y paleta

- **Marca:** Umbrales (no solo “Carmen Valenzuela” como marca principal).
- **Colores:** verde bosque `#2F4B45`, terracota `#C77758`, marfil/crema `#F6F2EA`.
- **Tipografías:** Fraunces (display) + Outfit (body), Google Fonts.
- **Título SEO:** `Umbrales | Psicología y psicoterapia en San Isidro, Lima`
- **Colegiatura:** CPsP. 46485  
- **Dirección:** Av. Pezet 1449 (3.er piso), San Isidro, Lima  
- **WhatsApp:** +51 949 722 086 (`51949722086`)  
- **Email público:** `contacto@carmenvalenzuela.pe`  
- **Honorarios:** S/ 120 (tarifa estándar) + política de honorarios escalonados  

### Logos (decisión vigente)

| Uso | Archivo | Contenido |
|-----|---------|-----------|
| Header | `umbrales-mark.png` | Emblema + Umbrales |
| Portada | `umbrales-logo-hero.png` | Emblema + Umbrales + ESPACIO DE PSICOTERAPIA CLÍNICA + **Lic. Carmen Valenzuela Avalos** |
| Ambos | PNG **sin fondo** (transparente); no deben verse como “cuadro” crema |

---

## Arquitectura de la página (pedida por Carmen)

1. **Portada compacta**
   - Logo Umbrales primero (visual).
   - Frase citada (lema): *“Un espacio para detenerse, comprender y atravesar lo que cambia.”* + atribución *por Carmen Valenzuela — Psicóloga Clínica y Psicoterapeuta* (diseño de **cita** con comillas tipográficas; el `<h1>` envuelve la frase por SEO, pero Carmen no es diseñadora: interpretamos su “H1” como mensaje principal).
   - Párrafo “Umbrales nace…”.
2. **Sobre Carmen** (foto B/N cutout) + bio + formación profesional.
3. **Resto en pestañas** (`#explorar`):
   - a) **¿En qué puedo ayudarte?** (Psicoterapia, Evaluaciones, Umbrales en Comunidad)
   - b) **Cómo atendemos** (Presencial + mapa, Virtual, 50 min, Honorarios)
   - c) **Agendar un encuentro** (3 pasos + WhatsApp + correo + redes)
   - d) **Contacto** (WhatsApp, email, IG, FB, LinkedIn + formulario)

**Retirado a pedido de Carmen:** motivos frecuentes de consulta y sección “enfoque terapéutico” como bloque aparte (ya sintetizado en Sobre Carmen / servicios).

---

## UX / widgets ya implementados

- Widget WhatsApp: FAB → panel tipo chat → “Abrir chat”; teaser “¿Conversamos?”.
- Botón “volver arriba” (se oculta si el panel WA está abierto).
- Tabs JS (`data-tab` / `data-panel`) + enlaces del menú que abren tab y hacen scroll a `#explorar`.
- Formulario con honeypot, estados enviando/éxito/error, FormSubmit.
- Iconos: sprite SVG inline en `BaseLayout` (no Font Awesome CDN).
- Animaciones reveal / hero-in; `prefers-reduced-motion` respetado.

---

## Formulario / correo

- Endpoint de **prueba** en `config.js`:  
  `https://formsubmit.co/ajax/paucarmontesbailon@gmail.com`  
  (cuenta de prueba del desarrollador; FormSubmit ya se activó al menos una vez).
- **Producción:** cambiar a correo real de Carmen y, idealmente, endpoint con **hash** de FormSubmit (oculta el email en el front).
- FormSubmit free: envíos ilimitados; remitente `submissions@formsubmit.co`.

---

## Dominio / hosting

- Vercel sirve en `*.vercel.app` hasta conectar dominio.
- Dominio propio: comprar (`.pe` en Punto.pe o `.com` en Namecheap/Cloudflare) → Vercel → Settings → Domains → DNS.
- Cuando haya dominio definitivo: actualizar `canonical`, `og:url`, schema y `CV_CONFIG.domain` / email si aplica.

---

## Convenciones para quien edite (humano o IA)

1. **No reinventar la marca:** Umbrales primero; Carmen es la profesional detrás.
2. **Textos:** preferir actualizar `public/js/i18n.js` (ES y EN) y HTML con `data-i18n`.
3. **Datos de contacto/precio:** `public/js/config.js`.
4. **Estilos de marca/layout:** `src/styles/global.css` (más que utilidades Tailwind sueltas).
5. **No volver a meter** Font Awesome CDN ni secciones “motivos” / “enfoque” sin pedirlo.
6. **Logos:** no regenerar a ciegas; la portada lleva **Lic.**; el header es corto; siempre preferir PNG transparente.
7. Carmen puede pedir “H1”, “pestañas”, etc. sin jerga técnica: **interpretar intención de diseño**, no solo la etiqueta HTML literal.
8. Respuestas al dueño del repo suelen pedirse en **español** y cortas, salvo que pida detalle.
9. **No subir a GitHub ni commits** salvo petición explícita.
10. Evitar “hacer de más” (extras SEO/UX no pedidos) sin confirmar.

---

## Pendiente / mejoras posibles

- [ ] Cambiar `formEndpoint` al correo/hash definitivo de producción.
- [ ] Conectar dominio propio en Vercel + actualizar URLs canónicas/schema.
- [ ] Analytics (GTM / GA4 / Meta Pixel) vía `config.js` (campos vacíos).
- [ ] Revisar textos legales con asesoría (aviso de privacidad marcado como preliminar en el pasado).
- [ ] Opcional: logo vectorial SVG para nitidez infinita; favicon del emblema.
- [ ] Opcional: testimonios (`enableTestimonials` existe en config, hoy `false`).

---

## Contacto del desarrollador (contexto)

Trabajo local reciente en Windows; a veces `node`/`npm` no están en PATH y se usó el Node embebido de Cursor para builds. Preferir terminal con Node instalado normalmente.

Última limpieza: se eliminaron `_legacy/`, `images/` raíz, `scripts/`, fotos originales y logos duplicados no referenciados.

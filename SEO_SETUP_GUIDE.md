# Guía de Configuración SEO para Qwilo

## ✅ Cambios Implementados

### 1. Sitemap XML Dinámico
- ✅ Instalado `next-sitemap`
- ✅ Configurado `next-sitemap.config.js`
- ✅ Creado sitemap dinámico que se genera automáticamente en cada build
- ✅ Incluye páginas estáticas y dinámicas (blog, productos) desde Strapi

### 2. Robots.txt
- ✅ Creado `/public/robots.txt` optimizado
- ✅ Permite indexación de todas las páginas públicas
- ✅ Bloquea directorios privados (/api/, /admin/)
- ✅ Incluye referencias a sitemaps

### 3. Metadatos SEO Mejorados
- ✅ Keywords por defecto: "agencia IA", "automatización", "agente WhatsApp", "chatbot IA", etc.
- ✅ URLs canónicas para evitar contenido duplicado
- ✅ Meta tags completos para Google, Open Graph y Twitter
- ✅ Configuración de robots para mejor indexación

### 4. Datos Estructurados (Schema.org)
- ✅ Implementado JSON-LD para Organization
- ✅ Implementado JSON-LD para WebSite
- ✅ Soporte para Article y Product (listo para blog/productos)
- ✅ Mejora la aparición en rich snippets de Google

---

## 🚀 Pasos Siguientes: Registro en Google

### Paso 1: Despliega los Cambios

```bash
cd /home/koros2/Qwilo/qwilo-website/next
npm run build
# Despliega a producción (Vercel, Netlify, etc.)
```

### Paso 2: Google Search Console

1. **Accede a Google Search Console**
   - Ve a: https://search.google.com/search-console
   - Inicia sesión con tu cuenta de Google

2. **Agrega tu Propiedad**
   - Haz clic en "Agregar propiedad"
   - Selecciona "Prefijo de URL"
   - Ingresa: `https://qwilo.es`

3. **Verifica la Propiedad**

   **Método 1: Archivo HTML** (Recomendado)
   - Google te dará un archivo HTML para descargar
   - Sube ese archivo a `/home/koros2/Qwilo/qwilo-website/next/public/`
   - Accesible en: `https://qwilo.es/google-verification-file.html`
   - Haz clic en "Verificar"

   **Método 2: Meta Tag**
   - Copia el meta tag que Google te proporciona
   - Agrégalo en `app/layout.tsx` dentro del `<head>`

   **Método 3: DNS** (Si tienes acceso al DNS)
   - Agrega el registro TXT que Google te proporciona en tu proveedor de DNS

4. **Envía el Sitemap**
   - Una vez verificada, ve a "Sitemaps" en el menú lateral
   - Agrega estas URLs:
     - `https://qwilo.es/sitemap.xml`
     - `https://qwilo.es/server-sitemap.xml`
   - Haz clic en "Enviar"

5. **Solicita Indexación Manual** (Opcional pero recomendado)
   - Ve a "Inspección de URLs"
   - Ingresa: `https://qwilo.es`
   - Haz clic en "Solicitar indexación"
   - Repite para tus páginas principales:
     - `https://qwilo.es/products`
     - `https://qwilo.es/blog`

### Paso 3: Google Analytics (Opcional pero Recomendado)

1. **Crea una propiedad en Google Analytics**
   - Ve a: https://analytics.google.com
   - Crea una cuenta y propiedad para `qwilo.es`

2. **Obtén el Tracking ID**
   - Copia el ID de medición (ej: `G-XXXXXXXXXX`)

3. **Agrega el script a tu web**
   - Edita `app/layout.tsx` y agrega el script de Google Analytics en el `<head>`

```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Paso 4: Google My Business (Opcional)

Si Qwilo tiene ubicación física o quieres aparecer en Google Maps:
1. Ve a: https://business.google.com
2. Crea un perfil de empresa
3. Completa toda la información
4. Verifica la empresa (por teléfono o correo postal)

---

## 📊 Optimizaciones Adicionales

### 1. Velocidad de Página
```bash
# Analiza el rendimiento en:
# https://pagespeed.web.dev/
# Ingresa: https://qwilo.es
```

### 2. Enlaces Internos
- Asegúrate de tener enlaces entre páginas relacionadas
- Usa anchor text descriptivo ("automatización con IA" en vez de "haz clic aquí")

### 3. Contenido de Calidad
- Blog posts regulares sobre IA, automatización, WhatsApp Business
- Casos de uso y testimonios
- FAQs relevantes

### 4. Backlinks
- Directorios de empresas tech en España
- Guest posts en blogs de tecnología/marketing
- Colaboraciones con partners
- Redes sociales activas

### 5. Performance
```bash
# Optimiza imágenes
npm install --save-dev @next/bundle-analyzer

# Agrega en next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
```

---

## 🎯 Keywords Target

Ya implementadas en los metadatos:
- ✅ agencia IA
- ✅ automatización
- ✅ agente WhatsApp
- ✅ chatbot IA
- ✅ automatización ventas
- ✅ inteligencia artificial
- ✅ marketing automation
- ✅ asistente virtual
- ✅ chatbot WhatsApp
- ✅ IA empresas

### Keywords Adicionales para Contenido
- automatización WhatsApp Business
- bot conversacional español
- agencia automatización España
- CRM automatizado
- lead generation automation
- AI sales assistant
- conversational AI
- WhatsApp API business

---

## 📈 Monitoreo

### Herramientas Recomendadas
1. **Google Search Console** - Posicionamiento y errores
2. **Google Analytics** - Tráfico y comportamiento
3. **Semrush / Ahrefs** - Análisis de keywords y competencia
4. **Ubersuggest** - Alternativa gratuita

### KPIs a Monitorear
- Impresiones en búsqueda
- CTR (Click-Through Rate)
- Posición promedio
- Páginas indexadas
- Errores de rastreo
- Core Web Vitals

---

## ⚠️ Problemas Comunes

### "Mi sitio no aparece en Google"
- **Espera**: Puede tomar 1-4 semanas para indexación inicial
- **Verifica**: `site:qwilo.es` en Google para ver páginas indexadas
- **Revisa**: Google Search Console para errores

### "Aparece pero muy abajo"
- SEO toma tiempo (3-6 meses para resultados significativos)
- Necesitas contenido regular y backlinks de calidad
- Competencia: analiza qué hacen tus competidores

### Error 500 en producción
- Verifica logs del servidor
- Asegúrate que Strapi esté accesible
- Revisa variables de entorno (NEXT_PUBLIC_API_URL)

---

## 📞 Contacto

Si necesitas ayuda con la configuración, revisa:
- [Documentación Next.js SEO](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Console Help](https://support.google.com/webmasters)
- [Schema.org Documentation](https://schema.org/docs/documents.html)

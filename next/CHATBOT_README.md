# Qwilo Chatbot - Documentación

Chatbot inteligente integrado con Groq AI (Llama 3.3 70B) para la web de Qwilo.

## 📋 Características

### ✅ Funcionalidades Implementadas

- **IA Conversacional**: Powered by Groq (Llama 3.3 70B Versatile)
- **Multi-idioma**: Soporte para EN, ES, CA, FR con detección automática
- **Persistencia**: Historial guardado en localStorage
- **Rate Limiting**: 20 requests/15min por IP con headers estándar
- **Retry Logic**: 3 intentos automáticos en caso de timeout
- **Mobile-First**: Responsive design con soporte táctil
- **Accesibilidad**: ARIA labels, navegación por teclado, focus management
- **Next.js Image**: Optimización automática de imágenes
- **Animaciones**: Framer Motion para UX fluida
- **Error Handling**: Mensajes contextuales y manejo robusto

## 🏗️ Arquitectura

```
/app/api/chat/route.ts        # API Route Handler (backend)
/components/QwiloChatbot.tsx   # Componente React (frontend)
/public/chatbot-logo.png       # Logo del chatbot
.env                            # Variables de entorno
```

## 🚀 Configuración

### Variables de Entorno Requeridas

```bash
# .env
GROQ_API_KEY=gsk_...                     # API key de Groq
ALLOWED_ORIGINS=https://qwilo.es         # Dominios permitidos (producción)
NODE_ENV=production                       # Entorno
```

### Instalación

El chatbot ya está integrado en el layout principal:

```tsx
// app/layout.tsx
import QwiloChatbot from '@/components/QwiloChatbot';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <QwiloChatbot />  {/* ← Ya integrado */}
      </body>
    </html>
  );
}
```

## 📖 Uso

### Para Usuarios

1. Click en el botón flotante (esquina inferior derecha)
2. Escribe tu pregunta
3. El chatbot responde en tu idioma
4. Historial se guarda automáticamente

### Cambiar Idioma

- Click en la bandera circular en el header
- Selecciona idioma del dropdown
- La preferencia se guarda en localStorage

### Reset Conversación

- Click en el icono de reset (🔄) en el header
- Confirma la acción
- Se borra todo el historial

## 🔧 Personalización

### Modificar el Prompt del Sistema

```typescript
// app/api/chat/route.ts
const SYSTEM_PROMPT = `You are a friendly customer support agent for Qwilo...

  MODIFICAR AQUÍ:
  - Añadir servicios específicos
  - Ajustar tono de voz
  - Actualizar información de empresa
`;
```

### Añadir Nuevo Idioma

```typescript
// components/QwiloChatbot.tsx

const translations: Record<string, Translation> = {
  // ... idiomas existentes
  pt: {  // ← Nuevo idioma
    title: 'Chat com Qwilo',
    placeholder: 'Digite sua mensagem...',
    welcomeMessage: 'Olá! Sou seu assistente Qwilo...',
    quickReplies: ['...']
  }
};

const flagUrls: Record<string, string> = {
  // ...
  pt: 'https://flagcdn.com/w40/pt.png'  // ← Añadir bandera
};
```

### Cambiar Rate Limiting

```typescript
// app/api/chat/route.ts

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,  // ← Cambiar ventana de tiempo
  max: 20,                    // ← Cambiar límite de requests
};
```

### Personalizar Quick Replies

```typescript
// components/QwiloChatbot.tsx

const translations = {
  en: {
    // ...
    quickReplies: [
      'Tell me about your services',     // ← Modificar
      'Pricing information',
      'Book a demo',                     // ← Añadir nuevas
    ]
  }
};
```

## 📊 Analytics (Pendiente)

Para añadir tracking de eventos:

```typescript
// components/QwiloChatbot.tsx

const sendMessage = async () => {
  // Track evento
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'chatbot_message_sent', {
      language: currentLanguage,
      session_id: sessionId,
    });
  }

  // ... resto del código
};
```

## 🐛 Troubleshooting

### El chatbot no responde

1. Verificar que `GROQ_API_KEY` esté configurada
2. Check logs del servidor: `npm run dev`
3. Verificar rate limiting en browser console

### Error de CORS

1. Añadir dominio a `ALLOWED_ORIGINS` en `.env`
2. Reiniciar servidor

### Mensajes no se guardan

1. Verificar que localStorage esté habilitado
2. Check browser console para errores
3. Probar en modo incógnito

### Rate limit alcanzado

- Esperar 15 minutos
- O ajustar límites en `route.ts`

## 🔐 Seguridad

### ✅ Implementado

- Rate limiting por IP
- Input validation (max 500 chars)
- Sanitización de inputs
- CORS configurado
- API key en backend (no expuesta)
- Timeout de requests (30s)

### ⚠️ Recomendaciones Producción

1. **Redis para Rate Limiting**: Reemplazar Map in-memory
2. **CAPTCHA**: Si hay abuso de bots
3. **Logging**: Implementar Sentry o LogRocket
4. **SSL**: Asegurar HTTPS en producción
5. **Monitoring**: Configurar alertas de uptime

## 📱 Compatibilidad

### Navegadores Soportados

- ✅ Chrome/Edge (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Android (últimas 2 versiones)

### Dispositivos Probados

- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

## 🚀 Deployment

### Pre-Deploy Checklist

- [ ] Configurar `GROQ_API_KEY` en plataforma de hosting
- [ ] Actualizar `ALLOWED_ORIGINS` con dominios de producción
- [ ] Verificar `NODE_ENV=production`
- [ ] Test completo en staging
- [ ] Lighthouse score > 90

### Vercel Deployment

```bash
# 1. Configurar variables de entorno en Vercel Dashboard
GROQ_API_KEY=gsk_...
ALLOWED_ORIGINS=https://qwilo.es,https://www.qwilo.es
NODE_ENV=production

# 2. Deploy
vercel --prod
```

## 📈 Métricas a Monitorear

- Conversaciones iniciadas/día
- Mensajes enviados/conversación (promedio)
- Tasa de error de API
- Tiempo de respuesta (p95, p99)
- Rate limit hits/día
- Idiomas más usados

## 🔄 Mantenimiento

### Actualizar Modelo de IA

```typescript
// app/api/chat/route.ts

body: JSON.stringify({
  model: 'llama-3.3-70b-versatile',  // ← Cambiar modelo aquí
  // ...
})
```

### Limpiar LocalStorage Antiguo

```typescript
// Añadir en useEffect inicial
const lastCleanup = localStorage.getItem('qwilo_last_cleanup');
const now = Date.now();
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

if (!lastCleanup || now - parseInt(lastCleanup) > WEEK_MS) {
  // Limpiar datos antiguos
  localStorage.setItem('qwilo_last_cleanup', now.toString());
}
```

## 📞 Soporte

Para issues o preguntas:
- GitHub Issues: [qwilo-website/issues]
- Email: dev@qwilo.es

---

**Última actualización**: 2025-10-06
**Versión**: 1.0.0

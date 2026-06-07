# 🌿 PlantArt — Scrum Dashboard

Dashboard de seguimiento Scrum para el proyecto **App-Plantart** (Software de Paisajismo).
Completamente aislado — no toca la app de producción.

## 🚀 Deploy en Vercel

1. Entra a [vercel.com/new](https://vercel.com/new)
2. Importa el repo `jpgutif-cloud/plantart-scrum-dashboard`
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy** — listo.

Cada `git push` a `main` redeploya automáticamente.

## 📊 Cómo actualizar el avance

Edita el array `STORIES` en `src/pages/ScrumDashboard.jsx`.

Cambia el `status` de la story completada:

```js
// Antes
{ id: 'US-017', status: 'in-progress', ... }

// Después de completar
{ id: 'US-017', status: 'done', commits: ['fix: production hardening applied'] }
```

Haz `git commit + push` y Vercel actualiza el dashboard en ~30 segundos.

## 🗒 Estados disponibles

| Status | Significado |
|--------|-------------|
| `done` | Completado y en producción |
| `in-progress` | En desarrollo activo |
| `pending` | Por iniciar |
| `blocked` | Bloqueado por dependencia |

## 🔗 Repos relacionados

- App principal: [jpgutif-cloud/App-Plantart](https://github.com/jpgutif-cloud/App-Plantart) (privado)
- Este dashboard: [jpgutif-cloud/plantart-scrum-dashboard](https://github.com/jpgutif-cloud/plantart-scrum-dashboard)

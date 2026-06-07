import { useState, useMemo } from 'react';

// ─────────────────────────────────────────────
//  DATA: extraída de auditorías y docs del repo
//  Fuentes: CAMBIOS_100_PRODUCCION, STABILIZATION_BUG_REPORT,
//           SUPERVISOR_GAP_ANALYSIS, AUDIT_REPORT, USER_STORIES
// ─────────────────────────────────────────────
const LAST_UPDATED = '2026-06-06';

const SPRINTS = [
  {
    id: 'sprint-1',
    name: 'Sprint 1 — Core MVP',
    period: 'Feb 2026',
    status: 'done',
    completionPct: 100,
    goal: 'Módulos base: Auth, Actividades, Dashboard, OTs, Incidencias, Informes, Mobile.'
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2 — Estabilización',
    period: 'Feb 17, 2026',
    status: 'done',
    completionPct: 100,
    goal: 'Hardening beta→operación estable. Fix 5 bugs críticos. Gap Analysis Supervisor FSM.'
  },
  {
    id: 'sprint-3',
    name: 'Sprint 3 — Enterprise & Offline',
    period: 'Mar–May 2026',
    status: 'in-progress',
    completionPct: 55,
    goal: 'Offline-first, modelo enterprise multi-tenant, migraciones SQL en producción.'
  },
  {
    id: 'sprint-4',
    name: 'Sprint 4 — Producción 100/100',
    period: 'Jun 2026',
    status: 'pending',
    completionPct: 0,
    goal: 'EDP/MUT, seguridad server-side, Lighthouse 90+, E2E completo, CI/CD, exportación PDF.'
  },
];

const STORIES = [
  // ═══════════════════════════════════════════
  //  SPRINT 1 — DONE
  // ═══════════════════════════════════════════
  {
    id: 'US-001', epic: 'Core', sprint: 'sprint-1',
    title: 'Login & autenticación por rol',
    description: 'Admin, Supervisor y Jardinero con acceso diferenciado y scope por proyecto.',
    status: 'done', priority: 'critical', points: 8,
    commits: ['feat: role-based routing', 'fix: scope auth recovery'],
  },
  {
    id: 'US-002', epic: 'Planificación', sprint: 'sprint-1',
    title: 'Módulo de Actividades (desktop)',
    description: 'CRUD completo. Copiar semana anterior con loading state y recovery de scope.',
    status: 'done', priority: 'critical', points: 13,
    commits: ['feat: activities module', 'fix: copy week button loading state', 'fix: scope recovery activities'],
  },
  {
    id: 'US-003', epic: 'Planificación', sprint: 'sprint-1',
    title: 'Calendario de actividades',
    description: 'Vista calendario con CTA Nueva Actividad Extra in-place desde ActivitiesCalendar.',
    status: 'done', priority: 'high', points: 8,
    commits: ['feat: calendar view', 'fix: extra activity CTA in calendar'],
  },
  {
    id: 'US-004', epic: 'Dashboard', sprint: 'sprint-1',
    title: 'Dashboard Admin — KPIs y tareas del día',
    description: 'Toggle checklist, métricas diarias con fecha local, acceso rápido a OTs.',
    status: 'done', priority: 'critical', points: 13,
    commits: ['feat: dashboard kpis', 'fix: local date calculations replace toISOString'],
  },
  {
    id: 'US-005', epic: 'OTs', sprint: 'sprint-1',
    title: 'Módulo Work Orders (OTs)',
    description: 'Crear y gestionar órdenes de trabajo. Resumen de tareas extra trazables.',
    status: 'done', priority: 'high', points: 8,
    commits: ['feat: work orders', 'fix: double-click protection write ops'],
  },
  {
    id: 'US-006', epic: 'Incidencias', sprint: 'sprint-1',
    title: 'Módulo de Incidencias (desktop + mobile)',
    description: 'Registro con scope por supervisor. Carga de zonas respeta scope del perfil.',
    status: 'done', priority: 'high', points: 8,
    commits: ['feat: incidents module', 'fix: scope recovery incidents desktop+mobile'],
  },
  {
    id: 'US-007', epic: 'Informes', sprint: 'sprint-1',
    title: 'Reportes acumulados Supervisor',
    description: 'Semana/mes/año acumulado con recovery_user_id y restricción legacy sin scope.',
    status: 'done', priority: 'critical', points: 13,
    commits: ['feat: reports accumulated model', 'fix: supervisor scope alignment reports'],
  },
  {
    id: 'US-008', epic: 'Mobile', sprint: 'sprint-1',
    title: 'App Mobile Supervisor (E2E)',
    description: 'MobileActivities, MobileDashboard, MobileIncidents, MobileProfile, MobileTaskDetail, MobileZoneDetail. Scope recovery en todas las vistas.',
    status: 'done', priority: 'critical', points: 21,
    commits: ['feat: mobile supervisor full', 'fix: mobile scope recovery all views', 'fix: mobile date comparisons'],
  },

  // ═══════════════════════════════════════════
  //  SPRINT 2 — DONE
  // ═══════════════════════════════════════════
  {
    id: 'US-009', epic: 'Estabilización', sprint: 'sprint-2',
    title: 'CRIT-001: Crear Actividad Extra no persistía',
    description: 'Causa: violación constraint activities_horario_check. Fix: normalización estricta de horario, payload cross-schema, bloqueo doble envío.',
    status: 'done', priority: 'critical', points: 5,
    commits: ['fix: crit-001 extra activity persist', 'fix: horario constraint normalization'],
  },
  {
    id: 'US-010', epic: 'Estabilización', sprint: 'sprint-2',
    title: 'CRIT-002: Errores 400 en catálogos zones/workers',
    description: 'Causa: filtros enterprise sobre esquema legacy. Fix: lectura base sin filtros server-side + filtrado local seguro.',
    status: 'done', priority: 'critical', points: 3,
    commits: ['fix: crit-002 scope filter catalogs safe read'],
  },
  {
    id: 'US-011', epic: 'Estabilización', sprint: 'sprint-2',
    title: 'CRIT-003/004/005: Anti doble click, error handling y modal zombie',
    description: 'isLoading/isSubmitting + disabled en botones críticos. Utilidad getErrorMessage. Ref estable para new_extra=1.',
    status: 'done', priority: 'high', points: 5,
    commits: ['fix: crit-003 double click locks', 'fix: crit-004 getErrorMessage util', 'fix: crit-005 modal zombie ref stable'],
  },
  {
    id: 'US-012', epic: 'Supervisor', sprint: 'sprint-2',
    title: 'Gap Analysis FSM — CTAs y trazabilidad ad-hoc',
    description: 'CTA Nueva Actividad Extra en Dashboard y Calendario. createAdHocActivity() con mirror en work_order_tasks. Etiqueta trazable created_by/created_at en OTs.',
    status: 'done', priority: 'high', points: 8,
    commits: ['feat: adhoc activity cta dashboard+calendar', 'feat: createAdHocActivity mirror OT'],
  },
  {
    id: 'US-013', epic: 'Supervisor', sprint: 'sprint-2',
    title: 'Validación de conflictos de asignación horaria',
    description: 'getScheduleConflicts() bloquea guardado si cuadrilla/trabajador ya está asignado al mismo bloque.',
    status: 'done', priority: 'high', points: 5,
    commits: ['feat: schedule conflict validation'],
  },

  // ═══════════════════════════════════════════
  //  SPRINT 3 — IN PROGRESS
  // ═══════════════════════════════════════════
  {
    id: 'US-014', epic: 'Offline', sprint: 'sprint-3',
    title: 'Offline-first completo (Service Worker + IndexedDB)',
    description: 'App Shell cacheado, cola IndexedDB con background sync, toggle optimista reversible, dedupe last-write-wins, retry con exponential backoff. Compresión fotos 1024px/300KB.',
    status: 'in-progress', priority: 'high', points: 13,
    commits: ['feat: service worker app shell', 'feat: indexeddb offline queue'],
  },
  {
    id: 'US-015', epic: 'Enterprise', sprint: 'sprint-3',
    title: 'Modelo Enterprise multi-tenant (Supabase)',
    description: 'supabase_enterprise_full_model.sql aplicado. Multi-empresa con scope aislado. Migraciones enterprise_migration + project_enterprise_integrity.',
    status: 'in-progress', priority: 'critical', points: 21,
    commits: ['feat: enterprise model sql migration'],
  },
  {
    id: 'US-016', epic: 'Supervisor', sprint: 'sprint-3',
    title: 'Guardar perfil Supervisor (E2E validado)',
    description: 'Flujo identificado pero pendiente validación con credencial admin. Requiere fix de permisos RLS en Supabase para UPDATE en profiles.',
    status: 'in-progress', priority: 'high', points: 5,
    commits: [],
  },
  {
    id: 'US-017', epic: 'DB', sprint: 'sprint-3',
    title: 'Migraciones SQL críticas en producción',
    description: 'Pendiente aplicar en prod: supabase_supervisor_offline_hardening.sql, supabase_workers_kpis.sql, supabase_production_hardening.sql, supabase_reports_enforcement.sql.',
    status: 'in-progress', priority: 'critical', points: 8,
    commits: ['chore: sql migration scripts added'],
  },

  // ═══════════════════════════════════════════
  //  SPRINT 4 — PENDING
  // ═══════════════════════════════════════════
  {
    id: 'US-018', epic: 'EDP', sprint: 'sprint-4',
    title: 'Módulo EDP/MUT completo en producción',
    description: 'Estado de Pago con flujo de aprobación admin→supervisor. Módulo implementado en código (EDP_MUT_MODULO_IMPLEMENTADO) pero requiere validación E2E en prod.',
    status: 'pending', priority: 'critical', points: 13,
    commits: [],
  },
  {
    id: 'US-019', epic: 'Seguridad', sprint: 'sprint-4',
    title: 'Enforcement server-side permisos Supervisor',
    description: 'Función supervisor_can_manage_activity_workers() + trigger trg_enforce_supervisor_activity_worker_scope en activities. Script: supabase_supervisor_offline_hardening.sql.',
    status: 'pending', priority: 'critical', points: 8,
    commits: [],
  },
  {
    id: 'US-020', epic: 'Producción', sprint: 'sprint-4',
    title: 'Lighthouse Score 90+ en todas las categorías',
    description: 'Performance, Accessibility, Best Practices, SEO. lighthouserc.js ya configurado. Requiere auditoría en URL de producción Vercel.',
    status: 'pending', priority: 'high', points: 5,
    commits: [],
  },
  {
    id: 'US-021', epic: 'Producción', sprint: 'sprint-4',
    title: 'E2E Playwright completo (Admin + Supervisor + Jardinero)',
    description: 'Playwright configurado. Smoke test Supervisor OK (Feb 17). Falta: Admin full flow, Jardinero mobile, Guardar perfil Supervisor con credencial admin.',
    status: 'pending', priority: 'high', points: 8,
    commits: [],
  },
  {
    id: 'US-022', epic: 'Producción', sprint: 'sprint-4',
    title: 'CI/CD GitHub Actions → Vercel automático',
    description: 'Pipeline con gates: npm lint → npm test → npm build → deploy. Block en main si falla cualquier gate.',
    status: 'pending', priority: 'high', points: 5,
    commits: [],
  },
  {
    id: 'US-023', epic: 'Inventario', sprint: 'sprint-4',
    title: 'Módulo Inventario de plantas (UI completa)',
    description: 'SQL base: supabase_plant_inventory_scope.sql. Falta UI con CRUD de inventario, búsqueda por especie, stock mínimo y alertas.',
    status: 'pending', priority: 'medium', points: 13,
    commits: [],
  },
  {
    id: 'US-024', epic: 'Reportes', sprint: 'sprint-4',
    title: 'Exportación PDF/Excel de informes',
    description: 'Reportes exportables para clientes enterprise: Parque Arauco, MUT, PAK. Incluye logo, fechas y firma de responsable.',
    status: 'pending', priority: 'medium', points: 8,
    commits: [],
  },
];

// ─────────────────────────────────────────────
//  CONFIG
// ─────────────────────────────────────────────
const STATUS_CONFIG = {
  done:          { label: 'Done ✅',         bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  col: 'bg-green-500'  },
  'in-progress': { label: 'En Progreso 🔄',  bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300',   col: 'bg-blue-500'   },
  pending:       { label: 'Pendiente ⏳',    bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-gray-300',   col: 'bg-gray-400'   },
  blocked:       { label: 'Bloqueado 🔴',    bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300',    col: 'bg-red-500'    },
};

const PRIORITY_CONFIG = {
  critical: { label: '🔴 Crítico',  bg: 'bg-red-50',    text: 'text-red-700'    },
  high:     { label: '🟠 Alto',     bg: 'bg-orange-50', text: 'text-orange-700' },
  medium:   { label: '🟡 Medio',    bg: 'bg-yellow-50', text: 'text-yellow-700' },
  low:      { label: '🟢 Bajo',     bg: 'bg-green-50',  text: 'text-green-700'  },
};

const EPIC_COLORS = {
  Core:          'bg-purple-100 text-purple-800',
  Planificación: 'bg-blue-100 text-blue-800',
  Dashboard:     'bg-cyan-100 text-cyan-800',
  OTs:           'bg-indigo-100 text-indigo-800',
  Incidencias:   'bg-pink-100 text-pink-800',
  Informes:      'bg-teal-100 text-teal-800',
  Mobile:        'bg-sky-100 text-sky-800',
  Estabilización:'bg-amber-100 text-amber-800',
  Supervisor:    'bg-violet-100 text-violet-800',
  Offline:       'bg-lime-100 text-lime-800',
  Enterprise:    'bg-fuchsia-100 text-fuchsia-800',
  DB:            'bg-rose-100 text-rose-800',
  EDP:           'bg-orange-100 text-orange-800',
  Seguridad:     'bg-red-100 text-red-800',
  Producción:    'bg-green-100 text-green-800',
  Inventario:    'bg-emerald-100 text-emerald-800',
  Reportes:      'bg-yellow-100 text-yellow-800',
};

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
function calcProgress(stories) {
  if (!stories.length) return 0;
  return Math.round((stories.filter(s => s.status === 'done').length / stories.length) * 100);
}

function calcPtsDone(stories) {
  return stories.filter(s => s.status === 'done').reduce((a, s) => a + s.points, 0);
}

// ─────────────────────────────────────────────
//  COMPONENTES
// ─────────────────────────────────────────────
function ProgressBar({ pct, colorClass = 'bg-emerald-500', height = 'h-2.5' }) {
  return (
    <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
      <div
        className={`${colorClass} ${height} rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function Badge({ label, className = '' }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}

function KPICard({ icon, label, value, sub, valueColor = 'text-gray-900' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-1 min-w-0">
      <div className="text-2xl">{icon}</div>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide leading-tight">{label}</p>
      <p className={`text-2xl font-extrabold leading-tight ${valueColor}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 leading-tight">{sub}</p>}
    </div>
  );
}

function StoryCard({ story, expanded, onToggle }) {
  const sc = STATUS_CONFIG[story.status] || STATUS_CONFIG.pending;
  const pc = PRIORITY_CONFIG[story.priority];
  const ec = EPIC_COLORS[story.epic] || 'bg-gray-100 text-gray-700';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => e.key === 'Enter' && onToggle()}
      className={`rounded-xl border-2 ${sc.border} ${sc.bg} p-3.5 cursor-pointer hover:shadow-md transition-shadow select-none`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1 mb-1.5">
            <span className="text-xs font-mono text-gray-400 shrink-0">{story.id}</span>
            <Badge label={story.epic} className={ec} />
            <Badge label={pc.label} className={`${pc.bg} ${pc.text}`} />
          </div>
          <p className={`font-semibold text-sm leading-snug ${sc.text}`}>{story.title}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
          <Badge label={sc.label} className={`${sc.bg} ${sc.text} border ${sc.border}`} />
          <span className="text-xs text-gray-400">{story.points} pts</span>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200/80 space-y-2">
          <p className="text-xs text-gray-600 leading-relaxed">{story.description}</p>
          {story.commits.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1">🔗 Commits:</p>
              <ul className="space-y-0.5">
                {story.commits.map((c, i) => (
                  <li key={i} className="text-xs font-mono text-gray-500 bg-white/60 rounded px-2 py-0.5">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-xs italic text-gray-400">Sin commits — pendiente de implementación.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────
export default function ScrumDashboard() {
  const [activeTab, setActiveTab]     = useState('board');
  const [activeSprint, setActiveSprint] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEpic, setFilterEpic]   = useState('all');
  const [expandedId, setExpandedId]   = useState(null);

  const totalPct    = calcProgress(STORIES);
  const ptsDone     = calcPtsDone(STORIES);
  const totalPts    = STORIES.reduce((a, s) => a + s.points, 0);
  const doneCount   = STORIES.filter(s => s.status === 'done').length;
  const inProgCount = STORIES.filter(s => s.status === 'in-progress').length;
  const pendCount   = STORIES.filter(s => s.status === 'pending').length;
  const critPend    = STORIES.filter(s => s.status !== 'done' && s.priority === 'critical').length;

  const epics = useMemo(() => [...new Set(STORIES.map(s => s.epic))], []);

  const filtered = useMemo(() => STORIES.filter(s => {
    const mSprint = activeSprint === 'all' || s.sprint === activeSprint;
    const mStatus = filterStatus === 'all' || s.status === filterStatus;
    const mEpic   = filterEpic   === 'all' || s.epic   === filterEpic;
    return mSprint && mStatus && mEpic;
  }), [activeSprint, filterStatus, filterEpic]);

  const byStatus = {
    done:          filtered.filter(s => s.status === 'done'),
    'in-progress': filtered.filter(s => s.status === 'in-progress'),
    pending:       filtered.filter(s => s.status === 'pending'),
  };

  const toggle = id => setExpandedId(prev => prev === id ? null : id);

  const TABS = [
    { id: 'board',   label: '🗂 Tablero Kanban' },
    { id: 'backlog', label: '📋 Backlog completo' },
    { id: 'sprints', label: '🏃 Sprints' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <div className="max-w-screen-xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-start gap-4 mb-8">
          <span className="text-4xl mt-0.5">🌿</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              PlantArt — Scrum Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Seguimiento hacia Producción 100/100 · Última actualización: {LAST_UPDATED}
            </p>
            <a
              href="https://github.com/jpgutif-cloud/App-Plantart"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-600 hover:underline"
            >
              📦 jpgutif-cloud/App-Plantart →
            </a>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <KPICard icon="🎯" label="Avance global" value={`${totalPct}%`}
            sub={`${doneCount}/${STORIES.length} stories`} valueColor="text-emerald-700" />
          <KPICard icon="✅" label="Done" value={doneCount}
            sub="stories terminadas" valueColor="text-green-600" />
          <KPICard icon="🔄" label="En Progreso" value={inProgCount}
            sub="activas ahora" valueColor="text-blue-600" />
          <KPICard icon="⏳" label="Pendientes" value={pendCount}
            sub="por iniciar" valueColor="text-gray-500" />
          <KPICard icon="🔴" label="Críticos pend." value={critPend}
            sub="alta urgencia" valueColor="text-red-600" />
          <KPICard icon="⚡" label="Story Points" value={`${ptsDone}/${totalPts}`}
            sub="completados" valueColor="text-indigo-600" />
        </div>

        {/* PROGRESO GLOBAL */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-gray-800">Progreso Global — Producción 100/100</span>
            <span className="font-extrabold text-emerald-700 text-xl">{totalPct}%</span>
          </div>
          <ProgressBar pct={totalPct} colorClass="bg-emerald-500" height="h-3" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {SPRINTS.map(sp => (
              <div key={sp.id}>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span className="font-semibold truncate pr-1">{sp.name}</span>
                  <span className="shrink-0">{sp.completionPct}%</span>
                </div>
                <ProgressBar
                  pct={sp.completionPct}
                  colorClass={
                    sp.status === 'done' ? 'bg-green-400' :
                    sp.status === 'in-progress' ? 'bg-blue-400' : 'bg-gray-300'
                  }
                />
                <p className="text-xs text-gray-400 mt-1 leading-tight">{sp.goal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors
                ${activeTab === t.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <select value={activeSprint} onChange={e => setActiveSprint(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="all">Todos los sprints</option>
            {SPRINTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="all">Todos los estados</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) =>
              <option key={k} value={k}>{v.label}</option>)}
          </select>

          <select value={filterEpic} onChange={e => setFilterEpic(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="all">Todas las épicas</option>
            {epics.map(e => <option key={e} value={e}>{e}</option>)}
          </select>

          <span className="text-xs text-gray-400">
            {filtered.length} stories · {filtered.reduce((a,s) => a+s.points, 0)} pts
          </span>
        </div>

        {/* ── BOARD ── */}
        {activeTab === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['done', 'in-progress', 'pending'].map(col => {
              const sc    = STATUS_CONFIG[col];
              const items = byStatus[col];
              return (
                <div key={col}>
                  <div className={`flex items-center justify-between rounded-xl px-4 py-2 mb-3 border-2 ${sc.border} ${sc.bg}`}>
                    <span className={`font-bold text-sm ${sc.text}`}>{sc.label}</span>
                    <span className={`text-xs font-mono ${sc.text} opacity-70`}>
                      {items.length} · {items.reduce((a,s) => a+s.points,0)} pts
                    </span>
                  </div>
                  <div className="space-y-3">
                    {items.length === 0
                      ? <p className="text-xs text-gray-400 italic text-center py-6">Sin stories aquí.</p>
                      : items.map(s => (
                          <StoryCard key={s.id} story={s}
                            expanded={expandedId === s.id}
                            onToggle={() => toggle(s.id)} />
                        ))
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── BACKLOG ── */}
        {activeTab === 'backlog' && (
          <div className="space-y-2">
            {filtered.map(s => (
              <StoryCard key={s.id} story={s}
                expanded={expandedId === s.id}
                onToggle={() => toggle(s.id)} />
            ))}
          </div>
        )}

        {/* ── SPRINTS ── */}
        {activeTab === 'sprints' && (
          <div className="space-y-8">
            {SPRINTS.map(sp => {
              const spStories = STORIES.filter(s => s.sprint === sp.id);
              const filtSp    = spStories.filter(s => {
                const mStatus = filterStatus === 'all' || s.status === filterStatus;
                const mEpic   = filterEpic   === 'all' || s.epic   === filterEpic;
                return mStatus && mEpic;
              });
              const sc = STATUS_CONFIG[sp.status] || STATUS_CONFIG.pending;
              const spPct = calcProgress(spStories);
              return (
                <div key={sp.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h2 className="font-extrabold text-lg text-gray-900 leading-tight">{sp.name}</h2>
                      <p className="text-xs text-gray-400">{sp.period}</p>
                      <p className="text-xs text-gray-500 mt-1">{sp.goal}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge label={sc.label} className={`${sc.bg} ${sc.text} border ${sc.border}`} />
                      <span className="font-bold text-emerald-700 text-lg">{spPct}%</span>
                    </div>
                  </div>
                  <ProgressBar pct={spPct} colorClass={sc.col} height="h-2" />
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filtSp.map(s => (
                      <StoryCard key={s.id} story={s}
                        expanded={expandedId === s.id}
                        onToggle={() => toggle(s.id)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center space-y-1">
          <p className="text-xs text-gray-400">
            🌿 PlantArt · Software de Paisajismo · Scrum Dashboard
          </p>
          <p className="text-xs text-gray-300">
            Repo: jpgutif-cloud/App-Plantart · Dashboard: jpgutif-cloud/plantart-scrum-dashboard
          </p>
        </div>

      </div>
    </div>
  );
}

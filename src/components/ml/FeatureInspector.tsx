import React, { useEffect, useMemo, useState } from 'react';
import { discountApi, type FeatureDescriptions, type FeatureInspectResponse } from '../../services/api';

interface Props {
  appid: number | null;
  onClose: () => void;
}

const FeatureInspector: React.FC<Props> = ({ appid, onClose }) => {
  const [data, setData] = useState<FeatureInspectResponse | null>(null);
  const [desc, setDesc] = useState<FeatureDescriptions>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!appid) return;
      setError(null);
      setData(null);
      try {
        const [d, fd] = await Promise.all([
          discountApi.inspectFeatures(appid),
          discountApi.getFeatureDescriptions(),
        ]);
        if (!cancelled) { setData(d); setDesc(fd); }
      } catch (e) {
        if (!cancelled) setError('Não foi possível carregar features');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [appid]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // focus close button for accessibility and quick dismiss
  const closeBtnRef = React.useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const t = setTimeout(() => closeBtnRef.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  // Simple search/filter
  const [filter, setFilter] = useState('');
  const rows = useMemo(() => {
    if (!data) return [] as Array<{ name: string; value: number; label: string }>;
    const base = data.feature_names.map((name) => ({
      name,
      value: data.features[name] ?? 0,
      label: desc[name] || name,
    }));
    if (!filter.trim()) return base;
    const f = filter.toLowerCase();
    return base.filter(r => r.name.toLowerCase().includes(f) || r.label.toLowerCase().includes(f));
  }, [data, desc, filter]);

  // Group features by prefix semantics for readability
  const grouped = useMemo(() => {
    const order: Array<[string, (name:string)=>boolean]> = [
      ['Preço', n => n.startsWith('price_')],
      ['Variação/Volatilidade', n => /slope|std|var|z_ma/.test(n)],
      ['Descontos', n => n.startsWith('disc_')],
      ['Sazonalidade', n => n.startsWith('season_') || n.startsWith('sale_')],
      ['Metadata', n => ['type_encoded','years_since_release'].includes(n)],
    ];
    const used = new Set<string>();
    const result: Record<string, Array<{ name:string; value:number; label:string }>> = {};
    for (const [label, fn] of order) {
      const arr = rows.filter(r => fn(r.name));
      if (arr.length) {
        result[label] = arr;
        arr.forEach(a => used.add(a.name));
      }
    }
    const remaining = rows.filter(r => !used.has(r.name));
    if (remaining.length) result['Outros'] = remaining;
    return result;
  }, [rows]);

  const formatNumber = (v: number) => {
    if (!Number.isFinite(v)) return '-';
    // choose precision adaptively
    if (Math.abs(v) >= 1000) return v.toFixed(0);
    if (Math.abs(v) >= 100) return v.toFixed(1);
    if (Math.abs(v) >= 10) return v.toFixed(2);
    if (Math.abs(v) >= 1) return v.toFixed(3);
    return v.toExponential(2);
  };

  if (!appid) return null;

  const copyCSV = () => {
    if (!data) return;
    const header = 'feature,label,value';
    const lines = rows.map(r => `${r.name},"${(r.label||'').replace(/"/g,'""')}",${r.value}`);
    navigator.clipboard.writeText([header, ...lines].join('\n')).catch(()=>{});
  };

  const onOverlayClick = (e: React.MouseEvent) => {
    // close only when clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div onClick={onOverlayClick} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
  <div style={{ maxHeight: '90vh', width: 'min(92vw, 520px)' }} className="bg-white rounded-lg shadow-xl slide-up relative flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <div className="relative px-4 py-3 border-b border-gray-200">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Features do Modelo</h2>
            <p className="text-xs text-gray-600">appid {appid}{data && ` • ${rows.length} visíveis`}</p>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 p-2 rounded-md bg-white/0 hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filtros / Ações (sticky) */}
        {data && (
          <div className="px-4 pt-3 pb-2 space-y-2 border-b border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filtrar..."
                className="flex-1 border rounded px-3 py-1 text-xs focus:outline-none focus:ring focus:border-primary-400"
              />
              <button
                onClick={copyCSV}
                className="text-xs px-3 py-1 rounded border bg-white hover:bg-gray-50"
                title="Copiar CSV"
              >CSV</button>
            </div>
            <AccordionControls />
          </div>
        )}

        {/* Conteúdo rolável */}
  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar min-h-0">
          {error && <div className="text-red-600 text-sm mb-1">{error}</div>}
          {!error && !data && <div className="text-gray-500 text-sm">Carregando...</div>}
          {!error && data && (
            <div className="space-y-3">
              {Object.entries(grouped).map(([group, items]) => (
                items.length === 0 ? null : <AccordionGroup key={group} title={`${group} (${items.length})`} items={items} formatNumber={formatNumber} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="btn btn-secondary px-4 text-sm"
            >Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AccordionGroupProps {
  title: string;
  items: Array<{ name:string; value:number; label:string }>;
  formatNumber: (v:number)=>string;
}

// Global store for expand/collapse all via custom event
const ACCORDION_EVENT = 'feature-accordion-toggle-all';

const AccordionGroup: React.FC<AccordionGroupProps> = ({ title, items, formatNumber }) => {
  const [open, setOpen] = useState(false); // start collapsed

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { open: boolean } | undefined;
      if (detail) setOpen(detail.open);
    };
    window.addEventListener(ACCORDION_EVENT, handler as EventListener);
    return () => window.removeEventListener(ACCORDION_EVENT, handler as EventListener);
  }, []);

  return (
    <div className="border rounded-md bg-white/70 hover:bg-white transition-colors">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <span className="font-semibold text-xs text-gray-700 pr-2 truncate">{title}</span>
        <span className="text-gray-500 text-[10px]">{open ? 'Esconder' : 'Mostrar'}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          {items.map(r => (
            <div key={r.name} className="border rounded p-2 bg-white shadow-sm hover:shadow transition-shadow">
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase text-gray-400 font-medium truncate" title={r.name}>{r.name}</div>
                  <div className="text-[11px] text-gray-600 mb-0.5 line-clamp-2" title={r.label}>{r.label}</div>
                </div>
                <div className="font-mono text-[11px] text-primary-700 flex-shrink-0 ml-1">{formatNumber(r.value)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Controls component for expand/collapse all
const AccordionControls: React.FC = () => {
  const broadcast = (open: boolean) => {
    window.dispatchEvent(new CustomEvent(ACCORDION_EVENT, { detail: { open } }));
  };
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => broadcast(true)}
        className="text-[10px] px-2 py-1 rounded border bg-white hover:bg-gray-50"
      >Expandir tudo</button>
      <button
        onClick={() => broadcast(false)}
        className="text-[10px] px-2 py-1 rounded border bg-white hover:bg-gray-50"
      >Recolher tudo</button>
    </div>
  );
};

export default FeatureInspector;

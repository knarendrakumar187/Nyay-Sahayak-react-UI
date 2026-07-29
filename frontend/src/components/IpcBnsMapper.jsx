import React, { useMemo, useState } from 'react';
import { Search, ArrowLeftRight, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import mapData from '../data/ipcBnsMap.json';

const normalizeQuery = (q) =>
  String(q || '')
    .trim()
    .toUpperCase()
    .replace(/^SECTION\s+/i, '')
    .replace(/^SEC\.?\s+/i, '')
    .replace(/^§\s*/, '')
    .replace(/\s+/g, '');

const baseSection = (sec) => {
  const m = String(sec || '').toUpperCase().match(/^(\d+[A-Z]?)/);
  return m ? m[1] : '';
};

const statusLabel = (status) => {
  if (status === 'new') return 'New in BNS';
  if (status === 'deleted') return 'Deleted / not carried';
  if (status === 'none') return 'No IPC equivalent listed';
  return 'Mapped';
};

const statusClass = (status) => {
  if (status === 'new') return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';
  if (status === 'deleted') return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/25';
  return 'bg-teal-700/10 text-teal-900 dark:text-teal-300 border-teal-700/25';
};

const IpcBnsMapper = () => {
  const [direction, setDirection] = useState('ipc-to-bns'); // or bns-to-ipc
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const entries = mapData.entries || [];

  const results = useMemo(() => {
    const q = normalizeQuery(submitted);
    if (!q) return [];

    const qBase = baseSection(q);

    if (direction === 'ipc-to-bns') {
      const exact = entries.filter((e) => e.ipcKey === q || e.ipcBase === q);
      if (exact.length) return exact;
      return entries.filter(
        (e) =>
          e.ipcKey?.startsWith(q) ||
          e.ipcBase === qBase ||
          e.ipcTitle?.toUpperCase().includes(q) ||
          e.bnsTitle?.toUpperCase().includes(q)
      );
    }

    const exact = entries.filter((e) => e.bnsKey === q || e.bnsBase === q);
    if (exact.length) return exact;
    return entries.filter(
      (e) =>
        e.bnsKey?.startsWith(q) ||
        e.bnsBase === qBase ||
        e.bnsTitle?.toUpperCase().includes(q) ||
        e.ipcTitle?.toUpperCase().includes(q)
    );
  }, [submitted, direction, entries]);

  const popular = direction === 'ipc-to-bns'
    ? [
        { label: 'IPC 302', value: '302' },
        { label: 'IPC 420', value: '420' },
        { label: 'IPC 498A', value: '498A' },
        { label: 'IPC 376', value: '376' },
        { label: 'IPC 307', value: '307' },
        { label: 'IPC 379', value: '379' },
        { label: 'IPC 406', value: '406' },
        { label: 'IPC 354', value: '354' },
      ]
    : [
        { label: 'BNS 103', value: '103' },
        { label: 'BNS 318', value: '318' },
        { label: 'BNS 85', value: '85' },
        { label: 'BNS 64', value: '64' },
        { label: 'BNS 109', value: '109' },
        { label: 'BNS 303', value: '303' },
        { label: 'BNS 316', value: '316' },
        { label: 'BNS 74', value: '74' },
      ];

  const runSearch = (value) => {
    const v = value ?? query;
    setQuery(v);
    setSubmitted(v);
  };

  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-background-light/80 dark:bg-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-teal-700/10 border border-teal-700/20">
              <ArrowLeftRight size={18} className="text-teal-800 dark:text-teal-300" />
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink dark:text-white tracking-normal">
              IPC ↔ BNS Mapping
            </h1>
          </div>
          <p className="text-sm text-ink-mute dark:text-slate-400 leading-relaxed">
            Official section correspondence between the Indian Penal Code, 1860 and the Bharatiya Nyaya Sanhita, 2023.
            Data from the NCRB Sankalan Portal ({mapData.count} rows).
          </p>
        </div>

        <div className="flex gap-2 mb-4 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          {[
            { id: 'ipc-to-bns', label: 'IPC → BNS' },
            { id: 'bns-to-ipc', label: 'BNS → IPC' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setDirection(tab.id);
                setSubmitted('');
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                direction === tab.id
                  ? 'bg-ink text-white dark:bg-teal-700'
                  : 'text-ink-mute dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
          className="relative mb-4"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              direction === 'ipc-to-bns'
                ? 'Enter IPC section (e.g. 302, 498A, 420)'
                : 'Enter BNS section (e.g. 103, 85, 318)'
            }
            className="w-full pl-11 pr-28 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-ink dark:text-white outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700/30"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-ink dark:bg-teal-700 text-white text-sm font-semibold"
          >
            Map
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-6">
          {popular.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => runSearch(p.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-ink-mute dark:text-slate-300 hover:border-teal-700/40 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8 text-center"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-3 text-teal-800 dark:text-teal-400" />
              <p className="text-ink dark:text-white font-medium mb-1">Look up any section</p>
              <p className="text-sm text-ink-mute dark:text-slate-400">
                Type an IPC or BNS section number to see the corresponding provision.
              </p>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              key="none"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-ink dark:text-white">No mapping found for “{submitted}”</p>
                <p className="text-sm text-ink-mute dark:text-slate-400 mt-1">
                  Check the section number, or try the base number without subsections (e.g. 376 instead of 376(2)).
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-slate-500">
                {results.length} result{results.length === 1 ? '' : 's'}
              </p>
              {results.slice(0, 40).map((row, idx) => (
                <div
                  key={`${row.bns}-${row.ipc}-${idx}`}
                  className="rounded-2xl border border-slate-200 dark:border-teal-400/15 bg-white dark:bg-surface-dark/90 p-4 md:p-5"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded-md border ${statusClass(row.status)}`}>
                      {statusLabel(row.status)}
                    </span>
                    {row.chapter ? (
                      <span className="text-[11px] text-ink-mute dark:text-slate-500 truncate max-w-full">
                        {row.chapter}
                      </span>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-start">
                    <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-3.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-mute dark:text-slate-500 mb-1">
                        IPC
                      </p>
                      <p className="font-display text-xl font-semibold text-ink dark:text-white">
                        {row.ipc ? `§ ${row.ipc}` : '—'}
                      </p>
                      <p className="text-sm text-ink-mute dark:text-slate-400 mt-1 leading-snug">
                        {row.ipcTitle || 'No IPC title listed'}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center justify-center pt-6 text-teal-700 dark:text-teal-400">
                      <ArrowLeftRight size={18} />
                    </div>

                    <div className="rounded-xl bg-teal-700/5 dark:bg-teal-400/5 border border-teal-700/20 dark:border-teal-400/20 p-3.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 mb-1">
                        BNS
                      </p>
                      <p className="font-display text-xl font-semibold text-teal-900 dark:text-teal-200">
                        {row.bns ? `§ ${row.bns}` : '—'}
                      </p>
                      <p className="text-sm text-ink-mute dark:text-slate-400 mt-1 leading-snug">
                        {row.bnsTitle || 'No BNS title listed'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <a
          href={mapData.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 text-xs text-ink-mute dark:text-slate-500 hover:text-teal-800 dark:hover:text-teal-300"
        >
          <ExternalLink size={12} />
          Source: {mapData.source}
        </a>
        <p className="mt-2 text-[11px] text-ink-mute dark:text-slate-600 leading-relaxed">
          Always verify against the bare Act on India Code before filing or charging. Some IPC sections were deleted, merged, or replaced by new BNS provisions.
        </p>
      </div>
    </div>
  );
};

export default IpcBnsMapper;

import React, { useMemo, useState } from 'react';
import { ListChecks, CheckCircle2, XCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BANK = [
  {
    id: 1,
    q: 'Bharatiya Nyaya Sanhita (BNS), 2023 replaced which earlier code?',
    options: ['CrPC, 1973', 'Indian Penal Code, 1860', 'Evidence Act, 1872', 'Constitution of India'],
    answer: 1,
    explain: 'BNS replaced the Indian Penal Code, 1860 (effective from 1 July 2024).',
  },
  {
    id: 2,
    q: 'Old IPC Section 302 (murder — punishment) roughly maps to which BNS section?',
    options: ['BNS 101', 'BNS 103', 'BNS 302', 'BNS 318'],
    answer: 1,
    explain: 'IPC 302 ↔ BNS 103 (punishment for murder). BNS 302 is a different offence.',
  },
  {
    id: 3,
    q: 'Old IPC Section 420 (cheating and dishonestly inducing delivery of property) maps mainly to:',
    options: ['BNS 316', 'BNS 318', 'BNS 303', 'BNS 85'],
    answer: 1,
    explain: 'IPC 420 corresponds to BNS 318 (cheating / related provisions).',
  },
  {
    id: 4,
    q: 'Which pair is correct for cruelty by husband or relatives?',
    options: ['IPC 498A ↔ BNS 85', 'IPC 376 ↔ BNS 103', 'IPC 379 ↔ BNS 64', 'IPC 307 ↔ BNS 318'],
    answer: 0,
    explain: 'IPC 498A maps to BNS 85 (with related definition at BNS 86).',
  },
  {
    id: 5,
    q: 'Cognizable offence generally means the police may:',
    options: [
      'Only investigate after magistrate permission',
      'Arrest without warrant in many cases',
      'Never register an FIR',
      'Only mediate between parties',
    ],
    answer: 1,
    explain: 'For cognizable offences, police can usually register FIR and arrest without warrant (subject to law).',
  },
  {
    id: 6,
    q: 'Anticipatory bail is typically sought:',
    options: [
      'After conviction only',
      'Before arrest, when a person apprehends arrest',
      'Only in civil suits',
      'Only by the police prosecutor',
    ],
    answer: 1,
    explain: 'Anticipatory bail is pre-arrest protection when arrest is apprehended in a non-bailable offence.',
  },
  {
    id: 7,
    q: 'IPC 379 (theft) commonly corresponds to which BNS provision family?',
    options: ['BNS 64', 'BNS 103', 'BNS 303', 'BNS 79'],
    answer: 2,
    explain: 'Theft provisions under IPC 379 map around BNS 303.',
  },
  {
    id: 8,
    q: 'Which statement about BNS is accurate?',
    options: [
      'BNS has more sections than IPC and identical numbering',
      'Section numbers were reorganised; always verify mapping',
      'IPC still applies for all new FIRs after July 2024',
      'BNS applies only to civil disputes',
    ],
    answer: 1,
    explain: 'BNS reorganised section numbers. Use a verified IPC↔BNS table and the bare Act.',
  },
  {
    id: 9,
    q: 'IPC 354 (assault/criminal force to woman to outrage modesty) maps near:',
    options: ['BNS 74', 'BNS 103', 'BNS 318', 'BNS 61'],
    answer: 0,
    explain: 'IPC 354 corresponds to BNS 74 (and related sexual-offence chapters nearby).',
  },
  {
    id: 10,
    q: 'An FIR is primarily:',
    options: [
      'A civil plaint for money recovery',
      'First information of a cognizable offence to police',
      'A judgment of the Supreme Court',
      'A rent agreement template',
    ],
    answer: 1,
    explain: 'FIR is the first information report of a cognizable offence given to the police.',
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LawStudentQuiz = () => {
  const [seed, setSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const questions = useMemo(() => shuffle(BANK).slice(0, 8), [seed]);
  const current = questions[index];
  const progress = ((index + (selected !== null || done ? 1 : 0)) / questions.length) * 100;

  const onPick = (optIdx) => {
    if (selected !== null || done) return;
    setSelected(optIdx);
    if (optIdx === current.answer) setScore((s) => s + 1);
  };

  const onNext = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const onRestart = () => {
    setSeed((s) => s + 1);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div className="h-full overflow-y-auto overscroll-contain bg-background-light dark:bg-bg-deep">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-xl bg-teal-700/10 border border-teal-700/20">
              <ListChecks size={18} className="text-teal-800 dark:text-teal-300" />
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink dark:text-white tracking-normal">
              BNS Practice Quiz
            </h1>
          </div>
          <p className="text-sm text-ink-mute dark:text-slate-400">
            Law Student mode — quick checks on BNS, IPC mapping, and procedure.
          </p>
        </div>

        <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-teal-700 dark:bg-teal-400"
            animate={{ width: `${done ? 100 : Math.min(progress, 100)}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 text-center"
            >
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-teal-700 dark:text-teal-300" />
              <h2 className="text-xl font-semibold text-ink dark:text-white mb-1">Quiz complete</h2>
              <p className="text-ink-mute dark:text-slate-400 mb-5">
                You scored <span className="font-bold text-teal-800 dark:text-teal-300">{score}</span> / {questions.length}
              </p>
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink dark:bg-teal-700 text-white font-semibold"
              >
                <RotateCcw size={16} />
                Try another set
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 md:p-6"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-ink-mute dark:text-slate-500 mb-2">
                Question {index + 1} of {questions.length}
              </p>
              <h2 className="text-lg md:text-xl font-semibold text-ink dark:text-white mb-5 leading-snug">
                {current.q}
              </h2>

              <div className="space-y-2.5">
                {current.options.map((opt, i) => {
                  const isSel = selected === i;
                  const isCorrect = i === current.answer;
                  const show = selected !== null;
                  let cls =
                    'w-full text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors ';
                  if (!show) {
                    cls +=
                      'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-ink dark:text-slate-200 hover:border-teal-700/40';
                  } else if (isCorrect) {
                    cls += 'border-teal-600 bg-teal-700/10 text-teal-900 dark:text-teal-200';
                  } else if (isSel) {
                    cls += 'border-red-500/50 bg-red-500/10 text-red-800 dark:text-red-200';
                  } else {
                    cls += 'border-slate-200/60 dark:border-white/5 opacity-60 text-ink-mute dark:text-slate-400';
                  }
                  return (
                    <button key={opt} type="button" disabled={selected !== null} onClick={() => onPick(i)} className={cls}>
                      <span className="inline-flex items-start gap-2">
                        {show && isCorrect ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : null}
                        {show && isSel && !isCorrect ? <XCircle size={16} className="mt-0.5 shrink-0" /> : null}
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <p className="text-sm text-ink-mute dark:text-slate-300 leading-relaxed">{current.explain}</p>
                  <button
                    type="button"
                    onClick={onNext}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink dark:bg-teal-700 text-white text-sm font-semibold"
                  >
                    {index + 1 >= questions.length ? 'See score' : 'Next'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LawStudentQuiz;

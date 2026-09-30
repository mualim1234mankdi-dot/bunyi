import React, { useState } from 'react';
import { Language, SimulationTab } from '../../types/physics';
import { Network, Eye, EyeOff, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface ConceptMapSectionProps {
  lang: Language;
  onNavigateTab: (tab: SimulationTab) => void;
}

export const ConceptMapSection: React.FC<ConceptMapSectionProps> = ({ lang, onNavigateTab }) => {
  const [hideBlanks, setHideBlanks] = useState<boolean>(false);
  const [revealedNodes, setRevealedNodes] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revealAll = () => {
    setHideBlanks(false);
    setRevealedNodes({});
  };

  const testSelfMode = () => {
    setHideBlanks(true);
    setRevealedNodes({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
            <span>Cambridge IGCSE™ Physics</span>
            <span aria-hidden="true">·</span>
            <span>Let’s Map It (Slides 24 & 25)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {lang === 'id' ? 'Peta Konsep Pembelajaran Bab 14 (Bunyi)' : 'Chapter 14 Concept Map: SOUND'}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {lang === 'id'
              ? 'Peta keterkaitan seluruh konsep utama: Produksi, Perambatan, Pemantulan/USG, serta Nada & Kenyaringan.'
              : 'Holistic concept map connecting Sound Production, Transmission, Reflection & Ultrasound, and Pitch/Loudness.'}
          </p>
        </div>

        {/* Self-Test vs Reveal Mode */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={revealAll}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              !hideBlanks ? 'bg-orange-500 text-white border-orange-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />
            <span>{lang === 'id' ? 'Tampilkan Semua (Slide 25)' : 'Reveal All (Slide 25)'}</span>
          </button>

          <button
            type="button"
            onClick={testSelfMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              hideBlanks ? 'bg-cyan-600 text-white border-cyan-500 shadow' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5 inline mr-1" />
            <span>{lang === 'id' ? 'Mode Kuis Kosong (Slide 24)' : 'Test Recall (Slide 24)'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Concept Tree matching Slide 24/25 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-8 overflow-x-auto">
        {/* Root Node: SOUND */}
        <div className="flex justify-center">
          <div className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xl shadow-lg shadow-orange-500/20 text-center tracking-wide border-2 border-orange-300">
            {lang === 'id' ? 'BUNYI (SOUND)' : 'SOUND'}
          </div>
        </div>

        {/* 4 Main Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Branch 1: Production & Longitudinal Wave */}
          <div className="bg-slate-950 p-4 rounded-xl border border-orange-500/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                1. {lang === 'id' ? 'PRODUKSI (PRODUCTION)' : 'PRODUCTION'}
              </span>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                {lang === 'id' ? 'Dihasilkan oleh:' : 'Produced by:'}{' '}
                <strong className="text-white">{lang === 'id' ? 'Sumber yang bergetar (vibrating sources)' : 'Vibrating sources'}</strong>
              </div>

              {/* Node 1A: Longitudinal wave */}
              <div
                onClick={() => hideBlanks && toggleReveal('node-longitudinal')}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  hideBlanks && !revealedNodes['node-longitudinal']
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse text-center font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                {hideBlanks && !revealedNodes['node-longitudinal'] ? (
                  <span>❓ {lang === 'id' ? 'Klik untuk Tebak Jenis Gelombang' : 'Click to Reveal Wave Type'}</span>
                ) : (
                  <div>
                    <strong className="text-orange-400 block mb-1">
                      {lang === 'id' ? 'Gelombang Longitudinal:' : 'Longitudinal Wave:'}
                    </strong>
                    <p className="text-[11px] text-slate-300">
                      {lang === 'id'
                        ? 'Partikel bergetar sejajar dengan arah rambat gelombang. Mentransfer energi melalui rapatan (compressions) dan renggangan (rarefactions).'
                        : 'Air molecules vibrate parallel to wave motion. Transfers energy via compressions and rarefactions.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Node 1B: Audible range */}
              <div
                onClick={() => hideBlanks && toggleReveal('node-audible')}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  hideBlanks && !revealedNodes['node-audible']
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse text-center font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                {hideBlanks && !revealedNodes['node-audible'] ? (
                  <span>❓ {lang === 'id' ? 'Klik untuk Tebak Rentang Dengar Manusia' : 'Click to Reveal Audible Range'}</span>
                ) : (
                  <div>
                    <strong className="text-emerald-400 block mb-1">
                      {lang === 'id' ? 'Rentang Pendengaran Manusia:' : 'Audible Range for Humans:'}
                    </strong>
                    <span className="font-mono font-bold text-white text-sm">20 Hz – 20 000 Hz</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('waves')}
              className="w-full py-1.5 text-xs text-orange-400 hover:text-orange-300 flex items-center justify-center gap-1 border-t border-slate-800 pt-2 font-medium"
            >
              <span>{lang === 'id' ? 'Buka Simulasi Gelombang' : 'Open Waves Lab'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Branch 2: Transmission & Speed */}
          <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                2. {lang === 'id' ? 'PERAMBATAN (TRANSMISSION)' : 'TRANSMISSION'}
              </span>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                <strong className="text-cyan-300 block mb-1">
                  {lang === 'id' ? 'Membutuhkan Medium Materi:' : 'Requires a Medium:'}
                </strong>
                <span className="text-[11px] text-slate-400">
                  {lang === 'id' ? 'Tidak dapat merambat di ruang hampa (vakum bell jar / angkasa).' : 'Cannot travel through vacuum (bell jar).'}
                </span>
              </div>

              {/* Node 2A: Speed in media */}
              <div
                onClick={() => hideBlanks && toggleReveal('node-speed')}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  hideBlanks && !revealedNodes['node-speed']
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse text-center font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                {hideBlanks && !revealedNodes['node-speed'] ? (
                  <span>❓ {lang === 'id' ? 'Klik untuk Tebak Urutan Cepat Rambat' : 'Click to Reveal Speed Order'}</span>
                ) : (
                  <div>
                    <strong className="text-cyan-400 block mb-1">
                      {lang === 'id' ? 'Perbandingan Laju:' : 'Speed Comparison:'}
                    </strong>
                    <div className="font-mono text-xs text-amber-300 font-bold mb-1">
                      v(gas) &lt; v(cair) &lt; v(padat)
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Udara: ~330–350 m/s | Air: ~1500 m/s | Besi: ~5000 m/s
                    </p>
                  </div>
                )}
              </div>

              {/* Node 2B: Measurement formula */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                <strong className="text-white block mb-0.5">{lang === 'id' ? 'Metode Pengukuran Langsung:' : 'Direct Method:'}</strong>
                <span className="font-mono text-cyan-400 font-bold">v = d / t</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {lang === 'id' ? 'Pistol start & stopwatch (Investigasi 14A)' : 'Starting pistol & stopwatch (Inv 14A)'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('speed')}
              className="w-full py-1.5 text-xs text-cyan-400 hover:text-cyan-300 flex items-center justify-center gap-1 border-t border-slate-800 pt-2 font-medium"
            >
              <span>{lang === 'id' ? 'Buka Lab Kecepatan' : 'Open Speed Lab'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Branch 3: Echoes & Ultrasound */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                3. {lang === 'id' ? 'GEMA & ULTRASONIK' : 'ECHOES & ULTRASOUND'}
              </span>

              {/* Node 3A: Echoes */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                <strong className="text-emerald-300 block mb-0.5">
                  {lang === 'id' ? 'Gema (Echoes):' : 'Echoes:'}
                </strong>
                <span className="text-[11px] text-slate-300">
                  {lang === 'id' ? 'Pemantulan gelombang bunyi dari permukaan keras (sudut i = r).' : 'Reflection of sound off hard, flat surface (i = r).'}
                </span>
              </div>

              {/* Node 3B: Ultrasound uses */}
              <div
                onClick={() => hideBlanks && toggleReveal('node-ultrasound')}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  hideBlanks && !revealedNodes['node-ultrasound']
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse text-center font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                {hideBlanks && !revealedNodes['node-ultrasound'] ? (
                  <span>❓ {lang === 'id' ? 'Klik untuk Tebak 3 Kegunaan Ultrasonik' : 'Click to Reveal 3 Ultrasound Uses'}</span>
                ) : (
                  <div>
                    <strong className="text-emerald-400 block mb-1">
                      {lang === 'id' ? 'Ultrasonik (> 20 kHz):' : 'Ultrasound (> 20 kHz):'}
                    </strong>
                    <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                      <li>{lang === 'id' ? 'Uji mutu cacat beton/logam' : 'Testing materials (quality control)'}</li>
                      <li>{lang === 'id' ? 'Pemindaian medis janin (USG)' : 'Medical scanning (prenatal)'}</li>
                      <li>{lang === 'id' ? 'Sonar kedalaman laut: d = vt/2' : 'Sonar depth sounder: d = vt/2'}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('echo-sonar')}
              className="w-full py-1.5 text-xs text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1 border-t border-slate-800 pt-2 font-medium"
            >
              <span>{lang === 'id' ? 'Buka Lab Gema & Sonar' : 'Open Sonar Lab'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Branch 4: Pitch & Loudness */}
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                4. {lang === 'id' ? 'NADA & KENYARINGAN' : 'PITCH & LOUDNESS'}
              </span>

              {/* Node 4A: Pitch & Frequency */}
              <div
                onClick={() => hideBlanks && toggleReveal('node-pitch')}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  hideBlanks && !revealedNodes['node-pitch']
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse text-center font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                {hideBlanks && !revealedNodes['node-pitch'] ? (
                  <span>❓ {lang === 'id' ? 'Klik untuk Tebak Hubungan Pitch' : 'Click to Reveal Pitch Rule'}</span>
                ) : (
                  <div>
                    <strong className="text-purple-300 block mb-0.5">
                      Pitch (Tinggi Nada):
                    </strong>
                    <span className="text-[11px] text-slate-300">
                      {lang === 'id'
                        ? 'Terkait erat dengan FREKUENSI gelombang. Frekuensi makin tinggi ➔ nada makin tinggi.'
                        : 'Related to the FREQUENCY of a sound wave. Higher frequency ➔ higher pitch.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Node 4B: Loudness & Amplitude */}
              <div
                onClick={() => hideBlanks && toggleReveal('node-loudness')}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  hideBlanks && !revealedNodes['node-loudness']
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 animate-pulse text-center font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-200'
                }`}
              >
                {hideBlanks && !revealedNodes['node-loudness'] ? (
                  <span>❓ {lang === 'id' ? 'Klik untuk Tebak Hubungan Loudness' : 'Click to Reveal Loudness Rule'}</span>
                ) : (
                  <div>
                    <strong className="text-amber-300 block mb-0.5">
                      Loudness (Kenyaringan):
                    </strong>
                    <span className="text-[11px] text-slate-300">
                      {lang === 'id'
                        ? 'Terkait erat dengan AMPLITUDO gelombang. Amplitudo makin besar ➔ bunyi makin nyaring.'
                        : 'Related to the AMPLITUDE of a sound wave. Larger amplitude ➔ louder sound.'}
                    </span>
                  </div>
                )}
              </div>

              {/* CRO visualizer note */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                <strong className="text-white block mb-0.5">C.R.O Oscilloscope:</strong>
                <span className="text-[10px] text-slate-400">
                  {lang === 'id' ? 'Menampilkan grafik pergeseran terhadap waktu dari mikrofon.' : 'Displays displacement-time graph of sounds.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('pitch-cro')}
              className="w-full py-1.5 text-xs text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 border-t border-slate-800 pt-2 font-medium"
            >
              <span>{lang === 'id' ? 'Buka Lab Osiloskop CRO' : 'Open CRO Lab'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

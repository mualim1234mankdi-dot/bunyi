import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types/physics';
import { soundEngine } from '../../utils/audio';
import { Sliders, Volume2, Activity, Music, Bug, Zap, RotateCcw } from 'lucide-react';

interface PitchLoudnessCROSimulationProps {
  lang: Language;
}

export const PitchLoudnessCROSimulation: React.FC<PitchLoudnessCROSimulationProps> = ({ lang }) => {
  const [frequencyHz, setFrequencyHz] = useState<number>(250); // Hz
  const [amplitudePercent, setAmplitudePercent] = useState<number>(60); // %
  const [isToneActive, setIsToneActive] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('custom');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animTimeRef = useRef<number>(0);

  // Synchronize live Web Audio oscillator when tone is active
  useEffect(() => {
    if (isToneActive) {
      soundEngine.startTone(frequencyHz, amplitudePercent / 100);
    } else {
      soundEngine.stopTone();
    }
    return () => {
      soundEngine.stopTone();
    };
  }, [isToneActive]);

  useEffect(() => {
    if (isToneActive) {
      soundEngine.updateTone(frequencyHz, amplitudePercent / 100);
    }
  }, [frequencyHz, amplitudePercent, isToneActive]);

  // Main Oscilloscope Animation Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      animTimeRef.current += 0.05;
      const t = animTimeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Dark CRT Oscilloscope Screen Background
      ctx.fillStyle = '#021814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Phosphor Grid Reticle (8 horizontal divisions, 6 vertical divisions)
      ctx.strokeStyle = '#064e3b';
      ctx.lineWidth = 1;

      // Vertical grid lines
      const colWidth = canvas.width / 10;
      for (let x = colWidth; x < canvas.width; x += colWidth) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal grid lines
      const rowHeight = canvas.height / 8;
      for (let y = rowHeight; y < canvas.height; y += rowHeight) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Center Major Axes
      const centerY = canvas.height / 2;
      const centerX = canvas.width / 2;
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.stroke();

      // Tick marks on axes
      ctx.fillStyle = '#10b981';
      for (let x = 0; x < canvas.width; x += 10) {
        ctx.fillRect(x, centerY - 2, 1, 4);
      }
      for (let y = 0; y < canvas.height; y += 10) {
        ctx.fillRect(centerX - 2, y, 4, 1);
      }

      // 3. Glow effect for green oscilloscope trace
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#34d399';
      ctx.strokeStyle = '#6ee7b7';
      ctx.lineWidth = 2.5;

      // Draw Sinusoidal Waveform
      // Display cycles proportional to frequency
      const waveCycles = (frequencyHz / 120);
      const ampPx = (amplitudePercent / 100) * (canvas.height * 0.4);

      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 2) {
        // y(x, t) = centerY - A * sin(2*pi*f*x - omega*t)
        const angle = ((x / canvas.width) * waveCycles * 2 * Math.PI) - (t * 2);
        const y = centerY - Math.sin(angle) * ampPx;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Reset shadow for text overlays
      ctx.shadowBlur = 0;

      // 4. Amplitude & Period annotation guidelines
      if (amplitudePercent > 20) {
        // Amplitude marker
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);

        // Peak line
        ctx.beginPath();
        ctx.moveTo(centerX + 60, centerY - ampPx);
        ctx.lineTo(centerX + 140, centerY - ampPx);
        ctx.stroke();

        // Amplitude arrow
        ctx.beginPath();
        ctx.moveTo(centerX + 120, centerY);
        ctx.lineTo(centerX + 120, centerY - ampPx);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#f59e0b';
        ctx.font = '10px monospace';
        ctx.fillText(lang === 'id' ? 'Amplitudo (Kenyaringan)' : 'Amplitude (Loudness)', centerX + 125, centerY - ampPx / 2);
      }

      // Period marker (T)
      const periodPx = canvas.width / waveCycles;
      if (periodPx > 50 && periodPx < 300) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);

        const startPeriodX = 40;
        const endPeriodX = startPeriodX + periodPx;

        ctx.beginPath();
        ctx.moveTo(startPeriodX, centerY + ampPx + 15);
        ctx.lineTo(endPeriodX, centerY + ampPx + 15);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '10px monospace';
        ctx.fillText(lang === 'id' ? `Periode T = 1/f` : `Period T = 1/f`, startPeriodX + 10, centerY + ampPx + 28);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [frequencyHz, amplitudePercent, lang]);

  // Preset handlers matching Slide 21 & 23
  const applyPreset = (name: string, freq: number, amp: number) => {
    setActivePreset(name);
    setFrequencyHz(freq);
    setAmplitudePercent(amp);
  };

  return (
    <div className="space-y-6">
      {/* Title & Section Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
          <span>Cambridge IGCSE™ Physics</span>
          <span aria-hidden="true">·</span>
          <span>14.4 Pitch and Loudness (Slides 20–23)</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {lang === 'id' ? 'Tinggi Nada (Pitch), Kenyaringan & Osiloskop Sinar Katoda (C.R.O)' : 'Pitch, Loudness & Cathode Ray Oscilloscope (C.R.O)'}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-1">
          {lang === 'id'
            ? 'Frekuensi menentukan tinggi nada (pitch); Amplitudo menentukan kenyaringan bunyi (loudness). Visualisasikan pada layar C.R.O dan dengarkan perubahannya.'
            : 'Frequency determines pitch; Amplitude determines loudness. Visualize sound on the C.R.O display and hear live tone changes.'}
        </p>
      </div>

      {/* Main C.R.O. Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Oscilloscope Canvas Screen (matching Figure 14.15 SB) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {lang === 'id' ? 'Layar Osiloskop C.R.O (Gambar 14.15)' : 'C.R.O Display Screen (Fig 14.15)'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-400 font-bold">f = {frequencyHz} Hz</span>
              <span className="text-slate-400">|</span>
              <span className="text-amber-400 font-bold">Amp = {amplitudePercent}%</span>
            </div>
          </div>

          {/* CRT Screen */}
          <div className="my-4 relative rounded-xl overflow-hidden border-4 border-slate-950 shadow-2xl">
            <canvas
              ref={canvasRef}
              width={540}
              height={300}
              className="w-full h-auto block"
            />
          </div>

          {/* Audio Output Switch */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'id' ? 'Generator Nada Murni (Web Audio Synth):' : 'Pure Tone Audio Synthesizer:'}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsToneActive(!isToneActive)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow ${
                isToneActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isToneActive ? (lang === 'id' ? 'STOP SUARA TONE' : 'STOP LIVE TONE') : (lang === 'id' ? 'BUNYIKAN SUARA TONE' : 'PLAY LIVE TONE')}
            </button>
          </div>
        </div>

        {/* Right: Sliders & Slide Presets */}
        <div className="lg:col-span-5 space-y-4">
          {/* Presets from Cambridge Textbook Slides */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {lang === 'id' ? 'Pilih Contoh dari Buku Teks (Slide 21–23):' : 'Select Textbook Examples (Slide 21–23):'}
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('longFork', 150, 70)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                  activePreset === 'longFork' ? 'bg-orange-500/20 border-orange-500 text-white font-bold' : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-orange-400">🍴 {lang === 'id' ? 'Garputala Panjang' : 'Long Tuning Fork'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{lang === 'id' ? 'Nada Rendah / Low Pitch (Gbr 14.16)' : 'Low Pitch (Fig 14.16)'}</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('shortFork', 650, 70)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                  activePreset === 'shortFork' ? 'bg-cyan-500/20 border-cyan-500 text-white font-bold' : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-cyan-400">🍴 {lang === 'id' ? 'Garputala Pendek' : 'Short Tuning Fork'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{lang === 'id' ? 'Nada Tinggi / High Pitch (Gbr 14.17)' : 'High Pitch (Fig 14.17)'}</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('mosquito', 800, 20)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                  activePreset === 'mosquito' ? 'bg-purple-500/20 border-purple-500 text-white font-bold' : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-purple-400">🦟 {lang === 'id' ? 'Nyamuk Terbang' : 'Flying Mosquito'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{lang === 'id' ? 'Nada Tinggi & Lirih (Soal 14.4 No.2)' : 'High Pitch, Soft (Q14.4)'}</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('bullfrog', 120, 95)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                  activePreset === 'bullfrog' ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold' : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-emerald-400">🐸 {lang === 'id' ? 'Katak Lembu (Bullfrog)' : 'Croaking Bullfrog'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{lang === 'id' ? 'Nada Rendah & Keras (Soal 14.4 No.2)' : 'Low Pitch, Loud (Q14.4)'}</div>
              </button>
            </div>
          </div>

          {/* Interactive Manual Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            {/* Frequency Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-cyan-400">
                  <Activity className="w-3.5 h-3.5" />
                  {lang === 'id' ? 'Frekuensi ➔ Tinggi Nada (Pitch):' : 'Frequency ➔ Pitch:'}
                </span>
                <span className="font-mono font-bold text-white">{frequencyHz} Hz</span>
              </div>
              <input
                type="range"
                min="60"
                max="1000"
                step="10"
                value={frequencyHz}
                onChange={(e) => {
                  setActivePreset('custom');
                  setFrequencyHz(parseInt(e.target.value));
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>{lang === 'id' ? 'Nada Rendah (Bass)' : 'Low Pitch (Bass)'}</span>
                <span>{lang === 'id' ? 'Nada Tinggi (Treble)' : 'High Pitch (Treble)'}</span>
              </div>
            </div>

            {/* Amplitude Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Sliders className="w-3.5 h-3.5" />
                  {lang === 'id' ? 'Amplitudo ➔ Kenyaringan (Loudness):' : 'Amplitude ➔ Loudness:'}
                </span>
                <span className="font-mono font-bold text-white">{amplitudePercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={amplitudePercent}
                onChange={(e) => {
                  setActivePreset('custom');
                  setAmplitudePercent(parseInt(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>{lang === 'id' ? 'Suara Lirih / Pelan' : 'Soft / Quiet'}</span>
                <span>{lang === 'id' ? 'Suara Keras / Nyaring' : 'Loud / Intense'}</span>
              </div>
            </div>
          </div>

          {/* Quick Cambridge Summary Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs space-y-1.5">
            <div className="text-orange-400 font-bold uppercase tracking-wider">
              {lang === 'id' ? 'Rangkuman Ujian IGCSE (Slide 21 & 22):' : 'IGCSE Exam Formula Rule (Slide 21 & 22):'}
            </div>
            <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
              <li><strong className="text-white">Pitch (Tinggi Nada)</strong> {lang === 'id' ? 'bergantung pada' : 'depends on'} <strong className="text-cyan-400">Frekuensi (f)</strong> — {lang === 'id' ? 'makin rapat gelombang di CRO, makin tinggi nadanya.' : 'more cycles on CRO screen.'}</li>
              <li><strong className="text-white">Loudness (Kenyaringan)</strong> {lang === 'id' ? 'bergantung pada' : 'depends on'} <strong className="text-amber-400">Amplitudo (A)</strong> — {lang === 'id' ? 'makin tinggi puncak bukit gelombang di CRO, makin nyaring suaranya.' : 'taller waveform peaks.'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

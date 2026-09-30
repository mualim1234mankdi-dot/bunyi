import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types/physics';
import { soundEngine } from '../../utils/audio';
import { FREQUENCY_SPECTRUM } from '../../data/curriculumData';
import { Play, Pause, RotateCcw, Volume2, Info, Eye, Droplets, Activity, ChevronRight } from 'lucide-react';

interface WaveSimulationProps {
  lang: Language;
}

interface Particle {
  baseX: number;
  y: number;
  offset: number;
  isTagged: boolean;
}

export const WaveSimulation: React.FC<WaveSimulationProps> = ({ lang }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [frequency, setFrequency] = useState<number>(2.0); // Visual slow-mo Hz
  const [amplitude, setAmplitude] = useState<number>(35); // Pixels
  const [showPressureGraph, setShowPressureGraph] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isDippedInWater, setIsDippedInWater] = useState<boolean>(false);
  const [waterSplashes, setWaterSplashes] = useState<Array<{ x: number; y: number; vx: number; vy: number; alpha: number }>>([]);
  const [selectedSpectrum, setSelectedSpectrum] = useState<number>(1); // Default to Audible
  const [audioPitchHz, setAudioPitchHz] = useState<number>(440); // 440 Hz A4

  const timeRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize air particles grid
  useEffect(() => {
    const particles: Particle[] = [];
    const rows = 12;
    const cols = 75;
    const width = 760;
    const height = 150;

    for (let r = 0; r < rows; r++) {
      const y = 15 + (r / (rows - 1)) * (height - 30);
      for (let c = 0; c < cols; c++) {
        const baseX = 30 + (c / (cols - 1)) * (width - 60);
        // Tag one particle in the middle to observe its back-and-forth oscillation
        const isTagged = r === 6 && c === 30;
        particles.push({
          baseX,
          y: y + (Math.random() - 0.5) * 6,
          offset: 0,
          isTagged
        });
      }
    }
    particlesRef.current = particles;
  }, []);

  // Main Canvas Animation Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isPlaying) {
        timeRef.current += 0.035;
      }
      const t = timeRef.current;
      const k = 0.035; // Wave number
      const omega = frequency * 2.5;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Tuning Fork vibrating prongs on the left
      const prongVibration = Math.sin(t * omega) * (amplitude * 0.22);
      ctx.fillStyle = '#64748b';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;

      // Stem & base of tuning fork
      ctx.fillRect(8, 70, 8, 40);
      // Left fixed prong
      ctx.fillRect(8, 25, 4, 45);
      // Right vibrating prong (displaces air)
      const prongX = 20 + prongVibration;
      ctx.fillStyle = '#f97316';
      ctx.fillRect(prongX, 25, 5, 45);

      // Acoustic wave emissions rings from prong
      ctx.beginPath();
      ctx.arc(prongX + 2, 47, 8 + Math.abs(prongVibration) * 2, -Math.PI / 2, Math.PI / 2);
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.stroke();

      // 2. Tube boundaries
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 10, canvas.width - 40, 140);

      // 3. Draw & displace air particles
      let taggedX = 0;
      let taggedY = 0;

      particlesRef.current.forEach((p) => {
        // Longitudinal displacement: s = A * sin(kx - omega*t)
        const displacement = amplitude * Math.sin(k * p.baseX - t * omega);
        p.offset = displacement;
        const currentX = p.baseX + displacement;

        if (p.isTagged) {
          taggedX = currentX;
          taggedY = p.y;
          // Draw reference equilibrium tick
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(p.baseX, 10);
          ctx.lineTo(p.baseX, 150);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.arc(currentX, p.y, p.isTagged ? 4.5 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = p.isTagged ? '#ef4444' : '#38bdf8';
        ctx.fill();
      });

      // Highlight tagged particle with pulse ring
      if (taggedX > 0) {
        ctx.beginPath();
        ctx.arc(taggedX, taggedY, 8 + Math.sin(t * 8) * 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Vibration arrow on tagged particle
        const arrowLen = Math.cos(k * taggedX - t * omega) * 14;
        ctx.beginPath();
        ctx.moveTo(taggedX - arrowLen, taggedY - 12);
        ctx.lineTo(taggedX + arrowLen, taggedY - 12);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 4. Compressions (C) & Rarefactions (R) labels
      if (showLabels) {
        const sampleColPositions = [120, 220, 320, 420, 520, 620, 720];
        sampleColPositions.forEach((x) => {
          // Density gradient calculation
          // Gradient of displacement ds/dx gives pressure variation: deltaP = -B * ds/dx
          const pressureDev = -Math.cos(k * x - t * omega);
          if (Math.abs(pressureDev) > 0.7) {
            const isCompression = pressureDev > 0;
            ctx.fillStyle = isCompression ? 'rgba(249, 115, 22, 0.9)' : 'rgba(56, 189, 248, 0.9)';
            ctx.font = 'bold 11px system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(
              isCompression ? (lang === 'id' ? 'C (Rapatan)' : 'C (Compression)') : (lang === 'id' ? 'R (Renggangan)' : 'R (Rarefaction)'),
              x,
              166
            );
          }
        });
      }

      // 5. Draw Real-time Pressure vs Position Wave Graph
      if (showPressureGraph) {
        const graphYCenter = 225;
        const graphHeight = 40;

        // Baseline
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, graphYCenter);
        ctx.lineTo(canvas.width - 10, graphYCenter);
        ctx.stroke();

        ctx.font = '10px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'left';
        ctx.fillText(lang === 'id' ? 'Tekanan Normal P₀' : 'Normal Pressure P₀', 35, graphYCenter - 3);

        // Sinusoidal curve of pressure: P(x) = P0 - P_max * cos(kx - omega*t)
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#f59e0b';

        for (let x = 30; x < canvas.width - 10; x += 3) {
          const pressureVariation = -Math.cos(k * x - t * omega) * (amplitude * 0.9);
          const y = graphYCenter + pressureVariation;
          if (x === 30) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Labels for Graph
        ctx.fillStyle = '#f97316';
        ctx.fillText(lang === 'id' ? '+ Tekanan Tinggi (Kompresi)' : '+ High Pressure (Compression)', canvas.width - 190, graphYCenter - 28);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(lang === 'id' ? '- Tekanan Rendah (Renggangan)' : '- Low Pressure (Rarefaction)', canvas.width - 190, graphYCenter + 38);
      }

      // 6. Water splash physics if dipped
      if (isDippedInWater) {
        // Draw beaker with water on the left
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2;
        ctx.strokeRect(4, 80, 26, 60);
        ctx.fillStyle = 'rgba(2, 132, 199, 0.4)';
        ctx.fillRect(4, 95, 26, 45);

        // Animate water splashes
        if (isPlaying && Math.random() < 0.6) {
          setWaterSplashes((prev) => [
            ...prev.slice(-25),
            {
              x: 18 + (Math.random() - 0.5) * 8,
              y: 95,
              vx: (Math.random() - 0.5) * 3,
              vy: -(Math.random() * 4 + 2),
              alpha: 1
            }
          ]);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, frequency, amplitude, showPressureGraph, showLabels, isDippedInWater, lang]);

  const toggleSound = () => {
    soundEngine.startTone(audioPitchHz, amplitude / 100);
    setTimeout(() => soundEngine.stopTone(), 600);
  };

  return (
    <div className="space-y-6">
      {/* Title & Section Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
            <span>Cambridge IGCSE™ Physics</span>
            <span aria-hidden="true">·</span>
            <span>14.1 What Is Sound? (Slides 3–7)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {lang === 'id' ? 'Sifat Gelombang Longitudinal & Partikel Udara' : 'Longitudinal Nature of Sound & Air Molecules'}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {lang === 'id' 
              ? 'Amati bagaimana getaran garputala menggeser lapisan udara, membentuk rapatan (tekanan tinggi) dan renggangan (tekanan rendah).'
              : 'Observe how a vibrating tuning fork shifts air layers inward and outward, creating compressions (high pressure) and rarefactions (low pressure).'}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium text-xs rounded-lg shadow transition-all active:scale-95"
        >
          <Volume2 className="w-4 h-4" />
          <span>{lang === 'id' ? 'Bunyikan Nada Garputala' : 'Hear Tuning Fork Tone'}</span>
        </button>
      </div>

      {/* Main Interactive Canvas Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? (lang === 'id' ? 'Jeda' : 'Pause') : (lang === 'id' ? 'Jalankan' : 'Play')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                timeRef.current = 0;
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsDippedInWater(!isDippedInWater)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDippedInWater 
                  ? 'bg-blue-600 text-white border-blue-500' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'id' ? 'Celup ke Air (Gbr 14.1)' : 'Dip into Water (Fig 14.1)'}</span>
            </button>
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLabels(!showLabels)}
              className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-colors ${
                showLabels ? 'bg-amber-950/60 text-amber-300 border-amber-700' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {lang === 'id' ? 'Label C & R' : 'C & R Labels'}
            </button>
            <button
              type="button"
              onClick={() => setShowPressureGraph(!showPressureGraph)}
              className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-colors ${
                showPressureGraph ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {lang === 'id' ? 'Grafik Tekanan Gelombang' : 'Pressure Wave Graph'}
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="relative overflow-x-auto rounded-lg bg-slate-950 border border-slate-800 p-2">
          <canvas
            ref={canvasRef}
            width={780}
            height={showPressureGraph ? 280 : 180}
            className="w-full max-w-full block"
          />
        </div>

        {/* Sliders for Wave Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="font-medium">{lang === 'id' ? 'Frekuensi Getaran (f)' : 'Vibration Frequency (f)'}:</span>
              <span className="font-mono text-orange-400">{frequency.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400">
              {lang === 'id' ? 'Mempengaruhi panjang gelombang λ dan kerapatan rapatan' : 'Controls wavelength λ and rate of compressions'}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="font-medium">{lang === 'id' ? 'Amplitudo Getaran (A)' : 'Vibration Amplitude (A)'}:</span>
              <span className="font-mono text-cyan-400">{amplitude} px</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="1"
              value={amplitude}
              onChange={(e) => setAmplitude(parseInt(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400">
              {lang === 'id' ? 'Mempengaruhi tingkat pemampatan partikel & kenyaringan' : 'Controls maximum particle displacement & loudness'}
            </span>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{lang === 'id' ? 'Perhatikan Partikel Merah!' : 'Notice the Red Tagged Particle!'}</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {lang === 'id' 
                ? 'Partikel bergetar bolak-balik sejajar arah rambat; partikel TIDAK berpindah ke ujung tabung.' 
                : 'The particle oscillates back and forth parallel to wave travel; it does NOT travel along with the wave!'}
            </p>
          </div>
        </div>
      </div>

      {/* Frequency Spectrum Explorer: Infrasound, Audible, Ultrasound (Slide 6) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-white">
              {lang === 'id' ? 'Spektrum Frekuensi Bunyi (Slide 6 - Gambar 14.4)' : 'Spectrum of Sound Frequencies (Slide 6 - Figure 14.4)'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">20 Hz – 20,000 Hz</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {FREQUENCY_SPECTRUM.map((item, idx) => {
            const isSelected = selectedSpectrum === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedSpectrum(idx)}
                className={`cursor-pointer rounded-xl p-4 border transition-all ${
                  isSelected
                    ? `bg-slate-800/90 ${item.color} shadow-lg ring-1 ring-orange-500/50`
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="text-xs font-bold font-mono text-slate-300">{item.range}</div>
                <h4 className="text-sm font-bold text-white mt-1">{item.name[lang]}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {item.description[lang]}
                </p>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {item.examples.map((ex, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cambridge Let's Practise 14.1 Question 2 Highlight */}
        <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {lang === 'id' ? 'Soal Uji Cepat Cambridge (Let’s Practise 14.1 No. 2)' : 'Cambridge Checkpoint (Let’s Practise 14.1 Q2)'}
            </div>
            <p className="text-xs text-slate-200">
              {lang === 'id'
                ? 'Sumber getar memancarkan gelombang 40 kHz. Apakah bunyi ini dapat didengar telinga manusia?'
                : 'A vibrating source produces ultrasound at a frequency of 40 kHz. Is this audible to the human ear?'}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800 text-xs font-mono text-amber-400 font-semibold whitespace-nowrap">
            <span>40 kHz &gt; 20 kHz ➔ {lang === 'id' ? 'TIDAK TERDENGAR (Ultrasonik)' : 'INAUDIBLE (Ultrasound)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

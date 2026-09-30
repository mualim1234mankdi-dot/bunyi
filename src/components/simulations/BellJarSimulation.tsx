import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types/physics';
import { soundEngine } from '../../utils/audio';
import { Play, Pause, Power, Gauge, Wind, RotateCcw, Volume2, VolumeX, AlertCircle, CheckCircle } from 'lucide-react';

interface BellJarSimulationProps {
  lang: Language;
}

export const BellJarSimulation: React.FC<BellJarSimulationProps> = ({ lang }) => {
  const [bellPower, setBellPower] = useState<boolean>(true);
  const [pumpRunning, setPumpRunning] = useState<boolean>(false);
  const [airPressure, setAirPressure] = useState<number>(100); // 100 kPa to 0 kPa
  const [strikerAngle, setStrikerAngle] = useState<number>(0);
  const [experimentStep, setExperimentStep] = useState<number>(2); // Steps 1 to 4 matching Slide 9

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number }>>([]);

  // Generate air particles inside the bell jar
  useEffect(() => {
    const pts = [];
    for (let i = 0; i < 180; i++) {
      pts.push({
        x: 160 + (Math.random() - 0.5) * 160,
        y: 110 + (Math.random() - 0.5) * 130,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5
      });
    }
    particlesRef.current = pts;
  }, []);

  // Air pumping and pressure mechanics
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pumpRunning) {
      interval = setInterval(() => {
        setAirPressure((prev) => {
          if (prev <= 1) {
            setPumpRunning(false);
            setExperimentStep(3);
            return 0;
          }
          return Math.max(0, prev - 2.5);
        });
      }, 70);
    }
    return () => clearInterval(interval);
  }, [pumpRunning]);

  // Striker movement and sound trigger
  useEffect(() => {
    let animFrame: number;
    let lastTime = 0;
    let strikeCount = 0;

    const loop = (time: number) => {
      if (bellPower) {
        // Vibrate striker at ~12 Hz
        const freq = 0.04;
        const angle = Math.sin(time * freq) * 18;
        setStrikerAngle(angle);

        // Play metallic strike when striker reaches maximum swing toward bell gong
        if (angle > 14 && time - lastTime > 75) {
          lastTime = time;
          strikeCount++;
          // Sound volume directly proportional to remaining air pressure in jar
          const pressureFraction = airPressure / 100;
          soundEngine.playBellStrike(pressureFraction);
        }
      } else {
        setStrikerAngle(0);
      }
      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [bellPower, airPressure]);

  // Air Release Valve function (Step 4)
  const letAirBackIn = () => {
    setPumpRunning(false);
    const interval = setInterval(() => {
      setAirPressure((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setExperimentStep(4);
          return 100;
        }
        return Math.min(100, prev + 5);
      });
    }, 60);
  };

  const resetExperiment = () => {
    setPumpRunning(false);
    setAirPressure(100);
    setBellPower(true);
    setExperimentStep(2);
  };

  // Render the Bell Jar Glass & Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const jarCenterX = canvas.width / 2;
    const jarCenterY = 145;
    const jarRadiusX = 110;
    const jarHeight = 220;

    // 1. Base Plate & Stand
    ctx.fillStyle = '#334155';
    ctx.fillRect(jarCenterX - 135, jarCenterY + 105, 270, 16);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(jarCenterX - 120, jarCenterY + 121, 240, 10);

    // Rubber seal
    ctx.fillStyle = '#f97316';
    ctx.fillRect(jarCenterX - 110, jarCenterY + 101, 220, 4);

    // Vacuum hose beneath base
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(jarCenterX, jarCenterY + 121);
    ctx.lineTo(jarCenterX, jarCenterY + 165);
    ctx.lineTo(jarCenterX + 110, jarCenterY + 165);
    ctx.stroke();

    // Pump arrow
    if (pumpRunning) {
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(jarCenterX + 80, jarCenterY + 165, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Air Particles inside Jar (Density scales with airPressure)
    const activeParticleCount = Math.floor((airPressure / 100) * particlesRef.current.length);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.65)';

    for (let i = 0; i < activeParticleCount; i++) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;

      // Bounce within jar dome
      if (p.x < jarCenterX - 95 || p.x > jarCenterX + 95) p.vx *= -1;
      if (p.y < 35 || p.y > jarCenterY + 95) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Glass Bell Jar Outline (Dome on top, straight cylinder)
    ctx.beginPath();
    ctx.moveTo(jarCenterX - jarRadiusX, jarCenterY + 100);
    ctx.lineTo(jarCenterX - jarRadiusX, 70);
    ctx.bezierCurveTo(jarCenterX - jarRadiusX, 10, jarCenterX + jarRadiusX, 10, jarCenterX + jarRadiusX, 70);
    ctx.lineTo(jarCenterX + jarRadiusX, jarCenterY + 100);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Glass reflection highlights
    ctx.beginPath();
    ctx.arc(jarCenterX - 65, 55, 30, Math.PI * 0.8, Math.PI * 1.5);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 4. Electric Bell Apparatus Suspended from Top Stopper
    // Rubber stopper
    ctx.fillStyle = '#78350f';
    ctx.fillRect(jarCenterX - 22, 10, 44, 20);

    // Hanging electrical suspension wires
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(jarCenterX - 8, 30);
    ctx.lineTo(jarCenterX - 8, 85);
    ctx.moveTo(jarCenterX + 8, 30);
    ctx.lineTo(jarCenterX + 8, 85);
    ctx.stroke();

    // Bell base mounting block
    ctx.fillStyle = '#475569';
    ctx.fillRect(jarCenterX - 28, 85, 56, 40);

    // Electromagnet coils
    ctx.fillStyle = '#b45309';
    ctx.fillRect(jarCenterX - 18, 92, 14, 25);
    ctx.fillRect(jarCenterX + 4, 92, 14, 25);

    // Gong (Metal bell bowl)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(jarCenterX - 45, 105, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Striker (Arm + Hammer sphere)
    ctx.save();
    ctx.translate(jarCenterX - 15, 105);
    ctx.rotate((strikerAngle * Math.PI) / 180);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-20, 0);
    ctx.stroke();

    // Hammer ball
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-22, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 5. Sound wave arcs radiating outward (Fade with airPressure)
    if (bellPower && airPressure > 5) {
      const alpha = (airPressure / 100) * 0.8;
      ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
      ctx.lineWidth = 2;
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.arc(jarCenterX - 55, 105, 24 + r * 16, Math.PI * 0.7, Math.PI * 1.3);
        ctx.stroke();
      }
    }
  }, [airPressure, strikerAngle, bellPower, pumpRunning]);

  return (
    <div className="space-y-6">
      {/* Title & Cambridge Physics Slide 9 Alignment */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
          <span>Cambridge IGCSE™ Physics</span>
          <span aria-hidden="true">·</span>
          <span>14.2 Can Sound Travel in a Vacuum? (Slide 9 - Fig 14.5)</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {lang === 'id' ? 'Eksperimen Sungkup Bel Vakum (The Bell Jar Experiment)' : 'The Bell Jar Vacuum Experiment'}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-1">
          {lang === 'id'
            ? 'Buktikan secara langsung bahwa bunyi membutuhkan medium materi untuk merambat, dan tidak dapat merambat melalui ruang hampa.'
            : 'Directly prove that sound requires a material medium to propagate, and cannot travel through a vacuum.'}
        </p>
      </div>

      {/* Main Simulation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Canvas Bell Jar Visualizer */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">
                {lang === 'id' ? 'Manometer Tekanan Udara:' : 'Jar Air Pressure Gauge:'}
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                airPressure > 50 ? 'bg-emerald-950 text-emerald-300' : airPressure > 10 ? 'bg-amber-950 text-amber-300' : 'bg-rose-950 text-rose-300'
              }`}>
                {airPressure.toFixed(0)} kPa {airPressure === 0 ? (lang === 'id' ? '(Hampa Vakum)' : '(Vacuum)') : ''}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400">{lang === 'id' ? 'Status Suara:' : 'Sound Output:'}</span>
              {airPressure > 10 && bellPower ? (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <Volume2 className="w-3.5 h-3.5" />
                  {Math.round(airPressure)}%
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-400 font-semibold">
                  <VolumeX className="w-3.5 h-3.5" />
                  {lang === 'id' ? 'Hening (0%)' : 'Silent (0%)'}
                </span>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="my-4 relative">
            <canvas
              ref={canvasRef}
              width={340}
              height={310}
              className="rounded-lg bg-slate-950/80 border border-slate-800/80 shadow-inner"
            />
          </div>

          {/* Quick Step Indicators (matching Slide 9 steps ① ② ③ ④) */}
          <div className="w-full grid grid-cols-4 gap-1.5 pt-3 border-t border-slate-800 text-[11px] text-center">
            <div className={`p-1.5 rounded border ${airPressure === 100 && !bellPower ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-bold' : 'border-slate-800 text-slate-400'}`}>
              ① {lang === 'id' ? 'Bel Disuspensi' : 'Jar Sealed'}
            </div>
            <div className={`p-1.5 rounded border ${airPressure > 80 && bellPower && !pumpRunning ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'border-slate-800 text-slate-400'}`}>
              ② {lang === 'id' ? 'Bel Nyala (Suara Jelas)' : 'Bell On (Sound)'}
            </div>
            <div className={`p-1.5 rounded border ${airPressure < 10 && bellPower ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold' : 'border-slate-800 text-slate-400'}`}>
              ③ {lang === 'id' ? 'Dipompa (Sunyi)' : 'Pumped (Silent)'}
            </div>
            <div className={`p-1.5 rounded border ${experimentStep === 4 ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' : 'border-slate-800 text-slate-400'}`}>
              ④ {lang === 'id' ? 'Udara Masuk Lagi' : 'Air Refilled'}
            </div>
          </div>
        </div>

        {/* Right: Interactive Controls & Educational Guide */}
        <div className="lg:col-span-5 space-y-4">
          {/* Apparatus Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Power className="w-4 h-4 text-orange-400" />
              <span>{lang === 'id' ? 'Panel Kontrol Eksperimen' : 'Apparatus Controls'}</span>
            </h3>

            {/* Toggle Electric Bell */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  {lang === 'id' ? 'Saklar Bel Listrik (Electric Bell)' : 'Electric Bell Power'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {bellPower ? (lang === 'id' ? 'Pemukul bergerak aktif' : 'Striker is striking') : (lang === 'id' ? 'Mati' : 'Off')}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBellPower(!bellPower)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  bellPower ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {bellPower ? (lang === 'id' ? 'MATIKAN' : 'TURN OFF') : (lang === 'id' ? 'NYALAKAN' : 'TURN ON')}
              </button>
            </div>

            {/* Toggle Vacuum Pump */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  {lang === 'id' ? 'Pompa Vakum (Vacuum Pump)' : 'Vacuum Pump'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {pumpRunning ? (lang === 'id' ? 'Menghisap udara keluar...' : 'Pumping air out...') : (lang === 'id' ? 'Pompa diam' : 'Idle')}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPumpRunning(!pumpRunning)}
                disabled={airPressure <= 0 && pumpRunning}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  pumpRunning ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {pumpRunning ? (lang === 'id' ? 'HENTIKAN' : 'STOP PUMP') : (lang === 'id' ? 'SEDOT UDARA' : 'START PUMP')}
              </button>
            </div>

            {/* Release Valve Button */}
            <button
              type="button"
              onClick={letAirBackIn}
              disabled={airPressure >= 100}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 transition-colors disabled:opacity-50"
            >
              <Wind className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Buka Katup: Alirkan Udara Masuk Kembali (Langkah ④)' : 'Open Valve: Refill Air into Jar (Step ④)'}</span>
            </button>

            <button
              type="button"
              onClick={resetExperiment}
              className="w-full py-1.5 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'id' ? 'Kembalikan ke Kondisi Awal' : 'Reset Experiment'}</span>
            </button>
          </div>

          {/* Key Observation Card from Slide 9 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
              <CheckCircle className="w-4 h-4" />
              <span>{lang === 'id' ? 'Kesimpulan Ilmiah (Slide 9 Figure 14.5):' : 'Key Conclusion (Slide 9 Figure 14.5):'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'id' ? (
                <>
                  Ketika udara disedot keluar, suara bel semakin mengecil dan <strong className="text-white">hilang total</strong> walaupun pemukul masih terlihat aktif memukul bel. Ini membuktikan bahwa <strong className="text-orange-400">gelombang bunyi tidak dapat merambat melalui ruang hampa (vakum)</strong>.
                </>
              ) : (
                <>
                  As air is drawn out of the bell jar, the sound of the bell becomes faint and <strong className="text-white">disappears</strong>, even though the striker is still hitting the bell. This proves that <strong className="text-orange-400">sound waves cannot travel through a vacuum</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

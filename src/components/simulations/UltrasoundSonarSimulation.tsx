import React, { useState, useEffect } from 'react';
import { Language } from '../../types/physics';
import { soundEngine } from '../../utils/audio';
import { Radar, Waves, Fish, ShieldCheck, Activity, Award, HelpCircle, CheckCircle2 } from 'lucide-react';

interface UltrasoundSonarSimulationProps {
  lang: Language;
}

export const UltrasoundSonarSimulation: React.FC<UltrasoundSonarSimulationProps> = ({ lang }) => {
  const [activeMode, setActiveMode] = useState<'sonar' | 'testing' | 'prenatal'>('sonar');

  // --- SONAR State ---
  const [seaDepth, setSeaDepth] = useState<number>(225); // Worked Example 14A default = 225m
  const [speedInWater, setSpeedInWater] = useState<number>(1500); // 1500 m/s
  const [targetType, setTargetType] = useState<'seabed' | 'fish' | 'submarine'>('seabed');
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [pingProgress, setPingProgress] = useState<number>(0);
  const [echoReceivedTime, setEchoReceivedTime] = useState<number | null>(null);

  // Target depth calculation
  const targetDepth = targetType === 'seabed' ? seaDepth : targetType === 'fish' ? Math.round(seaDepth * 0.45) : Math.round(seaDepth * 0.7);
  const theoreticalRoundTripTime = (2 * targetDepth) / speedInWater;

  const triggerSonarPing = () => {
    if (isPinging) return;
    setIsPinging(true);
    setPingProgress(0);
    setEchoReceivedTime(null);

    // Initial ping sound
    soundEngine.playSonarPing(0, false);

    const startTime = performance.now();
    const duration = theoreticalRoundTripTime * 1000;

    const anim = () => {
      const elapsed = performance.now() - startTime;
      const prog = Math.min(1, elapsed / duration);
      setPingProgress(prog * 200); // 0-100 down, 100-200 up

      if (prog < 1) {
        requestAnimationFrame(anim);
      } else {
        // Return echo sound
        soundEngine.playSonarPing(0, true);
        setEchoReceivedTime(theoreticalRoundTripTime);
        setIsPinging(false);
      }
    };
    requestAnimationFrame(anim);
  };

  // --- Material Testing State (Figure 14.9) ---
  const [slabHasDefect, setSlabHasDefect] = useState<boolean>(true);
  const [isScanningSlab, setIsScanningSlab] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<'idle' | 'defect-detected' | 'intact'>('idle');

  const testConcreteSlab = () => {
    setIsScanningSlab(true);
    setTestResult('idle');
    setTimeout(() => {
      setIsScanningSlab(false);
      setTestResult(slabHasDefect ? 'defect-detected' : 'intact');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Title & Section Intro */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
          <span>Cambridge IGCSE™ Physics</span>
          <span aria-hidden="true">·</span>
          <span>14.3 Ultrasound & Applications (Slides 16–19)</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {lang === 'id' ? 'Ultrasonik (> 20 kHz), SONAR & Uji Cacat Material' : 'Ultrasound (> 20 kHz), SONAR & Flaw Testing'}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-1">
          {lang === 'id'
            ? 'Gelombang ultrasonik memiliki frekuensi di atas 20.000 Hz. Dimanfaatkan pada navigasi kapal (SONAR), deteksi keretakan beton, dan USG medis kehamilan.'
            : 'Ultrasound has a frequency higher than 20 kHz. Applications include ship SONAR depth sounding, non-destructive concrete inspection, and medical foetal imaging.'}
        </p>

        {/* Mode selector */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMode('sonar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeMode === 'sonar' ? 'bg-orange-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🚢 {lang === 'id' ? 'SONAR Pengukur Kedalaman Laut (Contoh 14A)' : 'SONAR Depth Sounder (Worked Ex 14A)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('testing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeMode === 'testing' ? 'bg-orange-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🧱 {lang === 'id' ? 'Uji Retak Beton (Gambar 14.9)' : 'Concrete Slab Flaw Detector (Fig 14.9)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('prenatal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeMode === 'prenatal' ? 'bg-orange-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🩺 {lang === 'id' ? 'USG Medis Janin vs Sinar-X (Soal 14.3 No. 3)' : 'Medical Prenatal Scan vs X-ray'}
          </button>
        </div>
      </div>

      {/* --- MODE 1: SONAR SHIP SIMULATION (WORKED EXAMPLE 14A) --- */}
      {activeMode === 'sonar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'id' ? 'Kapal Sonar Penentu Kedalaman Laut (Figure 14.11 SB)' : 'Ship Sonar Depth Sounder (Figure 14.11 SB)'}</span>
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'id'
                  ? 'Contoh Soal 14A: Kecepatan v = 1500 m/s, Waktu gema t = 0,3 s ➔ Kedalaman d = (v × t) / 2 = 225 m'
                  : 'Worked Example 14A: Speed v = 1500 m/s, Echo time t = 0.3 s ➔ Depth d = (v × t) / 2 = 225 m'}
              </p>
            </div>

            {/* Quick Presets matching Slide 18 & Slide 19 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSeaDepth(225);
                  setTargetType('seabed');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-orange-400 border border-slate-700"
              >
                {lang === 'id' ? 'Contoh 14A (225m / 0,3s)' : 'Example 14A (225m / 0.3s)'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSeaDepth(750);
                  setTargetType('seabed');
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 border border-slate-700"
              >
                {lang === 'id' ? 'Latihan 14.3 (750m / 1,0s)' : 'Practise 14.3 (750m / 1.0s)'}
              </button>
            </div>
          </div>

          {/* Interactive Ocean View Canvas / Visual */}
          <div className="relative h-72 rounded-xl bg-gradient-to-b from-sky-900 via-blue-950 to-slate-950 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
            {/* Water surface ripples */}
            <div className="absolute top-10 left-0 right-0 h-1 bg-cyan-400/40" />

            {/* Ship on surface */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="flex flex-col items-center">
                {/* Ship graphic */}
                <svg className="w-28 h-12 text-slate-200" viewBox="0 0 100 40" fill="currentColor">
                  <polygon points="10,25 90,25 80,38 20,38" fill="#475569" />
                  <rect x="35" y="10" width="30" height="15" fill="#f8fafc" />
                  <rect x="45" y="2" width="10" height="8" fill="#ea580c" />
                  <circle cx="50" cy="38" r="3" fill="#38bdf8" />
                </svg>
                <div className="text-[10px] text-cyan-300 font-mono -mt-1 font-bold">
                  {lang === 'id' ? 'Transmitter & Receiver SONAR' : 'SONAR Transceiver'}
                </div>
              </div>
            </div>

            {/* Ultrasonic Pulse beam traveling downwards and upwards */}
            {isPinging && (
              <div
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none transition-all"
                style={{
                  top: pingProgress <= 100
                    ? `${45 + (pingProgress / 100) * 180}px`
                    : `${225 - ((pingProgress - 100) / 100) * 180}px`
                }}
              >
                <div className={`w-8 h-4 rounded-full border-2 ${
                  pingProgress <= 100 ? 'border-cyan-400 bg-cyan-400/30' : 'border-amber-400 bg-amber-400/30'
                }`} />
              </div>
            )}

            {/* Intermediate Underwater Target: Fish or Submarine */}
            {targetType === 'fish' && (
              <div className="absolute top-36 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-blue-900/60 px-3 py-1 rounded-full border border-blue-600/40 text-xs text-cyan-200">
                <Fish className="w-4 h-4 text-cyan-300 animate-bounce" />
                <span>{lang === 'id' ? 'Kawanan Ikan (Shoal of Fish)' : 'Shoal of Fish'} — {targetDepth} m</span>
              </div>
            )}

            {/* Seabed at Bottom */}
            <div className="relative z-10 w-full bg-gradient-to-t from-stone-900 to-stone-800 border-t-2 border-stone-600 p-2 text-center rounded-b-lg">
              <div className="text-xs font-bold text-stone-300">
                {lang === 'id' ? 'Dasar Laut (Seabed)' : 'Seabed'} — {seaDepth} m {lang === 'id' ? 'di bawah permukaan' : 'below sea surface'}
              </div>
            </div>
          </div>

          {/* Controls & Worked Example Formula Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left Controls */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{lang === 'id' ? 'Kedalaman Laut (d):' : 'Seabed Depth (d):'}</span>
                <span className="font-mono font-bold text-orange-400">{seaDepth} m</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={seaDepth}
                disabled={isPinging}
                onChange={(e) => setSeaDepth(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-xs text-slate-400">{lang === 'id' ? 'Target Pantulan:' : 'Echo Target:'}</span>
                <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTargetType('seabed')}
                    className={`px-2.5 py-1 text-xs rounded-md ${targetType === 'seabed' ? 'bg-orange-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    {lang === 'id' ? 'Dasar Laut' : 'Seabed'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('fish')}
                    className={`px-2.5 py-1 text-xs rounded-md ${targetType === 'fish' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    🐟 {lang === 'id' ? 'Kawanan Ikan' : 'Fish'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={triggerSonarPing}
                disabled={isPinging}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Radar className="w-4 h-4 animate-spin" />
                <span>{lang === 'id' ? 'Pancarkan Pulsa Sonar (Kirim Ping!)' : 'Transmit Sonar Pulse (Send Ping!)'}</span>
              </button>
            </div>

            {/* Right Mathematical Solution Card (matching Slide 18 Worked Example 14A) */}
            <div className="md:col-span-6 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2.5">
              <div className="text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>{lang === 'id' ? 'Langkah Perhitungan Fisika (Worked Example 14A):' : 'Physics Calculation Step (Worked Ex 14A):'}</span>
              </div>

              <div className="font-mono text-slate-300 space-y-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div>• {lang === 'id' ? 'Waktu bolak-balik (t):' : 'Round-trip echo time (t):'} <span className="text-cyan-400 font-bold">{theoreticalRoundTripTime.toFixed(3)} s</span></div>
                <div>• {lang === 'id' ? 'Cepat rambat dalam air (v):' : 'Sound speed in water (v):'} <span className="text-white font-bold">1500 m/s</span></div>
                <div>• {lang === 'id' ? 'Rumus jarak tempuh bunyi:' : 'Total distance traveled:'} 2d = v × t</div>
                <div className="pt-1 border-t border-slate-700 text-amber-300 font-bold text-sm">
                  d = (v × t) / 2 = (1500 × {theoreticalRoundTripTime.toFixed(3)}) / 2 = <span className="text-white text-base underline">{targetDepth} m</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                {lang === 'id'
                  ? 'Catatan Kunci: Selalu bagi dua (t / 2 atau jarak / 2) karena pulsa merambat pergi dan kembali!'
                  : 'Key Rule: Always divide by 2 because the ultrasonic pulse travels to the seabed AND back!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 2: MATERIAL FLAW TESTING (FIGURE 14.9) --- */}
      {activeMode === 'testing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'id' ? 'Pemeriksaan Keretakan Beton dengan Ultrasonik (Gambar 14.9)' : 'Inspecting Concrete Slab using Ultrasound (Figure 14.9)'}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'id'
                  ? 'Gelombang ultrasonik dipancarkan oleh transmitter menembus lempeng beton dan diterima oleh sensor.'
                  : 'Ultrasound emerges from a transmitter, passes through the slab, and is received by a sensor.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlabHasDefect(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  !slabHasDefect ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {lang === 'id' ? 'Beton Mulus (Tanpa Cacat)' : 'Intact Concrete (No Defect)'}
              </button>
              <button
                type="button"
                onClick={() => setSlabHasDefect(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  slabHasDefect ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {lang === 'id' ? 'Beton Retak (Ada Rongga Udara)' : 'Concrete with Internal Crack'}
              </button>
            </div>
          </div>

          {/* Interactive Inspection Canvas */}
          <div className="relative h-60 rounded-xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between items-center overflow-hidden">
            {/* Top Transmitter */}
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-cyan-300 font-bold z-10">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Transmitter Ultrasonik</span>
            </div>

            {/* Concrete Slab with internal defect */}
            <div className="relative w-4/5 h-28 rounded-lg bg-stone-700 border-2 border-stone-500 flex items-center justify-center shadow-inner">
              <span className="text-[11px] font-bold text-stone-300 uppercase tracking-widest absolute top-2 left-3">
                {lang === 'id' ? 'Lempeng Beton (Concrete Slab)' : 'Concrete Slab'}
              </span>

              {/* Ultrasound Waves moving */}
              {isScanningSlab && (
                <div className="absolute inset-0 bg-cyan-400/20 animate-pulse pointer-events-none" />
              )}

              {/* Internal Defect / Void */}
              {slabHasDefect && (
                <div className="relative bg-stone-900 border-2 border-dashed border-red-500 rounded-md px-3 py-1 text-center animate-pulse">
                  <span className="text-red-400 text-xs font-bold">
                    ⚡ {lang === 'id' ? 'Retak Internal / Rongga Udara' : 'Internal Crack / Air Defect'}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Receiver */}
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-orange-300 font-bold z-10">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Sensor / Receiver</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={testConcreteSlab}
              disabled={isScanningSlab}
              className="py-2.5 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 disabled:opacity-50"
            >
              {lang === 'id' ? 'Lakukan Pemindaian Kualitas Mutu Beton' : 'Perform Quality Control Scan'}
            </button>

            {testResult === 'defect-detected' && (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800 px-3 py-2 rounded-lg">
                <span>⚠️ {lang === 'id' ? 'CACAT TERDETEKSI: Pantulan gelombang lebih cepat terjadi di dalam rongga sebelum mencapai sensor!' : 'DEFECT DETECTED: Premature echo detected from internal flaw!'}</span>
              </div>
            )}

            {testResult === 'intact' && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'id' ? 'BETON LULUS UJI: Gelombang merambat homogen tanpa distorsi.' : 'PASSED: Homogeneous sound propagation throughout slab.'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODE 3: PRENATAL SCANNING VS X-RAYS (PRACTISE 14.3 Q3) --- */}
      {activeMode === 'prenatal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{lang === 'id' ? 'USG Medis Janin vs Sinar-X (Soal 14.3 No. 3 & Gambar 14.10)' : 'Medical Prenatal Ultrasound vs X-rays (Practise 14.3 Q3)'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ultrasound Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>{lang === 'id' ? 'Ultrasonografi (USG Kandungan)' : 'Medical Ultrasound Scan'}</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">{lang === 'id' ? 'Aman Non-Ionisasi:' : 'Safe & Non-Ionizing:'}</strong> {lang === 'id' ? 'Berupa gelombang mekanik suara frekuensi tinggi, bukan radiasi radioaktif.' : 'Mechanical acoustic waves, not ionizing radiation.'}</li>
                <li><strong className="text-white">{lang === 'id' ? 'Tanpa Risiko Mutasi Janin:' : 'Harmless to Foetus:'}</strong> {lang === 'id' ? 'Tidak merusak DNA jaringan janin yang sedang berkembang cepat.' : 'Will not mutate DNA or damage developing foetal tissues.'}</li>
                <li><strong className="text-white">{lang === 'id' ? 'Membedakan Jaringan Lunak:' : 'Soft Tissue Contrast:'}</strong> {lang === 'id' ? 'Sangat baik dalam memetakan batas cairan ketuban dan organ lunak.' : 'Excellent at resolving boundaries between amniotic fluid and soft organs.'}</li>
              </ul>
            </div>

            {/* X-Ray Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/40 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <span>☢️ {lang === 'id' ? 'Sinar-X (Rontgen Konvensional)' : 'X-rays (Ionizing Radiation)'}</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong className="text-white">{lang === 'id' ? 'Radiasi Pengion Berenergi Tinggi:' : 'High Energy Ionizing Radiation:'}</strong> {lang === 'id' ? 'Dapat melepaskan elektron dari atom dan merusak molekul sel.' : 'Can knock electrons out of molecules and break chemical bonds.'}</li>
                <li><strong className="text-white">{lang === 'id' ? 'Bahaya Mutasi DNA:' : 'Risk of Genetic Mutation:'}</strong> {lang === 'id' ? 'Berisiko memicu kecacatan bawaan lahir jika digunakan pada ibu hamil.' : 'Presents severe risk of congenital defects to developing embryo.'}</li>
                <li><strong className="text-white">{lang === 'id' ? 'Hanya Bagus untuk Tulang:' : 'Best for Dense Bone:'}</strong> {lang === 'id' ? 'Jaringan lunak tembus pandang oleh sinar-X.' : 'Soft organs appear faint; primarily absorbs in dense calcium bone.'}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

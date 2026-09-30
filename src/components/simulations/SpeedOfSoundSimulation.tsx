import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types/physics';
import { soundEngine } from '../../utils/audio';
import { SPEED_DATA } from '../../data/curriculumData';
import { Play, RotateCcw, Timer, Zap, Flag, Award, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SpeedOfSoundSimulationProps {
  lang: Language;
}

export const SpeedOfSoundSimulation: React.FC<SpeedOfSoundSimulationProps> = ({ lang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'race' | 'investigation' | 'thunder'>('investigation');

  // --- Sub-Tab 1: Wave Speed Race ---
  const [raceRunning, setRaceRunning] = useState<boolean>(false);
  const [raceProgress, setRaceProgress] = useState<{ air: number; water: number; iron: number }>({ air: 0, water: 0, iron: 0 });

  const startRace = () => {
    setRaceProgress({ air: 0, water: 0, iron: 0 });
    setRaceRunning(true);
  };

  useEffect(() => {
    let anim: number;
    if (raceRunning) {
      const step = () => {
        setRaceProgress((prev) => {
          // Iron (5000 m/s) is ~15x faster than air (330 m/s)
          // Water (1500 m/s) is ~4.5x faster than air
          const nextIron = Math.min(100, prev.iron + 6.0);
          const nextWater = Math.min(100, prev.water + 1.8);
          const nextAir = Math.min(100, prev.air + 0.4);

          if (nextAir >= 100) {
            setRaceRunning(false);
          }
          return { air: nextAir, water: nextWater, iron: nextIron };
        });
        if (raceRunning) anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(anim);
  }, [raceRunning]);

  // --- Sub-Tab 2: Investigation 14A Direct Timing Method ---
  const [distance, setDistance] = useState<number>(800); // 800m default matching Slide 11
  const [investigationState, setInvestigationState] = useState<'idle' | 'fired' | 'soundArrived' | 'stopped'>('idle');
  const [stopwatchTime, setStopwatchTime] = useState<number>(0);
  const [measuredSpeed, setMeasuredSpeed] = useState<number | null>(null);
  const [flashVisible, setFlashVisible] = useState<boolean>(false);
  const [reactionNote, setReactionNote] = useState<string>('');

  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Speed of sound in ambient air
  const theoreticalSpeed = 333.3; // m/s
  const actualTravelTime = distance / theoreticalSpeed; // seconds

  const fireStartingPistol = () => {
    setInvestigationState('fired');
    setFlashVisible(true);
    setStopwatchTime(0);
    setMeasuredSpeed(null);
    setReactionNote('');

    // Flash appears instantly (Light speed 300,000,000 m/s)
    setTimeout(() => setFlashVisible(false), 200);

    const now = performance.now();
    startTimeRef.current = now;

    // Run stopwatch display
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      setStopwatchTime(elapsed);
    }, 10);

    // Schedule arrival of acoustic sound bang BANG
    setTimeout(() => {
      soundEngine.playPistolShot();
      setInvestigationState('soundArrived');
    }, actualTravelTime * 1000);
  };

  const stopStopwatch = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    const finalElapsed = (performance.now() - startTimeRef.current) / 1000;
    setStopwatchTime(finalElapsed);
    setInvestigationState('stopped');

    const calculatedV = distance / finalElapsed;
    setMeasuredSpeed(calculatedV);

    const timeDiff = finalElapsed - actualTravelTime;
    if (Math.abs(timeDiff) < 0.25) {
      setReactionNote(lang === 'id' ? 'Akurasi luar biasa! Refleks sangat tajam.' : 'Excellent precision! Very sharp reaction time.');
    } else if (timeDiff < -0.1) {
      setReactionNote(lang === 'id' ? 'Anda menekan stopwatch sebelum bunyi sampai!' : 'You stopped the watch before the sound arrived!');
    } else {
      setReactionNote(lang === 'id' ? `Waktu reaksi manusia menambahkan keterlambatan ~${timeDiff.toFixed(2)} detik.` : `Human reaction time added ~${timeDiff.toFixed(2)}s delay.`);
    }
  };

  const resetInvestigation = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setInvestigationState('idle');
    setStopwatchTime(0);
    setMeasuredSpeed(null);
    setFlashVisible(false);
    setReactionNote('');
  };

  // --- Sub-Tab 3: Thunder and Lightning Calculator (Slide 12 Q2) ---
  const [thunderTime, setThunderTime] = useState<number>(3.0);
  const [thunderDistanceKm, setThunderDistanceKm] = useState<number>(1.0);
  const [isSimulatingStorm, setIsSimulatingStorm] = useState<boolean>(false);
  const [stormFlash, setStormFlash] = useState<boolean>(false);

  const simulateThunderStrike = () => {
    setIsSimulatingStorm(true);
    setStormFlash(true);
    setTimeout(() => setStormFlash(false), 250);

    // Play thunder after thunderTime seconds
    setTimeout(() => {
      soundEngine.playThunder();
      setIsSimulatingStorm(false);
    }, thunderTime * 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Section Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
          <span>Cambridge IGCSE™ Physics</span>
          <span aria-hidden="true">·</span>
          <span>14.2 Transmission & Speed of Sound (Slides 8, 10–12)</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {lang === 'id' ? 'Cepat Rambat Bunyi & Eksperimen Lapangan 14A' : 'Speed of Sound & Investigation 14A Direct Method'}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-1">
          {lang === 'id'
            ? 'Bandingkan laju bunyi pada zat padat, cair, dan gas, serta simulasikan pengukuran langsung menggunakan pistol start dan stopwatch.'
            : 'Compare sound speed in solids, liquids, and gases, and simulate direct timing measurement using a starting pistol and stopwatch.'}
        </p>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('investigation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === 'investigation' ? 'bg-orange-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🎯 {lang === 'id' ? 'Eksperimen 14A (Pistol & Stopwatch)' : 'Investigation 14A (Direct Method)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('race')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === 'race' ? 'bg-orange-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⚡ {lang === 'id' ? 'Balapan Cepat Rambat (Gas vs Cair vs Padat)' : 'Speed Race in Media'}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('thunder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSubTab === 'thunder' ? 'bg-orange-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🌩️ {lang === 'id' ? 'Kilat & Guntur (Soal 14.2 No. 2)' : 'Thunder & Lightning (Practise 14.2)'}
          </button>
        </div>
      </div>

      {/* --- SUB-TAB 1: INVESTIGATION 14A DIRECT METHOD --- */}
      {activeSubTab === 'investigation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'id' ? 'Investigasi 14A: Pengukuran Langsung Cepat Rambat Bunyi' : 'Investigation 14A: Direct Measurement of Speed of Sound in Air'}</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'id' ? 'Berdasarkan Gambar 14.5 Buku Siswa: Jarak d = 800 m, t = 2,4 s ➔ v = d / t = 333 m/s' : 'Based on SB Figure 14.5: Distance d = 800 m, t = 2.4 s ➔ v = d / t = 333 m/s'}
              </p>
            </div>

            {/* Distance Slider */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
              <span className="text-xs font-medium text-slate-300">{lang === 'id' ? 'Jarak Lapangan (d):' : 'Field Distance (d):'}</span>
              <input
                type="range"
                min="400"
                max="1200"
                step="100"
                value={distance}
                disabled={investigationState === 'fired'}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-32 accent-orange-500 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-orange-400">{distance} m</span>
            </div>
          </div>

          {/* Interactive Visual Simulation Field */}
          <div className="relative h-64 rounded-xl bg-gradient-to-b from-sky-950/70 via-slate-900 to-emerald-950/40 border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
            {/* Flash Effect over entire field */}
            {flashVisible && (
              <div className="absolute inset-0 bg-yellow-300/40 pointer-events-none z-30 animate-ping" />
            )}

            {/* Top Field Distance Marker */}
            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-slate-700 pb-2">
              <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold">
                <Flag className="w-4 h-4" />
                <span>{lang === 'id' ? 'Titik A: Penembak Pistol' : 'Point A: Pistol Shooter'}</span>
              </div>
              <div className="flex-1 mx-4 text-center font-mono text-xs text-slate-300 bg-slate-950/80 py-0.5 rounded border border-slate-800">
                &larr; {lang === 'id' ? 'Jarak Terbuka' : 'Open Field Distance'} d = {distance} m &rarr;
              </div>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                <Timer className="w-4 h-4" />
                <span>{lang === 'id' ? 'Titik B: Pengamat & Stopwatch' : 'Point B: Observer & Stopwatch'}</span>
              </div>
            </div>

            {/* Field Characters & Wavefront */}
            <div className="relative z-10 flex items-center justify-between my-auto px-4">
              {/* Person A with Starting Pistol */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-20 flex flex-col items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900" />
                    <div className="w-8 h-10 bg-blue-600 rounded-t-md mt-0.5" />
                    <div className="w-6 h-8 bg-slate-800" />
                  </div>
                  {/* Gun arm raised */}
                  <div className="absolute top-4 right-[-10px] w-6 h-2 bg-slate-400 rotate-[-30deg]" />
                  {flashVisible && (
                    <div className="absolute top-1 right-[-24px] w-8 h-8 rounded-full bg-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-400">
                      <Zap className="w-5 h-5 text-red-600 animate-spin" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-300 mt-1">Person A</span>
              </div>

              {/* Acoustic Wavefront traveling across field */}
              {investigationState === 'fired' && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-24 border-r-4 border-orange-500 rounded-full bg-orange-500/10 pointer-events-none transition-all linear"
                  style={{
                    left: `${Math.min(90, 8 + (stopwatchTime / actualTravelTime) * 82)}%`,
                    opacity: 0.8
                  }}
                />
              )}

              {/* Person B with Stopwatch */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-20 flex flex-col items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900" />
                    <div className="w-8 h-10 bg-emerald-600 rounded-t-md mt-0.5" />
                    <div className="w-6 h-8 bg-slate-800" />
                  </div>
                  {/* Stopwatch in hand */}
                  <div className="absolute top-6 left-[-8px] w-4 h-4 rounded-full bg-cyan-400 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-950">
                    ⏱️
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-300 mt-1">Person B</span>
              </div>
            </div>

            {/* Bottom Ground & Status */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-2">
              <span>{lang === 'id' ? 'Kecepatan Cahaya c = 300.000 km/s (Kilatan terlihat seketika)' : 'Speed of Light c = 300,000 km/s (Flash seen instantaneously)'}</span>
              <span className="text-orange-400 font-medium">
                {investigationState === 'fired' && (lang === 'id' ? 'Gelombang bunyi sedang merambat di udara...' : 'Sound wave traveling through air...')}
                {investigationState === 'soundArrived' && (lang === 'id' ? 'BUNYI DENTUMAN SAMPAI! KLIK STOP!' : 'BANG ARRIVED! PRESS STOP!')}
              </span>
            </div>
          </div>

          {/* Stopwatch Controls & Interactive Reaction Test */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Stopwatch Display */}
            <div className="md:col-span-4 bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">{lang === 'id' ? 'Stopwatch Digital' : 'Digital Stopwatch'}</span>
              <div className="text-3xl md:text-4xl font-mono font-black text-cyan-400 my-1">
                {stopwatchTime.toFixed(3)} <span className="text-sm font-normal text-slate-400">s</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {lang === 'id' ? `Waktu teoritis tepat: ${(distance / theoreticalSpeed).toFixed(3)} s` : `True theoretical time: ${(distance / theoreticalSpeed).toFixed(3)} s`}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-8 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={fireStartingPistol}
                  disabled={investigationState === 'fired'}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>{lang === 'id' ? 'Tembakkan Pistol Start!' : 'Fire Starting Pistol!'}</span>
                </button>

                <button
                  type="button"
                  onClick={stopStopwatch}
                  disabled={investigationState !== 'fired' && investigationState !== 'soundArrived'}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Timer className="w-4 h-4" />
                  <span>{lang === 'id' ? 'HENTIKAN STOPWATCH (Saat Dengar Bang!)' : 'STOP STOPWATCH (When Bang Heard!)'}</span>
                </button>

                <button
                  type="button"
                  onClick={resetInvestigation}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Measured Calculation Result Box */}
              {measuredSpeed !== null && (
                <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-emerald-300">
                      v = d / t = {distance} m / {stopwatchTime.toFixed(3)} s = <span className="font-mono text-base text-white">{measuredSpeed.toFixed(1)} m/s</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-0.5">{reactionNote}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400">{lang === 'id' ? 'Nilai Rujukan Cambridge:' : 'Cambridge Benchmark:'}</span>
                    <div className="font-mono font-bold text-orange-400">330 – 350 m/s</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: SPEED RACE IN DIFFERENT MEDIA --- */}
      {activeSubTab === 'race' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'id' ? 'Balapan Kecepatan Bunyi di Berbagai Medium (Tabel 14.1)' : 'Speed of Sound in Different Media Race (Table 14.1)'}</span>
              </h3>
              <p className="text-xs text-slate-300">
                v (gas) &lt; v (liquid) &lt; v (solid) ➔ {lang === 'id' ? 'Partikel padat rapat mentransfer energi getar jauh lebih cepat' : 'Tightly packed solid lattice transfers acoustic energy rapidly'}
              </p>
            </div>

            <button
              type="button"
              onClick={startRace}
              disabled={raceRunning}
              className="py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{lang === 'id' ? 'Mulai Balapan Gelombang!' : 'Start Wavefront Race!'}</span>
            </button>
          </div>

          {/* 3 Race Tracks */}
          <div className="space-y-4">
            {SPEED_DATA.map((item, idx) => {
              const currentP = idx === 0 ? raceProgress.air : idx === 1 ? raceProgress.water : raceProgress.iron;
              return (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.medium[lang]}
                    </span>
                    <span className="font-mono font-bold text-slate-300">
                      v ≈ {item.speed} m/s
                    </span>
                  </div>

                  {/* Track Bar */}
                  <div className="relative h-10 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center px-2">
                    {/* Progress Wave */}
                    <div
                      className="absolute top-0 bottom-0 left-0 transition-all duration-75 rounded-r-lg opacity-30"
                      style={{
                        width: `${currentP}%`,
                        backgroundColor: item.color
                      }}
                    />

                    {/* Wavefront icon */}
                    <div
                      className="absolute transition-all duration-75 flex items-center"
                      style={{ left: `calc(${currentP}% - 14px)` }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-md" style={{ backgroundColor: item.color }}>
                        {item.type === 'solid' ? '🧱' : item.type === 'liquid' ? '💧' : '💨'}
                      </div>
                    </div>

                    {/* Finish Line */}
                    <div className="absolute right-3 top-0 bottom-0 flex items-center border-l-2 border-dashed border-red-500/60 pl-1 text-[10px] text-red-400 font-bold">
                      FINISH
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-orange-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'id' ? 'Mengapa Bunyi Merambat Lebih Cepat pada Zat Padat?' : 'Why Does Sound Travel Faster in Solids?'}</span>
            </div>
            <p className="leading-relaxed">
              {lang === 'id'
                ? 'Pada zat padat (seperti besi 5.000 m/s), partikel-partikel terikat sangat rapat dan memiliki ikatan antarmolekul yang kuat. Saat satu partikel bergetar, energinya seketika diteruskan ke partikel sebelahnya. Pada gas (seperti udara 330 m/s), partikel saling berjauhan sehingga tumbukan antarpartikel membutuhkan waktu lebih lama.'
                : 'In solids (e.g. iron at 5000 m/s), atoms are bound closely together in a rigid lattice. Displacing one particle transmits energy almost immediately to its neighbors. In gases (air at 330 m/s), particles are spaced far apart and rely on random molecular collisions.'}
            </p>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 3: THUNDER & LIGHTNING CALCULATOR (PRACTISE 14.2 Q2) --- */}
      {activeSubTab === 'thunder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'id' ? 'Soal Cambridge 14.2: Kilat dan Gemuruh Petir' : 'Cambridge Practise 14.2: Lightning & Thunder Calculation'}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'id'
                  ? 'Seorang wanita berada pada jarak 1,00 km dari badai dan mendengar guntur 3 detik setelah melihat kilatan. Hitung cepat rambat bunyi.'
                  : 'A woman standing 1.00 km away hears thunder 3 s after seeing lightning. Calculate speed of sound.'}
              </p>
            </div>

            <button
              type="button"
              onClick={simulateThunderStrike}
              disabled={isSimulatingStorm}
              className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{lang === 'id' ? 'Simulasikan Sambaran Petir!' : 'Simulate Lightning Strike!'}</span>
            </button>
          </div>

          {/* Storm Visual Area */}
          <div className="relative h-44 rounded-xl bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            {stormFlash && (
              <div className="absolute inset-0 bg-white/90 pointer-events-none z-20 animate-ping" />
            )}
            <div className="relative z-10 text-center space-y-2">
              <div className="text-4xl">🌩️ &rarr; 🏃‍♀️</div>
              <div className="text-xs text-slate-300 font-mono">
                {lang === 'id' ? 'Jarak d = 1,00 km = 1.000 m | Jeda Waktu t = 3 detik' : 'Distance d = 1.00 km = 1000 m | Time delay t = 3 seconds'}
              </div>
              {isSimulatingStorm && (
                <div className="text-xs text-amber-300 font-semibold animate-pulse">
                  {lang === 'id' ? 'Menunggu suara guntur merambat...' : 'Waiting for thunder rumble to arrive...'}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Formula Calculator */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">
                {lang === 'id' ? 'Jarak Badai (d):' : 'Distance to storm (d):'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={thunderDistanceKm}
                  onChange={(e) => setThunderDistanceKm(parseFloat(e.target.value) || 1)}
                  className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                />
                <span className="text-slate-300">km (= {(thunderDistanceKm * 1000).toFixed(0)} m)</span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">
                {lang === 'id' ? 'Jeda Waktu Suara (t):' : 'Time delay (t):'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={thunderTime}
                  onChange={(e) => setThunderTime(parseFloat(e.target.value) || 1)}
                  className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                />
                <span className="text-slate-300">{lang === 'id' ? 'detik' : 'seconds'}</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex flex-col justify-center">
              <span className="text-slate-400">{lang === 'id' ? 'Cepat Rambat Bunyi (v):' : 'Speed of sound (v):'}</span>
              <div className="font-mono text-lg font-bold text-orange-400">
                v = d / t = {((thunderDistanceKm * 1000) / thunderTime).toFixed(1)} m/s
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

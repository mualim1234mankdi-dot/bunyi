import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../../types/physics';
import { soundEngine } from '../../utils/audio';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, HelpCircle, ArrowRight, Play } from 'lucide-react';

interface EchoReflectionSimulationProps {
  lang: Language;
}

export const EchoReflectionSimulation: React.FC<EchoReflectionSimulationProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'wall' | 'law'>('wall');

  // --- Sub-simulation 1: Wall Echo ---
  const [distanceToWall, setDistanceToWall] = useState<number>(50); // meters (Slide 14 uses 50m)
  const [isClapping, setIsClapping] = useState<boolean>(false);
  const [wavePos, setWavePos] = useState<number>(0); // 0 to 100% of outbound, 100 to 200% return
  const [clappedTimes, setClappedTimes] = useState<number>(0);

  const speedInAir = 330; // m/s
  const totalTravelTime = (2 * distanceToWall) / speedInAir; // seconds
  const isDistinctEcho = totalTravelTime >= 0.1; // Human persistence of hearing threshold ~0.1s (~17m)

  const handleClap = () => {
    if (isClapping) return;
    setIsClapping(true);
    setWavePos(0);
    setClappedTimes((prev) => prev + 1);

    // Play clap + echo through Web Audio
    soundEngine.playClapWithEcho(totalTravelTime, 0.45);

    // Animate visual wavefront traveling to wall and returning
    const startTime = performance.now();
    const duration = totalTravelTime * 1000;

    const anim = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setWavePos(progress * 200); // 0 to 100 to wall, 100 to 200 back

      if (progress < 1) {
        requestAnimationFrame(anim);
      } else {
        setIsClapping(false);
      }
    };
    requestAnimationFrame(anim);
  };

  // --- Sub-simulation 2: Law of Reflection (Figure 14.8 Cardboard Tubes) ---
  const [incidentAngle, setIncidentAngle] = useState<number>(45); // degrees
  const [reflectedAngle, setReflectedAngle] = useState<number>(30); // student adjusts detector
  const [isTicking, setIsTicking] = useState<boolean>(true);

  // Sound intensity peaks sharply when reflectedAngle === incidentAngle (Law of Reflection)
  const angleDifference = Math.abs(reflectedAngle - incidentAngle);
  const detectedLoudness = Math.max(0, Math.round(100 * Math.exp(-Math.pow(angleDifference / 8, 2))));

  return (
    <div className="space-y-6">
      {/* Title & Section Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
          <span>Cambridge IGCSE™ Physics</span>
          <span aria-hidden="true">·</span>
          <span>14.3 Echoes & Law of Reflection (Slides 13–15)</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {lang === 'id' ? 'Pemantulan Gelombang Bunyi & Terjadinya Gema' : 'Sound Wave Reflection & Echo Formation'}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-1">
          {lang === 'id'
            ? 'Gema adalah pemantulan gelombang bunyi dari permukaan keras. Uji hukum pemantulan sudut datang i = sudut pantul r menggunakan tabung karton.'
            : 'An echo is the reflection of sound waves off hard, flat surfaces. Test the law of sound reflection (angle of incidence i = angle of reflection r).'}
        </p>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('wall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'wall' ? 'bg-orange-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            👏 {lang === 'id' ? 'Simulasi Gema Tepuk Tangan (Gbr 14.7)' : 'Clap Echo Simulator (Fig 14.7)'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('law')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'law' ? 'bg-orange-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            📐 {lang === 'id' ? 'Hukum Pemantulan Bunyi (Tabung Karton & Jam)' : 'Law of Reflection Apparatus (Fig 14.8)'}
          </button>
        </div>
      </div>

      {/* --- SUB-TAB 1: WALL ECHO SIMULATION --- */}
      {activeTab === 'wall' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'id' ? 'Eksperimen Gema Tunggal (Slide 14 - Gambar 14.7)' : 'Single Echo Formation (Slide 14 - Figure 14.7)'}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'id'
                  ? 'Berdiri 50 m dari dinding datar besar tanpa halangan dan tepuk tangan sekali.'
                  : 'Stand 50 m from a large unobstructed wall and clap hands once.'}
              </p>
            </div>

            {/* Distance Slider */}
            <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 font-medium">{lang === 'id' ? 'Jarak ke Dinding (d):' : 'Distance to Wall (d):'}</span>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={distanceToWall}
                disabled={isClapping}
                onChange={(e) => setDistanceToWall(parseInt(e.target.value))}
                className="w-28 accent-orange-500 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-orange-400">{distanceToWall} m</span>
            </div>
          </div>

          {/* Interactive Visual Echo Area */}
          <div className="relative h-60 rounded-xl bg-slate-950 border border-slate-800 p-4 flex items-center justify-between overflow-hidden">
            {/* Ground grid */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Person Clapping on the Left */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-24 flex flex-col items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-amber-400 border border-slate-900" />
                <div className="w-9 h-12 bg-orange-600 rounded-t-md mt-0.5" />
                <div className="w-7 h-9 bg-slate-800" />
              </div>
              <div className="mt-1 text-xs font-bold text-slate-200">
                {lang === 'id' ? 'Penepuk Tangan' : 'Clapper'}
              </div>
              <div className="text-[10px] text-slate-400">
                {lang === 'id' ? 'Sumber & Pendengar' : 'Source & Listener'}
              </div>
            </div>

            {/* Dynamic Sound Wavefront (Outbound and Inbound) */}
            {isClapping && (
              <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-transform"
                style={{
                  left: wavePos <= 100
                    ? `${10 + (wavePos / 100) * 78}%`
                    : `${88 - ((wavePos - 100) / 100) * 78}%`
                }}
              >
                {wavePos <= 100 ? (
                  // Outbound wave
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-28 border-r-4 border-cyan-400 rounded-full bg-cyan-400/20" />
                    <span className="text-[10px] text-cyan-300 font-mono mt-1 font-bold whitespace-nowrap">
                      {lang === 'id' ? 'Gelombang Datang &rarr;' : 'Incident Wave &rarr;'}
                    </span>
                  </div>
                ) : (
                  // Reflected wave
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-28 border-l-4 border-orange-400 rounded-full bg-orange-400/20" />
                    <span className="text-[10px] text-orange-300 font-mono mt-1 font-bold whitespace-nowrap">
                      {lang === 'id' ? '&larr; Gema Pantulan' : '&larr; Reflected Echo'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Distance Line Marker */}
            <div className="absolute bottom-4 left-24 right-28 flex items-center justify-between border-b border-dashed border-slate-700 pb-1">
              <span className="text-[10px] text-slate-500">&larr;</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                d = {distanceToWall} m (Total 2d = {2 * distanceToWall} m)
              </span>
              <span className="text-[10px] text-slate-500">&rarr;</span>
            </div>

            {/* Hard Unobstructed Wall on the Right */}
            <div className="relative z-10 w-20 h-44 rounded-lg bg-gradient-to-l from-slate-700 to-slate-600 border-2 border-slate-500 flex flex-col items-center justify-center shadow-2xl">
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-widest -rotate-90">
                {lang === 'id' ? 'Dinding Keras' : 'Hard Wall'}
              </div>
            </div>
          </div>

          {/* Controls & Math Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 space-y-2">
              <button
                type="button"
                onClick={handleClap}
                disabled={isClapping}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                <span>{lang === 'id' ? 'Tepuk Tangan Sekali (Dengarkan Gema!)' : 'Clap Hands Once (Hear Echo!)'}</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center">
                {lang === 'id' ? 'Bunyi tepukan awal diikuti pantulan gema setelah jeda waktu.' : 'Original clap sound is followed by the reflected echo after time delay.'}
              </p>
            </div>

            {/* Calculation Card */}
            <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>{lang === 'id' ? 'Jarak Tempuh Bolak-Balik:' : 'Total Round-Trip Distance:'}</span>
                <span className="font-mono font-bold text-white">2 &times; {distanceToWall} m = {2 * distanceToWall} m</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>{lang === 'id' ? 'Jeda Waktu Tiba Gema:' : 'Echo Delay Time (Δt):'}</span>
                <span className="font-mono font-bold text-orange-400">
                  t = 2d / v = {2 * distanceToWall} / 330 = <strong className="text-white text-sm">{totalTravelTime.toFixed(3)} s</strong>
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">{lang === 'id' ? 'Jenis Persepsi Telinga:' : 'Hearing Perception:'}</span>
                {isDistinctEcho ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-semibold">
                    ✓ {lang === 'id' ? 'Gema Jelas (t ≥ 0,1 detik)' : 'Distinct Echo (t ≥ 0.1s)'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-semibold">
                    ⚠ {lang === 'id' ? 'Gaung / Gaung Bertumpuk (t < 0,1 detik)' : 'Reverberation (t < 0.1s)'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: LAW OF REFLECTION APPARATUS (FIGURE 14.8) --- */}
      {activeTab === 'law' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'id' ? 'Eksperimen Tabung Karton Pemantulan Bunyi (Gambar 14.8)' : 'Sound Reflection Apparatus (Figure 14.8 SB)'}
              </h3>
              <p className="text-xs text-slate-300">
                {lang === 'id'
                  ? 'Putar sudut tabung pendengar (r). Telinga akan mendeteksi suara detak jam paling keras saat Sudut Datang i = Sudut Pantul r.'
                  : 'Rotate the listener tube angle (r). The ear detects loudest sound when Angle of Incidence i = Angle of Reflection r.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">{lang === 'id' ? 'Keras Suara Terdeteksi:' : 'Detected Loudness:'}</span>
              <div className="w-24 bg-slate-950 h-5 rounded-md border border-slate-800 overflow-hidden flex items-center p-0.5">
                <div
                  className="h-full rounded transition-all duration-150"
                  style={{
                    width: `${detectedLoudness}%`,
                    backgroundColor: detectedLoudness > 80 ? '#22c55e' : detectedLoudness > 40 ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-white w-9 text-right">{detectedLoudness}%</span>
            </div>
          </div>

          {/* Interactive SVG Diagram representing Figure 14.8 */}
          <div className="relative h-72 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-2xl">
              {/* Hard Flat Surface (Wall) on Top */}
              <rect x="150" y="20" width="300" height="24" fill="#64748b" stroke="#94a3b8" strokeWidth="2" rx="3" />
              <text x="300" y="36" fill="#f8fafc" fontSize="11" textAnchor="middle" fontWeight="bold">
                {lang === 'id' ? 'Permukaan Keras Datar (Tembok)' : 'Hard, Flat Surface (Wall)'}
              </text>

              {/* Normal Line (Perpendicular line) */}
              <line x1="300" y1="44" x2="300" y2="180" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="306" y="80" fill="#f59e0b" fontSize="10">Normal</text>

              {/* Central Barrier (Prevents direct sound travel) */}
              <rect x="297" y="100" width="6" height="150" fill="#dc2626" rx="2" />
              <text x="310" y="220" fill="#ef4444" fontSize="10">
                {lang === 'id' ? 'Penghalang (Barrier)' : 'Barrier (No Direct Sound)'}
              </text>

              {/* Incident Tube (Left) at angle incidentAngle */}
              {(() => {
                const rad = ((90 - incidentAngle) * Math.PI) / 180;
                const len = 170;
                const endX = 300 - len * Math.sin(rad);
                const endY = 44 + len * Math.cos(rad);
                return (
                  <g>
                    {/* Incident Ray Line */}
                    <line x1={endX} y1={endY} x2="300" y2="44" stroke="#38bdf8" strokeWidth="4" />
                    {/* Arrow head */}
                    <polygon points="295,50 300,44 302,54" fill="#38bdf8" />
                    {/* Ticking clock at tube base */}
                    <circle cx={endX} cy={endY} r="18" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                    <text x={endX} y={endY + 4} fill="#fff" fontSize="14" textAnchor="middle">⏰</text>
                    <text x={endX - 10} y={endY + 30} fill="#94a3b8" fontSize="10">
                      {lang === 'id' ? 'Jam Tik (Sumber)' : 'Ticking Clock'}
                    </text>
                  </g>
                );
              })()}

              {/* Reflected Tube (Right) at angle reflectedAngle */}
              {(() => {
                const rad = ((90 - reflectedAngle) * Math.PI) / 180;
                const len = 170;
                const endX = 300 + len * Math.sin(rad);
                const endY = 44 + len * Math.cos(rad);
                const isOptimal = detectedLoudness > 85;
                return (
                  <g>
                    {/* Reflected Ray Line */}
                    <line x1="300" y1="44" x2={endX} y2={endY} stroke={isOptimal ? '#22c55e' : '#f97316'} strokeWidth="4" />
                    {/* Arrow head */}
                    <polygon points={`${endX - 5},${endY - 5} ${endX},${endY} ${endX - 8},${endY + 2}`} fill={isOptimal ? '#22c55e' : '#f97316'} />
                    {/* Ear / Detector */}
                    <circle cx={endX} cy={endY} r="18" fill={isOptimal ? '#15803d' : '#ea580c'} stroke="#fff" strokeWidth="2" />
                    <text x={endX} y={endY + 4} fill="#fff" fontSize="14" textAnchor="middle">👂</text>
                    <text x={endX + 10} y={endY + 30} fill="#94a3b8" fontSize="10">
                      {lang === 'id' ? 'Telinga Pendengar' : 'Ear / Detector'}
                    </text>
                  </g>
                );
              })()}

              {/* Angle labels */}
              <text x="270" y="60" fill="#38bdf8" fontSize="12" fontWeight="bold">i = {incidentAngle}°</text>
              <text x="315" y="60" fill={detectedLoudness > 85 ? '#22c55e' : '#f97316'} fontSize="12" fontWeight="bold">r = {reflectedAngle}°</text>
            </svg>
          </div>

          {/* Sliders for incident and reflection angles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="font-semibold text-cyan-400">{lang === 'id' ? 'Sudut Datang Bunyi (i):' : 'Angle of Incidence (i):'}</span>
                <span className="font-mono font-bold text-white">{incidentAngle}°</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                value={incidentAngle}
                onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="font-semibold text-orange-400">{lang === 'id' ? 'Sudut Pantul Tabung Telinga (r):' : 'Angle of Reflection Tube (r):'}</span>
                <span className="font-mono font-bold text-white">{reflectedAngle}°</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                value={reflectedAngle}
                onChange={(e) => setReflectedAngle(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Conclusion Box from Figure 14.8 */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              <strong className="text-white block mb-0.5">
                {lang === 'id' ? 'Hukum Pemantulan Bunyi (Law of Sound Reflection):' : 'Law of Sound Reflection:'}
              </strong>
              {lang === 'id'
                ? 'Telinga mendeteksi suara detak jam paling nyaring ketika sudut datang sama dengan sudut pantul (i = r).'
                : 'Ear detects loudest reflected sound when angle of incidence equals angle of reflection (i = r).'}
            </div>
            {incidentAngle === reflectedAngle && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold whitespace-nowrap">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>i = r ({incidentAngle}°) — {lang === 'id' ? 'SUARA TERKERAS!' : 'MAX LOUDNESS!'}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

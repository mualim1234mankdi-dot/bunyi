import React, { useState } from 'react';
import { Language } from '../../types/physics';
import { soundEngine } from '../../utils/audio';
import { Play, Volume2, VolumeX, ShieldAlert, Sparkles, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface IntroSectionProps {
  lang: Language;
  onNavigateNext: () => void;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ lang, onNavigateNext }) => {
  const [environment, setEnvironment] = useState<'earth' | 'space'>('earth');
  const [isExploding, setIsExploding] = useState(false);
  const [showAnswer, setShowAnswer] = useState<number | null>(null);

  const triggerExplosion = () => {
    setIsExploding(true);
    if (environment === 'earth') {
      soundEngine.playPistolShot();
    }
    setTimeout(() => setIsExploding(false), 900);
  };

  const questions = [
    {
      q: {
        en: 'Imagine a battle scene taking place on Earth. What sounds would you expect to hear and why?',
        id: 'Bayangkan adegan pertempuran di Bumi. Bunyi apa saja yang Anda harapkan terdengar dan mengapa kita dapat mendengarnya?'
      },
      a: {
        en: 'You would hear roaring engines, gunfire, and explosive blasts. This is because Earth has an atmosphere (air medium) whose particles oscillate and propagate vibrations to your eardrums.',
        id: 'Kita akan mendengar deru mesin, tembakan, dan ledakan dahsyat. Hal ini karena Bumi memiliki atmosfer (medium udara) yang partikel-partikelnya bergetar dan meneruskan gelombang bunyi ke gendang telinga kita.'
      }
    },
    {
      q: {
        en: 'What misconception about sound in space do people have?',
        id: 'Kesalahpahaman apa tentang bunyi di luar angkasa yang umum dipercayai orang?'
      },
      a: {
        en: 'Most sci-fi Hollywood movies show roaring spaceship engines and loud fiery explosions in deep space. In reality, deep space is completely SILENT to an outside observer!',
        id: 'Banyak film fiksi ilmiah (seperti Star Wars) menampilkan ledakan menggelegar dan raungan mesin di luar angkasa. Nyatanya, luar angkasa hampa udara itu SUNYI SENYAP bagi pengamat luar!'
      }
    },
    {
      q: {
        en: 'Why do you think we cannot hear sound in space?',
        id: 'Mengapa kita sama sekali tidak dapat mendengar bunyi di luar angkasa?'
      },
      a: {
        en: 'Because space is an almost absolute vacuum. Sound is a mechanical wave that requires a material medium (air, liquid, solid) with particles that can vibrate and collide to transfer acoustic energy.',
        id: 'Karena luar angkasa adalah ruang hampa (vakum). Bunyi adalah gelombang mekanik yang mutlak membutuhkan medium materi yang memiliki partikel untuk bergetar dan saling bertumbukan guna mentransfer energi.'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner inspired by Slide 1 & 2 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-400">
              <span>Cambridge IGCSE™ Physics</span>
              <span aria-hidden="true">·</span>
              <span>Slide 1 & 2 Opening Hook</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {lang === 'id' ? 'Bab 14: Bunyi & Gelombang Akustik' : 'Chapter 14: Sound & Wave Mechanics'}
            </h2>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {lang === 'id' 
                ? 'Pernahkah Anda menyaksikan perang antariksa di film fiksi ilmiah di mana pesawat meledak dengan dentuman yang menggelegar? Mari kita uji apakah fenomena tersebut sesuai dengan hukum fisika nyata!'
                : 'Have you ever watched a space battle movie where starships explode with thunderous booms? Let us examine whether this cinematic trope obeys the fundamental laws of physics!'}
            </p>

            {/* Interactive Sci-Fi Space vs Earth Battle Simulation */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  {lang === 'id' ? 'Pilih Lingkungan Pengujian:' : 'Select Testing Environment:'}
                </span>
                <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEnvironment('earth')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      environment === 'earth'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🌍 {lang === 'id' ? 'Atmosfer Bumi (Ada Udara)' : 'Earth (Atmosphere Medium)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnvironment('space')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      environment === 'space'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🌌 {lang === 'id' ? 'Luar Angkasa (Vakum Hampa)' : 'Deep Space (Vacuum)'}
                  </button>
                </div>
              </div>

              {/* Visual Battlefield Canvas Simulation */}
              <div className="relative h-44 rounded-lg bg-gradient-to-b from-black to-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Starfield particles */}
                <div className="absolute inset-0 opacity-50 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Medium particles indicator */}
                {environment === 'earth' && (
                  <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-30">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full bg-cyan-400 ${
                          isExploding ? 'animate-ping' : ''
                        }`}
                        style={{ animationDelay: `${i * 40}ms` }}
                      />
                    ))}
                  </div>
                )}

                {/* Spaceship Graphic */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`relative transition-transform duration-300 ${isExploding ? 'scale-125' : ''}`}>
                    <svg className="w-24 h-16 text-slate-300 drop-shadow" viewBox="0 0 100 60" fill="currentColor">
                      <polygon points="10,30 40,10 70,25 90,30 70,35 40,50" fill="#64748b" />
                      <polygon points="35,20 60,30 35,40" fill="#94a3b8" />
                      <polygon points="5,28 15,30 5,32" fill="#38bdf8" />
                      <circle cx="55" cy="30" r="3" fill="#f97316" />
                    </svg>

                    {/* Explosion Effect */}
                    {isExploding && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-20 h-20 rounded-full bg-orange-500/80 animate-ping" />
                        <div className="absolute w-12 h-12 rounded-full bg-yellow-300 animate-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Audio Status Banner */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-black/60 border border-slate-700">
                    {environment === 'earth' ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span className="text-emerald-300">
                          {lang === 'id' ? 'Terdengar Dentuman! (Ada Medium Udara)' : 'Audible Blast! (Air Medium Present)'}
                        </span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-rose-300">
                          {lang === 'id' ? 'Sunyi Senyap! (Vakum - Tanpa Medium)' : 'Absolute Silence! (Vacuum - No Medium)'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={triggerExplosion}
                disabled={isExploding}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-lg shadow transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {lang === 'id' ? 'Ledakkan Meriam Pesawat!' : 'Fire Starship Cannon!'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Side: Chapter Overview & Questions from Slide 2 */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-orange-400" />
              <span>{lang === 'id' ? 'Pertanyaan Pemantik (Slide 2)' : 'Guiding Questions (Slide 2)'}</span>
            </div>

            <div className="space-y-2.5">
              {questions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors"
                >
                  <p className="text-xs font-medium text-slate-200 mb-2">
                    {item.q[lang]}
                  </p>
                  {showAnswer === idx ? (
                    <div className="mt-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/50 rounded-lg p-2.5 space-y-1">
                      <div className="font-semibold text-emerald-200">
                        {lang === 'id' ? 'Penjelasan Fisika:' : 'Physics Explanation:'}
                      </div>
                      <p>{item.a[lang]}</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAnswer(idx)}
                      className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1"
                    >
                      <span>{lang === 'id' ? 'Lihat Jawaban Konseptual' : 'Reveal Conceptual Answer'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onNavigateNext}
              className="w-full mt-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span>{lang === 'id' ? 'Lanjut ke 14.1: Sifat Gelombang Bunyi' : 'Proceed to 14.1: Sound Wave Nature'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Volume2, VolumeX, Globe, Sparkles, BookOpen, Waves, BellRing, Gauge, Radar, Sliders, Network, HelpCircle } from 'lucide-react';
import { Language, SimulationTab } from '../types/physics';
import { soundEngine } from '../utils/audio';

interface HeaderProps {
  currentTab: SimulationTab;
  onSelectTab: (tab: SimulationTab) => void;
  lang: Language;
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  isMuted,
  onToggleMute
}) => {
  const tabs = [
    {
      id: 'intro' as SimulationTab,
      label: { en: 'Intro & Space', id: 'Intro & Angkasa' },
      icon: Sparkles,
      slide: 'Slide 1-2'
    },
    {
      id: 'waves' as SimulationTab,
      label: { en: '14.1 Wave Nature', id: '14.1 Gelombang' },
      icon: Waves,
      slide: 'Slide 3-7'
    },
    {
      id: 'bell-jar' as SimulationTab,
      label: { en: '14.2 Bell Jar & Medium', id: '14.2 Sungkup Vakum' },
      icon: BellRing,
      slide: 'Slide 8-9'
    },
    {
      id: 'speed' as SimulationTab,
      label: { en: '14.2 Speed of Sound', id: '14.2 Cepat Rambat' },
      icon: Gauge,
      slide: 'Slide 10-12'
    },
    {
      id: 'echo-sonar' as SimulationTab,
      label: { en: '14.3 Echo & Ultrasound', id: '14.3 Gema & USG' },
      icon: Radar,
      slide: 'Slide 13-19'
    },
    {
      id: 'pitch-cro' as SimulationTab,
      label: { en: '14.4 Pitch & CRO', id: '14.4 Osiloskop CRO' },
      icon: Sliders,
      slide: 'Slide 20-23'
    },
    {
      id: 'concept-map' as SimulationTab,
      label: { en: 'Concept Map', id: 'Peta Konsep' },
      icon: Network,
      slide: 'Slide 24-25'
    },
    {
      id: 'quiz' as SimulationTab,
      label: { en: 'Practice & Quiz', id: 'Latihan & Kuis' },
      icon: HelpCircle,
      slide: 'Slide 26'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Chapter Tag */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-white shadow-md shadow-orange-500/20 text-lg">
                14
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">
                    {lang === 'id' ? 'Fisika Cambridge IGCSE: BUNYI' : 'Cambridge IGCSE Physics: SOUND'}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Marshall Cavendish Education</span>
                  <span aria-hidden="true">·</span>
                  <span>Chapter 14 Complete Lab</span>
                </div>
              </div>
            </div>

            {/* Utility Controls (Mobile & Desktop) */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={onToggleLang}
                title={lang === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Indonesian'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'id' ? 'ID 🇮🇩' : 'EN 🇬🇧'}</span>
              </button>

              {/* Master Mute / Sound Toggle */}
              <button
                type="button"
                onClick={onToggleMute}
                title={isMuted ? (lang === 'id' ? 'Nyalakan Audio' : 'Unmute Sound') : (lang === 'id' ? 'Matikan Audio' : 'Mute Sound')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  isMuted 
                    ? 'bg-rose-950/40 border-rose-800/60 text-rose-300 hover:bg-rose-900/50' 
                    : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                <span className="hidden sm:inline">{isMuted ? (lang === 'id' ? 'Suara Mati' : 'Audio Muted') : (lang === 'id' ? 'Suara Aktif' : 'Audio Live')}</span>
              </button>
            </div>
          </div>

          {/* Navigation Bar / Segmented Controls */}
          <nav className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60 overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label[lang]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

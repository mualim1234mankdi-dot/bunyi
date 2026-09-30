/**
 * Cambridge IGCSE Physics Chapter 14: Sound
 * Interactive Learning Media & Simulation Laboratory
 * Marshall Cavendish Education Student's Book Curriculum
 */

import React, { useState } from 'react';
import { Language, SimulationTab } from './types/physics';
import { Header } from './components/Header';
import { IntroSection } from './components/simulations/IntroSection';
import { WaveSimulation } from './components/simulations/WaveSimulation';
import { BellJarSimulation } from './components/simulations/BellJarSimulation';
import { SpeedOfSoundSimulation } from './components/simulations/SpeedOfSoundSimulation';
import { EchoReflectionSimulation } from './components/simulations/EchoReflectionSimulation';
import { UltrasoundSonarSimulation } from './components/simulations/UltrasoundSonarSimulation';
import { PitchLoudnessCROSimulation } from './components/simulations/PitchLoudnessCROSimulation';
import { ConceptMapSection } from './components/simulations/ConceptMapSection';
import { QuizPracticeSection } from './components/simulations/QuizPracticeSection';
import { soundEngine } from './utils/audio';
import { BookOpen, Sparkles, ChevronRight, Layers } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<SimulationTab>('intro');
  const [lang, setLang] = useState<Language>('id');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundEngine.setMuted(nextState);
  };

  const tabsOrder: SimulationTab[] = [
    'intro',
    'waves',
    'bell-jar',
    'speed',
    'echo-sonar',
    'pitch-cro',
    'concept-map',
    'quiz'
  ];

  const currentTabIndex = tabsOrder.indexOf(currentTab);
  const nextTab = currentTabIndex < tabsOrder.length - 1 ? tabsOrder[currentTabIndex + 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Header with Navigation & Controls */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={lang}
        onToggleLang={toggleLanguage}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {/* Main Simulation Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {currentTab === 'intro' && (
          <IntroSection
            lang={lang}
            onNavigateNext={() => setCurrentTab('waves')}
          />
        )}

        {currentTab === 'waves' && (
          <WaveSimulation lang={lang} />
        )}

        {currentTab === 'bell-jar' && (
          <BellJarSimulation lang={lang} />
        )}

        {currentTab === 'speed' && (
          <SpeedOfSoundSimulation lang={lang} />
        )}

        {currentTab === 'echo-sonar' && (
          <EchoReflectionSimulation lang={lang} />
        )}

        {currentTab === 'pitch-cro' && (
          <PitchLoudnessCROSimulation lang={lang} />
        )}

        {currentTab === 'concept-map' && (
          <ConceptMapSection
            lang={lang}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizPracticeSection lang={lang} />
        )}

        {/* Bottom Pagination / Flow to Next Lesson */}
        {nextTab && (
          <div className="mt-8 pt-4 border-t border-slate-900 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentTab(nextTab)}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all shadow-sm"
            >
              <span>
                {lang === 'id' ? 'Lanjut ke Modul Pembelajaran Berikutnya' : 'Proceed to Next Learning Module'}
              </span>
              <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-500 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>
              Cambridge IGCSE™ Physics Student&apos;s Book — Chapter 14: SOUND
            </span>
            <span aria-hidden="true">·</span>
            <span>Marshall Cavendish Education</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>27 Slide Modul Ajar Terintegrasi Simulasi Interaktif</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

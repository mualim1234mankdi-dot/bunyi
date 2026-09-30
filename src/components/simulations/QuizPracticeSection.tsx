import React, { useState } from 'react';
import { Language } from '../../types/physics';
import { PRACTICE_PROBLEMS, WRAP_UP_QUIZ } from '../../data/curriculumData';
import { Award, CheckCircle2, XCircle, HelpCircle, BookOpen, RotateCcw, ChevronRight, Sparkles, Check } from 'lucide-react';

interface QuizPracticeSectionProps {
  lang: Language;
}

export const QuizPracticeSection: React.FC<QuizPracticeSectionProps> = ({ lang }) => {
  const [subTab, setSubTab] = useState<'quiz' | 'practice'>('quiz');

  // --- Quiz State ---
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // --- Practice Problems State ---
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQIndex]: optionIndex }));
  };

  const submitAnswer = () => {
    if (selectedAnswers[currentQIndex] === undefined) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswers[currentQIndex] === WRAP_UP_QUIZ[currentQIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < WRAP_UP_QUIZ.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentQ = WRAP_UP_QUIZ[currentQIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">
            <span>Cambridge IGCSE™ Physics</span>
            <span aria-hidden="true">·</span>
            <span>Wrap-up & Evaluation (Slide 26)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {lang === 'id' ? 'Evaluasi Pembelajaran & Bank Soal Latihan' : 'Wrap-up Quiz & Practice Hub'}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            {lang === 'id'
              ? 'Uji pemahaman Anda dengan Kuis Interaktif (Slide 26) atau pelajari pembahasan lengkap Let’s Practise 14.1 hingga 14.4.'
              : 'Test your understanding with the Interactive Quiz (Slide 26) or review all Let’s Practise 14.1–14.4 questions.'}
          </p>
        </div>

        {/* Sub-tab selection */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('quiz')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
              subTab === 'quiz' ? 'bg-orange-500 text-white border-orange-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            🏆 {lang === 'id' ? 'Kuis Interaktif (Slide 26)' : 'Launch Quiz (Slide 26)'}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('practice')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-colors ${
              subTab === 'practice' ? 'bg-orange-500 text-white border-orange-400 shadow' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            📖 {lang === 'id' ? 'Buku Soal (Let’s Practise 14.1–14.4)' : 'Let’s Practise Hub'}
          </button>
        </div>
      </div>

      {/* --- SUB-TAB 1: INTERACTIVE QUIZ (SLIDE 26) --- */}
      {subTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          {!quizFinished ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Progress and Slide Source */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                <span className="font-bold text-orange-400">
                  {lang === 'id' ? `Pertanyaan ${currentQIndex + 1} dari ${WRAP_UP_QUIZ.length}` : `Question ${currentQIndex + 1} of ${WRAP_UP_QUIZ.length}`}
                </span>
                <span className="text-slate-400 font-mono">
                  {lang === 'id' ? `Sumber: Slide ${currentQ.sourceSlide} (${currentQ.section})` : `Ref: Slide ${currentQ.sourceSlide} (${currentQ.section})`}
                </span>
              </div>

              {/* Question Text */}
              <div className="text-base md:text-lg font-bold text-white leading-snug">
                {currentQ.question[lang]}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options[lang].map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === oIdx;
                  const isCorrect = oIdx === currentQ.correctAnswer;

                  let optionStyle = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200';
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-950/70 border-emerald-600 text-emerald-200 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-950/70 border-rose-600 text-rose-200';
                    } else {
                      optionStyle = 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-orange-500/20 border-orange-500 text-white font-semibold ring-1 ring-orange-500';
                  }

                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`p-3.5 rounded-xl border text-xs md:text-sm cursor-pointer transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center font-bold font-mono text-xs text-slate-400">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation upon submit */}
              {isAnswerSubmitted && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5 animate-fadeIn">
                  <div className="font-bold text-orange-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'id' ? 'Pembahasan Konsep:' : 'Conceptual Explanation:'}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {currentQ.explanation[lang]}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={submitAnswer}
                    disabled={selectedAnswers[currentQIndex] === undefined}
                    className="py-2.5 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                  >
                    {lang === 'id' ? 'Kirim Jawaban' : 'Submit Answer'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="py-2.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
                  >
                    <span>{currentQIndex < WRAP_UP_QUIZ.length - 1 ? (lang === 'id' ? 'Lanjut ke Soal Berikutnya' : 'Next Question') : (lang === 'id' ? 'Lihat Skor Akhir' : 'Finish Quiz')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed Score Card */
            <div className="max-w-md mx-auto text-center space-y-6 py-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-orange-500/30">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  {score >= 5 ? (lang === 'id' ? 'Luar Biasa! Prestasi Sempurna' : 'Outstanding Mastery!') : (lang === 'id' ? 'Bagus! Tetap Semangat' : 'Good Effort!')}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'id' ? 'Anda telah menyelesaikan Kuis Bab 14 Bunyi Cambridge IGCSE.' : 'You have completed the Cambridge IGCSE Sound Quiz.'}
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">{lang === 'id' ? 'Skor Akhir Anda' : 'Your Final Score'}</span>
                <div className="text-5xl font-black font-mono text-orange-400 my-2">
                  {score} <span className="text-2xl text-slate-500 font-normal">/ {WRAP_UP_QUIZ.length}</span>
                </div>
                <div className="text-xs font-semibold text-emerald-400">
                  {Math.round((score / WRAP_UP_QUIZ.length) * 100)}% {lang === 'id' ? 'Tingkat Ketepatan' : 'Accuracy'}
                </div>
              </div>

              <button
                type="button"
                onClick={restartQuiz}
                className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{lang === 'id' ? 'Ulangi Kuis Dari Awal' : 'Retake Quiz'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- SUB-TAB 2: PRACTICE PROBLEMS (LET'S PRACTISE 14.1 - 14.4) --- */}
      {subTab === 'practice' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRACTICE_PROBLEMS.map((prob) => {
              const isRevealed = revealedSolutions[prob.id];
              return (
                <div key={prob.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-orange-400">{prob.topic}</span>
                      <span className="text-slate-500 font-mono">Slide {prob.slide}</span>
                    </div>

                    <p className="text-xs text-slate-200 font-medium whitespace-pre-line leading-relaxed">
                      {prob.prompt[lang]}
                    </p>

                    {isRevealed && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 animate-fadeIn">
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'id' ? 'Kunci Jawaban Model Cambridge:' : 'Cambridge Model Answer:'}</span>
                        </div>
                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
                          {prob.sampleAnswer[lang]}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {prob.keyPoints[lang].map((kp, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                              ✓ {kp}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSolution(prob.id)}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{isRevealed ? (lang === 'id' ? 'Sembunyikan Pembahasan' : 'Hide Solution') : (lang === 'id' ? 'Buka Pembahasan & Kunci Jawaban' : 'Reveal Model Answer')}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

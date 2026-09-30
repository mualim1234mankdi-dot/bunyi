export type Language = 'id' | 'en';

export type SimulationTab = 
  | 'intro'
  | 'waves'
  | 'bell-jar'
  | 'speed'
  | 'echo-sonar'
  | 'pitch-cro'
  | 'concept-map'
  | 'quiz';

export interface QuizQuestion {
  id: string;
  section: string;
  sourceSlide: number;
  question: {
    en: string;
    id: string;
  };
  options: {
    en: string[];
    id: string[];
  };
  correctAnswer: number;
  explanation: {
    en: string;
    id: string;
  };
  hint?: {
    en: string;
    id: string;
  };
}

export interface PracticeProblem {
  id: string;
  slide: number;
  topic: string;
  prompt: {
    en: string;
    id: string;
  };
  sampleAnswer: {
    en: string;
    id: string;
  };
  keyPoints: {
    en: string[];
    id: string[];
  };
}

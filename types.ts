export enum GameLevel {
  START = 0,
  COORDINATES = 1,
  INTERACTION = 2,
  LOOPS = 3,
  VARIABLES = 4,
  QUIZ = 5,
  CONCLUSION = 6
}

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  level: GameLevel;
  score: number;
  timeLeft: number;
  botPos: Position;
  targetPos: Position;
  isBotMoving: boolean;
  currentColor: string;
  theme: 'space' | 'ocean';
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}
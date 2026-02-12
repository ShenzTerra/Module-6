import React from 'react';
import { QuizQuestion } from './types';
import MillionCodersLogo from './assets/Million_Coders_Logo_BLK.png';

// Easy to change asset URLs
export const LOGO_URL = MillionCodersLogo;
export const LOGO_TEXT_URL = MillionCodersText;

export const CLAY_COLORS = {
  BLUE: '#40c4ff',
  RED: '#ff5252',
  GREEN: '#69f0ae',
  YELLOW: '#ffd740',
  PURPLE: '#e040fb',
  ORANGE: '#ffab40',
};

export const LEVEL_INFO = [
  {
    title: "Mission Start!",
    desc: "Welcome to our Coding Studio! Let's power up our robot friend for a space journey.",
    module: "Tutorial"
  },
  {
    title: "Navigate the Grid (X, Y)",
    desc: "Every point has an address! Move the sprite to the Star. Y+ moves Up, X+ moves Right.",
    module: "M1: Coordinates"
  },
  {
    title: "Magic Sound Bubbles",
    desc: "Power up the audio engine! Tap the spheres to play notes and change colors.",
    module: "M2: Interactivity"
  },
  {
    title: "Repeat the Mission",
    desc: "Efficiency is key! Create a sequence of moves to be repeated 3 times.",
    module: "M3: Loops"
  },
  {
    title: "Data Dash",
    desc: "Variables store data! Collect stars to increase your 'Score' before the timer ends.",
    module: "M4: Variables"
  },
  {
    title: "The Logic Challenge",
    desc: "Let's reflect on what you've learned! Answer these questions to finish your training.",
    module: "M6: Coding Quiz"
  },
  {
    title: "Galaxy Master!",
    desc: "You've coded your way across the galaxy! Amazing work, Engineer!",
    module: "Finish"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "In our game, what happens when we add 10 to the 'Y' coordinate variable?",
    options: ["It moves UP", "It moves DOWN", "It changes color", "It plays music"],
    correctIndex: 0,
    feedback: "Correct! The Y-axis controls vertical movement, and adding makes it go higher!"
  },
  {
    question: "What do we use to store information that can change, like your Score or Time?",
    options: ["A Spritesheet", "A Variable", "A Static Block", "A Wallpaper"],
    correctIndex: 1,
    feedback: "Exactly! Variables are like boxes that hold data that can change over time."
  },
  {
    question: "Which block would you use if you wanted the sprite to dance back and forth forever?",
    options: ["A Start Block", "A Repeat/Forever Loop", "A Single Move Block", "A Stop Block"],
    correctIndex: 1,
    feedback: "Nice! Loops allow us to run the same code multiple times automatically."
  },
  {
    question: "What is it called when something happens (like sound playing) only when you touch the screen?",
    options: ["Interactivity", "Variables", "Coordinates", "Background Art"],
    correctIndex: 0,
    feedback: "Perfect! Interactivity or 'Events' are actions triggered by user input."
  }
];

export const BotIcon = ({ color = '#40c4ff', size = 80, theme = 'space' }: { color?: string; size?: number, theme?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="neon-glow" style={{ color: color }}>
    <rect x="20" y="29" width="60" height="50" rx="22" fill="black" fillOpacity="0.4" />
    <rect x="20" y="25" width="60" height="50" rx="22" fill={color} />
    <rect x="28" y="31" width="44" height="20" rx="10" fill="white" fillOpacity="0.25" />
    <circle cx="38" cy="50" r="9" fill="#0f172a" />
    <circle cx="38" cy="50" r="4" fill="white" />
    <circle cx="62" cy="50" r="9" fill="#0f172a" />
    <circle cx="62" cy="50" r="4" fill="white" />
    {theme === 'space' ? (
      <>
        <path d="M50 25V13" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
        <circle cx="50" cy="7" r="7" fill="#ff5252" />
      </>
    ) : (
      <path d="M30 25C30 25 40 15 50 15C60 15 70 25 70 25" stroke="#ffab40" strokeWidth="6" strokeLinecap="round" />
    )}
    <path d="M42 62C42 62 46 66 50 66C54 66 58 62 58 62" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const StarIcon = ({ size = 60 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="neon-glow" style={{ color: '#ffd740' }}>
    <path d="M50 10L61.8 33.9H88L66.8 49.3L74.9 73.2L50 58.3L25.1 73.2L33.2 49.3L12 33.9H38.2L50 10Z" fill="#ffd740" stroke="#ff8f00" strokeWidth="4" />
    <circle cx="45" cy="40" r="5" fill="white" fillOpacity="0.6" />
  </svg>
);

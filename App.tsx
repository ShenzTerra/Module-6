import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameLevel, GameState } from './types';
import { CLAY_COLORS, LEVEL_INFO, BotIcon, StarIcon, QUIZ_QUESTIONS, LOGO_URL } from './constants';
import { audioService } from './services/audioService';
import ClayButton from './components/ClayButton';

const App: React.FC = () => {
  const getRandomGridPos = () => Math.round((20 + Math.random() * 60) / 10) * 10;

  const [gameState, setGameState] = useState<GameState>({
    level: GameLevel.START,
    score: 0,
    timeLeft: 30,
    botPos: { x: 50, y: 50 },
    targetPos: { x: 80, y: 80 },
    isBotMoving: false,
    currentColor: CLAY_COLORS.BLUE,
    theme: 'space'
  });

  const [loopBlocks, setLoopBlocks] = useState<string[]>([]);
  const [isExecutingLoop, setIsExecutingLoop] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStart = () => {
    audioService.init();
    audioService.playLevelUp();
    setGameState(prev => ({ ...prev, level: GameLevel.COORDINATES, targetPos: { x: getRandomGridPos(), y: getRandomGridPos() } }));
  };

  const nextLevel = useCallback(() => {
    audioService.playLevelUp();
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      botPos: { x: 50, y: 50 },
      targetPos: { x: getRandomGridPos(), y: getRandomGridPos() },
      timeLeft: 30
    }));
  }, []);

  const moveBot = (dx: number, dy: number) => {
    setGameState(prev => {
      const newX = Math.round(Math.max(0, Math.min(100, prev.botPos.x + dx)));
      const newY = Math.round(Math.max(0, Math.min(100, prev.botPos.y + dy)));
      audioService.playTone(200 + newX * 2, 0.1, 'triangle');
      return { ...prev, botPos: { x: newX, y: newY } };
    });
  };

  useEffect(() => {
    if (gameState.level === GameLevel.COORDINATES || gameState.level === GameLevel.VARIABLES) {
      const dx = Math.abs(gameState.botPos.x - gameState.targetPos.x);
      const dy = Math.abs(gameState.botPos.y - gameState.targetPos.y);
      if (dx === 0 && dy === 0) {
        audioService.playSuccess();
        if (gameState.level === GameLevel.VARIABLES) {
            setGameState(prev => ({ 
                ...prev, 
                score: prev.score + 50,
                targetPos: { x: getRandomGridPos(), y: getRandomGridPos() }
            }));
        } else {
            setTimeout(nextLevel, 800);
        }
      }
    }
  }, [gameState.botPos, gameState.level, gameState.targetPos, nextLevel]);

  const handleSphereClick = (colorKey: keyof typeof CLAY_COLORS) => {
    audioService.playTone(400 + Math.random() * 300, 0.2);
    setGameState(prev => ({
      ...prev,
      currentColor: CLAY_COLORS[colorKey],
      score: prev.score + 10
    }));
    if (gameState.score >= 50 && gameState.level === GameLevel.INTERACTION) {
      nextLevel();
    }
  };

  const executeLoop = async () => {
    if (loopBlocks.length === 0 || isExecutingLoop) return;
    setIsExecutingLoop(true);
    for (let r = 0; r < 3; r++) {
      for (const dir of loopBlocks) {
        if (dir === 'UP') moveBot(0, 10);
        else if (dir === 'DOWN') moveBot(0, -10);
        else if (dir === 'LEFT') moveBot(-10, 0);
        else if (dir === 'RIGHT') moveBot(10, 0);
        await new Promise(res => setTimeout(res, 400));
      }
    }
    setIsExecutingLoop(false);
    setLoopBlocks([]);
    if (gameState.level === GameLevel.LOOPS) {
       audioService.playSuccess();
       nextLevel();
    }
  };

  const handleQuizAnswer = (index: number) => {
    const currentQ = QUIZ_QUESTIONS[quizIndex];
    if (index === currentQ.correctIndex) {
      audioService.playSuccess();
      setQuizFeedback(currentQ.feedback);
      setGameState(prev => ({ ...prev, score: prev.score + 100 }));
      setTimeout(() => {
        if (quizIndex < QUIZ_QUESTIONS.length - 1) {
          setQuizIndex(quizIndex + 1);
          setQuizFeedback(null);
        } else {
          nextLevel();
        }
      }, 2000);
    } else {
      audioService.playTone(150, 0.3, 'sawtooth');
      setQuizFeedback("Not quite! Try thinking about what we did in the lessons.");
      setTimeout(() => setQuizFeedback(null), 2000);
    }
  };

  useEffect(() => {
    const isTimedLevel = gameState.level === GameLevel.VARIABLES;
    if (isTimedLevel && gameState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return { ...prev, timeLeft: 0, level: prev.level + 1 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState.level]);

  return (
    <div className={`flex-1 flex flex-col p-4 md:p-8 overflow-hidden transition-colors duration-1000 bg-[#0f172a]`}>
      <div className="flex justify-between items-center mb-6 z-50">
        <div className="flex gap-4">
          <div className="clay-card px-6 py-2 bg-slate-800 border-slate-700">
             <span className="text-[10px] font-bold uppercase text-slate-500 tracking-widest">Score</span>
             <div className="text-2xl font-black text-yellow-400 font-mono">{gameState.score}</div>
          </div>
          {(gameState.level === GameLevel.VARIABLES) && (
            <div className="clay-card px-6 py-2 bg-red-900/20 border-red-500/50">
               <span className="text-[10px] font-bold uppercase text-red-400 tracking-widest">Time</span>
               <div className="text-2xl font-black text-red-500 font-mono">{gameState.timeLeft}s</div>
            </div>
          )}
        </div>
        <div className="hidden lg:flex items-center gap-3">
           <img src={LOGO_URL} alt="Million Coders Icon" className="h-12 w-auto" />
           <img src="/Million_Coders_Text_BLK.png" alt="Million Coders" className="h-10 w-auto brightness-0 invert" />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        <div className="flex-1 clay-card relative bg-slate-900 overflow-hidden coordinate-grid">
           <div className="absolute top-4 left-4 right-4 z-40 flex justify-center pointer-events-none">
             <div className="bg-slate-800/90 backdrop-blur-md px-6 py-4 rounded-3xl border-2 border-slate-600 shadow-2xl text-center max-w-md">
                <h2 className="text-lg font-black text-blue-300">{LEVEL_INFO[gameState.level].title}</h2>
                <p className="text-xs text-slate-400">{LEVEL_INFO[gameState.level].desc}</p>
             </div>
           </div>

           {/* Quiz View */}
           {gameState.level === GameLevel.QUIZ && (
             <div className="absolute inset-0 flex items-center justify-center p-6 z-30">
               <div className="clay-card bg-slate-800/95 p-8 max-w-2xl w-full border-slate-600 shadow-neon">
                  <div className="mb-6 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xl">
                      ?
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-8 leading-tight">
                    {QUIZ_QUESTIONS[quizIndex].question}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {QUIZ_QUESTIONS[quizIndex].options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleQuizAnswer(i)}
                        className="clay-btn bg-slate-700 hover:bg-slate-600 text-slate-100 p-4 rounded-2xl text-left font-bold transition-all border-2 border-slate-600 hover:border-blue-400 active:scale-95"
                      >
                        <span className="mr-3 text-blue-400 font-mono">{String.fromCharCode(65 + i)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                  {quizFeedback && (
                    <div className={`p-4 rounded-xl text-center font-bold animate-bounce ${quizFeedback.includes('Correct') ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                      {quizFeedback}
                    </div>
                  )}
               </div>
             </div>
           )}

           <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between py-10 opacity-30 pointer-events-none">
             <span className="axis-label">Y: 100</span>
             <span className="axis-label">Y: 50</span>
             <span className="axis-label">Y: 0</span>
           </div>
           <div className="absolute bottom-2 left-0 right-0 flex justify-between px-10 opacity-30 pointer-events-none">
             <span className="axis-label">X: 0</span>
             <span className="axis-label">X: 50</span>
             <span className="axis-label">X: 100</span>
           </div>

           {gameState.level !== GameLevel.START && gameState.level !== GameLevel.CONCLUSION && gameState.level !== GameLevel.QUIZ && (
             <div 
               className="absolute transition-all duration-300 ease-linear z-30"
               style={{ 
                 left: `${gameState.botPos.x}%`, 
                 top: `${100 - gameState.botPos.y}%`, 
                 transform: 'translate(-50%, -50%)' 
               }}
             >
               <BotIcon color={gameState.currentColor} size={window.innerWidth < 768 ? 60 : 90} />
               <div className="mt-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg text-center whitespace-nowrap">
                 ({gameState.botPos.x}, {gameState.botPos.y})
               </div>
             </div>
           )}

           {(gameState.level === GameLevel.COORDINATES || gameState.level === GameLevel.VARIABLES) && (
             <div 
               className="absolute z-20 transition-all duration-500"
               style={{ left: `${gameState.targetPos.x}%`, top: `${100 - gameState.targetPos.y}%`, transform: 'translate(-50%, -50%)' }}
             >
               <StarIcon size={window.innerWidth < 768 ? 50 : 70} />
             </div>
           )}

           {(gameState.level === GameLevel.INTERACTION) && (
             <div className="absolute inset-0 flex items-center justify-around flex-wrap p-20 gap-8 z-20 pointer-events-none">
                {Object.keys(CLAY_COLORS).map((key) => (
                  <button 
                    key={key}
                    onClick={() => handleSphereClick(key as any)}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-2xl pointer-events-auto transition-transform hover:scale-125 active:scale-90 border-4 border-slate-700/50"
                    style={{ backgroundColor: (CLAY_COLORS as any)[key] }}
                  />
                ))}
             </div>
           )}

           {gameState.level === GameLevel.START && (
             <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-slate-900/90 backdrop-blur-sm z-50">
                <BotIcon size={180} />
                <h1 className="text-5xl font-black text-white mt-6 mb-4">Coding Studio</h1>
                <p className="text-slate-400 mb-10 max-w-sm">Master coordinates, loops, and logic in this interactive adventure!</p>
                <ClayButton variant="green" onClick={handleStart} className="px-12 py-6 text-xl">START MISSION</ClayButton>
             </div>
           )}

           {gameState.level === GameLevel.CONCLUSION && (
             <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center bg-indigo-950/95 z-50">
                <div className="text-8xl mb-6">🏆</div>
                <h1 className="text-6xl font-black text-yellow-400 mb-2">YOU DID IT!</h1>
                <p className="text-xl text-slate-300 mb-10">You've mastered all 6 modules. You're a Coding Pro!</p>
                <div className="clay-card p-6 bg-slate-800 border-slate-700 mb-10">
                    <span className="text-xs font-bold text-slate-500 uppercase">Final Data Score</span>
                    <div className="text-5xl font-black text-white">{gameState.score}</div>
                </div>
                <ClayButton variant="blue" onClick={() => window.location.reload()} className="px-12 py-4">PLAY AGAIN</ClayButton>
             </div>
           )}
        </div>

        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          <div className="clay-card p-6 flex flex-col gap-6 bg-slate-800 border-slate-700 flex-1 overflow-y-auto custom-scrollbar">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Coding Blocks</span>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded">{LEVEL_INFO[gameState.level].module}</span>
             </div>

             <div className="flex flex-col gap-4">
                {(gameState.level === GameLevel.COORDINATES || gameState.level === GameLevel.VARIABLES) && (
                  <div className="grid grid-cols-3 gap-2">
                    <div />
                    <ClayButton variant="blue" onClick={() => moveBot(0, 10)}>Y + 10</ClayButton>
                    <div />
                    <ClayButton variant="blue" onClick={() => moveBot(-10, 0)}>X - 10</ClayButton>
                    <ClayButton variant="blue" onClick={() => moveBot(0, -10)}>Y - 10</ClayButton>
                    <ClayButton variant="blue" onClick={() => moveBot(10, 0)}>X + 10</ClayButton>
                  </div>
                )}

                {(gameState.level === GameLevel.LOOPS) && (
                   <div className="flex flex-col gap-4 pt-4 border-t border-slate-700/50">
                      <div className="bg-orange-950/30 border-2 border-orange-500/30 p-4 rounded-3xl">
                         <span className="text-[10px] font-black text-orange-400 uppercase">Repeat 3x Logic</span>
                         <div className="flex flex-wrap gap-1 mt-3 min-h-[60px]">
                            {loopBlocks.map((b, i) => (
                               <div key={i} className="bg-orange-500 text-white px-2 py-1 rounded-lg text-[10px] font-black shadow-md">{b}</div>
                            ))}
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                         <ClayButton variant="black" onClick={() => setLoopBlocks(p => p.length < 5 ? [...p, 'UP'] : p)} className="text-[10px] py-2">ADD UP</ClayButton>
                         <ClayButton variant="black" onClick={() => setLoopBlocks(p => p.length < 5 ? [...p, 'DOWN'] : p)} className="text-[10px] py-2">ADD DOWN</ClayButton>
                         <ClayButton variant="black" onClick={() => setLoopBlocks(p => p.length < 5 ? [...p, 'LEFT'] : p)} className="text-[10px] py-2">ADD LEFT</ClayButton>
                         <ClayButton variant="black" onClick={() => setLoopBlocks(p => p.length < 5 ? [...p, 'RIGHT'] : p)} className="text-[10px] py-2">ADD RIGHT</ClayButton>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setLoopBlocks([])} className="text-[10px] text-slate-500 hover:text-red-400 font-bold uppercase">Clear</button>
                        <ClayButton variant="orange" className="flex-1" onClick={executeLoop} disabled={isExecutingLoop || loopBlocks.length === 0}>
                            {isExecutingLoop ? 'EXECUTING...' : 'RUN LOOP'}
                        </ClayButton>
                      </div>
                   </div>
                )}

                {(gameState.level === GameLevel.QUIZ) && (
                  <div className="flex flex-col gap-4 items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-2xl mb-4">
                      💡
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Use your coding knowledge to answer the questions in the mission center!</p>
                  </div>
                )}
             </div>
          </div>
          
          <div className="px-6 flex justify-between items-center opacity-60">
             <span className="text-[10px] font-bold uppercase text-slate-500">Mastery Progress</span>
             <div className="flex gap-1">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${gameState.level >= i ? 'bg-blue-400 w-6' : 'bg-slate-700 w-3'}`} />
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
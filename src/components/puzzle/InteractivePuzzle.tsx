import React, { useState, useEffect } from 'react';
import { PuzzleLevel, ChoiceOption } from '../../types/game';
import { sound } from '../../services/sound';
import { Sparkles, RotateCcw, CheckCircle2, ArrowRight, Sun, Moon, Cloud, HelpCircle } from 'lucide-react';

interface InteractivePuzzleProps {
  level: PuzzleLevel;
  onAnswerSubmit: (answer: any) => void;
  isAnswerSubmitted: boolean;
  disabledOptions?: (string | number)[]; // options eliminated by hint
}

export const InteractivePuzzle: React.FC<InteractivePuzzleProps> = ({
  level,
  onAnswerSubmit,
  isAnswerSubmitted,
  disabledOptions = [],
}) => {
  // Number pad input state
  const [numInput, setNumInput] = useState<string>('');
  
  // Sequence tapping state
  const [selectedSequence, setSelectedSequence] = useState<(string | number)[]>([]);
  
  // Memory cards state
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isEvaluatingMemory, setIsEvaluatingMemory] = useState<boolean>(false);

  // Interactive Scene states
  const [scenePositions, setScenePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [sceneToggled, setSceneToggled] = useState<Record<string, boolean>>({});
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  // Reset local interactive state when level changes
  useEffect(() => {
    setNumInput('');
    setSelectedSequence([]);
    setFlippedCards([]);
    setMatchedPairs([]);
    setIsEvaluatingMemory(false);
    
    // Initialize interactive positions
    const initialPos: Record<string, { x: number; y: number }> = {};
    level.interactiveElements?.forEach((el) => {
      initialPos[el.id] = { x: el.x, y: el.y };
    });
    setScenePositions(initialPos);
    setSceneToggled({});
  }, [level.id]);

  // Choice Handler
  const handleChoiceClick = (optionId: string | number) => {
    if (isAnswerSubmitted || disabledOptions.includes(optionId)) return;
    sound.playTap();
    onAnswerSubmit(optionId);
  };

  // Grid Odd One Out Handler
  const handleGridOddClick = (itemId: number) => {
    if (isAnswerSubmitted) return;
    sound.playTap();
    onAnswerSubmit(itemId);
  };

  // Number Input Handlers
  const handleNumPad = (digit: string) => {
    if (isAnswerSubmitted || numInput.length >= 8) return;
    sound.playTap();
    setNumInput((prev) => prev + digit);
  };

  const handleNumBackspace = () => {
    if (isAnswerSubmitted) return;
    sound.playTap();
    setNumInput((prev) => prev.slice(0, -1));
  };

  const handleNumClear = () => {
    if (isAnswerSubmitted) return;
    sound.playTap();
    setNumInput('');
  };

  const handleNumSubmit = () => {
    if (!numInput || isAnswerSubmitted) return;
    sound.playTap();
    onAnswerSubmit(Number(numInput));
  };

  // Sequence Handlers
  const handleSequenceTap = (id: string | number) => {
    if (isAnswerSubmitted || selectedSequence.includes(id)) return;
    sound.playTap();
    const nextSeq = [...selectedSequence, id];
    setSelectedSequence(nextSeq);

    // Auto submit once all items are tapped
    if (nextSeq.length === (level.sequenceItems?.length || 0)) {
      onAnswerSubmit(nextSeq);
    }
  };

  const handleSequenceReset = () => {
    if (isAnswerSubmitted) return;
    sound.playTap();
    setSelectedSequence([]);
  };

  // Memory Card Handlers
  const handleCardFlip = (cardId: string, pairKey: string) => {
    if (isAnswerSubmitted || isEvaluatingMemory) return;
    if (flippedCards.includes(cardId) || matchedPairs.includes(pairKey)) return;

    sound.playTap();
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsEvaluatingMemory(true);
      const card1 = level.memoryCards?.find((c) => c.id === newFlipped[0]);
      const card2 = level.memoryCards?.find((c) => c.id === newFlipped[1]);

      if (card1 && card2 && card1.pairKey === card2.pairKey) {
        // Matched!
        setTimeout(() => {
          sound.playCoin();
          const nextMatched = [...matchedPairs, card1.pairKey];
          setMatchedPairs(nextMatched);
          setFlippedCards([]);
          setIsEvaluatingMemory(false);

          // All pairs found
          const totalPairs = (level.memoryCards?.length || 0) / 2;
          if (nextMatched.length === totalPairs) {
            onAnswerSubmit(totalPairs);
          }
        }, 400);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          sound.playTap();
          setFlippedCards([]);
          setIsEvaluatingMemory(false);
        }, 900);
      }
    }
  };

  // Render Interactive Scene Elements
  const renderInteractiveScene = () => {
    const handleElementClick = (el: any) => {
      if (isAnswerSubmitted) return;
      sound.playTap();

      if (el.type === 'tappable') {
        const nextState = !sceneToggled[el.id];
        setSceneToggled((prev) => ({ ...prev, [el.id]: nextState }));

        // Check specific level triggers
        if (level.id === 19 && el.id === 'plug') {
          onAnswerSubmit('unplug');
        } else if (level.id === 53 && el.id === 'mat') {
          // Reveal key under mat
          setSceneToggled((prev) => ({ ...prev, mat_revealed: true }));
        }
      }
    };

    const handleSceneDragDrop = (dragId: string, targetId: string) => {
      sound.playTap();
      // Level 2: Cloud over sun
      if (level.id === 2 && dragId === 'cloud' && targetId === 'sun') {
        setScenePositions((prev) => ({ ...prev, cloud: { x: 20, y: 25 } }));
        onAnswerSubmit('hide_sun');
      }
      // Level 10: Umbrella over ice cream
      else if (level.id === 10 && dragId === 'umbrella' && targetId === 'icecream') {
        setScenePositions((prev) => ({ ...prev, umbrella: { x: 50, y: 55 } }));
        onAnswerSubmit('shade_icecream');
      }
      // Level 14: Feed carrot to bunny
      else if (level.id === 14 && dragId === 'carrot' && targetId === 'bunny') {
        setScenePositions((prev) => ({ ...prev, carrot: { x: 25, y: 70 } }));
        onAnswerSubmit('feed_bunny');
      }
      // Level 27: Plank over gap
      else if (level.id === 27 && dragId === 'wood_plank' && targetId === 'bridge_gap') {
        setScenePositions((prev) => ({ ...prev, wood_plank: { x: 50, y: 70 } }));
        onAnswerSubmit('repair_bridge');
      }
      // Level 32: Merge rain clouds
      else if (level.id === 32 && (dragId === 'cloud1' || dragId === 'cloud2')) {
        setScenePositions((prev) => ({
          ...prev,
          cloud1: { x: 50, y: 20 },
          cloud2: { x: 50, y: 20 },
        }));
        onAnswerSubmit('merge_rain_clouds');
      }
      // Level 53: Key on door
      else if (level.id === 53 && dragId === 'key') {
        onAnswerSubmit('unlock_with_hidden_key');
      }
      // Level 69: Move fulcrum left
      else if (level.id === 69 && dragId === 'fulcrum') {
        setScenePositions((prev) => ({ ...prev, fulcrum: { x: 25, y: 75 } }));
        onAnswerSubmit('move_fulcrum_left');
      }
      // Level 77: Bait hook with worm
      else if (level.id === 77 && dragId === 'worm' && targetId === 'hook') {
        setScenePositions((prev) => ({ ...prev, worm: { x: 50, y: 55 } }));
        onAnswerSubmit('bait_hook');
      }
      // Level 88: Charger to smartwatch
      else if (level.id === 88 && dragId === 'cable' && targetId === 'watch') {
        setScenePositions((prev) => ({ ...prev, cable: { x: 25, y: 60 } }));
        onAnswerSubmit('snap_charger');
      }
    };

    return (
      <div className="relative w-full h-72 sm:h-80 bg-slate-900/90 rounded-2xl border border-slate-700/60 overflow-hidden shadow-inner p-4 flex flex-col justify-between">
        {/* Background ambience or visual indicators */}
        <div className="absolute top-2 left-3 text-xs text-slate-400 font-medium flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Scene: Tap or drag items to interact</span>
        </div>

        {/* Interactive SVG / Stage Area */}
        <div className="relative w-full h-full mt-4">
          {level.interactiveElements?.map((el) => {
            const pos = scenePositions[el.id] || { x: el.x, y: el.y };
            const isToggled = sceneToggled[el.id];

            return (
              <div
                key={el.id}
                onClick={() => handleElementClick(el)}
                draggable={el.type === 'draggable'}
                onDragStart={() => setActiveDragId(el.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (activeDragId && el.type === 'target') {
                    handleSceneDragDrop(activeDragId, el.id);
                  }
                }}
                // Mobile Touch support
                onTouchEnd={() => {
                  // If tapping a draggable, test if it can apply to targets in scene
                  if (el.type === 'draggable') {
                    const targetEl = level.interactiveElements?.find(
                      (item) => item.type === 'target' || item.id !== el.id
                    );
                    if (targetEl) {
                      handleSceneDragDrop(el.id, targetEl.id);
                    }
                  }
                }}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute transition-all duration-300 flex flex-col items-center justify-center p-2 rounded-xl select-none ${
                  el.type === 'draggable'
                    ? 'cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 bg-indigo-600/30 border border-indigo-400/50 shadow-lg shadow-indigo-500/20'
                    : el.type === 'tappable'
                    ? 'cursor-pointer hover:scale-105 active:scale-95 bg-amber-500/20 border border-amber-400/40'
                    : 'bg-slate-800/60 border border-slate-700/60'
                }`}
              >
                {/* Custom Item Rendering */}
                {el.renderCustom === 'sun' && <Sun className="w-12 h-12 text-amber-400 animate-pulse" />}
                {el.renderCustom === 'cloud' && <Cloud className="w-14 h-14 text-slate-300 filter drop-shadow" />}
                {el.renderCustom === 'owl_sleep' && (
                  <div className="text-4xl">🦉 <span className="text-xs text-indigo-300 block">Zzz...</span></div>
                )}
                {el.renderCustom === 'ice_cream' && <div className="text-4xl">🍦</div>}
                {el.renderCustom === 'umbrella' && <div className="text-4xl">🏖️</div>}
                {el.renderCustom === 'bunny' && <div className="text-4xl">🐰</div>}
                {el.renderCustom === 'fence' && <div className="text-3xl">🪵</div>}
                {el.renderCustom === 'carrot' && <div className="text-4xl">🥕</div>}
                {el.renderCustom === 'car' && <div className="text-4xl">🚗</div>}
                {el.renderCustom === 'chasm' && <div className="w-16 h-4 bg-black/80 rounded border border-red-500/40"></div>}
                {el.renderCustom === 'plank' && <div className="w-16 h-5 bg-amber-800 rounded border border-amber-600"></div>}
                {el.renderCustom === 'flower_dry' && <div className="text-4xl">🥀</div>}
                {el.renderCustom === 'can_empty' && <div className="text-3xl">🫗</div>}
                {el.renderCustom === 'lamp_on' && (
                  <div className="text-4xl">{isToggled ? '💡' : '🌑'}</div>
                )}
                {el.renderCustom === 'wall_plug' && (
                  <button className="px-2.5 py-1 text-xs bg-slate-700 text-amber-300 rounded-lg border border-amber-400/30">
                    🔌 {isToggled ? 'Unplugged' : 'Plugged'}
                  </button>
                )}
                {el.renderCustom === 'keypad' && <div className="text-3xl">🔒</div>}
                {el.renderCustom === 'doormat' && (
                  <div className="px-3 py-1 bg-amber-900/60 border border-amber-700 rounded text-xs text-amber-200">
                    {sceneToggled.mat_revealed ? 'Mat (Lifted)' : 'Welcome Mat'}
                  </div>
                )}
                {el.renderCustom === 'brass_key' && sceneToggled.mat_revealed && (
                  <div className="text-3xl animate-bounce">🔑</div>
                )}
                {el.renderCustom === 'elephant' && <div className="text-5xl">🐘</div>}
                {el.renderCustom === 'mouse' && <div className="text-3xl">🐭</div>}
                {el.renderCustom === 'fulcrum' && <div className="text-3xl">🔺</div>}
                {el.renderCustom === 'hook' && <div className="text-3xl">🪝</div>}
                {el.renderCustom === 'worm' && <div className="text-3xl">🪱</div>}
                {el.renderCustom === 'fish_swimming' && <div className="text-4xl">🐟</div>}
                {el.renderCustom === 'smartwatch' && <div className="text-4xl">⌚</div>}
                {el.renderCustom === 'charger_puck' && <div className="text-3xl">⚪⚡</div>}

                {/* Element Label */}
                {el.label && (
                  <span className="text-[11px] text-slate-300 mt-1 font-medium whitespace-nowrap">
                    {el.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Scene quick helper action for touchscreen users */}
        <div className="flex justify-center pb-1">
          <button
            onClick={() => {
              // Direct interactive trigger for touch devices if drag is awkward
              const draggables = level.interactiveElements?.filter((e) => e.type === 'draggable');
              const targets = level.interactiveElements?.filter((e) => e.type === 'target');
              if (draggables && draggables[0] && targets && targets[0]) {
                handleSceneDragDrop(draggables[0].id, targets[0].id);
              }
            }}
            className="text-xs text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 px-3 py-1.5 rounded-lg border border-indigo-500/30 transition-colors"
          >
            Apply Action / Combine Elements ➔
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Multiple Choice Cards */}
      {level.interactionType === 'choice' && level.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
          {level.options.map((opt) => {
            const isDisabled = disabledOptions.includes(opt.id);
            return (
              <button
                key={opt.id}
                disabled={isAnswerSubmitted || isDisabled}
                onClick={() => handleChoiceClick(opt.id)}
                className={`game-btn text-left p-4 rounded-xl border transition-all duration-150 flex items-center gap-3.5 ${
                  isDisabled
                    ? 'opacity-30 line-through bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700/80 hover:border-indigo-500 text-white shadow-md active:scale-[0.98]'
                }`}
              >
                {opt.icon && <span className="text-2xl shrink-0">{opt.icon}</span>}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm sm:text-base text-slate-100 leading-snug">
                    {opt.label}
                  </div>
                  {opt.sublabel && (
                    <div className="text-xs text-slate-400 mt-0.5">{opt.sublabel}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Grid Odd-One-Out */}
      {level.interactionType === 'find_odd' && level.gridOddData && (
        <div
          className={`grid gap-3 w-full max-w-sm ${
            level.gridOddData.gridCols === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {level.gridOddData.items.map((item) => (
            <button
              key={item.id}
              disabled={isAnswerSubmitted}
              onClick={() => handleGridOddClick(item.id)}
              className="game-btn h-24 sm:h-28 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border-2 border-slate-700/70 hover:border-amber-400 flex flex-col items-center justify-center text-4xl shadow-md transition-all active:scale-95"
            >
              <span>{item.symbol}</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. Number Input Keypad */}
      {level.interactionType === 'number_input' && (
        <div className="flex flex-col items-center w-full max-w-xs">
          {/* Display screen */}
          <div className="w-full bg-slate-900 border-2 border-indigo-500/40 rounded-xl p-3 text-center mb-3 shadow-inner">
            <span className="text-3xl font-display font-bold tracking-widest text-indigo-300 min-h-[40px] inline-block">
              {numInput || <span className="text-slate-600 font-sans text-lg">Enter number...</span>}
            </span>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-2 w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                disabled={isAnswerSubmitted}
                onClick={() => handleNumPad(digit)}
                className="game-btn h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xl font-bold text-white shadow active:scale-95"
              >
                {digit}
              </button>
            ))}
            <button
              disabled={isAnswerSubmitted}
              onClick={handleNumClear}
              className="game-btn h-12 rounded-xl bg-slate-800/60 hover:bg-rose-950/60 border border-slate-700 text-xs font-semibold text-rose-300"
            >
              C
            </button>
            <button
              disabled={isAnswerSubmitted}
              onClick={() => handleNumPad('0')}
              className="game-btn h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xl font-bold text-white shadow active:scale-95"
            >
              0
            </button>
            <button
              disabled={isAnswerSubmitted}
              onClick={handleNumBackspace}
              className="game-btn h-12 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-300"
            >
              ⌫
            </button>
          </div>

          {/* Submit button */}
          <button
            disabled={!numInput || isAnswerSubmitted}
            onClick={handleNumSubmit}
            className={`w-full mt-3 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all ${
              numInput && !isAnswerSubmitted
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
            }`}
          >
            Confirm Answer
          </button>
        </div>
      )}

      {/* 4. Sequence Tapper */}
      {level.interactionType === 'sequence' && level.sequenceItems && (
        <div className="flex flex-col items-center w-full max-w-md">
          <div className="flex items-center justify-between w-full mb-3 px-1">
            <span className="text-xs text-slate-400">
              Tapped: {selectedSequence.length} / {level.sequenceItems.length}
            </span>
            {selectedSequence.length > 0 && !isAnswerSubmitted && (
              <button
                onClick={handleSequenceReset}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset order
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            {level.sequenceItems.map((item) => {
              const orderIndex = selectedSequence.indexOf(item.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={item.id}
                  disabled={isAnswerSubmitted || isSelected}
                  onClick={() => handleSequenceTap(item.id)}
                  className={`game-btn p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-indigo-900/60 border-indigo-400/80 text-white scale-[0.98]'
                      : 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-slate-200 active:scale-95'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-2xl">{item.icon}</span>}
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center">
                      {orderIndex + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Memory Cards Matching */}
      {level.interactionType === 'memory_cards' && level.memoryCards && (
        <div className="flex flex-col items-center w-full max-w-sm">
          <div className="text-xs text-slate-400 mb-2">
            Matched: {matchedPairs.length} / {level.memoryCards.length / 2} pairs
          </div>
          <div className="grid grid-cols-3 gap-2.5 w-full">
            {level.memoryCards.map((card) => {
              const isFlipped =
                flippedCards.includes(card.id) || matchedPairs.includes(card.pairKey);

              return (
                <button
                  key={card.id}
                  disabled={isFlipped || isEvaluatingMemory || isAnswerSubmitted}
                  onClick={() => handleCardFlip(card.id, card.pairKey)}
                  className={`game-btn h-24 rounded-2xl flex flex-col items-center justify-center text-3xl transition-transform duration-300 border-2 ${
                    isFlipped
                      ? 'bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-400 text-white'
                      : 'bg-slate-800 border-slate-700/80 hover:border-slate-500 text-slate-500'
                  }`}
                >
                  {isFlipped ? (
                    <span className="animate-pop">{card.icon}</span>
                  ) : (
                    <span className="text-slate-600 font-bold text-2xl">?</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Interactive Scene */}
      {level.interactionType === 'interactive_scene' && renderInteractiveScene()}
    </div>
  );
};

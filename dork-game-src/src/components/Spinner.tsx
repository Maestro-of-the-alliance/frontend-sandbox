import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { SpinResult } from '../types';
import { sound } from '../utils/audio';
import { Skull, Zap } from 'lucide-react';

interface SpinnerProps {
  onSpinComplete: (result: SpinResult) => void;
  disabled?: boolean;
  activePlayerName: string;
  activePlayerColor: string;
  isHuman: boolean;
  autoSpin?: boolean;
  forcedResult?: SpinResult;
}

// 8 segments around 360 degrees (45 deg each)
// Segment 0: 0° - 45°  -> '1'
// Segment 1: 45° - 90° -> '2'
// Segment 2: 90° - 135° -> '3'
// Segment 3: 135° - 180° -> 'goliath'
// Segment 4: 180° - 225° -> '1'
// Segment 5: 225° - 270° -> '2'
// Segment 6: 270° - 315° -> '3'
// Segment 7: 315° - 360° -> 'goliath'
export const SPINNER_SEGMENTS: { label: string; value: SpinResult; color: string; textColor: string; angle: number }[] = [
  { label: '1', value: 1, color: '#f59e0b', textColor: '#ffffff', angle: 22.5 },
  { label: '2', value: 2, color: '#10b981', textColor: '#ffffff', angle: 67.5 },
  { label: '3', value: 3, color: '#3b82f6', textColor: '#ffffff', angle: 112.5 },
  { label: 'GOLIATH', value: 'goliath', color: '#dc2626', textColor: '#ffffff', angle: 157.5 },
  { label: '1', value: 1, color: '#f59e0b', textColor: '#ffffff', angle: 202.5 },
  { label: '2', value: 2, color: '#10b981', textColor: '#ffffff', angle: 247.5 },
  { label: '3', value: 3, color: '#3b82f6', textColor: '#ffffff', angle: 292.5 },
  { label: 'GOLIATH', value: 'goliath', color: '#dc2626', textColor: '#ffffff', angle: 337.5 },
];

export const Spinner: React.FC<SpinnerProps> = ({
  onSpinComplete,
  disabled = false,
  activePlayerName,
  activePlayerColor,
  isHuman,
  autoSpin = false,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [lastResult, setLastResult] = useState<SpinResult | null>(null);
  const controls = useAnimation();

  const handleSpin = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    sound.playSpinTick();

    // Pick a random outcome with weighted distribution (mostly 1, 2, 3 and ~20% goliath)
    const outcomes: SpinResult[] = [1, 2, 3, 1, 2, 3, 'goliath', 2];
    const chosenResult = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    // Find all matching segments
    const matchingIndices = SPINNER_SEGMENTS
      .map((seg, idx) => (seg.value === chosenResult ? idx : -1))
      .filter((idx) => idx !== -1);
    const chosenIndex = matchingIndices[Math.floor(Math.random() * matchingIndices.length)];
    
    // Needle is at top (270° or 0° depending on orientation).
    // Let's assume the indicator pointer is at the TOP (0° / 12 o'clock).
    // To land segment i under the 12 o'clock pointer:
    // Wheel angle target = (360 - SPINNER_SEGMENTS[chosenIndex].angle) + extra rotations
    const extraRotations = 360 * 5 + Math.floor(Math.random() * 3) * 360; // 5-7 full spins
    const targetAngle = 360 - SPINNER_SEGMENTS[chosenIndex].angle;
    const finalRotation = currentRotation + extraRotations + (targetAngle - (currentRotation % 360));

    // Play periodic ticks while spinning
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      sound.playSpinTick();
      tickCount++;
      if (tickCount > 18) {
        clearInterval(tickInterval);
      }
    }, 90);

    controls
      .start({
        rotate: finalRotation,
        transition: {
          duration: 2.2,
          ease: [0.15, 0.9, 0.25, 1], // snappy start with smooth dramatic deceleration
        },
      })
      .then(() => {
        clearInterval(tickInterval);
        setCurrentRotation(finalRotation);
        setIsSpinning(false);
        setLastResult(chosenResult);
        if (chosenResult === 'goliath') {
          sound.playGoliathAlarm();
        } else {
          sound.playHop();
        }
        onSpinComplete(chosenResult);
      });
  };

  // Trigger auto spin for computer players after short pleasant delay
  useEffect(() => {
    if (!isHuman && autoSpin && !isSpinning && !disabled) {
      const timer = setTimeout(() => {
        handleSpin();
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isHuman, autoSpin, isSpinning, disabled]);

  return (
    <div className="relative flex flex-col items-center justify-center p-3 sm:p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-lg select-none">
      {/* Turn indicator badge */}
      <div className="flex items-center gap-2 mb-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: activePlayerColor }}
        />
        <span className="text-xs sm:text-sm font-semibold text-slate-700">
          {activePlayerName}
        </span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 uppercase">
          {isHuman ? 'Human' : 'Auto Bot'}
        </span>
      </div>

      {/* Wheel Container with Pointer */}
      <div className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Top Needle / Pointer */}
        <div className="absolute -top-2 z-20 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-rose-600 drop-shadow-md" />
          <div className="w-2 h-2 rounded-full bg-white -mt-3 shadow-inner" />
        </div>

        {/* Rotating Wheel */}
        <motion.div
          animate={controls}
          className="w-full h-full rounded-full shadow-inner relative overflow-hidden border-4 border-slate-800 bg-slate-900"
          style={{ transformOrigin: 'center center' }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {SPINNER_SEGMENTS.map((seg, idx) => {
              const startAngle = (idx * 45 * Math.PI) / 180;
              const endAngle = ((idx + 1) * 45 * Math.PI) / 180;
              const x1 = 100 + 100 * Math.sin(startAngle);
              const y1 = 100 - 100 * Math.cos(startAngle);
              const x2 = 100 + 100 * Math.sin(endAngle);
              const y2 = 100 - 100 * Math.cos(endAngle);

              // Text position along midpoint ray
              const midAngle = ((idx * 45 + 22.5) * Math.PI) / 180;
              const textRadius = seg.value === 'goliath' ? 62 : 68;
              const tx = 100 + textRadius * Math.sin(midAngle);
              const ty = 100 - textRadius * Math.cos(midAngle);
              const rotAngle = idx * 45 + 22.5;

              return (
                <g key={idx}>
                  {/* Segment Pie Slice */}
                  <path
                    d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                    fill={seg.color}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                  {/* Segment Label */}
                  {seg.value === 'goliath' ? (
                    <g transform={`translate(${tx}, ${ty}) rotate(${rotAngle})`}>
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="900"
                        letterSpacing="0.05em"
                      >
                        GOLIATH
                      </text>
                      <circle cx="0" cy="7" r="5" fill="#7f1d1d" />
                      <path
                        d="M-2,6 L2,6 L1,10 L-1,10 Z"
                        fill="#fecaca"
                      />
                    </g>
                  ) : (
                    <g transform={`translate(${tx}, ${ty}) rotate(${rotAngle})`}>
                      <text
                        x="0"
                        y="5"
                        textAnchor="middle"
                        fill={seg.textColor}
                        fontSize="18"
                        fontWeight="900"
                        className="drop-shadow-sm"
                      >
                        {seg.label}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            {/* Outer Rim Decor */}
            <circle
              cx="100"
              cy="100"
              r="97"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
          </svg>
        </motion.div>

        {/* Center Hub Button */}
        <div className="absolute z-10">
          <button
            id="main-spinner-btn"
            onClick={handleSpin}
            disabled={disabled || isSpinning}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex flex-col items-center justify-center font-black text-xs sm:text-sm tracking-wider uppercase border-2 shadow-lg transition-all duration-200 active:scale-95 ${
              isSpinning
                ? 'bg-slate-700 text-slate-300 border-slate-600 cursor-not-allowed'
                : disabled
                ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                : isHuman
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 border-amber-500 ring-4 ring-amber-400/40 animate-pulse cursor-pointer'
                : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700 cursor-pointer'
            }`}
          >
            {isSpinning ? (
              <span className="text-[10px] animate-spin">⟳</span>
            ) : isHuman ? (
              <>
                <Zap className="w-3.5 h-3.5 fill-current text-slate-900 -mb-0.5" />
                <span>SPIN</span>
              </>
            ) : (
              <span>AUTO</span>
            )}
          </button>
        </div>
      </div>

      {/* Outcome Status / Hint */}
      <div className="mt-2 text-center h-6 flex items-center justify-center">
        {isSpinning ? (
          <span className="text-xs font-semibold text-slate-500 animate-pulse">
            Spinning wheel...
          </span>
        ) : lastResult ? (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              lastResult === 'goliath'
                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {lastResult === 'goliath' ? '⚠ GOLIATH EVENT!' : `Spun a ${lastResult}!`}
          </span>
        ) : (
          <span className="text-xs text-slate-400">
            {isHuman ? 'Click SPIN to move!' : 'Bot spinning automatically...'}
          </span>
        )}
      </div>
    </div>
  );
};

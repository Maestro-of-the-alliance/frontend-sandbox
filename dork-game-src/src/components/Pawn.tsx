import React from 'react';
import { motion } from 'motion/react';
import { PawnType } from '../types';

interface PawnProps {
  type: PawnType;
  color?: 'red' | 'blue' | 'green' | 'yellow';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  animateBounce?: boolean;
  animateGlow?: boolean;
  badgeNumber?: number;
}

const COLOR_PALETTES = {
  red: {
    primary: '#ef4444',
    dark: '#991b1b',
    deepDark: '#7f1d1d',
    highlight: '#fca5a5',
    ambient: '#fee2e2',
    accentGlow: 'rgba(239, 68, 68, 0.4)',
    border: '#dc2626',
  },
  blue: {
    primary: '#3b82f6',
    dark: '#1e40af',
    deepDark: '#1e3a8a',
    highlight: '#93c5fd',
    ambient: '#dbeafe',
    accentGlow: 'rgba(59, 130, 246, 0.4)',
    border: '#2563eb',
  },
  green: {
    primary: '#10b981',
    dark: '#065f46',
    deepDark: '#064e3b',
    highlight: '#6ee7b7',
    ambient: '#d1fae5',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    border: '#059669',
  },
  yellow: {
    primary: '#f59e0b',
    dark: '#b45309',
    deepDark: '#78350f',
    highlight: '#fde68a',
    ambient: '#fef3c7',
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    border: '#d97706',
  },
};

const SIZE_MAP = {
  xs: 'w-5 h-7',
  sm: 'w-7 h-10',
  md: 'w-10 h-14',
  lg: 'w-16 h-24',
  xl: 'w-24 h-36',
  hero: 'w-36 h-52 sm:w-44 sm:h-64',
};

export const Pawn: React.FC<PawnProps> = ({
  type,
  color = 'red',
  size = 'md',
  className = '',
  animateBounce = false,
  animateGlow = false,
  badgeNumber,
}) => {
  const palette = COLOR_PALETTES[color] || COLOR_PALETTES.red;
  const isDork = type === 'dork';
  const gradientId = `pawn-grad-${color}-${Math.random().toString(36).substr(2, 5)}`;
  const headGradId = `head-grad-${color}-${Math.random().toString(36).substr(2, 5)}`;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none ${SIZE_MAP[size]} ${className}`}
      animate={
        animateBounce
          ? {
              y: [0, -8, 0],
              scale: [1, 1.05, 1],
            }
          : {}
      }
      transition={
        animateBounce
          ? {
              repeat: Infinity,
              duration: 1.2,
              ease: 'easeInOut',
            }
          : undefined
      }
      style={{
        filter: animateGlow
          ? `drop-shadow(0 0 12px ${palette.accentGlow})`
          : 'drop-shadow(0 4px 6px rgba(0,0,0,0.18))',
      }}
    >
      <svg
        viewBox="0 0 120 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Body Glossy Gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.highlight} />
            <stop offset="25%" stopColor={palette.primary} />
            <stop offset="70%" stopColor={palette.dark} />
            <stop offset="100%" stopColor={palette.deepDark} />
          </linearGradient>

          {/* Spherical Head Gradient */}
          <radialGradient
            id={headGradId}
            cx="35%"
            cy="30%"
            r="65%"
            fx="30%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="25%" stopColor={palette.highlight} />
            <stop offset="60%" stopColor={palette.primary} />
            <stop offset="100%" stopColor={palette.deepDark} />
          </radialGradient>

          {/* Shadow Filter */}
          <filter id="subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Base Ground Shadow */}
        <ellipse cx="60" cy="154" rx="38" ry="6" fill="#0f172a" fillOpacity="0.25" />

        {/* --- LEGS & FEET --- */}
        {/* Left Leg */}
        <path
          d="M40 95 L40 142 C40 147 48 147 48 142 L48 95 Z"
          fill={`url(#${gradientId})`}
        />
        {/* Left Foot */}
        <ellipse cx="43" cy="144" rx="10" ry="6" fill={`url(#${gradientId})`} />
        <ellipse cx="41" cy="143" rx="6" ry="3" fill={palette.highlight} fillOpacity="0.5" />

        {/* Right Leg */}
        <path
          d="M72 95 L72 142 C72 147 80 147 80 142 L80 95 Z"
          fill={`url(#${gradientId})`}
        />
        {/* Right Foot */}
        <ellipse cx="77" cy="144" rx="10" ry="6" fill={`url(#${gradientId})`} />
        <ellipse cx="75" cy="143" rx="6" ry="3" fill={palette.highlight} fillOpacity="0.5" />

        {/* Torso */}
        <path
          d="M42 46 C34 50 36 78 38 98 C42 101 54 102 60 102 C66 102 78 101 82 98 C84 78 86 50 78 46 C70 42 50 42 42 46 Z"
          fill={`url(#${gradientId})`}
        />

        {/* Torso Specular Curved Highlight */}
        <path
          d="M52 48 C48 58 48 85 50 96 C53 97 55 97 56 95 C54 84 54 58 58 49 C56 48 54 48 52 48 Z"
          fill="#ffffff"
          fillOpacity="0.35"
        />

        {/* Left Arm & Sphere Hand */}
        <path
          d="M42 50 C32 55 26 68 28 86 C29 88 33 88 35 84 C33 70 38 58 45 54 Z"
          fill={`url(#${gradientId})`}
        />
        <circle cx="28" cy="88" r="7" fill={`url(#${headGradId})`} />

        {/* Right Arm & Sphere Hand */}
        <path
          d="M78 50 C88 55 94 68 92 86 C91 88 87 88 85 84 C87 70 82 58 75 54 Z"
          fill={`url(#${gradientId})`}
        />
        <circle cx="92" cy="88" r="7" fill={`url(#${headGradId})`} />

        {/* Neck */}
        <path d="M50 42 C50 38 70 38 70 42 Z" fill={palette.dark} />

        {/* --- SPHERICAL HEAD --- */}
        <circle cx="60" cy="27" r="22" fill={`url(#${headGradId})`} />

        {/* Head Specular Soft Glow Highlight */}
        <ellipse
          cx="52"
          cy="18"
          rx="7"
          ry="4"
          transform="rotate(-25 52 18)"
          fill="#ffffff"
          fillOpacity="0.75"
        />

        {/* --- DOMO SUNGLASSES (DORK ONLY) --- */}
        {isDork && (
          <g id="domo-sunglasses" className="transition-all duration-300">
            {/* Sunglasses Bridge & Frame */}
            <path
              d="M38 22 C42 21 54 21 60 23 C66 21 78 21 82 22 C84 22 85 24 84 26 L81 33 C80 36 74 37 68 37 C64 37 61 34 60 30 C59 34 56 37 52 37 C46 37 40 36 39 33 L36 26 C35 24 36 22 38 22 Z"
              fill="#09090b"
              stroke="#27272a"
              strokeWidth="1.2"
            />
            {/* Left Dark Lens */}
            <path
              d="M40 24 C44 23 52 23 57 25 C56 31 53 35 48 35 C43 35 40 31 40 24 Z"
              fill="#18181b"
            />
            {/* Left Lens Glare */}
            <path
              d="M43 25 L47 25 L43 33 L41 33 Z"
              fill="#ffffff"
              fillOpacity="0.4"
            />

            {/* Right Dark Lens */}
            <path
              d="M63 25 C68 23 76 23 80 24 C80 31 77 35 72 35 C67 35 64 31 63 25 Z"
              fill="#18181b"
            />
            {/* Right Lens Glare */}
            <path
              d="M66 25 L70 25 L66 33 L64 33 Z"
              fill="#ffffff"
              fillOpacity="0.4"
            />

            {/* Sunglasses Temple Arms */}
            <path
              d="M37 23 C35 23 33 24 32 26"
              stroke="#09090b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M83 23 C85 23 87 24 88 26"
              stroke="#09090b"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>

      {/* Optional Player Index Badge on pawns */}
      {badgeNumber !== undefined && (
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white rounded-full border border-white shadow-sm"
          style={{ backgroundColor: palette.dark }}
        >
          {badgeNumber}
        </span>
      )}
    </motion.div>
  );
};

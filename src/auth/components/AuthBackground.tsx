import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

// Rebuilt from the Claude Design auth background (Onboarding.dc.html, Login.dc.html).
// SVG instead of an exported image: sharp at every density, nothing added to the bundle.

// CSS radial-gradient(rx ry at cx cy, color 0%, transparent 70%), bottom layer first
const GLOWS = [
  { id: 'g1', cx: '90%', cy: '31%', rx: '42%', ry: '22%', color: '#00F0FF', opacity: 0.1 },
  { id: 'g2', cx: '78%', cy: '20%', rx: '60%', ry: '34%', color: '#8736F7', opacity: 0.22 },
  { id: 'g3', cx: '62%', cy: '11%', rx: '34%', ry: '15%', color: '#F2A8FF', opacity: 0.07 },
  { id: 'g4', cx: '50%', cy: '0%', rx: '90%', ry: '40%', color: '#8736F7', opacity: 0.26 },
];

// [cx, cy, r, opacity]
const STARS = [
  [36, 22, 0.8, 0.5], [118, 40, 0.6, 0.4], [212, 18, 1.1, 0.6], [286, 52, 0.7, 0.45],
  [352, 30, 1.3, 0.7], [372, 96, 0.6, 0.4], [248, 110, 0.8, 0.5], [330, 140, 1.0, 0.55],
  [196, 74, 0.6, 0.35], [70, 118, 0.6, 0.3], [368, 206, 0.7, 0.45], [276, 226, 1.2, 0.65],
  [222, 182, 0.6, 0.35], [344, 262, 0.6, 0.4], [300, 318, 0.9, 0.5], [380, 350, 0.6, 0.35],
  [250, 372, 0.7, 0.4], [18, 236, 0.7, 0.35], [10, 402, 0.6, 0.3], [356, 430, 1.0, 0.5],
  [214, 448, 0.6, 0.3], [320, 486, 0.7, 0.4], [40, 470, 0.6, 0.3], [150, 520, 0.6, 0.3],
  [380, 510, 0.6, 0.35], [96, 552, 0.5, 0.25],
] as const;

// The planet's glowing rim, widest and faintest first
const RIM = [
  { color: '#8736F7', width: 64, opacity: 0.035 },
  { color: '#8736F7', width: 44, opacity: 0.05 },
  { color: '#00F0FF', width: 28, opacity: 0.05 },
  { color: '#00F0FF', width: 16, opacity: 0.08 },
  { color: '#67E8F9', width: 8, opacity: 0.12 },
];

const PLANET = { cx: 300, cy: 1260, r: 720 };

const AuthBackground = () => (
  <Svg
    style={StyleSheet.absoluteFill}
    viewBox="0 0 390 844"
    preserveAspectRatio="xMidYMid slice"
    pointerEvents="none"
  >
    <Defs>
      {GLOWS.map(({ id, color, opacity, ...pos }) => (
        <RadialGradient key={id} id={id} {...pos} fx={pos.cx} fy={pos.cy}>
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset="0.7" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      ))}
      <RadialGradient id="highlight" cx="77%" cy="64%" rx="22%" ry="5%" fx="77%" fy="64%">
        <Stop offset="0" stopColor="#A5F3FC" stopOpacity={0.3} />
        <Stop offset="0.7" stopColor="#A5F3FC" stopOpacity={0} />
      </RadialGradient>
    </Defs>

    <Rect width="390" height="844" fill="#020103" />
    {GLOWS.map(({ id }) => (
      <Rect key={id} width="390" height="844" fill={`url(#${id})`} />
    ))}

    {STARS.map(([cx, cy, r, opacity]) => (
      <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#FFFFFF" fillOpacity={opacity} />
    ))}

    {RIM.map(({ color, width, opacity }) => (
      <Circle
        key={`${color}-${width}`}
        {...PLANET}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeOpacity={opacity}
      />
    ))}
    <Circle {...PLANET} fill="#010102" />
    <Circle {...PLANET} fill="none" stroke="#67E8F9" strokeWidth={1.2} strokeOpacity={0.55} />

    <Rect width="390" height="844" fill="url(#highlight)" />
  </Svg>
);

export default memo(AuthBackground);

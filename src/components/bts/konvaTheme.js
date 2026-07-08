// Konva renders to canvas, not the DOM, so it can't read the CSS custom
// properties in index.css — this file mirrors that palette in plain hex so
// every BTS view stays visually consistent with the rest of the app.
export const KONVA_THEME = {
  bgDeep: '#15110d',
  bgPanel: '#1f1812',
  surface: '#2a2018',
  surfaceAlt: '#241b13',
  border: 'rgba(245, 234, 217, 0.12)',
  borderStrong: 'rgba(245, 234, 217, 0.22)',
  textMuted: '#8a7d6b',
  accent: '#e8973a',
  accentSoft: '#f0b56e',
  coral: '#d4574a',
  teal: '#4fae8e',
};

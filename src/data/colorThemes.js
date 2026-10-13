import { readableOn, ensureContrast, fillColor } from '../lib/color.js';

// Kid-friendly, clean, cohesive color scheme
// Define all color themes
const THEMES = {
  classic: {
    primary: '#6D5BF6', // Violet
    secondary: '#FF6FA5', // Pink
    accent: '#F08A00', // Orange
    success: '#0E9F6E', // Green
    error: '#E5484D', // Red
    background: '#FBF8F3', // Warm cream
    surface: '#FFFFFF', // White
    text: '#23262F', // Charcoal
    textLight: '#6B7280', // Gray
  },
  ocean: {
    primary: '#0EA5E9', // Sky Blue
    secondary: '#06B6D4', // Cyan
    accent: '#14B8A6', // Teal
    success: '#10B981',
    error: '#EF4444',
    background: '#F0F9FF', // Light Blue
    surface: '#FFFFFF',
    text: '#0C4A6E', // Deep Blue
    textLight: '#0369A1',
  },
  forest: {
    primary: '#10B981', // Emerald
    secondary: '#84CC16', // Lime
    accent: '#22C55E', // Green
    success: '#059669',
    error: '#EF4444',
    background: '#F0FDF4', // Light Green
    surface: '#FFFFFF',
    text: '#14532D', // Deep Green
    textLight: '#15803D',
  },
  sunset: {
    primary: '#F97316', // Orange
    secondary: '#FB923C', // Light Orange
    accent: '#FBBF24', // Amber
    success: '#10B981',
    error: '#EF4444',
    background: '#FFF7ED', // Cream
    surface: '#FFFFFF',
    text: '#7C2D12', // Deep Orange
    textLight: '#C2410C',
  },
  purple: {
    primary: '#A855F7', // Purple
    secondary: '#C084FC', // Light Purple
    accent: '#E879F9', // Fuchsia
    success: '#10B981',
    error: '#EF4444',
    background: '#FAF5FF', // Lavender
    surface: '#FFFFFF',
    text: '#581C87', // Deep Purple
    textLight: '#7E22CE',
  },
  candy: {
    primary: '#EC4899', // Hot Pink
    secondary: '#F472B6', // Pink
    accent: '#FB7185', // Rose
    success: '#10B981',
    error: '#EF4444',
    background: '#FDF2F8', // Light Pink
    surface: '#FFFFFF',
    text: '#831843', // Deep Pink
    textLight: '#BE185D',
  },
  night: {
    primary: '#3B82F6', // Blue
    secondary: '#6366F1', // Indigo
    accent: '#8B5CF6', // Violet
    success: '#10B981',
    error: '#EF4444',
    background: '#EEF2FF', // Pale Blue
    surface: '#FFFFFF',
    text: '#1E3A8A', // Deep Blue
    textLight: '#3730A3',
  },
  sunshine: {
    primary: '#FBBF24', // Yellow
    secondary: '#FCD34D', // Light Yellow
    accent: '#F59E0B', // Amber
    success: '#10B981',
    error: '#EF4444',
    background: '#FFFBEB', // Cream Yellow
    surface: '#FFFFFF',
    text: '#78350F', // Deep Amber
    textLight: '#B45309',
  },
  cherry: {
    primary: '#F472B6', // Pink
    secondary: '#FBCFE8', // Light Pink
    accent: '#FDA4AF', // Rose
    success: '#10B981',
    error: '#EF4444',
    background: '#FFF1F2', // Blush
    surface: '#FFFFFF',
    text: '#881337', // Deep Rose
    textLight: '#BE123C',
  },
  mint: {
    primary: '#34D399', // Mint
    secondary: '#6EE7B7', // Light Mint
    accent: '#10B981', // Green
    success: '#059669',
    error: '#EF4444',
    background: '#ECFDF5', // Pale Mint
    surface: '#FFFFFF',
    text: '#064E3B', // Deep Green
    textLight: '#047857',
  },
  rainbow: {
    primary: '#F59E0B', // Amber
    secondary: '#EC4899', // Pink
    accent: '#8B5CF6', // Violet
    success: '#10B981',
    error: '#EF4444',
    background: '#FEFCE8', // Light Yellow
    surface: '#FFFFFF',
    text: '#78350F', // Deep Amber
    textLight: '#B45309',
  },
  kpop: {
    primary: '#14B8A6', // Teal
    secondary: '#10B981', // Green
    accent: '#EC4899', // Pink
    success: '#10B981',
    error: '#EF4444',
    background: '#F0FDFA', // Light Teal
    surface: '#FFFFFF',
    text: '#134E4A', // Deep Teal
    textLight: '#0F766E',
  },
  // Seasonal themes (see SEASONS in rewards.js)
  valentines: {
    primary: '#E11D48',
    secondary: '#FB7185',
    accent: '#F472B6',
    success: '#10B981',
    error: '#EF4444',
    background: '#FFF1F2',
    surface: '#FFFFFF',
    text: '#881337',
    textLight: '#BE123C',
  },
  spring: {
    primary: '#65A30D',
    secondary: '#FDE047',
    accent: '#F472B6',
    success: '#10B981',
    error: '#EF4444',
    background: '#F7FEE7',
    surface: '#FFFFFF',
    text: '#365314',
    textLight: '#4D7C0F',
  },
  summer: {
    primary: '#06B6D4',
    secondary: '#FDE047',
    accent: '#F97316',
    success: '#10B981',
    error: '#EF4444',
    background: '#ECFEFF',
    surface: '#FFFFFF',
    text: '#164E63',
    textLight: '#0E7490',
  },
  halloween: {
    primary: '#F97316',
    secondary: '#7C3AED',
    accent: '#7C3AED',
    success: '#10B981',
    error: '#EF4444',
    background: '#FFF4E6',
    surface: '#FFFFFF',
    text: '#2A1245',
    textLight: '#6B21A8',
  },
  winter: {
    primary: '#2563EB',
    secondary: '#93C5FD',
    accent: '#DC2626',
    success: '#10B981',
    error: '#EF4444',
    background: '#EFF6FF',
    surface: '#FFFFFF',
    text: '#1E3A8A',
    textLight: '#1D4ED8',
  },
};

// Adds the colors that keep text readable on every theme:
//   X          primary/accent/success/error are darkened only if no text color would read on them
//   onX        text color to put on a surface painted with color X (white or dark)
//   xText      color X darkened just enough to be used as text on the page background
const withReadableColors = (theme) => {
  const derived = { ...theme };
  for (const key of ['primary', 'accent', 'success', 'error']) {
    derived[key] = fillColor(theme[key]);
  }
  for (const key of ['primary', 'accent', 'success', 'error', 'textLight']) {
    derived['on' + key[0].toUpperCase() + key.slice(1)] = readableOn(derived[key]);
  }
  for (const key of ['primary', 'accent', 'success', 'error']) {
    derived[key + 'Text'] = ensureContrast(derived[key], [theme.surface, theme.background]);
  }
  return derived;
};

export const COLOR_THEMES = Object.fromEntries(
  Object.entries(THEMES).map(([name, theme]) => [name, withReadableColors(theme)]),
);

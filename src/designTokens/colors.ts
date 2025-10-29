// Design tokens for colors matching policyengine-app-v2

export const colors = {
  // Primary brand colors - teal
  primary: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C5',
    400: '#38B2AC',
    500: '#319795',
    600: '#2C7A7B',
    700: '#285E61',
    800: '#234E52',
    900: '#1D4044',
  },

  // Secondary colors
  secondary: {
    50: '#F0F9FF',
    100: '#F2F4F7',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#344054',
    800: '#1E293B',
    900: '#101828',
  },

  // Blue colors
  blue: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#026AA2',
    800: '#075985',
    900: '#0C4A6E',
  },

  // Semantic colors
  success: '#22C55E',
  warning: '#FEC601',
  error: '#EF4444',
  info: '#1890FF',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',

  // Gray scale
  gray: {
    50: '#F9FAFB',
    100: '#F2F4F7',
    200: '#E2E8F0',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#344054',
    800: '#1F2937',
    900: '#101828',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F5F9FF',
    tertiary: '#F1F5F9',
    sider: '#FFFFFF',
  },

  // Text colors
  text: {
    primary: '#000000',
    secondary: '#5A5A5A',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    title: '#000000',
  },

  // Border colors
  border: {
    light: '#E2E8F0',
    medium: '#CBD5E1',
    dark: '#94A3B8',
  },

  // Shadow colors
  shadow: {
    light: 'rgba(16, 24, 40, 0.05)',
    medium: 'rgba(16, 24, 40, 0.1)',
    dark: 'rgba(16, 24, 40, 0.2)',
  },
};

// Status-specific colors for coverage tracker
export const statusColors = {
  complete: colors.primary[600],
  partial: colors.primary[400],
  inProgress: colors.gray[500],
  notStarted: colors.gray[300],
  federal: colors.secondary[900],
} as const;

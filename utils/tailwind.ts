/**
 * Theme color helpers for non-CSS contexts (SVG fills, Stripe Elements, etc.).
 * Tailwind v4 removed `resolveConfig`; CSS variables are the source of truth.
 */
export const themeColors = {
  accent: {
    alt: 'hsl(var(--accent-alt))',
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))',
    light: 'hsl(var(--accent-light))',
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))',
    light: 'hsl(var(--destructive-light))',
  },
  // Legacy palette keys still referenced by a few non-CSS call sites
  gray: {
    '500': '#6b7280',
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  positive: '#22c55e',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))',
    light: 'hsl(var(--primary-light))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))',
    light: 'hsl(var(--secondary-light))',
  },
  tertiary: {
    DEFAULT: 'hsl(var(--tertiary))',
    foreground: 'hsl(var(--tertiary-foreground))',
  },
  'text-positive': '#22c55e',
  warning: '#f59e0b',
} as const;

const tailwind = {
  theme: {
    colors: themeColors,
  },
};

export default tailwind;

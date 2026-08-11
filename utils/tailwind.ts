/**
 * Theme color helpers for non-CSS contexts (SVG fills, Stripe Elements, etc.).
 * Tailwind v4 removed `resolveConfig`; CSS variables are the source of truth.
 */
export const themeColors = {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    light: 'hsl(var(--primary-light))',
    foreground: 'hsl(var(--primary-foreground))',
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    light: 'hsl(var(--secondary-light))',
    foreground: 'hsl(var(--secondary-foreground))',
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    light: 'hsl(var(--destructive-light))',
    foreground: 'hsl(var(--destructive-foreground))',
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    light: 'hsl(var(--accent-light))',
    foreground: 'hsl(var(--accent-foreground))',
    alt: 'hsl(var(--accent-alt))',
  },
  tertiary: {
    DEFAULT: 'hsl(var(--tertiary))',
    foreground: 'hsl(var(--tertiary-foreground))',
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
  // Legacy palette keys still referenced by a few non-CSS call sites
  gray: {
    '500': '#6b7280',
  },
  warning: '#f59e0b',
  positive: '#22c55e',
  'text-positive': '#22c55e',
} as const;

const tailwind = {
  theme: {
    colors: themeColors,
  },
};

export default tailwind;

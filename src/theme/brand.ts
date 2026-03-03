export const brand = {
  palette: {
    primary: '#008080',
    primaryDark: '#00a3a3',
    accent: '#e59b25',
    text: '#2e2f30',
    textDark: '#eaeaea',
    background: '#ffffff',
    backgroundDark: '#121212',
    sidebar: '#111c2e',
  },
  typography: {
    family: 'Inter, Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
  },
  spacing: {
    container: {
      default: '1rem',
      sm: '1.25rem',
      md: '2rem',
      lg: '2.5rem',
    },
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },
  shadow: {
    button: 'shadow-sm hover:shadow-md',
    card: 'shadow-[0_8px_24px_rgba(0,0,0,0.08)]',
  },
  buttonClass: {
    primary:
      'inline-flex items-center justify-center rounded-lg bg-primary hover:bg-accent dark:bg-primary-dark dark:hover:bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
    secondary:
      'inline-flex items-center justify-center rounded-lg border border-primary/30 bg-white/80 hover:bg-white dark:bg-gray-900 dark:hover:bg-gray-800 px-5 py-2.5 text-sm font-medium text-text dark:text-text-dark transition-all',
  },
} as const

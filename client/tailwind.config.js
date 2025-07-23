import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'line-clamp-1',
    'line-clamp-2',
    'line-clamp-3',
    'line-clamp-4',
    'line-clamp-5',
    'line-clamp-6',
    'md:line-clamp-1',
    'md:line-clamp-2',
    'md:line-clamp-3',
    'md:line-clamp-4',
    'md:line-clamp-5',
  ],
  theme: {
    extend: {
      colors: {
        'custom-primary': 'var(--color-primary)',
        'custom-primary-hover': 'var(--color-primary-hover)',
        'custom-primary-light': 'var(--color-primary-light)',
        'custom-primary-dark': 'var(--color-primary-dark)',
      },
    },
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: [
      {
        custom: {
          primary: '#4338CA',
          'primary-focus': '#3730A3',
          'primary-content': '#ffffff',
          secondary: '#f000b8',
          accent: '#37cdbe',
          neutral: '#3d4451',
          'base-100': '#ffffff',
        },
      },
    ],
  },
}

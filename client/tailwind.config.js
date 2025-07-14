module.exports = {
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
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

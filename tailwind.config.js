/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mixed: ['Goorm', 'Prompt', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

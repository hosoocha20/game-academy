/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'my-black':'#001019',
        'my-black2' : '#292929',
        'my-purple': '#663DE4',
        'my-yellow': '#EAFF01',
        'my-white': '#FBFAF5',
        'error-red-dark': '#cc0000',
        'error-red-light': '#FFCCCC',
        'valid-green-dark': '#249225',
        'valid-green-light': '#b8dcb8',
        'valid-green-light2': '#85c285',
        'valid-green-med':'#4fa64f',
        'chess-blackSqaure': '#798293',
        'chess-whiteSqaure' : '#eaebef',
        'chess-rim' : '#AFB4BF',
      },
      gridTemplateColumns: {
        'fluid-card': 'repeat(auto-fill, minmax(max(250px,(100% - (3)*20px)/3), 1fr))',
      },
    },
  },
  plugins: [],
}


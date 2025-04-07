module.exports = {
    darkMode: 'class',
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    
    theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 6s linear infinite',
          'pulse-slow': 'pulse 3s ease-in-out infinite',
        },
      },
    },
    plugins: [],
  }
  
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'chinese': ['PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', 'sans-serif'],
      },
      colors: {
        wechat: {
          green: '#07C160',
          blue: '#576B95',
          orange: '#FA9D3B',
          red: '#E64340'
        }
      }
    },
  },
  plugins: [],
}
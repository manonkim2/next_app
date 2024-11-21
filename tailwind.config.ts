import type { Config } from 'tailwindcss'

const config: Config = {
  // tailwind는 class name으로 가득찬 css파일이 아니라
  // 아래의 폴더의 내부 파일들을 돌면서 해당 확장자를 가진 파일들을 찾는 컴파일러
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // custom class name
    extend: {
      borderRadius: {
        'very-round': '11.11px',
      },
      colors: {
        primary: '#ffc107',
        secondary: '#2979ff',
      },
      fontFamily: {
        releway: 'var(--raleway-text)',
        bokor: 'var(--bokor-text)',
        nanum: 'var(--nanum-text)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config

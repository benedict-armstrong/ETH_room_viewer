/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        colors: {
            // Brand colors
            primary: {
                DEFAULT: '#003049',
                light: '#004266',
                dark: '#002033'
            },
            secondary: {
                DEFAULT: '#D62828',
                light: '#E04141',
                dark: '#B22222'
            },
            accent: {
                DEFAULT: '#F77F00',
                light: '#FF9419',
                dark: '#D66E00'
            },
            highlight: {
                DEFAULT: '#FCBF49',
                light: '#FDCF71',
                dark: '#FBAF21'
            },
            background: {
                DEFAULT: '#EAE2B7',
                light: '#F0EAC9',
                dark: '#E4D9A5'
            },
            // Base colors
            white: '#FFFFFF',
            black: '#000000',
            // Gray scale
            gray: {
                50: '#F9FAFB',
                100: '#F3F4F6',
                200: '#E5E7EB',
                300: '#D1D5DB',
                400: '#9CA3AF',
                500: '#6B7280',
                600: '#4B5563',
                700: '#374151',
                800: '#1F2937',
                900: '#111827'
            }
        },
        extend: {
            spacing: {
                '0': '0',
                '1': '0.25rem',
                '2': '0.5rem',
                '3': '0.75rem',
                '4': '1rem',
                '5': '1.25rem',
                '6': '1.5rem',
                '8': '2rem',
                '10': '2.5rem',
                '12': '3rem',
                '16': '4rem',
                '20': '5rem'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace']
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1rem' }],
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['1rem', { lineHeight: '1.5rem' }],
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }]
            },
            borderRadius: {
                none: '0',
                sm: '0.25rem',
                DEFAULT: '0.375rem',
                md: '0.5rem',
                lg: '0.75rem',
                xl: '1rem',
                full: '9999px'
            },
            transitionDuration: {
                fast: '150ms',
                DEFAULT: '300ms',
                slow: '500ms'
            },
            transitionTimingFunction: {
                DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
                linear: 'linear',
                bounce: 'cubic-bezier(0.4, 0, 0.6, 1)'
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
            }
        }
    },
    plugins: []
}; 
export default {
  plugins: {
    // Use TailwindCSS PostCSS plugin
    '@tailwindcss/postcss': {},
    
    // Autoprefixer for browser compatibility
    autoprefixer: {},
    
    // CSS optimization for production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: 'default'
      }
    })
  }
}
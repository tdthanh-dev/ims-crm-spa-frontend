import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    // Enable advanced CSS optimization
    cssCodeSplit: true,
    cssTarget: 'chrome61', // Target modern browsers for better optimization
    
    // Advanced minification settings  
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove dead code
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        
        // Advanced optimizations
        passes: 2, // Multiple passes for better compression
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        pure_getters: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        
        // Remove unused code
        unused: true,
        
        // Advanced compression
        collapse_vars: true,
        reduce_vars: true,
        hoist_funs: true,
        hoist_vars: true
      },
      
      mangle: {
        // Mangle properties for maximum compression
        properties: {
          regex: /^_/ // Only mangle properties starting with _
        }
      },
      
      format: {
        comments: false // Remove all comments
      }
    },
    
    // Chunk size settings - smaller chunks for better loading
    chunkSizeWarningLimit: 500,
    
    // Rollup options for maximum optimization
    rollupOptions: {
      output: {
        // Smaller chunk names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[hash].${ext}`; // Shorter names
          }
          return `assets/[hash].${ext}`;
        },
        
        // Separate JS into optimized chunks
        chunkFileNames: 'js/[hash].js',
        entryFileNames: 'js/[hash].js',
        
        // Advanced manual chunk splitting - separate by usage patterns
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('chart')) return 'chart-vendor';
            if (id.includes('axios')) return 'http-vendor';
            if (id.includes('@fortawesome')) return 'icons-vendor';
            return 'vendor';
          }
          
          // Component chunks by feature
          if (id.includes('src/components/Customer')) return 'customer-components';
          if (id.includes('src/components/Appointment')) return 'appointment-components';
          if (id.includes('src/components/services')) return 'service-components';
          if (id.includes('src/pages/admin')) return 'admin-pages';
          if (id.includes('src/pages/technician')) return 'technician-pages';
          if (id.includes('src/pages/Receptionist')) return 'receptionist-pages';
          
          // Utils and services
          if (id.includes('src/services')) return 'api-services';
          if (id.includes('src/utils')) return 'utils';
        }
      },
      
      // Tree shaking configuration
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    
    // Disable source maps for production (smaller bundle)
    sourcemap: false,
    
    // Enable asset inlining for small files
    assetsInlineLimit: 2048 // Inline assets smaller than 2KB
  }
})

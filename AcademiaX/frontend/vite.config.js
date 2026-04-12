// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import path from 'path';

// // https://vite.dev/config/
// export default defineConfig({
//   // content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   // darkMode: 'class',
//   // theme: {
//   //   extend: {
//   //     colors: {
//   //       primary: { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 900: '#1e3a8a' },
//   //       dark: { bg: '#0f172a', card: '#1e293b', border: '#334155' }
//   //     }
//   //   },
//   // },
//   plugins: [react(),
//      tailwindcss(),
//   ],
//    resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   //  resolve: {
//   //     alias: {
//   //       '@': path.resolve(__dirname, './src'),
//   //     },
//   //   },
//   //    server: {
//   //   port: 3000,
//   //   proxy: {
//   //     '/api': {
//   //       target: 'http://localhost:5000',
//   //       changeOrigin: true,
//   //     },
//   //   },
//   // },
// })


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
     tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});

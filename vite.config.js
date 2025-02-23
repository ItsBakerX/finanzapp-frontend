import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
            cssCodeSplit: true,
            chunkSizeWarningLimit: 1000
        },
        server: {
            port: 3000,
            strictPort: true,
            open: true
        },
        plugins: [
            react(),
            // svgr options: https://react-svgr.com/docs/options/
            svgr({ svgrOptions: { icon: true } }),
        ],
    };
});

// which allows you to import SVGs as React components
// import { ReactComponent as MyIcon } from './my-icon.svg';
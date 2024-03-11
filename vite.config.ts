import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	base: '/magick-wasm-test/',
	build: {
		target: 'esnext'
	},
	resolve: {
		alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) }
	},
	server: {
		port: 3000
	}
});

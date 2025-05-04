import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.argv.includes('dev');
const base = dev ? '' : process.env.BASE_PATH || '/space';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Используем adapter-static
		adapter: adapter({
			// Опции по умолчанию:
			pages: 'build', // Куда складывать результат
			assets: 'build', // Куда складывать статику (внутри pages)
			fallback: '404.html', // ВАЖНО для SPA на GitHub Pages!
			// GitHub Pages использует 404.html для обработки роутинга SPA.
			precompress: false // Можно включить true для gzip/brotli, если хочешь
		}),

		// Указываем базовый путь для ссылок на ресурсы
		paths: {
			base: base
			// assets: '' // Можно оставить пустым, если статика лежит в base
		}
	}
};

export default config;

/**
 * Babel will compile modern JavaScript down to a format compatible with older browsers, but it will also increase your
 * final bundle size and build speed. Edit the `browserslist` property in the package.json file to define which
 * browsers Babel should target.
 *
 * Browserslist documentation: https://github.com/browserslist/browserslist#browserslist-
 */
const useBabel = false;

/**
 * Change this to `true` to generate source maps alongside your production bundle. This is useful for debugging, but
 * will increase total bundle size and expose your source code.
 */
const sourceMapsInProduction = false;

/**
 * 
 */

const purge = false
/*********************************************************************************************************************/
/**********                                              Vite                                               **********/
/*********************************************************************************************************************/

import PurgeSvelte from "purgecss-from-svelte";
import autoprefixer from 'autoprefixer';
import compress from 'vite-plugin-compress'
import compression from 'vite-plugin-compression';
import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy';
import { optimizeCarbonImports } from "carbon-components-svelte/preprocess";
import pkg from './package.json';
import purgecss from '@fullhuman/postcss-purgecss';
import svelte from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess';
import { visualizer } from 'rollup-plugin-visualizer'

const production = process.env.NODE_ENV === 'production';
const config = defineConfig({
  plugins: [
    svelte({
      emitCss: production,
      preprocess: [
        sveltePreprocess(),
        optimizeCarbonImports()
        // Must after sveltePreprocess() and not for dev!!!!
      ],
      compilerOptions: {
        dev: !production,
      },
      hot: !production
    }),
    compression(),
    visualizer()
  ],
  // server: {
  // 	host: 'localhost',
  // 	port: 5000
  // },
  build: {
    sourcemap: sourceMapsInProduction,
    minify: production
  },
  // resolve: {
  // 	extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', 'svelte', 'scss']
  // },
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  }
});

// purgecss
if (purge) {
  config.css.postcss.plugins.unshift(
    purgecss({
      content: ["./src/**/*.svelte", './index.html'],
      extractors: [
        {
          extractor: content => PurgeSvelte.extract(content),
          extensions: ["svelte", 'html'],
          fontFace: true,
          variables: true,
          safelist: [/btn/]
        }
      ]
    })
  )
}
// Babel
if (useBabel) {
  config.plugins.unshift(
    legacy({
      targets: pkg.browserslist
    })
  );
}

export default config

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [svelte()]
// })


import dotenv from 'dotenv';
import { sassPlugin } from 'esbuild-sass-plugin';

dotenv.config({});

const define = {};
for (const k in process.env) {
  if (!k.includes('REACT_APP')) continue;
  define[`process.env.${k}`] = JSON.stringify(process.env[k]);
}

const buildOptions = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  color: true,
  outfile: 'www/bundle.js',
  sourcemap: process.env.REACT_APP_ENV === 'DEV',
  minify: process.env.REACT_APP_ENV !== 'DEV',
  target: 'es2019', // >> config/tsconfig.json
  plugins:[sassPlugin()],
  define,
}

export default buildOptions;
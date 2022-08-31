import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { parseAsEnvs } from 'esbuild-env-parsing';

dotenv.config({});
// TODO: Averiguar porqué esbuild.serve no levantaba el servidor...
// TODOENG: Find out why esbuild.serve doesn't starts a server...
esbuild.serve({
  servedir: 'www',
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'www/js',
  sourcemap: true,
  minify: true,
  port: 2022,
  define: parseAsEnvs(['REACT_APP_API_URL', 'REACT_APP_ENV', 'REACT_APP_AUTH_URL', 'REACT_APP_REDIRECT_URL', 'REACT_APP_CLIENT_ID', 'REACT_APP_CLIENT_SECRET']),
  plugins:[sassPlugin()],
}).then((server) => server.stop());
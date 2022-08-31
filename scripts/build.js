import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { parseAsEnvs } from 'esbuild-env-parsing';

dotenv.config({});

const build = async () => {
  esbuild.build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    color: true,
    outfile: 'www/bundle.js',
    sourcemap: process.env.REACT_APP_ENV === 'DEV',
    minify: process.env.REACT_APP_ENV !== 'DEV',
    target: 'es2019', // >> config/tsconfig.json
    /*
      TODO: Averiguar cómo conseguir que esbuild empaquete todo y use watch, parece que ahora mismo watch
       se queda observando la carpeta pero esbuild no emite ningún output ni dice nada; el resto de procesos
       del script se detienen...
       Mientras usaremos chokidar para hacer el watch a la carpeta src y levantaremos dos consolas,
       una para empaquetar y levantar servor en local, y otra para hacer el watch con chokidar...
    */ 
    // watch: {
    //   onRebuild(error, result) {
    //     if (error) console.error('watch build failed:', error);
    //     else console.log('watch build succeeded:', result);
    //   },
    // },
    /*
      TODO: Investigar una manera mejor para que esbuild procese las variables de entorno, por un issue de esbuild
       parece haber un fix con un pequeño script, pero no he conseguido que funcione...
    */
    define: parseAsEnvs(['REACT_APP_API_URL', 'REACT_APP_ENV', 'REACT_APP_AUTH_URL', 'REACT_APP_REDIRECT_URL', 'REACT_APP_CLIENT_ID', 'REACT_APP_CLIENT_SECRET']),
    plugins:[sassPlugin()],
  }).catch(() => process.exit(1));
};

build();

export default build;
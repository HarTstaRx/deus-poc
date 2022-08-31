import { watch } from 'chokidar';
import build from './build.js';
import fs from 'fs';

const watcher = watch(['src/**/*', 'public/**/*']);
console.log('Observando cambios en /src...  \n');
watcher.on('change', async (file) => {
  console.log(`Ha cambiado ${file}`, 'Recompilando...');
  if (file.includes('public\\')) {
    fs.copyFile(file, `www\\${file.split('\\')[1]}`, (error) => {
      if (error) console.error(error);
    });
  }

  await build();
  console.log('Compilado!');
});
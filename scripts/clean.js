import fs from 'fs';

// Alternative to powershell remove-item ./config/tsconfig.tsbuildinfo, ./temp, ./www/*, ./dist -force -recurse -ErrorAction SilentlyContinue & exit 0
const clean = () => {
  fs.rm('./temp', { recursive: true, force: true }, () => {});
  fs.rm('./www', { recursive: true, force: true }, () => {});
  fs.rm('./dist', { recursive: true, force: true }, () => {});
  fs.rm('./config/tsconfig.tsbuildinfo', { recursive: true, force: true }, () => {});
};

clean();
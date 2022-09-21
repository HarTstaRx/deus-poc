import fs from 'fs';

const clean = () => {
  fs.rm('./temp', { recursive: true, force: true }, () => {});
  fs.rm('./www', { recursive: true, force: true }, () => {});
  fs.rm('./dist', { recursive: true, force: true }, () => {});
  fs.rm('./config/tsconfig.tsbuildinfo', { recursive: true, force: true }, () => {});
};

clean();
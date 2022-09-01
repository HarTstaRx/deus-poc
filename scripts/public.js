import fs from 'fs';

// Alternative to powershell copy-item -Path ./public/* -Destination (new-item ./www -Type Directory -Force) -Recurse
const copyPublic = () => {
  fs.mkdir('./www', { recursive: true }, () => {});
  fs.cp('./public', './www', { recursive: true }, () => {});
};

copyPublic();
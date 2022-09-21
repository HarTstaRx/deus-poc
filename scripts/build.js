import esbuild from 'esbuild';
import buildOptions from './build.options.js';

const build = async () => {
  esbuild.build(buildOptions).catch(() => process.exit(1));
};

void build();

export default build;
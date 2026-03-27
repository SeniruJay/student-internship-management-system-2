import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/server.cjs',
  format: 'cjs',
  external: ['express', 'mongoose', 'mongodb-memory-server', 'bcryptjs', 'jsonwebtoken', 'dotenv', 'vite'],
}).catch(() => process.exit(1));

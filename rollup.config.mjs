import dts from 'rollup-plugin-dts';

export default [
  {
    input: './dist/types/render.d.ts', // Point to the entry .d.ts file
    output: [{ file: 'dist/render-lib.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

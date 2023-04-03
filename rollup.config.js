import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import codeGenPlugin from './src/index.js'

export default {
  input: 'example/index.js',
  output: {
    file: 'dist/my-library.js',
    format: 'es',
    name: 'MyLibrary',
    sourcemap: false
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    codeGenPlugin({
      format: true
    })
  ]
}

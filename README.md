# CodeGen
El siguiente es un plugin de Rollup llamado codeGenPlugin que se utiliza para generar código 
automáticamente a partir de comentarios @codegen en el código fuente.

```javascript
import codeGenPlugin from './codeGenPlugin.js'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es'
  },
  plugins: [
    codeGenPlugin({
      include: '**/*.js',
      exclude: 'node_modules/**',
      format: true,
      prettier: {
        tabWidth: 4
      }
    })
  ]
}
```

### License

MIT

export default {
  root: 'src/',
  publicDir: '../static/',
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5000,
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true
  }
}

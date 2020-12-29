module.exports = {
    devServer: {
      proxy: {
        '^/api': {
          target: 'http://localhost:1234',
          ws: true,
          changeOrigin: true,
          pathRewrite: { '^/api': '' }
        }
      }
    }
  }
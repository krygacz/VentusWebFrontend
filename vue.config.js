module.exports = {
    css: {
        loaderOptions: {
          scss: {
            prependData: `
              @import "@/scss/_variables.scss";
              @import "@/scss/_mixins.scss";
              @import "@/scss/main.scss";
            `
          }
        }
      },
      devServer: {
        open: process.platform === 'darwin',
        host: 'localhost',
        port: 80,
        https: true,
        hotOnly: false,
      },
      configureWebpack: {
        devtool: 'source-map'
      }
}
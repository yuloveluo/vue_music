// 导入node的路径
const { join } = require('path')
// 配置一个函数，用来简写路径设置
const resolve = dir => join(__dirname, dir)

module.exports = {
  // 设置webpack的打包的配置
  chainWebpack: config => {
    // 给一些路径设置别名
    config.resolve.alias
      // 将src之前的路径用@符合来代替，以后要使用src里面的文件直接就 例如@/api
      .set('assets', resolve('src/assets'))
      .set('_c', resolve('src/components'))
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
      .set('store', resolve('src/store'))
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    // 配置代理
    proxy: {
      // 使用/api来代替你要请求的路径
      '/api': {
        // 原来的路径
        target: 'http://ustbhuangyi.com/music/api/',
        ws: true,
        // 跨域
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
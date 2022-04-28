const path = require('path')
const { I18n } = require('i18n')
const i18n = new I18n({
  // eslint-disable-next-line array-bracket-spacing
  locales: ['en', 'cn'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'cn',
})

module.exports = (appInfo) => {
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1513779989145_1674'

  // add your config here
  // 加载 errorHandler 中间件
  config.middleware = ['errorHandler']

  // 只对 /api 前缀的 url 路径生效
  // config.errorHandler = {
  //   match: '/api',
  // }

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: ['*'],
  }

  config.cors = {
    credentials: true,
    origin: (ctx) => ctx.get('origin'),
  }
  
  config.multipart = {
    fileExtensions: [
      '.apk',
      '.pptx',
      '.docx',
      '.csv',
      '.doc',
      '.ppt',
      '.pdf',
      '.pages',
      '.wav',
      '.mov',
    ], // 增加对 .apk 扩展名的支持
  }

  config.bcrypt = {
    saltRounds: 10, // default 10
  }

  config.mongoose = {
    url: 'mongodb://localhost:27017/dewrite',
    options: {
      useFindAndModify: false,
      bufferMaxEntries: 0,
      useCreateIndex: true,
      useNewUrlParser: true,
      readPreference: 'secondaryPreferred',
      useUnifiedTopology: true,
    },
  }

  config.jwt = {
    secret: 'Great4-M',
    enable: true,
    // match: '/jwt', // optional
    match: /^\/api\/((?!public).)*$/,
  }

  config.image = {
    server: 'http://127.0.0.1:9000',
    s3: {
      endPoint: '127.0.0.1',
      port: 9000,
      useSSL: false,
      accessKey: 'dewritekey',
      secretKey: '1qazxsw2',
    },
  }

  config.theme = {
    template: '/Users/stephen/Projects/donews/vuepress-starter',
    site: '/Users/stephen/Projects/donews/subdomain',
  }

  config.session = {
    key: 'EGG_PROJECT_REST',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true,
    renew: true,
  }

  config.validate = {
    convert: true,
    validateRoot: true,
    translate: function () {
      var args = Array.prototype.slice.call(arguments)
      return i18n.__(args[0])
    },
  }

  return config
}

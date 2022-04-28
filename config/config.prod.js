module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '6b44cd6ad564068f5fb0a4313382f86b901eeaf4'

  config.middleware = ['errorHandler']

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: ['.pocplus.com'],
  }

  config.mongoose = {
    url: 'mongodb://localhost:27017/dewrite',
    options: {
      // useMongoClient: true,
      readPreference: 'secondaryPreferred',
      useUnifiedTopology: true,
      autoReconnect: true,
      useFindAndModify: false,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
      useCreateIndex: true,
      useNewUrlParser: true
    },
  }

  config.jwt = {
    secret: '945134717973276f16ff26222a89166ff98d0441',
    enable: true, // default is false
    match: /^\/api\/((?!public).)*$/
  }

  config.image = {
    server: 'http://img.dewrite.io',
    s3: {
      endPoint: '127.0.0.1',
      port: 9000,
      useSSL: false,
      
    },
  }

  config.theme = {
    template: '/www/wwwroot/template',
    site: '/www/wwwroot/subdomain'
  }
  
  return config
}

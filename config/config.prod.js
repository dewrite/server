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
      // useCreateIndex: true,
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
    site: '/www/wwwroot/subdomain',
    url: 'http://subdomain.dewrite.io/posts/aid.html',
  }

  config.eth = {
    // ## 主文章 DW NFT合约地址
    contract: '0x88Af2Cb612AD98686Aa0c70b537a9935868b56e8',
    // ## 投资分红，业务合约地址
    biz: '0xA8694BED65330E9E15424450c1a4BA0c5a751Ab8',
    // ## Polygon 上的WETH地址
    weth: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    rpc: 'https://polygon-mumbai.g.alchemy.com/v2/8IbzEe78kzvQOBbUV3Oq9B16U4Jv6vS1',
  }
  
  return config
}

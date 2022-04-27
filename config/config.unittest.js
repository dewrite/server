module.exports = appInfo => {
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '6b44cd6ad564068f5fb0a4313382f86b901eeaf4'

  config.middleware = ['errorHandler']

  config.security = {
    csrf: {
      enable: false,
    },
    domainWhiteList: ['*'],
  }

  config.mongoose = {
    url: 'mongodb://localhost:27017,localhost:27018,localhost:27019/eggtest?replicaSet=rs0',
    options: {
      // useMongoClient: true,
      useFindAndModify: false,
      bufferMaxEntries: 0,
      useCreateIndex: true,
      useNewUrlParser: true,
      readPreference: 'secondaryPreferred',
      useUnifiedTopology: true
    },
  }

  config.jwt = {
    secret: '945134717973276f16ff26222a89166ff98d0441',
    enable: false, // default is false
    match: /^\/api\/((?!public).)*$/
  }


  return config
}

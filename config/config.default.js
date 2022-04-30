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
      // useCreateIndex: true,
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
    },
    template: `
    <svg id="visual" viewBox="0 0 600 600" width="600" height="600" xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
  <style>
    body {
      padding: 10px;
    }
    .logo {
      color: white;
      font: 2rem SimHei;
      line-height: 6.2rem;
      height: 100%;
      overflow: auto;
      padding-bottom: 50px;
      text-indent: 130px;
    }

    .title {
      color: white;
      font: 3rem SimHei;
      height: 100%;
      overflow: auto;
      padding-bottom: 40px;
      text-align: center;
    }

    .centent {
      color: white;
      font: 1.6rem SimHei;
      position: fixed;
      top: 520px;

      display: flex;
      justify-content: center;
      width: 560px;
    }
    .centent span{
      background-color: #00000030;
      border-radius: 50rem;
      padding : 5px 20px;
      margin: 0 10px;
    }
  </style>

  <defs>
    <filter id="blur1" x="-10%" y="-10%" width="120%" height="120%">
      <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
      <feGaussianBlur stdDeviation="161" result="effect1_foregroundBlur"></feGaussianBlur>
    </filter>
  </defs>
  <rect width="600" height="600" fill="#3e00ff"></rect>
  <g filter="url(#blur1)">
    <circle cx="577" cy="88" fill="#cc00c6" r="357"></circle>
    <circle cx="39" cy="208" fill="#3e00ff" r="357"></circle>
    <circle cx="650" cy="374" fill="#cc00c6" r="357"></circle>
    <circle cx="344" cy="565" fill="#cc00c6" r="357"></circle>
    <circle cx="111" cy="387" fill="#3e00ff" r="357"></circle>
    <circle cx="794" cy="102" fill="#cc00c6" r="357"></circle>
  </g>

  <polygon class="hex" points="35,20 65,20 78,44 65,68 35,68 22,44 " stroke="white" fill-opacity="0"
    stroke-width="5" />
  <polygon class="hex" points="78,44 108,44 121,68 108,92 78,92 65,68" stroke="white" fill-opacity="0"
    stroke-width="5" />
  <polygon class="hex" points="35,68 65,68 78,92 65,116 35,116 22,92" stroke="white" fill-opacity="0"
    stroke-width="5" />

  <foreignObject x="0" y="0" width="600" height="600">

    <body xmlns="http://www.w3.org/1999/xhtml">
      <div class="logo">
        DeWrite.io
      </div>
      <div class="title">
        TitleTag
      </div>
      <div class="centent">
        <span>AuthorTag</span>
        <span>DateTag</span>
      </div>
    </body>
  </foreignObject>

</svg>
    `,
  }

  config.theme = {
    template: '/Users/stephen/Projects/donews/vuepress-starter',
    site: '/Users/stephen/Projects/donews/subdomain',
    url: 'http://subdomain.app.com:3000/posts/aid.html',
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

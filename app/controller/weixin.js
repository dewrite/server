const Controller = require('egg').Controller
const Payment = require('wxpay-v3')
const sha1 = require('sha1')
class WeixinController extends Controller {
  //
  // 公众号内H5网页初始化
  async init() {
    const { ctx, service, app } = this
    // const _id = ctx.state.user.data._id
    // const user = await ctx.model.User.findById(_id)
    const payload = ctx.query // GET
    // const payload = ctx.request.body || {} // POST
    const { url } = payload

    const appid = 'wxefa486642793ca14'
    const secret = '7f07afdac5d904587c5112e65a3382f3'
    const noncestr = ctx.helper.randomNum(16)
    const timestamp = parseInt(new Date().getTime() / 1000) + ''

    const ticket = await service.weixin.ticket(appid, secret)

    const str =
      'jsapi_ticket=' +
      ticket +
      '&noncestr=' +
      noncestr +
      '&timestamp=' +
      timestamp +
      '&url=' +
      decodeURIComponent(url)

    console.log('微信jssdk签名：',str)

    const json = {
      debug: app.config.env === 'local', // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appid, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature: sha1(str), // 必填，签名
      jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'chooseWXPay'], // 必填，需要使用的JS接口列表
    }

    ctx.helper.success({ ctx, res: json })
  }

  //  网站网页授权
  // async authMP() {
  //   const { ctx, service } = this
  //   const payload = ctx.query // GET
  //   const { code, state } = payload

  //   // https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
  //   const url =
  //     'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx65900691245da020&secret=c9ead5c9d81013e2b523f4c43d0c1078&code=' +
  //     code +
  //     '&grant_type=authorization_code'
  //   // const obj = await ctx.model.Object.find({})

  //   // console.log(url)

  //   const res = await ctx.curl(url, {
  //     contentType: 'json',
  //     dataType: 'json',
  //   })

  //   // console.log(res.data)
  //   const query = {}
  //   if (res.data.openid) {
  //     query.openid = res.data.openid

  //     const user = await ctx.model.User.findOne(query)
  //     if (user) {
  //       query.token = await service.actionToken.apply(user._id)
  //     }
  //   }

  //   // const x = {
  //   //   openid: 'oOI0f57z8HoQk9K-bbngX020vne4',
  //   // }

  //   ctx.helper.success({ ctx, res: query })
  // }
  async authBind() {
    const { ctx, service } = this
    const _id = ctx.state.user.data._id
    const payload = ctx.query // GET
    const { code, state } = payload

    const appid = 'wxefa486642793ca14'
    const secret = '7f07afdac5d904587c5112e65a3382f3'

    const url =
      'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
      appid +
      '&secret=' +
      secret +
      '&code=' +
      code +
      '&grant_type=authorization_code'

    // console.log(url)

    const res = await ctx.curl(url, {
      contentType: 'json',
      dataType: 'json',
    })

    console.log(res.data)

    if (res.data.openid) {
      const query = {}
      query.openid = res.data.openid
      const user = await ctx.model.User.findByIdAndUpdate(_id, query, { new: 1 })
      // if (user) {
      //   query.token = await service.actionToken.apply(user._id)
      // }
      ctx.helper.success({ ctx, res: user })
      return
    }
    // console.log(query)

    ctx.helper.success({ ctx, res: '' })
  }

  async auth() {
    const { ctx, service } = this

    const payload = ctx.query // GET
    const { code, state } = payload

    // const appid = 'wx65900691245da020'
    // const secret = 'c9ead5c9d81013e2b523f4c43d0c1078'

    const appid = 'wxefa486642793ca14'
    const secret = '7f07afdac5d904587c5112e65a3382f3'

    const url =
      'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
      appid +
      '&secret=' +
      secret +
      '&code=' +
      code +
      '&grant_type=authorization_code'

    console.log(url)

    const res = await ctx.curl(url, {
      contentType: 'json',
      dataType: 'json',
    })

    // https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
    console.log(res.data)

    const query = {}
    if (res.data.openid) {
      query.openid = res.data.openid

      const user = await ctx.model.User.findOne(query)
      if (user) {
        query.token = await service.actionToken.apply(user._id)
      }
    }
    console.log(query)

    ctx.helper.success({ ctx, res: query })
  }

  
  // 创建订单，
  async ordersH5() {
    const { ctx, service } = this
    const _id = ctx.state.user.data._id
    const payload = ctx.request.body || {} // POST
    const { amount, channel } = payload

    const orders = await ctx.model.Income.create({
      amount,
      channel,
      user: _id,
    })
    // console.log(orders)
    const appid = 'wxefa486642793ca14'
    const apiv3_private_key = 'f154e3221857ed8edf5fc115949da945' // apiv3 私钥
    const private_key = require('fs').readFileSync('./weixin/apiclient_key.pem').toString()

    const payment = new Payment({
      appid,
      mchid: '1540284971',
      private_key, //或者直接复制证书文件内容
      serial_no: '7045219FA1F83EAE6103FFB7933EC2FD4B71B28C',
      apiv3_private_key,
      notify_url: 'http://mhzc-api.crazysports.com/api/public/callback/weixin',
    })

    let data = await payment.h5({
      description: '梦幻中超-积分充值',
      out_trade_no: orders._id,
      amount: {
        // total: 1,
        total: Number(amount) * 100,
      },
      scene_info: {
        payer_client_ip: '120.92.76.227',
      },
    })

    // console.log(data)
    ctx.helper.success({ ctx, res: data })
  }

  // 创建订单，
  async ordersJSAPI() {
    const { ctx, service } = this
    const _id = ctx.state.user.data._id
    const payload = ctx.request.body || {} // POST
    const { amount, channel } = payload

    const user = await ctx.model.User.findById(_id)

    const orders = await ctx.model.Income.create({
      amount,
      channel,
      user: _id,
    })
    // console.log(orders)
    const appid = 'wxefa486642793ca14'
    const noncestr = Math.random().toString(36).substr(2, 15)
    // const noncestr = ctx.helper.randomNum(16)
    const signType = 'RSA'
    const timestamp = parseInt(new Date().getTime() / 1000) + ''
    const apiv3_private_key = 'f154e3221857ed8edf5fc115949da945' // apiv3 私钥
    const private_key = require('fs').readFileSync('./weixin/apiclient_key.pem').toString()

    const payment = new Payment({
      // appid: 'wx4344f3143f2c1421',
      appid,
      mchid: '1540284971',
      private_key, //或者直接复制证书文件内容
      serial_no: '7045219FA1F83EAE6103FFB7933EC2FD4B71B28C',
      apiv3_private_key,
      notify_url: 'http://mhzc-api.crazysports.com/api/public/callback/weixin',
    })

    let data = await payment.jsapi({
      description: '梦幻中超-积分充值',
      out_trade_no: orders._id,
      amount: {
        // total: 1,
        total: Number(amount) * 100,
      },
      payer: {
        openid: user.openid,
      },
    })

    // console.log(data)
    const res = JSON.parse(data.data)
    let prepay_id = res.prepay_id

    //4.签名
    const signData =
      appid + '\n' + timestamp + '\n' + noncestr + '\n' + 'prepay_id=' + prepay_id + '\n'

    const finalsign = payment.rsaSign(signData, private_key)

    // console.log(signData, finalsign)
    //这才是客户端最后使用的数据;
    let clientParam = {
      appId: appid,
      nonceStr: noncestr,
      timeStamp: timestamp,
      package: 'prepay_id=' + prepay_id,
      signType: signType,
      paySign: finalsign,
    }
    console.log(clientParam)

    // console.log(data)
    ctx.helper.success({ ctx, res: clientParam })
  }



  // 微信支付回调
  async payCallback() {
    const { ctx, service } = this

    // const get = ctx.query // GET
    const post = ctx.request.body || {} // POST
    console.log('========= weixin callback ======================')
    // console.log(get)
    // console.log(post)
    const { resource } = post
    if (resource) {
      const payment = new Payment({
        appid: 'wx4344f3143f2c1421',
        mchid: '1540284971',
        private_key: require('fs').readFileSync('./weixin/apiclient_key.pem').toString(), //或者直接复制证书文件内容
        serial_no: '7045219FA1F83EAE6103FFB7933EC2FD4B71B28C',
        apiv3_private_key: 'f154e3221857ed8edf5fc115949da945',
        notify_url: 'http://mhzc-api.crazysports.com/api/public/callback/weixin',
        // notify_url: 'http://mhzc.crazysports.com/api/public/weixin/callback',
      })

      let result = await payment.decodeResource(resource)

      if (result) {
        console.log(result.out_trade_no, result.trade_state_desc)
        // await ctx.model..find({  }).populate()
        // const iid = '60785e2457293de0ab6e862c'
        const iid = result.out_trade_no
        const income = await ctx.model.Income.findOne({ _id: iid, status: 'init' }).populate('user')
        if (income) {
          const user = income.user
          await ctx.model.Income.findByIdAndUpdate(iid, {
            status: 'pay',
            details: result,
          })

          await ctx.model.Bills.create({
            amount: result.amount.total,
            reason: '积分充值',
            user,
          })

          await ctx.model.User.findByIdAndUpdate(user._id, {
            amount: Number((Number(result.amount.total) + user.amount).toFixed(2)),
          })

          console.log(user.realName, result.amount.total, '充值成功')
        }
      }

      ctx.body = {
        code: 'SUCCESS',
        message: '成功',
      }
      ctx.status = 200
    } else {
      ctx.throw(404, 'no data')
    }
  }
}

module.exports = WeixinController

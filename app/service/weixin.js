const Service = require('egg').Service

class WeixinService extends Service {
  /**
   * 获取token, 没有就去服务器申请
   * @param {*} appid 
   * @param {*} secret 
   * @returns 
   */
  async token(appid, secret) {
    const { ctx, service } = this
    const token = await ctx.model.Weixin.findOne({ appid })
    let access_token
    if (!token) {
      access_token = await service.weixin.getToken(appid, secret)
    } else {
      if (!token.access_token || token.token_expires_in < new Date()) {
        console.log(
          'get token : ',
          token.token_expires_in,
          new Date(),
          token.token_expires_in < new Date()
        )
        access_token = await service.weixin.getToken(appid, secret)
      } else {
        access_token = token.access_token
      }
    }
    return access_token
  }

  /**
   * 获取微信公众号，ticket，没有就从微信申请
   * @param {*} appid 
   * @param {*} secret 
   * @returns 
   */
  async ticket(appid, secret) {
    const { ctx, service } = this

    const token = await ctx.model.Weixin.findOne({ appid })
    let ticket
    if (!token) {
      const access_token = await service.weixin.token(appid, secret)
      ticket = await service.weixin.jsapi_ticket(appid, access_token)
    } else {
      if (!token.jsapi_ticket || token.ticket_expires_in < new Date()) {
        console.log(
          'get ticket: ',
          token.ticket_expires_in,
          new Date(),
          token.ticket_expires_in < new Date()
        )
        const access_token = await service.weixin.token(appid, secret)
        ticket = await service.weixin.jsapi_ticket(appid, access_token)
      } else {
        ticket = token.jsapi_ticket
      }
    }
    return ticket
  }

  /**
   * 申请 token
   * @param {*} appid 
   * @param {*} secret 
   * @returns 
   */
  async getToken(appid, secret) {
    const { ctx, service } = this
    const url =
      'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +
      appid +
      '&secret=' +
      secret
    // console.log(url)
    const res = await ctx.curl(url, {
      contentType: 'json',
      dataType: 'json',
    })
    // console.log(res.data)
    if (!res.data.errcode) {
      const update = {
        access_token: res.data.access_token,
        token_expires_in: new Date(new Date().getTime() + 1000 * (res.data.expires_in - 60 * 10)),
      }

      await ctx.model.Weixin.findOneAndUpdate({ appid }, update, { upsert: true, new: true })

      return update.access_token
    }
    return ''
  }

  /**
   * 申请 ticket
   * @param {*} appid 
   * @param {*} access_token 
   * @returns 
   */
  async jsapi_ticket(appid, access_token) {
    const { ctx, service } = this

    const url =
      'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' +
      access_token +
      '&type=jsapi'
    // console.log(url)
    const res = await ctx.curl(url, {
      contentType: 'json',
      dataType: 'json',
    })
    // console.log(res.data)
    if (res.data.errcode === 0) {
      const update = {
        jsapi_ticket: res.data.ticket,
        ticket_expires_in: new Date(new Date().getTime() + 1000 * (res.data.expires_in - 60 * 10)),
      }

      await ctx.model.Weixin.findOneAndUpdate({ appid }, update, { upsert: true, new: true })
      return update.jsapi_ticket
    }
    return ''
  }
}

module.exports = WeixinService

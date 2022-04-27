'use strict'
const fs = require('fs')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const Controller = require('egg').Controller

class UserAccessController extends Controller {

  constructor(ctx) {
    super(ctx)

    

    this.UserResetPswTransfer = {
      password: { type: 'password', required: true, allowEmpty: false, min: 6 },
      oldPassword: { type: 'password', required: true, allowEmpty: false, min: 6 }
    }

    this.UserUpdateTransfer = {
      mobile: { type: 'string', required: true, allowEmpty: false },
      realName: {type: 'string', required: true, allowEmpty: false, format: /^[\u2E80-\u9FFF]{2,6}$/}
    }

    this.UserCreateTransfer = {
      address: { type: 'string', required: true, allowEmpty: false , format: /^0x[a-fA-F0-9]{40}$/},
    }

    this.UserLoginTransfer = {
      address: { type: 'string', required: true, allowEmpty: false , format: /^0x[a-fA-F0-9]{40}$/},
    }
  }

  async signup() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserCreateTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.userAccess.signup(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }

  // 用户登入
  async signin() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserLoginTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.userAccess.signin(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }

  // 用户登出
  async logout() {
    const { ctx, service } = this
    // 调用 Service 进行业务处理
    await service.userAccess.logout()
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }
  
  // 修改密码
  async resetPsw() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserResetPswTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    await service.userAccess.resetPsw(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }

  // 获取用户信息
  async current() {
    const { ctx, service } = this
    const res = await service.userAccess.current()
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }

  // 修改基础信息
  async resetSelf() {
    const {ctx, service} = this
    // 校验参数
    ctx.validate(this.UserUpdateTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用Service 进行业务处理
    await service.userAccess.resetSelf(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }

}

module.exports = UserAccessController

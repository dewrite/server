const Controller = require('egg').Controller
const fs = require('fs')
const fse = require('fs-extra')
const { spawn , execSync} = require('child_process')
class UserController extends Controller {
  constructor(ctx) {
    super(ctx)

    this.UserCreateTransfer = {
      mobile: { type: 'string', required: true, allowEmpty: false, format: /^[0-9]{11}$/ },
      password: { type: 'password', required: true, allowEmpty: false, min: 6 },
      realName: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[\u2E80-\u9FFF]{2,6}$/,
      },
    }

    this.UserUpdateTransfer = {
      mobile: { type: 'string', required: true, allowEmpty: false },
      realName: {
        type: 'string',
        required: true,
        allowEmpty: false,
        format: /^[\u2E80-\u9FFF]{2,6}$/,
      },
    }
  }

  async publish() {
    const { ctx, app } = this
    const { id } = ctx.params

    const cwd = app.config.theme.template
    // const args = [id]
    try {
      execSync('./build.sh ' + id , { cwd })
      // console.log(out)
    } catch (error) {
      // console.log(error)
    }
    ctx.helper.success({ ctx, res: 'ok' })
    // const ls = spawn('./build.sh', args, { cwd, encoding: 'utf-8' })
    // // return
    // // ls.stdout.on('data', (data) => {
    // //   console.log(`stdout: ${data}`)
    // // })

    // ls.stderr.on('data', (data) => {
    //   console.log(`stderr: ${data}`)
    // })

    // ls.on('error', (error) => {
    //   console.log(`error: ${error.message}`)
    // })

    // ls.on('close', (code) => {
    //   console.log(`${id} build successfully ${code}`)
    // })

    // ctx.response.body = ls.stdout
    // return 'ok'
  }

  // build 站点
  async init() {
    const { ctx, service } = this
    const { id } = ctx.params
    const { overwrite }  = ctx.query

    const user = await ctx.model.User.findById(id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    // 生成首页文件
    await service.user.generateSite(user)
    await service.user.copyTheme(user, overwrite)
    if (overwrite) {
      await service.user.generateReadme(user)
      await service.user.generateConfig(user)
    }
    
    ctx.helper.success({ ctx, res: 'ok' })
  }

  async updated() {
    const { ctx, service } = this
    const { id } = ctx.params

    const user = await ctx.model.User.findById(id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    
    await service.user.generateReadme(user)
    await service.user.generateConfig(user)

    ctx.helper.success({ ctx, res: 'ok' })
  }

  async deploy() {
    const { ctx, service } = this
    const { id } = ctx.params

    const user = await ctx.model.User.findById(id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    
    await service.user.deploy(user)
    
    await ctx.model.User.findByIdAndUpdate(id, { build: new Date() })

    ctx.helper.success({ ctx, res: 'ok' })
  }


  // =======================================================================
  // =======================================================================
  // =======================================================================
  // 创建用户
  async create() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserCreateTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.user.create(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 删除单个用户
  async destroy() {
    const { ctx, service } = this
    // 校验参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    await service.user.destroy(id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx })
  }

  // 修改用户
  async update() {
    const { ctx, service } = this
    // 校验参数
    // ctx.validate(this.UserUpdateTransfer)
    // 组装参数
    const { id } = ctx.params
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.user.update(id, payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 获取单个用户
  async show() {
    const { ctx, service } = this
    // 组装参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    const res = await service.user.show(id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 获取所有用户(分页/模糊)
  async index() {
    const { ctx, service } = this
    // 组装参数
    const payload = ctx.query
    // 调用 Service 进行业务处理
    const res = await service.user.index(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 删除所选用户(条件id[])
  async removes() {
    const { ctx, service } = this
    // 组装参数
    // const payload = ctx.queries.id
    const { id } = ctx.request.body
    const payload = id.split(',') || []
    // 调用 Service 进行业务处理
    const result = await service.user.removes(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx })
  }
}

module.exports = UserController

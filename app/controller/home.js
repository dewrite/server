const Controller = require('egg').Controller
const path = require('path')

class HomeController extends Controller {
  async index() {
    const packageJson = require(path.resolve(this.config.baseDir, 'package.json'))
    this.ctx.body = {
      name: 'tempateTitle',
      auther: `${packageJson.author}`,
      version: `${packageJson.version}`,
      node_env: process.env.NODE_ENV,
      eggjs_env: this.app.config.env,
      server_name: process.env.SERVER_NAME,
      build_version: process.env.BUILD_VERSION,
      node_version: process.versions.node,
      // logger: this.app.config.logger.dir
    }
  }

  async init() {
    const { ctx, service } = this

    const jsons = [
      {
        name: 'user',
        access: 'user',
      },
      {
        name: 'admin',
        access: 'admin',
      },
    ]
    let role
    for (const json of jsons) {
      role = (await ctx.model.Role.findOne(json)) || (await service.role.create(json))
    }
    
    
    // 组装参数
    const payload = {
      address: '0x86ab7333c8965de7f512b144f282e5f04ab08fdb',
      realName: 'admin',
      role: role,
    }

    // 调用 Service 进行业务处理
    const res =
      (await ctx.model.User.findOne(payload)) ||
      (await service.userAccess.signup(Object.assign(payload, { password: '123123' })))
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  async echo() {
    const { ctx } = this
    // const _id = ctx.state.user && ctx.state.user.data._id // GET ID
    const post = ctx.request.body || {} // POST
    const get = ctx.query // GET

    console.log(post, get)

    const res = {
      post,
      get,
    }

    ctx.helper.success({ ctx, res })
  }
}

module.exports = HomeController

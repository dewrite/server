const Controller = require('egg').Controller
class ArticlesController extends Controller {
  constructor(ctx) {
    super(ctx)

    this.createRule = {
      title: { type: 'string', required: true, allowEmpty: false },
    }
  }
  async build() {
    const { ctx, service, app } = this
    const { id } = ctx.params

    const res = await ctx.model.Articles.findById(id).populate('user')
    if (!res) {
      ctx.throw(404, '文章不存在')
    }
    if (!res.user) {
      ctx.throw(404, '用户不存在')
    }

    await service.articles.markdown(res)

    await ctx.model.Articles.findByIdAndUpdate(id, { pass: true })

    ctx.helper.success({ ctx, res: 'ok' })
  }
  // 获取所有角色(分页/模糊)
  async index() {
    const { ctx, service } = this
    const payload = ctx.query
    const res = await service.articles.index(payload)
    ctx.helper.success({ ctx, res })
  }

  // 新增之前调用(默认值，不一定需要)
  async new() {
    const { ctx } = this
    const payload = ctx.query
    const res = await new ctx.model.Articles()
    ctx.helper.success({ ctx, res })
  }

  // 创建角色
  async create() {
    const { ctx } = this
    ctx.validate(this.createRule)
    const payload = ctx.request.body || {}
    const _id = ctx.state.user && ctx.state.user.data._id

    payload.user = _id
    const res = await ctx.model.Articles.create(payload)
    ctx.helper.success({ ctx, res })
  }

  // 获取单个角色
  async show() {
    const { ctx } = this
    const { id } = ctx.params

    const res = await ctx.model.Articles.findById(id)
    if (!res) {
      ctx.throw(404, 'articles 没有找到')
    }
    ctx.helper.success({ ctx, res })
  }

  // 编辑之前调用 根据具体业务修改代码 默认和show相同
  async edit() {
    await this.show()
  }

  // 修改角色
  async update() {
    const { ctx } = this
    ctx.validate(this.createRule)
    const { id } = ctx.params
    const payload = ctx.request.body || {}

    const articles = await ctx.model.Articles.findById(id)
    if (!articles) {
      ctx.throw(404, 'articles 没有找到')
    }
    await ctx.model.Articles.findByIdAndUpdate(id, payload)

    ctx.helper.success({ ctx })
  }

  // 删除单个角色
  async destroy() {
    const { ctx } = this
    const { id } = ctx.params

    const articles = await ctx.model.Articles.findById(id)
    if (!articles) {
      ctx.throw(404, 'articles 没有找到')
    }
    await ctx.model.Articles.findByIdAndRemove(id)

    ctx.helper.success({ ctx })
  }

  // 获取所有角色(分页/模糊)
  async mine() {
    const { ctx, service } = this

    const _id = ctx.state.user.data._id
    // const user = await ctx.model.User.findById(_id)
    const payload = ctx.query

    // 调用 Service 进行业务处理
    const res = await service.articles.index(payload, _id)
    ctx.helper.success({ ctx, res })
  }

  // 开启关闭
  async pass() {
    const { ctx } = this
    const payload = ctx.request.body || {}
    const { id } = ctx.params
    const articles = await ctx.model.Articles.findById(id)
    if (!articles) {
      ctx.throw(404, 'articles没有找到')
    }
    const pass = !articles.pass
    const res = await ctx.model.Articles.findByIdAndUpdate(id, { pass })
    ctx.helper.success({ ctx, res })
  }
}

module.exports = ArticlesController


const Controller = require('egg').Controller

class FunderController extends Controller {
  constructor(ctx) {
    super(ctx)

    this.createRule = {
      name: { type: 'string', required: true, allowEmpty: false },
      access: { type: 'string', required: true, allowEmpty: false }
    }
  }
  
  // 获取所有角色(分页/模糊)
  async index() {
    const { ctx, service } = this
    const payload = ctx.query
    const res = await service.funder.index(payload)
    ctx.helper.success({ctx, res})
  }

  // 新增之前调用(默认值，不一定需要)
  async new() {
    const { ctx } = this
    const payload = ctx.query
    const res = await new ctx.model.Funder()
    ctx.helper.success({ctx, res})
  }

  // 创建角色
  async create() {
    const { ctx } = this
    ctx.validate(this.createRule)
    const payload = ctx.request.body || {}

    const res = await ctx.model.Funder.create(payload)
    ctx.helper.success({ctx, res})
  }

  // 获取单个角色
  async show() {
    const { ctx } = this
    const { id } = ctx.params
    
    const res = await ctx.model.Funder.findById(id)
    if (!res) {
      ctx.throw(404, 'funder 没有找到')
    }
    ctx.helper.success({ctx, res})
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

    const funder = await ctx.model.Funder.findById(id)
    if (!funder) {
      ctx.throw(404, 'funder 没有找到')
    }
    await ctx.model.Funder.findByIdAndUpdate(id, payload)

    ctx.helper.success({ctx})
  }
  
  // 删除单个角色
  async destroy() {
    const { ctx } = this
    const { id } = ctx.params

    const funder = await ctx.model.Funder.findById(id)
    if (!funder) {
      ctx.throw(404, 'funder 没有找到')
    }
    await ctx.model.Funder.findByIdAndRemove(id)

    ctx.helper.success({ctx})
  }

  // 获取所有角色(分页/模糊)
  async mine() {
    const { ctx, service } = this

    const _id = ctx.state.user.data._id
    // const user = await ctx.model.User.findById(_id)
    const payload = ctx.query

    // 调用 Service 进行业务处理
    const res = await service.funder.index(payload, _id)
    ctx.helper.success({ctx, res})
  }

  // 开启关闭
  async pass() {
    const { ctx } = this
    const payload = ctx.request.body || {}
    const { id } = ctx.params
    const funder = await ctx.model.Funder.findById(id)
    if (!funder) {
      ctx.throw(404, 'funder没有找到')
    }
    const pass = !funder.pass
    const res = await ctx.model.Funder.findByIdAndUpdate(id, { pass })
    ctx.helper.success({ ctx, res })
  }
}

module.exports = FunderController


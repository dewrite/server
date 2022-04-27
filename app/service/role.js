const Service = require('egg').Service

class RoleService extends Service {
  // create===============================================>
  async create(payload) {
    return this.ctx.model.Role.create(payload)
  }

  // destroy===============================================>  
  async destroy(_id) {
    const { ctx, service } = this
    const role = await ctx.service.role.find(_id)
    if (!role) {
      ctx.throw(404, 'role not found')
    }
    return ctx.model.Role.findByIdAndRemove(_id)
  }

  // update===============================================>
  async update(_id, payload) {
    const { ctx, service } = this
    const role = await ctx.service.role.find(_id)
    if (!role) {
      ctx.throw(404, 'role not found')
    }
    return ctx.model.Role.findByIdAndUpdate(_id, payload)
  }

  // show===============================================>
  async show(_id) {
    const role = await this.ctx.service.role.find(_id)
    if (!role) {
      this.ctx.throw(404, 'role not found')
    }
    return this.ctx.model.Role.findById(_id)
  }

  // index===============================================>
  async index(payload) {
    let { currentPage, pageSize, search } = payload

    // 分页
    pageSize = Number(pageSize || 10)
    currentPage = Number(currentPage || 1)
    const skip = (currentPage - 1) * pageSize

    // 排序
    const sort = { createdAt: -1 }

    // 对象映射
    // let populate = ['blockchain', 'block']
    // .populate(populate)

    // 查询参数
    let querys = {}
    if (search) {
      querys.name = { $regex: search }
    }

    const res = await this.ctx.model.Role.find(querys).skip(skip).limit(pageSize).sort(sort).exec()
    const count = await this.ctx.model.Role.countDocuments(querys).exec()

    // 整理数据源 -> Ant Design Pro
    const list = res.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc)
      jsonObject.index = i
      jsonObject.createdAt = e.createdAt.getTime()
      return jsonObject
    })

    return { count, list, pageSize, currentPage }
  }

  // removes===============================================>
  async removes(values) {
    if (values.length > 0) {
      return this.ctx.model.Role.deleteMany({ _id: { $in: values } })
    }else{
      return this.ctx.model.Role.deleteMany({})
    }
  }

  // Commons===============================================>
  async find(id) {
    return this.ctx.model.Role.findById(id)
  }

}

module.exports = RoleService

const Service = require('egg').Service

class FunderService extends Service {

  /**
  *  index 搜索方法
  */
  async index(payload, id = undefined) {
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
    if (id){
      querys.user = id
    }

    const res = await this.ctx.model.Funder.find(querys).skip(skip).limit(pageSize).sort(sort).exec()
    const count = await this.ctx.model.Funder.countDocuments(querys).exec()

    // 整理数据源 -> Ant Design Pro
    const list = res.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc)
      // jsonObject.index = i
      // jsonObject.createdAt = e.createdAt.getTime()
      return jsonObject
    })

    return { count, list, pageSize, currentPage }
  }

}

module.exports = FunderService

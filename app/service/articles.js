const Service = require('egg').Service
const fs = require('fs')

class ArticlesService extends Service {

  async markdown(article) {
    const { ctx, app } = this

    const tags = article.tag ? article.tag.split(',') : []
    let content = ['tag:']
    for (const t of tags) {
      content.push('  - ' + t)
    }
    const md = `---
title: ${article.title}
date: ${ctx.helper.formatTime(article.updatedAt, 'YYYY-MM-DD')}
${content.join('\n')}
---

# ${article.title}

${article.content}
    `
    const root = app.config.theme.template
    const site = '/sites/' + article.user._id + '/posts/'
    const filename = root + site + article._id + '.md'
    if (!fs.existsSync(root + site)) {
      fs.mkdirSync(root + site,{recursive: true } )
    }
    fs.writeFileSync(filename, md)
  }

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
    const sort = { updatedAt: -1 }

    // 对象映射
    // let populate = ['blockchain', 'block']
    // .populate(populate)

    // 查询参数
    let querys = {}
    if (search) {
      querys.name = { $regex: search }
    }
    if (id) {
      querys.user = id
    }

    const res = await this.ctx.model.Articles.find(querys)
      .skip(skip)
      .limit(pageSize)
      .sort(sort)
      .exec()
    const count = await this.ctx.model.Articles.countDocuments(querys).exec()

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

module.exports = ArticlesService

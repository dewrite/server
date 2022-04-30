const Service = require('egg').Service
const fs = require('fs')
const path = require('path')
const pinataSDK = require('@pinata/sdk')

class ArticlesService extends Service {
  async svgfile(article) {
    const { ctx, app } = this

    let template = app.config.image.template
    const target = path.join(this.config.baseDir, 'app/public/svgs', article._id + '.svg')

    template = template.replace('TitleTag', article.title)
    template = template.replace('AuthorTag', article.user.name)
    template = template.replace('DateTag', ctx.helper.formatTime(article.updatedAt, 'YYYY-MM-DD'))

    fs.writeFileSync(target, template)
    // console.log(target)
    return target
  }

  async jsonfile(article, svg) {
    const { ctx, app } = this

    const target = path.join(this.config.baseDir, 'app/public/jsons', article._id + '.json')
    let url = app.config.theme.url
    if (article.user.domain) {
      url = url.replace('subdomain', article.user.domain)
    } else {
      url = url.replace('subdomain', article.user.address)
    }
    url = url.replace('aid', article._id)

    const template = {
      name: article.title,
      id: article._id,
      external_url: url,
      description: url,
      image: 'https://gateway.pinata.cloud/ipfs/' + svg,
      attributes: [
        {
          trait_type: 'Author',
          value: article.user.name,
        },
        {
          display_type: 'date',
          trait_type: 'Discovered',
          value: article.updatedAt.getTime(),
        },
      ],
    }

    // if (article.svg) {
    //   template.image = 'https://gateway.pinata.cloud/ipfs/' + article.svg
    // }

    fs.writeFileSync(target, JSON.stringify(template, null, 2))
    console.log(target)
    return target
  }

  async ifps(name) {
    const pinata = pinataSDK(
      'da57ae681ce3bc2d7b0b',
      '26da1c1c6851262eab1c03ab31c8296ea3a6dc3d5f119e68dfdd438d16e4f514'
    )

    try {
      const result = await pinata.testAuthentication()
      if (result.authenticated) {
        const filename = name.substring(name.lastIndexOf('/') + 1)

        const options = {
          pinataMetadata: {
            name: filename,
          },
          pinataOptions: {
            cidVersion: 0,
          },
        }
        // console.log(filename)
        const res = await pinata.pinFromFS(name, options)
        // console.log(res)
        return res.IpfsHash
      }
    } catch (e) {
      console.log(e)
    }
  }

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
      fs.mkdirSync(root + site, { recursive: true })
    }
    fs.writeFileSync(filename, md)
    return filename
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

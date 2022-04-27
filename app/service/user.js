const Service = require('egg').Service
const fs = require('fs')
const fse = require('fs-extra')
const { spawn } = require('child_process')
class UserService extends Service {

  async deploy(user, overwrite) {
    const { app } = this

    const root = app.config.theme.template
    const site = '/dist/' + user._id

    const server = app.config.theme.site
    const uri = '/public/_sub/' + user._id

    console.log(root + site, server + uri)
    fse.copySync(root + site, server + uri, { overwrite: true })
  }

  async generateConfig(user) {
    const { app } = this

    const root = app.config.theme.template
    const site = '/sites/' + user._id + '/'
    const vuepress = root + site + '.vuepress'
    const configname = vuepress + '/config.ts'
    // let configfile = fs.readFileSync(vuepress + '/test.js', 'utf-8')
    let configfile = fs.readFileSync(configname, 'utf-8')

    configfile = user.avatar
      ? configfile.replace(/logo[^"]*"([^"]*?)"/gi, `logo: "${user.avatar}"`)
      : configfile

    configfile = user.cover
      ? configfile.replace(/bgImage[^"]*"([^"]*?)"/gi, `bgImage: "${user.cover}"`)
      : configfile
    configfile = user.name
      ? configfile.replace(/author: {[^"]*"([^"]*?)"/g, `author: {\n    name: "${user.name}"`)
      : configfile
    configfile = user.title
      ? configfile.replace(/title[^"]*"([^"]*?)"/gi, `title: "${user.title}"`)
      : configfile
    configfile = user.desc
      ? configfile.replace(/description[^"]*"([^"]*?)"/gi, `description: "${user.desc}"`)
      : configfile
    configfile = user.name
      ? configfile.replace(/footer[^"]*"([^\\|]*?)\|/g, `footer: "Written by ${user.name} |`)
      : configfile

    fs.writeFileSync(configname, configfile)
  }

  async copyTheme(user, overwrite) {
    const { ctx, service, app } = this

    const root = app.config.theme.template
    const site = '/sites/' + user._id + '/'
    const config = '/vuepress'
    const vuepress = root + site + '.vuepress'
    if (overwrite || !fs.existsSync(vuepress)) {
      fse.copySync(root + config, vuepress, { overwrite: true })
    }
  }

  async generateSite(user) {
    const { ctx, service, app } = this

    const root = app.config.theme.template
    const site = '/sites/' + user._id + '/'
    const filename = root + site + 'README.md'
    if (!fs.existsSync(root + site)) {
      fs.mkdirSync(root + site, { recursive: true })
    }
  }

  async generateReadme(user) {
    const { app } = this

    const root = app.config.theme.template
    const site = '/sites/' + user._id + '/'
    const filename = root + site + 'README.md'

    const md = `---
home: true
layout: Blog
title: Home
heroImageStyle: {
  borderRadius: '100px',
}
heroFullScreen: false
heroImage: ${user.avatar}
bgImage: ${user.cover}
tagline: ${user.desc}
---
    
    `
    fs.writeFileSync(filename, md)
  }

  // create======================================================================================================>
  async create(payload) {
    const { ctx, service } = this
    const role = await service.role.show(payload.role)
    if (!role) {
      ctx.throw(404, 'role is not found')
    }
    payload.password = await this.ctx.genHash(payload.password)
    return ctx.model.User.create(payload)
  }

  // destroy======================================================================================================>
  async destroy(_id) {
    const { ctx, service } = this
    const user = await ctx.service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user not found')
    }
    return ctx.model.User.findByIdAndRemove(_id)
  }

  // update======================================================================================================>
  async update(_id, payload) {
    const { ctx, service } = this
    const user = await ctx.service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user not found')
    }
    return ctx.model.User.findByIdAndUpdate(_id, payload)
  }

  // show======================================================================================================>
  async show(_id) {
    const user = await this.ctx.service.user.find(_id)
    if (!user) {
      this.ctx.throw(404, 'user not found')
    }
    return this.ctx.model.User.findById(_id).populate('role')
  }

  // index======================================================================================================>
  async index(payload) {
    const { currentPage, pageSize, isPaging, search } = payload
    let res = []
    let count = 0
    let skip = (Number(currentPage) - 1) * Number(pageSize || 10)
    if (isPaging) {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } })
          .populate('role')
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec()
        count = res.length
      } else {
        res = await this.ctx.model.User.find({})
          .populate('role')
          .skip(skip)
          .limit(Number(pageSize))
          .sort({ createdAt: -1 })
          .exec()
        count = await this.ctx.model.User.count({}).exec()
      }
    } else {
      if (search) {
        res = await this.ctx.model.User.find({ mobile: { $regex: search } })
          .populate('role')
          .sort({ createdAt: -1 })
          .exec()
        count = res.length
      } else {
        res = await this.ctx.model.User.find({}).populate('role').sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.User.count({}).exec()
      }
    }
    // 整理数据源 -> Ant Design Pro
    let data = res.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc)
      jsonObject.key = i
      jsonObject.password = 'Are you ok?'
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
      return jsonObject
    })

    return {
      count: count,
      list: data,
      pageSize: Number(pageSize),
      currentPage: Number(currentPage),
    }
  }

  async removes(payload) {
    return this.ctx.model.User.remove({ _id: { $in: payload } })
  }

  // Commons======================================================================================================>
  async findByMobile(mobile) {
    return this.ctx.model.User.findOne({ mobile: mobile })
  }

  async find(id) {
    return this.ctx.model.User.findById(id)
  }

  async findByIdAndUpdate(id, values) {
    return this.ctx.model.User.findByIdAndUpdate(id, values)
  }
}

module.exports = UserService

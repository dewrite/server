const Controller = require('egg').Controller
const path = require('path')
const ObjectId = require('mongoose').Types.ObjectId

class TestController extends Controller {
  async index() {
    this.ctx.body = {
      name: 'test'
    }
  }

  async echo() {
    const { ctx } = this
    // const _id = ctx.state.user && ctx.state.user.data._id // GET ID
    const post = ctx.request.body || {} // POST
    const get = ctx.query // GET

    console.log( post , get)

    const res = {
      post,
      get
    }
    
    ctx.helper.success({ctx, res})
  }


  async top() {
    const { ctx, service } = this
    // const _id = ctx.state.user.data._id;
    // const user = await ctx.model.User.findById(_id);

    const payload = ctx.query // GET
    // const payload = ctx.request.body || {}; // POST
    let { currentPage, pageSize, type } = payload

    pageSize = Number(pageSize || 10)
    currentPage = Number(currentPage || 1)
    let skip = (currentPage - 1) * pageSize

    let sort, info
    type = Number(type || 1)
    switch (type) {
    case 1:
      info = '日榜'
      sort = {
        $gte: new Date(ctx.helper.addDate(0)),
        $lte: new Date(ctx.helper.addDate(0, null, 'last')),
      }
      break
    case 2:
      info = '周榜'
      sort = {
        $gte: new Date(ctx.helper.addDate(-(new Date().getDay()))),
        $lte: new Date(ctx.helper.addDate(7 - new Date().getDay(), null, 'last')),
      }
      break
    case 3:
      info = '月榜'
      sort = {
        $gte: new Date(ctx.helper.addDate(-new Date().getDate() + 1)),
        $lte: new Date(
          ctx.helper.addDate(ctx.helper.getDayOfMonth() - new Date().getDate(), null, 'last')
        ),
      }
      break
    default:
      sort = {
        $gte: new Date(ctx.helper.addDate(-new Date().getDate() + 1)),
        $lte: new Date(
          ctx.helper.addDate(ctx.helper.getDayOfMonth() - new Date().getDate(), null, 'last')
        ),
      }
    }
    console.log(info, '排行榜日期范围：',new Date(), sort)
    const weeks = await ctx.model.Bills.aggregate([
      {
        $match: {
          amount: { $gt: 0 },
          createdAt: sort,
        },
      },
      {
        $group: {
          _id: '$user',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
      { $skip: skip },
      { $limit: pageSize },
      {
        $lookup: {
          from: ctx.model.User.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
    ])

    const countQuery = await ctx.model.Bills.aggregate([
      {
        $match: {
          amount: { $gt: 0 },
          createdAt: sort,
        },
      },
      {
        $group: {
          _id: '$user',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $count: 'myCount',
      },
    ])
    // const obj = await ctx.model.User.find().limit(10).sort(sort)
    // console.log(pageSize, skip)
    let count = countQuery.length > 0 ? countQuery[0].myCount : 0
    count = count > 100 ? 100 : count
    // pageSize = skip > 100 ? 0 : pageSize
    let list = weeks.map((e, i) => {
      const jsonObject = Object.assign({})
      jsonObject.key = i
      jsonObject.mobile = e.user[0].mobile
      jsonObject.realName = e.user[0].realName
      jsonObject.avatar = e.user[0].avatar
      jsonObject.amount = e.totalAmount

      return jsonObject
    })
    const res = { list, count }

    ctx.helper.success({ ctx, res })
  }


  async topAndSum() {
    const { ctx, service } = this

    const _id = ctx.state.user.data._id
    
    const weeks = await ctx.model.Sender.aggregate([
      {
        $match: {
          sender: new ObjectId(_id ),
        },
      },
      {
        $group: {
          _id: '$sender',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: ctx.model.User.collection.name,
          localField: '_id',
          foreignField: '_id',
          as: 'sender',
        },
      },
    ])
  }

  async total() {
    const { ctx, service } = this

    const aggregate = ctx.model.Income.aggregate([
      {
        $match: {
          status: 'pay',
        },
      },
      { $group: { _id: null, total: { $sum: '$details.amount.total' } } },
    ])
  }

}

module.exports = TestController

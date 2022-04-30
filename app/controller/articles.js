const Controller = require('egg').Controller
const { ethers } = require('ethers')

class ArticlesController extends Controller {
  constructor(ctx) {
    super(ctx)

    // this.createRule = {
    //   title: { type: 'string', required: true, allowEmpty: false },
    // }
  }
  // 生成MD
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

    const mdfile = await service.articles.markdown(res)

    // 需要付费才能看，TODO: 未来可能加密后上传到IPFS上。用作者的公钥签名后上传
    // const page = await service.articles.ifps(mdfile)

    await ctx.model.Articles.findByIdAndUpdate(id, { pass: true })

    ctx.helper.success({ ctx, res: 'ok' })
  }

  async ipfs() {
    const { ctx, service } = this
    const { id } = ctx.params

    let res = await ctx.model.Articles.findById(id).populate('user')
    if (!res) {
      ctx.throw(404, '文章不存在')
    }
    if (!res.user) {
      ctx.throw(404, '用户不存在')
    }
    let svg = res.svg
    let ipfs = res.ipfs

    if (!res.svg) {
      const svgfile = await service.articles.svgfile(res)
      svg = await service.articles.ifps(svgfile)
      await ctx.model.Articles.findByIdAndUpdate(id, { svg })
    }
    if (!res.ipfs) {
      const jsonfile = await service.articles.jsonfile(res, svg)
      ipfs = await service.articles.ifps(jsonfile)
      await ctx.model.Articles.findByIdAndUpdate(id, { ipfs })
      console.log(jsonfile)
    }

    ctx.helper.success({ ctx, res: { ipfs, svg } })
  }

  async ethSetOwner() {
    const { ctx, app, service } = this
    const { id } = ctx.params

    let res = await ctx.model.Articles.findById(id).populate('user')
    if (!res) {
      ctx.throw(404, '文章不存在')
    }
    if (!res.user) {
      ctx.throw(404, '用户不存在')
    }
    if (!res.user.address) {
      ctx.throw(404, '用户地址不存在')
    }
    if (!res.nft) {
      ctx.throw(404, 'NFT还未上链')
    }
    if (res.owner) {
      ctx.throw(404, 'NFT授权成功，不能重复授权')
    }
    const last = new Date().getTime() - res.approveLast
    if (last < 1000 * 60 * 20) {
      // console.log(new Date().getTime() , last)
      // console.log('20分钟内不能再次设置，已执行', Math.ceil(last / (1000 * 60)))
      ctx.throw(404, '正在授权中，请稍后再试，' + 20 - Math.ceil(last / (1000 * 60)) + '分钟')
    } else {
      try {
        await ctx.model.Articles.findByIdAndUpdate(id, { approveLast: new Date().getTime() })
        const url = app.config.eth.rpc
        const provider = new ethers.providers.JsonRpcProvider(url)

        // const block = await provider.getBlockNumber()
        // console.log(block)
        // const signer = new ethers.Wallet(your_private_key_string, provider);

        const signer = new ethers.Wallet(process.env.privateKey, provider)
        // const signer = provider.getSigner()
        const BizAbi = ['function setOwner(uint256 tokenId, address owner) public']
        const contract = new ethers.Contract(app.config.eth.biz, BizAbi, signer)

        console.log('NFT token id', res.nft)
        console.log('author', res.user.address)
        console.log('contract', app.config.eth.biz)
        console.log('contract owner', signer.address)

        const tx = await contract.setOwner(res.nft, res.user.address, {
          gasPrice: ethers.utils.parseUnits('100', 'gwei'),
          gasLimit: 1000000,
        })
        // console.log(tx);

        const receipt = await tx.wait()
        console.log(receipt.transactionHash)
        const owner = receipt.transactionHash
        await ctx.model.Articles.findByIdAndUpdate(id, { owner })
        ctx.helper.success({ ctx, res: owner })
      } catch (error) {
        console.error(error)
        await ctx.model.Articles.findByIdAndUpdate(id, { approveLast: 0 })
        ctx.throw(404, '设置拥有权失败，请稍后再试')
      }
    }
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
    // ctx.validate(this.createRule)
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
    // ctx.validate(this.createRule)
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

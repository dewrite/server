module.exports = (app) => {
  const mongoose = app.mongoose

  const ArticlesSchema = new mongoose.Schema(
    {
      title: { type: String, required: true },
      summary: { type: String }, // 摘要
      content: { type: String }, // 内容
      tag: { type: String },

      tx: { type: String }, // 交易地址
      nft: { type: String }, // nft tokenid
      owner: { type: String }, // 是否签约业务合约的owner
      ipfs: { type: String }, //  ipfs
      svg: { type: String }, // svgs ipfs
      page: { type: String }, // docs 文档地址

      cornerstone: { type: Number }, // 基石
      core: { type: Number }, // 核心
      angel: { type: Number }, // 天使

      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      pass: { type: Boolean, default: false }, // 是否发表
      approve: { type: Boolean, default: false }, // 是否授权
      approveLast: { type: Number, default: 0 }, // 是否授权时间，为了防止重复授权
    },
    { timestamps: true }
  )

  // ArticlesSchema.index({ name: 1, pass: 1 });

  // ArticlesSchema.pre('save', async function (next) {
  //   const ctx = app.createAnonymousContext()
  //   this.secret = ctx.helper.randomString(12)
  //   next()
  // })

  ArticlesSchema.methods.toString = function () {
    return this.title
  }

  return mongoose.model('Articles', ArticlesSchema)
}

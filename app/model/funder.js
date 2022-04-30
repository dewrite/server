module.exports = (app) => {
  const mongoose = app.mongoose

  const FunderSchema = new mongoose.Schema(
    {
      level: { type: String, required: true }, // 等级 cornerstone 基石\core 核心\angel 天使\
      amount: { type: Number, required: true },  // 金额
      shares: { type: Number, required: true },  // 股份
      blockchain: { type: String },
      tx: { type: String }, // 交易地址
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      article: { type: mongoose.Schema.Types.ObjectId, ref: 'Articles' },
      pass: { type: Boolean, default: false },
    },
    { timestamps: true }
  )

  // FunderSchema.index({ name: 1, pass: 1 });

  // FunderSchema.pre('save', async function (next) {
  //   const ctx = app.createAnonymousContext()
  //   this.secret = ctx.helper.randomString(12)
  //   next()
  // })

  FunderSchema.methods.toString = function () {
    return this.name
  }

  return mongoose.model('Funder', FunderSchema)
}

module.exports = (app) => {
  const mongoose = app.mongoose

  const FunderSchema = new mongoose.Schema(
    {
      level: { type: String, required: true },
      amount: { type: Number, required: true },
      shares: { type: Number, required: true },
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

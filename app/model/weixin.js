module.exports = app => {
  const mongoose = app.mongoose
  const WeixinSchema = new mongoose.Schema(
    {
      appid: { type: String},
      access_token: { type: String},
      jsapi_ticket: { type: String},
      token_expires_in: { type: Date},
      ticket_expires_in: { type: Date},
    },
    { timestamps: true }
  )

  WeixinSchema.methods.toString = function () {
    return this.access_token 
  }

  return mongoose.model('Weixin', WeixinSchema)
}

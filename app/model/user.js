module.exports = app => {
  const mongoose = app.mongoose
  const UserSchema = new mongoose.Schema({
    password: { type: String,  },
    name: { type: String, },
    address: { type: String , unique: true, required: true },  // 钱包地址
    signature: { type: String }, // 登录签名
    title: { type: String }, // blog 标题
    desc: { type: String }, // blog一句话介绍
    cover: { type: String }, // 
    domain: { type: String ,unique: true }, //

    build: { type: Date }, // 最后一次打包时间

    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    avatar: { type: String, default: '/avatar.jpg'},
    extra: { type: mongoose.Schema.Types.Mixed },

  }, { timestamps: true })

  UserSchema.methods.getInfo =  function () {
    return this.address + this.name
  }

  UserSchema.methods.toString = function () {
    return this.address  
  }

  UserSchema.statics = {
    async findByQuery(query, proj = {}, opt = {}, populate = []) {
      return await this.find(query, proj, opt).populate(populate)
    },

    async findOneByQuery(query, proj = {}, opt = {}, populate = []) {
      return await this.findOne(query, proj, opt).populate(populate)
    }
  }

  return mongoose.model('User', UserSchema)
}

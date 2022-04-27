
module.exports = app => {
  const mongoose = app.mongoose
  
  const ArticlesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, }, // 摘要
    content: { type: String,  }, // 内容
    tag: { type: String,  }, 
    
    tx: { type: String,  },   // 交易地址
    ipfs: { type: String,  }, // ipfs
    docs: { type: String,  }, // vuepress 文档地址

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pass: { type: Boolean, default: false } // 是否发表
  }, { timestamps: true })

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

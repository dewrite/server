'use strict'
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/api/public/init', controller.home.init)
  router.post('/api/public/echo', controller.home.echo)

  router.get('/api/public/test', controller.test.index)
  router.post('/api/public/test/echo', controller.test.echo)


  router.get('/api/articles/build/:id', controller.articles.build)  
  router.get('/api/site/init/:id', controller.user.init)   
  router.get('/api/site/update/:id', controller.user.updated)   
  router.get('/api/site/publish/:id', controller.user.publish)   
  router.get('/api/site/deploy/:id', controller.user.deploy)   

  // insert
  // ===========================================================
  // ======================  funder  =======================
  // ===========================================================
  router.post('/api/funder/pass/:id', controller.funder.pass)    //  开启，关闭
  router.get('/api/funder/mine', controller.funder.mine)     //  根据个人获取信息
  router.resources('funder', '/api/funder', controller.funder)
  // ===========================================================
  // ===========================================================
  // ======================  articles  =======================
  // ===========================================================
 
  router.post('/api/articles/pass/:id', controller.articles.pass)    //  开启，关闭
  router.get('/api/articles/mine', controller.articles.mine)     //  根据个人获取信息
  router.resources('articles', '/api/articles', controller.articles)
  // ===========================================================

  // role
  router.post('/api/role', controller.role.create)
  router.delete('/api/role/:id', controller.role.destroy)
  router.put('/api/role/:id', controller.role.update)
  router.get('/api/role/:id', controller.role.show)
  router.get('/api/role', controller.role.index)
  router.delete('/api/role', controller.role.removes)
  router.resources('role', '/api/role', controller.role)

  // userAccess
  // 常用的开放接口
  // router.post('/api/public/signup', controller.userAccess.signup)
  router.post('/api/public/signin', controller.userAccess.signin)
  router.get('/api/public/logout', controller.userAccess.logout)
  // router.get('/api/public/dashboard', controller.userAccess.dashboard)
  // router.post('/api/public/register', controller.user.create)
  // router.get('/api/public/refresh', controller.userAccess.refresh)
  // router.get('/api/public/captcha', controller.userAccess.captcha)
  // router.get('/api/public/verify', controller.userAccess.verify)
  // router.post('/api/public/sendsms', controller.userAccess.sendsms)
  // router.post('/api/public/lastpassword', controller.userAccess.lastpassword)

  router.get('/api/user/current', controller.userAccess.current)
  router.put('/api/user/resetPsw', controller.userAccess.resetPsw)

  // 微信支付
  // router.post('/api/pay/weixin', controller.weixin.ordersJSAPI)   // 微信下单
  // // 微信公众号相关的接口
  // router.get('/api/weixin/h5init', controller.weixin.init)        // 微信公众号，页面认证
  // router.get('/api/weixin/bind', controller.weixin.authBind)    // 微信和用户绑定
  // // router.get('/api/public/weixin/auth/mp', controller.weixin.authMP) // 微信登录接口，获取openid
  // router.get('/api/public/weixin/auth', controller.weixin.auth) // 微信登录接口，获取openid
  // router.post('/api/public/callback/weixin', controller.weixin.payCallback)   // 微信回调
  // router.get('/api/public/callback/alipay', controller.crazy.weixinCallback)   // 

  // user
  router.post('/api/user', controller.user.create)
  router.delete('/api/user/:id', controller.user.destroy)
  router.put('/api/user/:id', controller.user.update)

  router.get('/api/user/:id', controller.user.show)
  router.get('/api/user', controller.user.index)
  router.resources('user', '/api/user', controller.user)

  // upload
  router.post('/api/public/upload/s3', controller.upload.s3)
  // router.post('/api/public/upload', controller.upload.create)
  // router.post('/api/upload/url', controller.upload.url)
  // router.post('/api/uploads', controller.upload.multiple)
  // router.delete('/api/upload/:id', controller.upload.destroy)
  // // router.put('/api/upload/:id', controller.upload.update)
  // router.post('/api/upload/:id', controller.upload.update) // Ant Design Pro
  // router.put('/api/upload/:id/extra', controller.upload.extra)
  // router.get('/api/upload/:id', controller.upload.show)
  // router.get('/api/upload', controller.upload.index)
  // router.delete('/api/upload', controller.upload.removes)
  // router.resources('upload', '/api/upload', controller.upload)
}

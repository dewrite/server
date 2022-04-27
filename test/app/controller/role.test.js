'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('test/app/controller/role.test.js', () => {

  let id = ''

  before(async () => {
    const res = await app.httpRequest()
      .delete('/api/role')
      .expect(200)

    // console.log(res.body);
  });

  it('测试 role 添加', async () => {
    app.mockCsrf()
    const res = await app.httpRequest()
      .post('/api/role/')
      .type('form')
      .send({
        name: 'test' + new Date().getTime(),
        access: 'test',
      })
      .expect(200, /请求成功/)
    const body = res.body
    assert(body.code === 0);
    id = body.data._id
  })

  it('测试 role 修改', async () => {
    app.mockCsrf()

    return app.httpRequest()
      .put('/api/role/' + id)
      .send({
        name: 'update' + new Date().getTime(),
        access: 'update',
      })
      .expect(200)
      .expect(/请求成功/)

  })

  it('测试 role 获得', async () => {
    app.mockCsrf()

    const res = await app.httpRequest()
      .get('/api/role/' + id)
      .expect(200)

    const body = res.body
    // console.log(body);
    assert(res.status === 200);
    assert(body.data._id === id)
  })

  it('测试 role 列表', async () => {
    app.mockCsrf()

    const res = await app.httpRequest()
      .get('/api/role')
      .expect(200)

    const body = res.body
    // console.log(body);
    assert(res.status === 200);
    assert(body.data.list.length === 1)
    assert(body.data.list[0].access === 'update')
  })


  it('测试 role 删除', () => {
    app.mockCsrf()

    return app.httpRequest()
      .delete('/api/role/' + id)
      .expect(200)
      .expect(/请求成功/)

  })

})

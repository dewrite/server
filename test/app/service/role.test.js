'use strict'

const { app, assert } = require('egg-mock/bootstrap')
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('test/app/service/role.test.js', () => {

  let id = ''

  it('should get exists user', async () => {
    // 创建 ctx
    const ctx = app.mockContext();
    const payload = { name: 'test' + new Date().getTime(), access: 'service' }
    const role = await ctx.service.role.create(payload);
    assert(role);
    assert(role.access === 'service');
    id = role._id;
    // console.log(role);
  });

  it('should get null when user not exists', async () => {
    await wait(2 * 1000);

    const ctx = app.mockContext();
    // console.log(id);
    const role = await ctx.service.role.destroy(id);
    // console.log(role);
    assert(role);
    assert(role.access === 'service');

  })

})
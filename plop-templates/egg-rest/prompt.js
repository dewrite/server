const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a view',
  prompts: [{
    type: 'input',
    name: 'name',
    message: 'model name please',
    validate: notEmpty('name')
  }
  ],
  actions: data => {
    const name = '{{name}}'
    const actions = [{
      type: 'add',
      path: `../app/controller/${name}.js`,
      templateFile: 'egg-rest/controller.hbs',
      skipIfExists: true,
      data: {
        name: name,
      }
    },
    {
      type: 'add',
      path: `../app/service/${name}.js`,
      templateFile: 'egg-rest/service.hbs',
      skipIfExists: true,
      data: {
        name: name,
      }
    }, 
    {
      type: 'add',
      path: `../app/model/${name}.js`,
      templateFile: 'egg-rest/model.hbs',
      skipIfExists: true,
      data: {
        name: name,
      }
    },
    {
      type: 'add',
      path: `../test/app/controller/${name}.test.js`,
      templateFile: 'egg-rest/test.controller.hbs',
      skipIfExists: true,
      data: {
        name: name,
      }
    },
    {
      type: 'add',
      path: `../test/app/service/${name}.test.js`,
      templateFile: 'egg-rest/test.service.hbs',
      skipIfExists: true,
      data: {
        name: name,
      }
    },
    {
      type: 'modify',
      path: '../app/router.js',
      templateFile: 'egg-rest/router.hbs',
      pattern: /\/\/ insert/,
      data: {
        name: name,
      }
    }
    ]

    return actions
  }
}

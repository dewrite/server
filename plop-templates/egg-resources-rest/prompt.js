const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a view',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'model name please',
      validate: notEmpty('name')
    }
  ],
  actions: (data) => {
    const name = '{{name}}'
    const actions = [
      {
        type: 'add',
        path: `../app/controller/${name}.js`,
        templateFile: 'egg-resources-rest/controller.hbs',
        skipIfExists: true,
        data: {
          name: name
        }
      },
      {
        type: 'add',
        path: `../app/service/${name}.js`,
        templateFile: 'egg-resources-rest/service.hbs',
        skipIfExists: true,
        data: {
          name: name
        }
      },
      {
        type: 'add',
        path: `../app/model/${name}.js`,
        templateFile: 'egg-resources-rest/model.hbs',
        skipIfExists: true,
        data: {
          name: name
        }
      },
      {
        type: 'modify',
        path: '../app/router.js',
        templateFile: 'egg-resources-rest/router.hbs',
        pattern: /\/\/ insert/,
        data: {
          name: name
        }
      }
    ]

    return actions
  }
}

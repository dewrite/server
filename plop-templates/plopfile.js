const egg_rest = require('./egg-rest/prompt')
const egg_resources_rest = require('./egg-resources-rest/prompt')
const vue_rest = require('./vue-rest/prompt')

const vue_view = require('./vue-view/prompt')
const vue_component = require('./vue-component/prompt')
const vue_store = require('./vue-store/prompt.js')

module.exports = function(plop) {
  plop.setGenerator('egg-resources-rest', egg_resources_rest)
  plop.setGenerator('egg-rest', egg_rest)
  plop.setGenerator('vue-rest', vue_rest)
  plop.setGenerator('vue-view', vue_view)
  plop.setGenerator('vue-component', vue_component)
  plop.setGenerator('vue-store', vue_store)
}

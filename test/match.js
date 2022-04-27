const pathMatching = require('egg-path-matching')
// const assert = require('power-assert');


const options = {
  // ignore: '/api', // string will use parsed by path-to-regexp
  // support regexp
  // ignore: /^\/api/,
  // support function
  // ignore: ctx => ctx.path.startsWith('/api'),
  // support Array
  // ignore: [ ctx => ctx.path.startsWith('/api'), /^\/foo$/, '/bar'],
  // support match or ignore
  // match: '/api',
  match: /^\/api\/((?!public).)*$/,
}

const match = pathMatching(options)
// console.log();
console.log(match({path: '/api/user'}) )
console.log(match({path: '/api/public'}))
console.log(match({path: '/api/abc'}) )
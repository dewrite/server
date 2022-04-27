'use strict'

// 系统消息监听代码
module.exports = app => {
  // app.beforeStart(async () => {
  //   // ensure memory cache exists before app ready
  //   await app.runSchedule('force_refresh');
  // });

  // const { messenger } = app;

  // messenger.on('refresh', data => {

  //   const ctx = app.createAnonymousContext();
  //   ctx.runInBackground(async () => {
  //     const nsp = app.io.of('/');

  //     nsp.clients(async (error, clients) => {
  //       if (error) throw error;

  //       app.logger.info('start send by %s clients' , clients.length);
  //       if (clients.length > 0) {
  //         await nsp.emit("miner", data);
  //       }
  //     })
  //   });
  // });
}
module.exports = app => {
  return {
    schedule: {
      cron: (app.config.env === 'prod' || app.config.env === 'st') ? '0 0 * * * *' : '0 0 * * * *',
      immediate: false,
      type: 'worker',
    },
    async task(ctx) {
      console.log('************ crontab 定时统计 ...' + new Date())

    },
  }
}


const _ = require('lodash')
const winston = require('winston')
const customSettings = require('../settings.custom.json')

const logger = new (winston.Logger)({
  transports: [new (winston.transports.Console)({colorize: true, showLevel: true, timestamp: true})]
})

process.on('uncaughtException', (err) => {
  logger.error('Error ', err.toString())
  logger.error('Error stack', err.stack.replace(/\r?\n|\r/g, '**'))
})

const defaultSettings = {
  port: process.env.PORT || 3000,
  user: '',
  password: '',
  refreshInterval: 60*1000,
  projector: {
    address: '',
    port: 0
  }
}
const settings = _.merge(defaultSettings, customSettings)

module.exports = {
  settings,
  logger
}

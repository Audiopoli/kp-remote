/** @jsx h */
const Bacon = require('baconjs')
const _ = require('lodash')
const express = require('express')
const basicAuth = require('express-basic-auth')
const winston = require('winston')
const {h} = require('preact')
const render = require('preact-render-to-string')
const {logger, settings} = require('./util')
const Page = require('./page.preact')
const {SdcpClient} = require('sony-sdcp-com')

const app = express()

if (!_.isEmpty(settings.user) && !_.isEmpty(settings.password)) {
  logger.info('Using basic auth')
  const users = {}
  users[settings.user] = settings.password
  const unauthorizedResponse = (req) => 'Requires auth'
  app.use(basicAuth({users, unauthorizedResponse, challenge: true}))
}

const sdcpClient = SdcpClient({address: settings.projector.address, port: settings.projector.port})

const pageData = Bacon.interval(settings.refreshInterval, true)
  .merge(Bacon.later(100, true))
  .flatMap(() => {
    logger.info('Fetching projector data')
    return Bacon.combineTemplate({
      time: Date.now(),
      projector: {
        status: Bacon.fromPromise(sdcpClient.getPower()),
        aspectRatio: Bacon.fromPromise(sdcpClient.getAspectRatio())
      }
    })
  })
  .toProperty({loading: true})

pageData.onError(e => {
  logger.info('Error fetching projector data: ', e)
})

app.get('/', function (req, res) {

  pageData.take(1).onValue(data => {
    const html = render(Page(data))
    res.send(html)
  })

})

app.listen(settings.port, function () {
  logger.info(`Server up, listening port ${settings.port}`)
  logger.info('Settings', JSON.stringify(settings, null, 2))
})

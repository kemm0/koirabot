const {Telegraf} = require('telegraf')
const axios = require ('axios')
const {google} = require('googleapis')
const logger = require('./utils/logger')
require("dotenv").config()

const BOT_TOKEN = process.env.BOT_TOKEN
const YOUTUBE_API_TOKEN = process.env.YOUTUBE_API_TOKEN
const YT_URL_BASE = 'https://www.youtube.com/watch?v='

const koiraBot = new Telegraf(BOT_TOKEN)

getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const handleKoira = (ctx) => {
  axios.get('https://random.dog/woof.json')
  .then(response => {
    doggoUrl = response.data.url
    ctx.replyWithPhoto(doggoUrl)
  })
}
const handleKoiraVideo = (ctx) => {
  google.youtube('v3').search.list({
    key: YOUTUBE_API_TOKEN,
    part: 'snippet',
    q: 'dog | doggo | doge | pupper | shibe',
    topicId: '/m/09kqc',
    order: 'date',
    type: 'video',
    relevanceLanguage: 'en',
    maxResults: 25
  })
  .then((response) => {
    const data = response.data
    const results = []
    data.items.forEach((item) => {
      results.push(item.id.videoId)
    })
    const selectedVideo = results[getRandomInt(results.length-1)]
    url = `${YT_URL_BASE}${selectedVideo}`
    ctx.reply(url)
  })
  .catch((error) => {
    logger.logError(error)
  })
}

koiraBot.start((ctx) => ctx.reply(
  'Hello, I am koirabot. Use command /koira to get random picture of koira (dog) or /koiravideo to get a random video of koira (dog)'
  ))

koiraBot.on('text', (ctx) => {
  const msg = ctx.update.message.text
  if(msg.includes('/koiravideo')){
    handleKoiraVideo(ctx)
  }
  else if(msg.includes('/koira')){
    handleKoira(ctx)
  }
})
koiraBot.launch()

process.once('SIGINT',() => koiraBot.stop('SIGINT'))
process.once('SIGTERM', () => koiraBot.stop('SIGTERM'))



/* module imports */
const BotConnector = require('recastai-botconnector')
const recastai = require('recastai')
const express = require('express')
const bodyParser = require('body-parser')

/* Bot Connector connection */
const myBot = new BotConnector({ userSlug: 'ishan', botId: '689a9436-dfdc-4adb-ac3a-6c07db7f49f4', userToken: '8e2560343141d4f933a683ce9e769a35' })

/* Recast.AI API connection */
const client = new recastai.Client('a7c95b9cf6a8f2845a6ecee1186d386d')

/* Server setup */
const app = express()
var port = process.env.PORT || 8080;



app.use(bodyParser.json())
app.post('/', (req, res) => myBot.listen(req, res))
app.listen(port, () => console.log('Bot running on port', port))

/* When a bot receive a message */
myBot.onTextMessage(message => {
  console.log(message)
  const userText = message.content.attachment.content
  const conversationToken = message.senderId

  client.textConverse(userText, { conversationToken })
    .then(res => {
      // We get the first reply from Recast.AI or a default reply
      const reply = res.reply() || 'Sorry, I didn\'t understand'

      const response = {
        type: 'text',
        content: reply,
      }

      return message.reply(response)
    })
    .then(() => console.log('Message successfully sent'))
    .catch(err => console.error(`Error while sending message: ${err}`))
})

import path from 'path'
import express from 'express'
import Photon from '@generated/photon'

const photon = new Photon()
const app = express()

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})

app.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',

    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  })

  const intervalId = setInterval(async () => {
    const users = await photon.users.findMany({})
    res.write(`data: ${JSON.stringify(users)}\n\n`)
  }, 3000)

  req.on('close', function() {
    // Breaks the interval loop on client disconnected
    clearInterval(intervalId)
  })
})

app.listen(3001, () => console.log(`http://localhost:3001`))

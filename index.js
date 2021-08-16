const express = require('express')
const app = express()
const morgan = require('morgan')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const fs = require('fs')

const { createInstrumenter } = require('istanbul-lib-instrument')
const instrumenter = createInstrumenter()

// Socket communication server
io.sockets.on('connection', function (socket) {
  console.log('new connection')

  socket.on('username', function (username) {
    socket.username = username
    console.log('set username %s', username)
    io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>')
  })

  socket.on('disconnect', function (username) {
    console.log('disconnected', socket.username)
    io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>')
  })

  socket.on('chat_message', function (message) {
    console.log('> %s: %s', socket.username, message)

    io.emit(
      'chat_message',
      '<strong>' + socket.username + '</strong>: ' + message,
    )
  })
})

app.use(morgan('dev'))

app.get('/', function (req, res) {
  res.render('index.ejs')
})

app.get('/scripts/app.js', function (req, res) {
  const filename = path.join(__dirname, 'scripts', 'app.js')
  const src = fs.readFileSync(filename, 'utf8')
  const instrumented = instrumenter.instrumentSync(src, filename)
  res.set('Content-Type', 'application/javascript')
  res.send(instrumented)
})

// https://github.com/cypress-io/code-coverage#instrument-backend-code
/* istanbul ignore next */
if (global.__coverage__) {
  require('@cypress/code-coverage/middleware/express')(app)
}

const server = http.listen(8080, function () {
  console.log('listening on *:8080')
})

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', function (req, res) {
  res.render('index.ejs')
})

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

const server = http.listen(8080, function () {
  console.log('listening on *:8080')
})

const socket = io.connect('http://localhost:8080')

const clientActions = {
  setUsername(name) {
    socket.emit('username', name)
  },
  sendMessage(msg) {
    socket.emit('chat_message', msg)
  },
  onChatMessage(msg) {
    $('#messages').append($('<li>').html(msg))
  },
  isOnline(username) {
    $('#messages').append($('<li>').html(username))
  },
}

if (window.Cypress) {
  // when running inside a Cypress test,
  // expose the clientActions object
  window.__clientActions = clientActions
}

// submit text message without reload/refresh the page
$('form').submit(function (e) {
  e.preventDefault() // prevents page reloading
  const message = $('#txt').val()

  clientActions.sendMessage(message)
  $('#txt').val('')
  return false
})

// use intermediate client object
// between the socket and the UI code
// so Cypress can spy or stub methods
socket.on('chat_message', clientActions.onChatMessage)
socket.on('is_online', clientActions.isOnline)

// ask username
const username = prompt('Please tell me your name')
clientActions.setUsername(username)

// old alternative: use socket directly
// const socket = io.connect('http://localhost:8080')

// // submit text message without reload/refresh the page
// $('form').submit(function (e) {
//   e.preventDefault() // prevents page reloading
//   const message = $('#txt').val()

//   socket.emit('chat_message', message)

//   $('#txt').val('')
//   return false
// })

// socket.on('chat_message', function (msg) {
//   $('#messages').append($('<li>').html(msg))
// })

// socket.on('is_online', function (username) {
//   $('#messages').append($('<li>').html(username))
// })

// // ask username
// const username = prompt('Please tell me your name')
// socket.emit('username', username)

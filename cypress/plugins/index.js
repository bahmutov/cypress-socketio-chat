/// <reference types="cypress" />

// Socket.io client to allow Cypress itself
// to connect from the plugin file to the chat app
// to play the role of another user
// https://socket.io/docs/v4/client-initialization/
const io = require('socket.io-client')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // connection to the chat server
  let socket

  on('task', {
    connect(name) {
      console.log('Cypress is connecting to socket server under name %s', name)
      socket = io('http://localhost:8080')

      socket.emit('username', name)

      return null
    },

    say(message) {
      socket.emit('chat_message', message)
      return null
    },
  })
}

/// <reference types="cypress" />

// Socket.io client to allow Cypress itself
// to connect from the plugin file to the chat app
// to play the role of another user
// https://socket.io/docs/v4/client-initialization/
const io = require('socket.io-client')
const cypress = require('cypress')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // connection to the chat server
  let socket
  let lastMessage

  on('task', {
    connect(name) {
      console.log('Cypress is connecting to socket server under name %s', name)
      socket = io('http://localhost:8080')

      socket.emit('username', name)
      socket.on('chat_message', (msg) => (lastMessage = msg))

      return null
    },

    disconnect() {
      socket.disconnect()
      return null
    },

    say(message) {
      socket.emit('chat_message', message)
      return null
    },

    getLastMessage() {
      // cy.task cannot return undefined value
      return lastMessage || null
    },

    openCypress(config = {}) {
      console.log('running Cypress with config')
      console.log('%o', config)

      cypress.run(config)

      // we do not wait for the Cypress process to finish
      // because we want it to run concurrently with the current test
      return null
    },
  })
}

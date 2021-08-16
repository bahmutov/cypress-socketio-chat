/// <reference types="cypress" />

// Socket.io client to allow Cypress itself
// to communicate with a central "checkpoint" server
// https://socket.io/docs/v4/client-initialization/
const io = require('socket.io-client')

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // code coverage tasks
  // github.com/cypress-io/code-coverage
  require('@cypress/code-coverage/task')(on, config)

  // this socket will be used to sync Cypress instance
  // to another Cypress instance. We can create it right away
  const cySocket = io('http://localhost:9090')

  // this socket will act like a 2nd chat client
  // directly connecting to the chat server
  let chatSocket
  let lastMessage

  // receiving the checkpoint name reached by any test runner
  let checkpointName
  cySocket.on('checkpoint', (name) => {
    console.log('current checkpoint %s', name)
    checkpointName = name
  })

  on('task', {
    // acting like the 2nd chat user tasks
    connect(name) {
      console.log('Cypress is connecting to socket server under name %s', name)
      chatSocket = io('http://localhost:8080')

      chatSocket.emit('username', name)
      chatSocket.on('chat_message', (msg) => (lastMessage = msg))
      chatSocket.on('is_online', (msg) => (lastMessage = msg))

      // cy.task should always return something
      // it cannot return undefined
      // https://on.cypress.io/task
      return null
    },

    disconnect() {
      chatSocket.disconnect()
      return null
    },

    say(message) {
      console.log('saying "%s"', message)
      chatSocket.emit('chat_message', message)
      return null
    },

    getLastMessage() {
      return lastMessage || null
    },

    // tasks for syncing multiple Cypress instances together
    checkpoint(name) {
      console.log('emitting checkpoint name "%s"', name)
      cySocket.emit('checkpoint', name)

      return null
    },

    waitForCheckpoint(name) {
      console.log('waiting for checkpoint "%s"', name)

      // TODO: set maximum waiting time
      return new Promise((resolve) => {
        const i = setInterval(() => {
          console.log('checking, current checkpoint "%s"', checkpointName)
          if (checkpointName === name) {
            console.log('reached checkpoint "%s"', name)
            clearInterval(i)
            resolve(name)
          }
        }, 1000)
      })
    },
  })

  // IMPORTANT to return the config object
  // with the any changed environment variables
  // at least for code coverage
  return config
}

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

  const socket = io('http://localhost:9090')

  let checkpointName
  socket.on('checkpoint', (name) => {
    console.log('current checkpoint %s', name)
    checkpointName = name
  })

  on('task', {
    checkpoint(name) {
      socket.emit('checkpoint', name)

      return null
    },

    waitForCheckpoint(name) {
      console.log('wairing for checkpoint "%s"', name)

      return null
    },

    disconnect() {
      socket.disconnect()
      return null
    },
  })
}

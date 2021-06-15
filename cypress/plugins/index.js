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
      console.log('emitting checkpoint name "%s"', name)
      socket.emit('checkpoint', name)

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

    disconnect() {
      socket.disconnect()
      return null
    },
  })
}

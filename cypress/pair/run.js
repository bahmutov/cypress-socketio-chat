const cypress = require('cypress')
const io = require('socket.io')(9090)

// little utility for delaying any async action
const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// Socket.io server to let two Cypress runners communicate
// and wait for "checkpoints"
io.on('checkpoint', (name) => {
  console.log('checkpoint: %s', name)
  io.emit('checkpoint', name)
})

console.log('starting the first Cypress')
cypress
  .run({
    configFile: 'cy-first-user.json',
  })
  .then((firstResults) => {
    console.log('First Cypress has finished')
  })

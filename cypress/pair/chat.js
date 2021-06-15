const arg = require('arg')

const args = arg({
  '--open': Boolean,
  '--port': Number
})

const port = args['--port'] || 9090

const cypress = require('cypress')
const io = require('socket.io')(port)

// little utility for delaying any async action
const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// Socket.io server to let two Cypress runners communicate and wait for "checkpoints"
// https://socket.io/
io.on('connection', (socket) => {
  console.log('chat new connection')

  socket.on('disconnect', () => {
    console.log('disconnected')
  })

  socket.on('checkpoint', (name) => {
    console.log('chat checkpoint: "%s"', name)
    io.emit('checkpoint', name)
  })
})

// TODO: implement reset before each test

// TODO: implement --open vs run
console.log('starting the first Cypress')

// TODO: implement waiting for two test runners
cypress
  .open({
    configFile: 'cy-first-user.json',
  })
  .then((results) => {
    console.log('First Cypress has finished')
  })

wait(5000).then(() => {
  console.log('starting the second Cypress')
  cypress.open({
    configFile: 'cy-second-user.json'
  }).then((results) => {
    console.log('Second Cypress has finished')
    // TODO: exit with the test code from both runners
    process.exit(0)
  })
})
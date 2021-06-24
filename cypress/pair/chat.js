const arg = require('arg')

const args = arg({
  '--open': Boolean,
  '--port': Number,
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

// keep the last checkpoint around
// even if a test runner joins later, it
// should still receive it right away
let lastCheckpoint

io.on('connection', (socket) => {
  console.log('chat new connection')
  if (lastCheckpoint) {
    console.log('sending the last checkpoint "%s"', lastCheckpoint)
    socket.emit('checkpoint', lastCheckpoint)
  }

  socket.on('disconnect', () => {
    console.log('disconnected')
  })

  socket.on('checkpoint', (name) => {
    console.log('chat checkpoint: "%s"', name)
    lastCheckpoint = name
    io.emit('checkpoint', name)
  })
})

// TODO: implement reset before each test

if (args['--open']) {
  console.log('opening the first Cypress')
} else {
  console.log('starting the first Cypress')
}

const cypressAction = args['--open'] ? cypress.open : cypress.run
const firstCypress = cypressAction({
  configFile: 'cy-first-user.json',
}).then((results) => {
  console.log('First Cypress has finished')
  return results
})

// delay starting the second Cypress instance
// to avoid XVFB race condition
const secondCypress = wait(5000).then(() => {
  console.log('starting the second Cypress')
  return cypressAction({
    configFile: 'cy-second-user.json',
  })
})

Promise.all([firstCypress, secondCypress]).then(() => {
  // TODO: exit with the test code from both runners
  console.log('all done, exiting')
  process.exit(0)
})

const arg = require('arg');
const cypress = require('cypress');
const io = require('socket.io')(port);

const args = arg({
  '--open': Boolean,
  '--port': Number,
  '--record': Boolean,
  '--key': String,
});

const port = args['--port'] || 9090;
const record = args['--record'];
const key = args['--key'];

// Utility function for delaying async actions
const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

let lastCheckpoint;

io.on('connection', (socket) => {
  console.log('New connection');
  if (lastCheckpoint) {
    console.log('Sending the last checkpoint "%s"', lastCheckpoint);
    socket.emit('checkpoint', lastCheckpoint);
  }

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

  socket.on('checkpoint', (name) => {
    console.log('Checkpoint: "%s"', name);
    lastCheckpoint = name;
    io.emit('checkpoint', name);
  });
});

console.log(args['--open'] ? 'Opening the first Cypress' : 'Starting the first Cypress');

const cypressAction = args['--open'] ? cypress.open : cypress.run;

const firstCypress = cypressAction({
  configFile: 'cy-first-user.config.js',
  record,
  key,
})
  .then((results) => {
    console.log('First Cypress has finished');
    return results;
  })
  .catch((error) => {
    console.error('Error running the first Cypress:', error);
    process.exit(1);
  });

wait(5000)
  .then(() => {
    console.log('Starting the second Cypress');
    return cypressAction({
      configFile: 'cy-second-user.config.js',
      record,
      key,
    });
  })
  .then(() => {
    console.log('All done, exiting');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running the second Cypress:', error);
    process.exit(1);
  });

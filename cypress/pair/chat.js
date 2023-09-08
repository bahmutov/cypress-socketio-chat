const arg = require('arg');
const cypress = require('cypress');
const io = require('socket.io')();

const args = arg({
  '--open': Boolean,
  '--port': Number,
  '--record': Boolean,
  '--key': String,
});

const port = args['--port'] || 9090;
const record = args['--record'];
const key = args['--key'];

// Error handling function
const handleError = (error) => {
  console.error(error);
  process.exit(1); // Exit with a non-zero code to indicate failure
};

// Socket.io server to let two Cypress runners communicate and wait for "checkpoints"
io.on('connection', (socket) => {
  console.log('chat new connection');
  if (lastCheckpoint) {
    console.log('sending the last checkpoint "%s"', lastCheckpoint);
    socket.emit('checkpoint', lastCheckpoint);
  }

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  socket.on('checkpoint', (name) => {
    console.log('chat checkpoint: "%s"', name);
    lastCheckpoint = name;
    io.emit('checkpoint', name);
  });
});

// Wrap Cypress runs in a function for better error handling
const runCypress = async (configFile) => {
  try {
    const results = await cypress.run({ configFile, record, key });
    console.log('Cypress has finished');
    return results;
  } catch (error) {
    handleError(error);
  }
};

let lastCheckpoint;

if (args['--open']) {
  console.log('opening the first Cypress');
} else {
  console.log('starting the first Cypress');
}

const firstCypressPromise = runCypress('cy-first-user.config.js');
const secondCypressPromise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('starting the second Cypress');
    resolve(runCypress('cy-second-user.config.js'));
  }, 5000);
});

Promise.all([firstCypressPromise, secondCypressPromise])
  .then(([firstResults, secondResults]) => {
    // Determine the exit code based on test results
    const exitCode = determineExitCode(firstResults, secondResults);
    console.log('all done, exiting with code', exitCode);
    process.exit(exitCode);
  })
  .catch(handleError);

// Function to determine the exit code based on test results
function determineExitCode(firstResults, secondResults) {
  // You can implement custom logic here to analyze test results
  // and return an appropriate exit code.
  // For example, if any test failed, return 1. Otherwise, return 0.
  if (firstResults.totalFailed || secondResults.totalFailed) {
    return 1; // At least one test failed
  }
  return 0; // All tests passed
}

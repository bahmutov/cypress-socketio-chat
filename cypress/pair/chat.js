const arg = require('arg');

const args = arg({
  '--open': Boolean,
  '--port': Number,
  '--record': Boolean,
  '--key': String,
});

const port = args['--port'] || 9090;
const record = args['--record'];
const key = args['--key'];

const cypress = require('cypress');
const io = require('socket.io')(port);

// Create an array to store results
const results = [];

// Function to print test results
// Function to print test results
function printTestResults(result) {
  if (result && result.spec && result.spec.name) {
    console.log('Spec:', result.spec.name);
    console.log('Tests:', result.totalTests);
    console.log('Passing:', result.totalPassed);
    console.log('Failing:', result.totalFailed);
    console.log('Pending:', result.totalPending);
    console.log('Skipped:', result.totalSkipped);
    console.log('\n');
  } else {
    console.error('Invalid test results:', result);
  }
}

// little utility for delaying any async action
const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Socket.io server to let two Cypress runners communicate and wait for "checkpoints"
// https://socket.io/

// keep the last checkpoint around
// even if a test runner joins later, it
// should still receive it right away
let lastCheckpoint;

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

// TODO: implement reset before each test

if (args['--open']) {
  console.log('opening the first Cypress');
} else {
  console.log('starting the first Cypress');
}

const cypressAction = args['--open'] ? cypress.open : cypress.run;
const firstCypress = cypressAction({
  configFile: 'cy-first-user.config.js',
  record,
  key,
})
.then((firstResults) => {
  console.log('First Cypress has finished');
  results.push(firstResults);
  printTestResults(firstResults);
})
.catch((error) => {
  console.error('Error running the first Cypress:', error);
  process.exit(1);
});

// delay starting the second Cypress instance
// to avoid XVFB race condition
const secondCypress = wait(5000).then(() => {
  console.log('starting the second Cypress');
  return cypressAction({
    configFile: 'cy-second-user.config.js',
    record,
    key,
  });
})
.then((secondResults) => {
  console.log('Second Cypress has finished');
  results.push(secondResults);
  printTestResults(secondResults);
})
.catch((error) => {
  console.error('Error running the second Cypress:', error);
  process.exit(1);
});

Promise.all([firstCypress, secondCypress])
.then(() => {
  // TODO: exit with the test code from both runners
  console.log('all done, exiting');
  // Extract exit codes from results and exit with the highest one
  const exitCodes = results.map((result) => result.totalFailed);
  const highestExitCode = Math.max(...exitCodes);
  process.exit(highestExitCode);
})
.catch((error) => {
  console.error('Error running Cypress:', error);
  process.exit(1);
});

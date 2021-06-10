# cypress-socketio-chat
[![ci status][ci image]][ci url] [![badges status][badges image]][badges url] [![renovate-app badge][renovate-badge]][renovate-app] ![cypress version](https://img.shields.io/badge/cypress-7.5.0-brightgreen)
> Example testing real-time [Socket.io](https://socket.io/) chat using [Cypress.io](https://www.cypress.io/)

The original chat program copied from [dkhd/node-group-chat](https://github.com/dkhd/node-group-chat) as described in [Build A Group-Chat App in 30 Lines Using Node.js](https://itnext.io/build-a-group-chat-app-in-30-lines-using-node-js-15bfe7a2417b) blog post.

![Chat test](images/chat.png)

Read the blog post [Test a Socket.io Chat App using Cypress](https://glebbahmutov.com/blog/test-socketio-chat-using-cypress/)

## Specs

Name | Description
---|---
[first-spec](./cypress/integration/first-spec.js) | Tests that the user can post a message and see it
[random-name-spec.js](./cypress/integration/random-name-spec.js) | Creates a random user name for the test
[client-api-spec.js](./cypress/integration/client-api-spec.js) | Invokes events as a 2nd user using app actions
[socket-spec.js](./cypress/integration/socket-spec.js) | Connects to the Socket.io server as a 2nd user

[ci image]: https://github.com/bahmutov/cypress-socketio-chat/workflows/ci/badge.svg?branch=main
[ci url]: https://github.com/bahmutov/cypress-socketio-chat/actions
[badges image]: https://github.com/bahmutov/cypress-socketio-chat/workflows/badges/badge.svg?branch=main
[badges url]: https://github.com/bahmutov/cypress-socketio-chat/actions
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/

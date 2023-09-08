const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: "6zj823",
  fixturesFolder: false,
  viewportWidth: 400,
  viewportHeight: 400,
  defaultCommandTimeout: 15000,
  videosFolder: 'cypress/videos-pair/first',
  screenshotsFolder: 'cypress/screenshots-pair/first',
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'https://www.cypress.io/', // Replace with the URL you want to test.
    specPattern: 'cypress/pair/**/first-user.js',
  },
});

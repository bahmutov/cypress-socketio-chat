const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: "6zj823",
  fixturesFolder: false,
  viewportWidth: 400,
  viewportHeight: 400,
  defaultCommandTimeout: 15000,
  videosFolder: 'cypress/videos-pair/second',
  screenshotsFolder: 'cypress/screenshots-pair/second',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://www.google.com',
    specPattern: 'cypress/pair/**/second-user.js',
  },
})

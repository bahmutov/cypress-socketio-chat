// Import the necessary functions from 'cypress'
import { defineConfig } from 'cypress';

// Define and export the configuration using ESM syntax
export default defineConfig({
  projectId: "6zj823",
  fixturesFolder: false,
  viewportWidth: 400,
  viewportHeight: 400,
  defaultCommandTimeout: 15000,
  videosFolder: 'cypress/videos-pair/first',
  screenshotsFolder: 'cypress/screenshots-pair/first',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://ca.yahoo.com',
    specPattern: 'cypress/pair/**/first-user.js',
  },
});
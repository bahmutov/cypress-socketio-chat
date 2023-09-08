#!/bin/bash

# Replace 'your-script.js' with the actual name of your JavaScript file
npm run chat:run -- --record --key $CYPRESS_RECORD_KEY

# # Capture the exit code of the Node.js script
# exit_code=$?

# # Exit the shell script with the same exit code
# exit $exit_code

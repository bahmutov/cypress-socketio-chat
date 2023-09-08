#!/bin/bash

# Run Cypress tests and record with parallel mode
npm run chat:run -- --record --key $CYPRESS_RECORD_KEY

# Capture the exit code of the Cypress tests
exit_code=$?

# Check if Cypress tests failed (non-zero exit code)
if [ $exit_code -ne 0 ]; then
    echo "Cypress tests failed with exit code $exit_code"
    exit $exit_code
fi

# If the tests passed, exit with a success code (0)
exit 0

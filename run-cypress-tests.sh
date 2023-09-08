#!/bin/bash

# Run Cypress tests and record with parallel mode
npm run chat:run -- --record --key $CYPRESS_RECORD_KEY

# Capture the exit code of the Cypress tests
E2E_RESULT=$?

# Check if Cypress tests failed (non-zero exit code)
if [ "$E2E_RESULT" != "0" ]; then
    echo -e "\n$E2E_RESULT\n"
    exit 1
fi

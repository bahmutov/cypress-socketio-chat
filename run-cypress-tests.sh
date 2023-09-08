#!/bin/bash

# Run Cypress tests and record with parallel mode
npm run chat:run -- --record --key "$CYPRESS_RECORD_KEY"

# Capture the exit code of the Cypress tests
E2E_RESULT=$?

# Check if Cypress tests failed (non-zero exit code)
if [ "$E2E_RESULT" -ne 0 ]; then
    echo -e "\nCypress tests failed with exit code: $E2E_RESULT\n"
    exit 1  # Exit the script with a status code of 1
else
    echo -e "\nCypress tests passed\n"
    exit 0  # Exit the script with a status code of 0 (success)
fi

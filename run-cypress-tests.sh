#!/bin/bash

# Set your Cypress Record Key (replace with your actual key)
CYPRESS_RECORD_KEY=$CYPRESS_RECORD_KEY

# Function to display error message and exit with a non-zero code
exit_with_error() {
  echo "Error: $1"
  exit 1
}

# Function to run Cypress tests using chat.js
run_cypress_tests() {
  local record="$1"
  local key="$2"

  echo "Running Cypress tests using chat.js"

  # Execute chat.js with the provided record and key options
  node ./cypress/pair/chat.js --record="$record" --key="$key"

  # Check the exit code of the Cypress tests
  if [ $? -ne 0 ]; then
    exit_with_error "Cypress tests failed."
  else
    echo "Cypress tests passed."
  fi
}

# Main script

# Check if CYPRESS_RECORD_KEY is set
if [ -z "$CYPRESS_RECORD_KEY" ]; then
  exit_with_error "CYPRESS_RECORD_KEY is not set. Please set it."
fi

# Run Cypress tests with the provided Record Key
run_cypress_tests true "$CYPRESS_RECORD_KEY"

# Exit with success
exit 0

#!/bin/bash

# Set your Cypress configuration files
first_user_config="cy-first-user.config.js"
second_user_config="cy-second-user.config.js"

# Set your Cypress record key
cypress_record_key="YOUR_CYPRESS_RECORD_KEY"

# Function to display error message and exit with a non-zero code
exit_with_error() {
  echo "Error: $1"
  exit 1
}

# Function to run Cypress tests with error handling
run_cypress_tests() {
  local config_file="$1"
  local record="$2"
  local key="$3"

  if [ -z "$config_file" ]; then
    exit_with_error "Cypress config file not provided."
  fi

  if [ -n "$record" ]; then
    record_option="--record"
  else
    record_option=""
  fi

  if [ -n "$key" ]; then
    key_option="--key=$key"
  else
    key_option=""
  fi

  echo "Running Cypress tests with config file: $config_file"
  npx cypress run --config-file "$config_file" $record_option $key_option

  if [ $? -ne 0 ]; then
    exit_with_error "Cypress tests failed for config file: $config_file"
  fi

  echo "Cypress tests passed for config file: $config_file"
}

# Run Cypress tests for the first user
run_cypress_tests "$first_user_config" true "$cypress_record_key"

# Delay before running tests for the second user
sleep 5

# Run Cypress tests for the second user
run_cypress_tests "$second_user_config" true "$cypress_record_key"

# All tests passed
echo "All Cypress tests have passed."

# Exit with success
exit 0

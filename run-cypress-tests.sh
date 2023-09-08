version: 2.1

executors:
  node-executor:
    docker:
      - image: circleci/node:14

jobs:
  build:
    executor: node-executor
    working_directory: ~/app

    steps:
      - checkout

      - restore_cache:
          keys:
            - v1-deps-{{ checksum "package-lock.json" }}
            - v1-deps-

      - run:
          name: Install Dependencies
          command: npm install

      - save_cache:
          paths:
            - node_modules
          key: v1-deps-{{ checksum "package-lock.json" }}

      - restore_cache:
          keys:
            - cypress-{{ arch }}-{{ checksum "cypress.json" }}
            - cypress-{{ arch }}-

      - run:
          name: Install Cypress
          command: npm install cypress

      - save_cache:
          paths:
            - ~/.cache/Cypress
          key: cypress-{{ arch }}-{{ checksum "cypress.json" }}

      - run:
          name: Run Cypress Tests
          command: ./run_tests.sh

      - persist_to_workspace:
          root: .
          paths:
            - cypress/videos
            - cypress/screenshots

  deploy:
    docker:
      - image: cypress/base:14
    steps:
      - attach_workspace:
          at: /tmp/workspace

      - run:
          name: Transfer Test Artifacts
          command: cp -a /tmp/workspace/cypress/videos /tmp/workspace/cypress/screenshots /tmp/workspace/artifacts

      - persist_to_workspace:
          root: /tmp/workspace
          paths:
            - artifacts

workflows:
  version: 2.1
  build_and_test:
    jobs:
      - build
      - deploy:
          requires:
            - build

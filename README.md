# gb-node-api

[![CodeFactor](https://www.codefactor.io/repository/github/garbagebytes/gb-node-api/badge)](https://www.codefactor.io/repository/github/garbagebytes/gb-node-api)
[![DeepScan grade](https://deepscan.io/api/teams/6561/projects/8572/branches/105540/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6561&pid=8572&bid=105540)

**Master**

[![Build Status](https://travis-ci.org/GarbageBytes/gb-node-api.svg?branch=master)](https://travis-ci.org/GarbageBytes/gb-node-api)
[![Coverage Status](https://coveralls.io/repos/github/GarbageBytes/gb-node-api/badge.svg?branch=master)](https://coveralls.io/github/GarbageBytes/gb-node-api?branch=master)
[![codebeat badge](https://codebeat.co/badges/b5eb3416-def9-464e-a651-f70dd122e76f)](https://codebeat.co/projects/github-com-garbagebytes-gb-node-api-master)

**Development**

[![Build Status](https://travis-ci.org/GarbageBytes/gb-node-api.svg?branch=development)](https://travis-ci.org/GarbageBytes/gb-node-api)
[![Coverage Status](https://coveralls.io/repos/github/GarbageBytes/gb-node-api/badge.svg?branch=development)](https://coveralls.io/github/GarbageBytes/gb-node-api?branch=development)
[![codebeat badge](https://codebeat.co/badges/49d9c564-c987-4772-af8e-b59e152b244d)](https://codebeat.co/projects/github-com-garbagebytes-gb-node-api-development)

Local node server on each GB. Typescript based NodeJS Server.

## Documentation

All methods are documented using jsdoc tags. Tests are written in the test folder using Mocha and NYC for coverage checking.

### Authentication

- Auth is provided through the /auth routes
- Register at /auth/register with a "email" and "password" key. Your user ID will be returned if successful
- Login at /auth/login with a "email" and "password" key. Your user ID and a token will be returned
- To access protected routes, put the returned token inside of the header as the `Authorization` key
- All routes but login and register are protected

## Get Started Developing

Ensure you have node installed (I prefer nvm to manage versions), typescript, and typescript-watch `npm i -g tsc-watch typescript`

Clone the repository into your choice location, and `cd gb-local-node-server`.

Install dependencies: `npm i`

Install and run your mongod client.

`npm run dev` to compile and run the server.

### Code Quality Checks

I've implemented some checkers for code quality

- PreCommit - Prettier using `pretty-quick` and `tslint` auto fix and check
- PrePush - `npm run test` to test all code before pushing

Make sure you have clean code before pushing

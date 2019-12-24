# gb-local-node-server

Local node server on each GB. Typescript based NodeJS Server.

## Get Started Developing

Ensure you have node installed (I prefer nvm to manage versions), typescript, and typescript-watch `npm i -g tsc-watch typescript`

Clone the repository into your choice location, and `cd gb-local-node-server`.

Install dependencies: `npm i`

Install and run your mongod client.

`npm run dev` to compile and run the server.

### Code Quality Checks

I've implemented some checkers for code quality

- PreCommit - Prettier using `pretty-quick`
- PrePush - TsLint

Make sure you have clean code before pushing

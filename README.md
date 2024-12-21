<p align="center">
  <a href="https://www.arculus.de" target="blank"><img src="https://www.arculus.de/wp-content/uploads/2024/02/arculus-black.svg" width="320" alt="arculus" /></a>
</p>

  <p align="center">A home <a href="https://github.com/meghrazchi/arculus-backend" target="_blank">Assessment</a> for Arculus.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
</p>

## Description

[Arculus](https://arculus.de)  Home Assessment - TypeScript Starter Repository


## Installation

Follow these steps to set up the project locally:

### 1. Clone the repository

Clone the repository to your local machine:

```bash
$ git clone https://github.com/meghrazchi/arculus-backend.git
$ cd arculus-backend
```
### 2. Set up environment variables
Copy the example environment configuration file:
```bash
$ cp .env.example .env
```
Edit the .env file and configure the game board dimentions:
```bash
BOARD_WIDTH=800
BOARD_HEIGHT=800
```
### 3. Install dependencies
Run the following command to install the necessary dependencies:
```bash
$ npm install
```

### 4. Run the application locally

```bash
$ docker-compose up
```
Once the application is running, the API will be accessible at:
- WebSocket - [http://localhost:3000](http://localhost:3000/)

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Behzad Meghrazchi](https://github.com/meghrazchi)
- Email - [behzad.meghrazchi(at)gmail.com](mailto:behzad.meghrazchi@gmail.com)

## License

Nest is [MIT licensed](LICENSE).


## Overview
This is a multiplayer game where each side of the game has one player. The game features a dynamic board, player controls, and game logic to handle player connections, paddle positioning, and ball reflection. The game is built using [insert technology stack], and players can join the game after logging in.

## Features
- **Login and Join Game**: Players can log in via a login route and join the game using the `joinGame` function.
- **Game Board**: The game board fills the entire screen and accommodates up to 4 paddles (2 paddles on each side).
- **Player Logic**:
  - Each player is assigned a random ID upon joining.
  - Paddles are vertically positioned on the left and right sides of the screen and horizontally on the top and bottom.
  - The ball moves across the game board, reflecting off the edges and paddles.
  - If a player misses the ball, they lose points.
- **Dynamic Gameplay**: Players can join or leave the game, and their paddles will appear or disappear accordingly.

## Game Logic
- **Player Join**: If there is no available space for a new player on either side, the player will not be allowed to join.
- **Player Disconnection**: If a player disconnects, they will be removed from the game, their paddle will disappear, and the space will become available for another player.
- **Paddle Boundaries**: Paddles must not move beyond the game board's boundaries.
- **Ball Movement**: The ball starts at the center of the board and moves towards the sides. It reflects off the edges of the game board and paddles.

### Project Structure
```
── Dockerfile
├── README.md
├── docker-compose.yml
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── game
│   │   ├── game.gateway.spec.ts
│   │   ├── game.gateway.ts
│   │   ├── game.service.spec.ts
│   │   ├── game.service.ts
│   │   └── models
│   │       └── player.model.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```
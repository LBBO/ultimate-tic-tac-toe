# Ultimate Tic Tac Toe

[![Build Status](https://travis-ci.com/LBBO/tic_tac_toe.svg?branch=master)](https://travis-ci.com/LBBO/tic_tac_toe)

Browser based, 2 player
[Ultimate Tic Tac Toe](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe).

## Gameplay

2 players play Ultimate Tic Tac Toe taking turns on the same browser window (no
network-multiplayer, no AI). To start, simply press the "New Game"
button on the bottom of the screen. The current player is then displayed
(and updated) where the button was and you can now make your move in any
of the purple fields. The game can be aborted at any time by pressing
the "Abort" button in the top right corner.

You can find more detailed information about the game on
[Wikipedia](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe). Please
feel free to report any bugs or feature requests
[here](https://github.com/LBBO/ultimate-tic-tac-toe/issues).

## Getting Started
### Prerequisites
* First, you'll need to install [git](https://git-scm.com/downloads) and
[Node.js](https://nodejs.org/en/download/).
* Then you can clone this repository to your computer

### Installing
Open a command line into this project's folder and type
```
npm install
```
Once that is done, you can start a local web server by typing
```
npm start
```
Lastly, you just need to open
[http:/localhost:8080/](http:/localhost:8080/) and you're ready to go!

## Running tests
So far, there are only a few unit tests located in the test folder. To
run them, yo can either run
```
npm test
```
In a command line or you can visit
[http:/localhost:8080/test](http:/localhost:8080/test) while your web
server is running.

## Deployment
```
npm webpack
```
This will create a release folder which can be copied onto any server and
into any folder.

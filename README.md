Tic Tac Toe
===========

Browser based [Tic Tac Toe](https://en.wikipedia.org/wiki/Tic-tac-toe)


Gameplay
--------

2 players play Tic Tac Toe taking turns on the same browser window (no network-multiplayer, no AI).

You can find detailed information about the game on [Wikipedia](https://en.wikipedia.org/wiki/Tic-tac-toe).


Target design
-------------

![Design 1](https://cdn.rawgit.com/neopoly/tic_tac_toe/master/doc/design-1.png?v=2)

![Design 2](https://cdn.rawgit.com/neopoly/tic_tac_toe/master/doc/design-2.png?v=2)

![Design 3](https://cdn.rawgit.com/neopoly/tic_tac_toe/master/doc/design-3.png?v=2)

Environment
-----------

* [NodeJS](https://nodejs.org) (Version 10.x)

Setup
-----

* Fork this project into your GitHub account
* Clone your fork to your machine
* In project folder:
  * `npm install`


Run, test, build
----------------

* Start dev server: `npm start`
* To run the application open `http://localhost:8080/webpack-dev-server/`
* To run tests open `http://localhost:8080/webpack-dev-server/test`
* (Build release version to ./release: `npm run-script webpack`)

Technologies used
-----------------

* [Webpack](https://github.com/webpack/webpack) for asset bundling
* [React](https://facebook.github.io/react/) for web components
* [Sass](http://sass-lang.com/) for CSS preprocessing
* [Mocha](http://mochajs.org/) as test runner and [Chai](http://chaijs.com/) as assertion library
* [Enzyme](http://airbnb.io/enzyme/) as a test renderer for React

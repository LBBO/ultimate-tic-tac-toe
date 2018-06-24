import React from 'react';
import Player from './Player'

const playerX_SVG = React.createElement(
	"svg",
	{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", version: "1.1"},
	React.createElement("line", {
		style: {
			"fill": "none",
			"fillOpacity": "0",
			"stroke": "#3a3b63",
			"strokeWidth": "10",
			"strokeMiterlimit": "4",
			"strokeDasharray": "none",
			"strokeOpacity": "1"
		}, x1: "10", x2: "90", y1: "10", y2: "90"
	}),
	React.createElement("line", {
		style: {
			"fill": "none",
			"fillOpacity": "0",
			"stroke": "#3a3b63",
			"strokeWidth": "10",
			"strokeMiterlimit": "4",
			"strokeDasharray": "none",
			"strokeOpacity": "1"
		}, x1: "10", x2: "90", y1: "90", y2: "10"
	})
);
const playerO_SVG = React.createElement(
	"svg",
	{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", version: "1.1"},
	React.createElement("circle", {
		style: {
			"fill": "none",
			"fillOpacity": "0",
			"stroke": "#73dce6",
			"strokeWidth": "10",
			"strokeMiterlimit": "4",
			"strokeDasharray": "none",
			"strokeOpacity": "1"
		}, cx: "50", cy: "50", r: "40"
	})
);

export default class Gamefield {
	constructor() {
		this.numberOfRows = 3;
		this.numberOfCols = 3;

		this.nobody = new Player('empty', null);
		this.playerX = new Player('X', playerX_SVG);
		this.playerO = new Player('O', playerO_SVG);
		
		this.hasEverBeenStarted = false;

		this.init();
	}

	init(startingPlayer = this.playerO) {
		this.currPlayer = startingPlayer;
		this.field = new Array(this.numberOfRows).fill(0).map(() => new Array(this.numberOfCols).fill(this.nobody));
		this.movesMade = 0;
		this.isWon = false;
		this.winner = this.nobody;
	}
	
	StartNewGame() {
		if (this.hasEverBeenStarted) {
			this.Restart();
		} else {
			this.init();
		}
		
		this.hasEverBeenStarted = true;
	}
	
	computeNextStartingPlayerAfterGameEnd() {
		//Verlierer soll anfangen, bei Unentschieden derjenige, der diese Runde nicht begonnen hat
		if (this.winner === this.playerO || this.winner === this.playerX) {
			return this.otherRealPlayer(this.winner);
		} else if (this.currPlayer === this.playerO || this.currPlayer === this.playerX) {
			return this.currPlayer;
		} else {
			return this.playerX;
		}
	}
	
	Restart() {
		this.init(this.computeNextStartingPlayerAfterGameEnd());
	}

	RowAndColFromTotalIndex(index) {
		if (typeof index !== 'number') {
			throw new TypeError('Expected index to have type of "number". Instead, it hat type of "' + (typeof '') + '"');
		} else if (index < 0 || index >= this.amountOfPossibleMoves) {
			throw 'index must be between 0 and 8!';
		} else {
			return {
				col: index % this.numberOfRows,
				row: Math.floor(index / this.numberOfCols)
			};
		}
	}

	CheckIfMoveIsValid(...args) {
		let result = false;

		if (args.length === 1 && typeof args[0] === 'number') {
			const {row, col} = this.RowAndColFromTotalIndex(args[0]);
			result = this.CheckIfMoveIsValid(row, col);
		} else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
			result = !this.isWon && this.movesMade < this.amountOfPossibleMoves && this.field[args[0]][args[1]] === this.nobody;
		} else {
			console.warn('Gamefield.CheckIfMoveIsValid called with ' + args.length + ' arguments. Expected either one or' +
						 ' two numbers.');
		}

		return result;
	}
	
	winnerOfCombo(combo) {
		return combo.reduce((currWinner, currPlayer) => currPlayer === currWinner ? currWinner : this.nobody);
	}

	otherRealPlayer(player) {
		let result;

		if (player !== this.playerX && player !== this.playerO) {
			console.warn('Gamefield.otherRealPlayer was called with non-player: ', player);
			result = this.playerX;
		} else {
			result = player === this.playerX ? this.playerO : this.playerX;
		}

		return result;
	}

	checkForWin(changedRowIndex, changedColIndex) {
		//check changed row
		this.winner = this.winnerOfCombo(this.field[changedRowIndex]);
		
		//check changed col
		if (this.winner === this.nobody) {
			this.winner = this.winnerOfCombo(this.field.map(row => row[changedColIndex]));
		}
		
		//check diagonal from top left to bottom right if it was changed
		//(diagonal from top left to bottom right has identical rowIndex and colIndex)
		if (this.winner === this.nobody && changedColIndex === changedRowIndex) {
			this.winner = this.winnerOfCombo(this.field.map((row, i) => row[i]));
		}
		
		//check diagonal from top right to bottom left if it was changed
		//(diagonal from top right to bottom left has "inverted" rowIndex and colIndex)
		if (this.winner === this.nobody && changedColIndex === this.field.length - 1 - changedRowIndex) {
			this.winner = this.winnerOfCombo(this.field.map((row, i) => row[this.field.length - 1 - i]));
		}
		
		if (this.winner != this.nobody || this.movesMade >= 9) {
			this.isWon = true;
		}
	}

	MakeMove(...args) {
		if (args.length === 1 && typeof args[0] === 'number') {
			const {row, col} = this.RowAndColFromTotalIndex(args[0]);
			this.MakeMove(row, col);
		} else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
			const [row, col] = args;

			if (this.CheckIfMoveIsValid(row, col)) {
				this.field[row][col] = this.currPlayer;
				this.movesMade++;
				this.currPlayer = this.otherRealPlayer(this.currPlayer);
				this.checkForWin(row, col);
			}
		} else {
			console.warn('Gamefield.MakeMove called with ' + args.length + ' arguments. Expected either one or' +
						 ' two numbers.');
		}
	}

	get amountOfPossibleMoves() {
		return this.numberOfCols * this.numberOfRows;
	}
	
	get FlattenedField() {
		return this.field.reduce((acc, row) => acc.concat(row));
	}
	
	get Winner() {
		return this.winner;
	}
	
	get CurrentPlayer() {
		return this.currPlayer;
	}

	get HasBeenWon() {
		return this.isWon;
	}
}
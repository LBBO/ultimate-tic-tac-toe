import React from 'react';
import Player from './Player'

const playerX_SVG = React.createElement(
	"svg",
	{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", version: "1.1", className: 'playerX'},
	React.createElement("line", {
		style: {
			"fill": "none",
			"fillOpacity": "0",
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
			"strokeWidth": "10",
			"strokeMiterlimit": "4",
			"strokeDasharray": "none",
			"strokeOpacity": "1"
		}, x1: "10", x2: "90", y1: "90", y2: "10"
	})
);
const playerO_SVG = React.createElement(
	"svg",
	{xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 100 100", version: "1.1", className: 'playerO'},
	React.createElement("circle", {
		style: {
			"fill": "none",
			"fillOpacity": "0",
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
		this.isWon = false;
		this.winner = this.nobody;
		this.occupiedFields = 0;
	}
	
	Restart() {
		this.init(this.computeNextStartingPlayerAfterGameEnd());
	}
	
	computeNextStartingPlayerAfterGameEnd() {
		//Verlierer soll anfangen, bei Unentschieden derjenige, der diese Runde nicht begonnen hat
		if (this.winner === this.playerO || this.winner === this.playerX) {
			return this.otherRealPlayer(this.winner);
		} else if (this.currPlayer === this.playerO || this.currPlayer === this.playerX) {
			return this.currPlayer;
		} else {
			console.warn('Something went wrong, currPlayer is neither playerX nor playerO. Returning playerX as' +
						 ' default');
			return this.playerX;
		}
	}
	
	StartNewGame() {
		if (this.hasEverBeenStarted) {
			this.Restart();
		} else {
			this.init();
		}
		
		this.hasEverBeenStarted = true;
	}
	
	RowAndColFromTotalIndex(index) {
		if (typeof index !== 'number') {
			throw new TypeError('Expected index to have type of "number". Instead, it hat type of "' + (typeof index) + '"');
		} else if (Number.isNaN(index)) {
			throw 'Index may not be NaN';
		} else if (index < 0 || index >= this.fieldLength) {
			throw 'Index must be between 0 and ' + (this.fieldLength - 1);
		} else {
			return {
				col: index % this.numberOfCols,
				row: Math.floor(index / this.numberOfCols)
			};
		}
	}
	
	/**
	 * Calculates TotalIndex when given a certain row and col
	 * @param {Number} row
	 * @param {Number} col
	 * @returns {number}
	 */
	TotalIndexFromRowAndCol(row, col) {
		if (typeof row !== 'number' || typeof col !== 'number') {
			throw new TypeError('Expected row and col to have type of "number". Instead, they hat types of "'
				+ (typeof row) + '" and "' + (typeof col) + '"');
		} else if (row < 0 || row >= this.numberOfRows) {
			throw 'Row must be between 0 and ' + (this.numberOfRows - 1) + '!';
		} else if (col < 0 || col >= this.numberOfCols) {
			throw 'Col must be between 0 and ' + (this.numberOfCols - 1) + '!';
		} else if (Number.isNaN(row)) {
			throw 'Row may not be NaN';
		} else if (Number.isNaN(col)) {
			throw 'Col may not be NaN';
		} else {
			return row * this.numberOfCols + col;
		}
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
		
		if (this.winner != this.nobody || this.occupiedFields >= this.fieldLength) {
			this.isWon = true;
		}
	}
	
	get fieldLength() {
		return this.numberOfCols * this.numberOfRows;
	}
	
	get FlattenedField() {
		return this.field.reduce((acc, row) => acc.concat(row), []);
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
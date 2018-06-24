import Gamefield from './Gamefield';
import Player from './Player';

export default class SingleGamefield extends Gamefield {
	constructor() {
		super();
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
	
	Restart() {
		this.init(this.computeNextStartingPlayerAfterGameEnd());
	}
	
	/**
	 * @returns {boolean}
	 */
	CheckIfMoveIsValid(...args) {
		let result = false;
		
		if (args.length === 1 && typeof args[0] === 'number') {
			const {row, col} = this.RowAndColFromTotalIndex(args[0]);
			result = this.CheckIfMoveIsValid(row, col);
		} else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
			result = !this.isWon && this.movesMade < this.amountOfSingleGamefields && this.field[args[0]][args[1]] === this.nobody;
		} else {
			console.warn('Gamefield.CheckIfMoveIsValid called with ' + args.length + ' arguments. Expected either one or' +
						 ' two numbers.');
		}

		return result;
	}
	
	winnerOfCombo(combo) {
		return combo.reduce((currWinner, currPlayer) => currPlayer === currWinner ? currWinner : this.nobody);
	}
	
	MakeMove(row, col, player) {
		if (typeof row === 'number' && typeof col === 'number' && player instanceof Player) {
			if (this.CheckIfMoveIsValid(row, col)) {
				this.field[row][col] = player;
				this.movesMade++;
				this.checkForWin(row, col);
			}
		} else {
			console.warn('Gamefield.MakeMove called with ' + args.length + ' arguments. Expected either one or' +
						 ' two numbers.');
		}
	}
}
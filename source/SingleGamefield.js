import Gamefield from './Gamefield';
import Player from './Player';

export default class SingleGamefield extends Gamefield {
	constructor() {
		super();
	}
	
	init() {
		super.init();
		this.field = new Array(this.numberOfRows).fill(0).map(() => new Array(this.numberOfCols).fill(this.nobody));
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
			result =
				!this.isWon &&
				this.occupiedFields < this.fieldLength &&
				args[0] >= 0 && args[0] < this.numberOfRows &&
				args[1] >= 0 && args[1] < this.numberOfCols &&
				this.field[args[0]][args[1]] === this.nobody;
		} else {
			console.warn('Gamefield.CheckIfMoveIsValid called with ' + args.length + ' arguments. Expected either one or' +
						 ' two numbers, actual:', args);
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
				this.occupiedFields++;
				this.checkForWin(row, col);
			}
		} else {
			console.warn('Gamefield.MakeMove called with ' + args.length + ' arguments. Expected either one or' +
						 ' two numbers.');
		}
	}
}
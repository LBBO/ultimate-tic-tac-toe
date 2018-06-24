import Gamefield from './Gamefield';
import SingleGamefield from './SingleGamefield';

export default class FieldOfGamefields extends Gamefield {
	constructor() {
		super();
		this.init();
	}
	
	init(startingPlayer = this.playerO) {
		this.currPlayer = startingPlayer;
		this.field = new Array(this.numberOfRows).fill(0)
			.map(() => new Array(this.numberOfCols).fill(new SingleGamefield(this)));
		this.singleFieldsWon = 0;
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
	 *
	 * @param {SingleGamefield} singleGamefield
	 * @returns {boolean}
	 */
	CheckIfMoveIsValid(singleGamefield) {
		let result = false;
		
		if (singleGamefield instanceof SingleGamefield) {
			result = !this.isWon && this.singleFieldsWon < this.amountOfSingleGamefields && true;
		} else {
			console.warn('FieldOfGamefields.CheckIfMoveIsValid called with wrong argument type. Expected' +
						 ' SingleGamefield! Instead got ', singleGamefield);
		}
		
		return result;
	}
	
	winnerOfCombo(combo) {
		return combo.reduce(
			(currWinner, currSingleGamefield) =>
				currSingleGamefield.Winner === currWinner ? currWinner : this.nobody
		);
	}
	
	MakeMove(...args) {
		if (args.length === 1 && typeof args[0] === 'number') {
			const {row, col} = this.RowAndColFromTotalIndex(args[0]);
			this.MakeMove(row, col);
		} else if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
			const [row, col] = args;
			
			if (this.CheckIfMoveIsValid(row, col)) {
				this.field[row][col] = this.currPlayer;
				this.singleFieldsWon++;
				this.currPlayer = this.otherRealPlayer(this.currPlayer);
				this.checkForWin(row, col);
			}
		} else {
			console.warn('Gamefield.MakeMove called with ' + args.length + ' arguments. Expected either one or' +
						 ' two numbers.');
		}
	}
}
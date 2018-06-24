import Gamefield from './Gamefield';

export default class SingleGamefield extends Gamefield {
	constructor(parentFieldOfGamefields) {
		super();
		
		this.parentFieldOfGamefields = parentFieldOfGamefields;
		
		this.init();
	}
	
	init(startingPlayer = this.playerO) {
		this.currPlayer = startingPlayer;
		this.field = new Array(this.numberOfRows).fill(0).map(() => new Array(this.numberOfCols).fill(this.playerX));
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
	 * @returns {boolean}
	 */
	CheckIfMoveIsValid(...args) {
		let result = false;
		
		if (args.length === 1 && typeof args[0] === 'number') {
			const {row, col} = this.RowAndColFromTotalIndex(args[0]);
			result = this.CheckIfMoveIsValid(row, col);
		} else if(this.parentFieldOfGamefields.CheckIfMoveIsValid(this)) {
			if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
				result = !this.isWon && this.singleFieldsWon < this.amountOfSingleGamefields && this.field[args[0]][args[1]] === this.nobody;
			} else {
				console.warn('Gamefield.CheckIfMoveIsValid called with ' + args.length + ' arguments. Expected either one or' +
							 ' two numbers.');
			}
		}
		
		return result;
	}
	
	winnerOfCombo(combo) {
		return combo.reduce((currWinner, currPlayer) => currPlayer === currWinner ? currWinner : this.nobody);
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
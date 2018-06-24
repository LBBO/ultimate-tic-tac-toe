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
			.map(() => new Array(this.numberOfCols).fill(0).map(() => new SingleGamefield()));
		this.singleFieldsWon = 0;
		this.isWon = false;
		this.winner = this.nobody;
		this.chooseAny = true;
		this.activeSingleGamefields = new Array(this.numberOfRows * this.numberOfCols).fill(0)
			.map((curr, index) => index);
		console.log(this.activeSingleGamefields);
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
	CheckIfMoveIsValid(gamefieldRow, gamefieldCol) {
		let result = false;
		
		if (typeof gamefieldRow === 'number' && typeof gamefieldCol === 'number') {
			result =
				!this.isWon
				&& this.singleFieldsWon < this.amountOfSingleGamefields
				&& !this.field[gamefieldRow][gamefieldCol].HasBeenWon
				&& this.activeSingleGamefields.indexOf(gamefieldRow * this.numberOfRows + gamefieldCol) > -1;
		} else {
			console.warn('FieldOfGamefields.CheckIfMoveIsValid called with wrong argument types. Expected' +
						 ' two numbers! Instead got ', gamefieldRow, gamefieldCol);
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
		if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
			const rowAndColOfFieldOfGamefields = this.RowAndColFromTotalIndex(args[0]);
			const rowAndColOfSingleGamefield =
				this.field[rowAndColOfFieldOfGamefields.row][rowAndColOfFieldOfGamefields.col]
					.RowAndColFromTotalIndex(args[1]);
			this.MakeMove(
				rowAndColOfFieldOfGamefields.row, rowAndColOfFieldOfGamefields.col,
				rowAndColOfSingleGamefield.row, rowAndColOfSingleGamefield.col
			);
		} else if (
			args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number'
			&& typeof args[2] === 'number' && typeof args[3] === 'number'
		) {
			const [singleGamefieldRow, singleGamefieldCol, fieldRow, fieldCol] = args;

			const targetedSingleField = this.field[singleGamefieldRow][singleGamefieldCol];
			if (this.CheckIfMoveIsValid(singleGamefieldRow, singleGamefieldCol) && targetedSingleField.CheckIfMoveIsValid(fieldRow, fieldCol)) {
				targetedSingleField.MakeMove(fieldRow, fieldCol, this.currPlayer);
				this.currPlayer = this.otherRealPlayer(this.currPlayer);
				this.chooseAny = false;

				if (targetedSingleField.HasBeenWon) {
					this.singleFieldsWon++;
					this.checkForWin(singleGamefieldRow, singleGamefieldCol);
				}

				const nextExpectedField = this.field[fieldRow][fieldCol];
				if (nextExpectedField.HasBeenWon) {
					this.activeSingleGamefields = this.FlattenedField.reduce((all, currSingleGamefield, index) => {
						if (!currSingleGamefield.HasBeenWon) {
							all.push(index);
						}

						return all;
					}, []);
				} else {
					this.activeSingleGamefields = [fieldRow * 3 + fieldCol];
				}
			}
		} else {
			console.warn('Gamefield.MakeMove called with ' + args.length + ' arguments. Expected either two or' +
						 ' four numbers.');
		}
	}
}
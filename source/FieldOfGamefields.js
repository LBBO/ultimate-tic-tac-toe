import Gamefield from './Gamefield';
import SingleGamefield from './SingleGamefield';

export default class FieldOfGamefields extends Gamefield {
	constructor() {
		super();
		this.init();
	}
	
	init(startingPlayer = this.playerO) {
		super.init();
		this.currPlayer = startingPlayer;
		this.field = new Array(this.numberOfRows).fill(0)
			.map(() => new Array(this.numberOfCols).fill(0).map(() => new SingleGamefield()));
		this.isWon = false;
		this.winner = this.nobody;
		this.chooseAny = true;
		this.activeSingleGamefields = new Array(this.fieldLength).fill(0)
			.map((curr, index) => index);
	}
	
	/**
	 * @returns {boolean}
	 */
	CheckIfMoveIsValid(gamefieldRow, gamefieldCol) {
		let result = false;
		
		if (typeof gamefieldRow === 'number' && typeof gamefieldCol === 'number' && !Number.isNaN(gamefieldRow) && !Number.isNaN(gamefieldCol)) {
			result =
				!this.isWon
				&& gamefieldRow >= 0 && gamefieldCol >= 0
				&& gamefieldRow < this.numberOfRows && gamefieldCol < this.numberOfCols
				&& this.occupiedFields < this.fieldLength
				&& !this.field[gamefieldRow][gamefieldCol].HasBeenWon
				&& this.activeSingleGamefields.indexOf(this.TotalIndexFromRowAndCol(gamefieldRow, gamefieldCol)) > -1;
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
		, combo[0].Winner);
	}
	
	/**
	 * 
	 * @param args - Either [indexOfSingleGamefield, indexOfFieldWithinSingleGamefield] or
	 * 				[rowSingleGamefield, colSingleGamefield, rowFieldWithinSingleGamefield, colFieldWithinSingleGamefield]
	 * @constructor
	 */
	MakeMove(...args) {
		if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
			const rowAndColOfSingleGamefield = this.RowAndColFromTotalIndex(args[0]);
			const rowAndColOfFieldWithinSingleGamefield =
				this.field[rowAndColOfSingleGamefield.row][rowAndColOfSingleGamefield.col]
					.RowAndColFromTotalIndex(args[1]);
			this.MakeMove(
				rowAndColOfSingleGamefield.row, rowAndColOfSingleGamefield.col,
				rowAndColOfFieldWithinSingleGamefield.row, rowAndColOfFieldWithinSingleGamefield.col
			);
		} else if (
			args.length === 4 && typeof args[0] === 'number' && typeof args[1] === 'number'
			&& typeof args[2] === 'number' && typeof args[3] === 'number'
			&& !Number.isNaN(args[0]) && !Number.isNaN(args[1]) && !Number.isNaN(args[2]) && !Number.isNaN(args[3])
		) {
			const [singleGamefieldRow, singleGamefieldCol, fieldWithinSingleGamefieldRow, fieldWithinSingleGamefieldCol] = args;

			const targetedSingleField = this.field[singleGamefieldRow][singleGamefieldCol];
			if (
				this.CheckIfMoveIsValid(singleGamefieldRow, singleGamefieldCol) &&
				targetedSingleField.CheckIfMoveIsValid(fieldWithinSingleGamefieldRow, fieldWithinSingleGamefieldCol)
			) {
				targetedSingleField.MakeMove(fieldWithinSingleGamefieldRow, fieldWithinSingleGamefieldCol, this.currPlayer);
				this.currPlayer = this.otherRealPlayer(this.currPlayer);
				this.chooseAny = false;

				if (targetedSingleField.HasBeenWon) {
					this.occupiedFields++;
					this.checkForWin(singleGamefieldRow, singleGamefieldCol);
				}

				//next active SingleGamefield should have the same position in FieldOfSinglefields as the clicked field
				//had within the SingleGamefield. However, if the next active SingleGamefield has been won, the next
				//player may choose freely (of all SingleGamefields that have not been won yet) where to make his move
				const nextActiveSingleGamefield = this.field[fieldWithinSingleGamefieldRow][fieldWithinSingleGamefieldCol];
				if (nextActiveSingleGamefield.HasBeenWon) {
					this.activeSingleGamefields = this.FlattenedField.reduce((all, currSingleGamefield, index) => {
						if (!currSingleGamefield.HasBeenWon) {
							all.push(index);
						}

						return all;
					}, []);
				} else {
					this.activeSingleGamefields = [this.TotalIndexFromRowAndCol(fieldWithinSingleGamefieldRow, fieldWithinSingleGamefieldCol)];
				}
			}
		} else {
			console.warn('Gamefield.MakeMove called with ' + args.length + ' arguments. Expected either two or' +
						 ' four numbers.');
		}
	}
}
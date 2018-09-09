import Gamefield from "../source/Gamefield";
import chai, {expect} from "chai";
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe("Class Gamefield", () => {
	let gamefield;

	const setGamefieldSize = (rows, cols) => {
		if(rows === undefined) {
			rows = gamefield.numberOfRows;
		}

		if(cols === undefined) {
			cols = gamefield.numberOfCols;
		}

		gamefield.numberOfRows = rows;
		gamefield.numberOfCols = cols;
		gamefield.field = new Array(rows).fill(0).map(
			() => new Array(cols).fill(gamefield.nobody)
		);
	};

	beforeEach(() => {
		gamefield = new Gamefield();
	});

	it("Should have three rows and three cols", () => {
		expect(gamefield.numberOfRows).to.equal(3);
		expect(gamefield.numberOfCols).to.equal(3);
	});

	it("Should have one player for X, one for O and one for nobody", () => {
		expect(gamefield.nobody).to.exist;
		expect(gamefield.playerX).to.exist;
		expect(gamefield.playerX).to.exist;
	});

	describe('Initially', () => {
		it('Should have not been started', () => {
			expect(gamefield.hasEverBeenStarted).to.be.false;
		});

		it('Should have not been won and have no winner (or, more precisely, the winner should be nobody)', () => {
			expect(gamefield.isWon).to.be.false;
			expect(gamefield.winner).to.equal(gamefield.nobody);
		});

		it('Should have no occupied fields', () => {
			expect(gamefield.occupiedFields).to.equal(0);
		});
	});

	describe('Should have getters', () => {
		it('For winner', () => {
			expect(gamefield.Winner).to.equal(gamefield.winner);

			let currWinner = gamefield.playerX;
			gamefield.winner = currWinner;
			expect(gamefield.Winner).to.equal(currWinner);

			currWinner = gamefield.playerO;
			gamefield.winner = currWinner;
			expect(gamefield.Winner).to.equal(currWinner);

			currWinner = gamefield.nobody;
			gamefield.winner = currWinner;
			expect(gamefield.Winner).to.equal(currWinner);
		});

		it('For current player', () => {
			expect(gamefield.CurrentPlayer).to.equal(gamefield.currPlayer);

			let currCurrentPlayer = gamefield.playerX;
			gamefield.currPlayer = currCurrentPlayer;
			expect(gamefield.CurrentPlayer).to.equal(currCurrentPlayer);

			currCurrentPlayer = gamefield.playerO;
			gamefield.currPlayer = currCurrentPlayer;
			expect(gamefield.CurrentPlayer).to.equal(currCurrentPlayer);

			currCurrentPlayer = gamefield.nobody;
			gamefield.currPlayer = currCurrentPlayer;
			expect(gamefield.CurrentPlayer).to.equal(currCurrentPlayer);
		});

		it('For has been won', () => {
			expect(gamefield.HasBeenWon).to.equal(gamefield.isWon);

			let currIsWon = true;
			gamefield.isWon = currIsWon;
			expect(gamefield.HasBeenWon).to.equal(currIsWon);

			currIsWon = false;
			gamefield.isWon = currIsWon;
			expect(gamefield.HasBeenWon).to.equal(currIsWon);
		});

		describe('For field length that returns total amound of tiles in field (or rows * cols)', () => {
			const variations = [
				{
					rows: 0,
					cols: 0
				},
				{
					rows: 3,
					cols: 3
				},
				{
					rows: 10,
					cols: 10
				},
				{
					rows: 2,
					cols: 13
				},
				{
					rows: 15,
					cols: 4
				}
			];

			variations.forEach((variation, variationIndex) => {
				it(`(${variationIndex}) With ${variation.rows} rows and ${variation.cols} cols`, () => {
					setGamefieldSize(variation.rows, variation.cols);

					expect(gamefield.fieldLength).to.equal(variation.rows * variation.cols);
				});
			});
		});

		describe('For flattened field that returns an array of all tiles in a row (without separate rows)', () => {
			const variations = [
				[[0, 1], [2, 3]],
				[[0, 1, 2], [3, 4, 5], [6, 7, 8]],
				[[0, 1], [2, 3, 4, 5, 6]],
				[[0, 1, 2, 3, 4], [5, 6]]
			];

			variations.forEach((variation, variationIndex) => {
				it(`(${variationIndex}) With ${variation.length} rows and ${variation[0].length} cols`, () => {
					gamefield.field = variation;
					gamefield.FlattenedField.forEach((tile, index) => {
						expect(tile).to.equal(index);
					});
				});
			});

			it('With an empty array', () => {
				gamefield.field = [];
				expect(gamefield.FlattenedField).to.deep.equal([]);
			});

			it('With an array of empty arrays', () => {
				gamefield.field = [[], [], [], []];
				expect(gamefield.FlattenedField).to.deep.equal([]);
			});
		});
	});

	describe('otherRealPlayer', () => {
		it('Should print a warning to the console and return playerX as default when called without arguments', () => {
			const consoleWarnStub = sinon.stub(console, 'warn');

			expect(consoleWarnStub).to.not.have.been.called;
			expect(gamefield.otherRealPlayer()).to.equal(gamefield.playerX);
			expect(consoleWarnStub).to.have.been.calledOnce;

			consoleWarnStub.restore();
		});

		it('Should print a warning to the console and return playerX as default when called with nobody', () => {
			const consoleWarnStub = sinon.stub(console, 'warn');

			expect(consoleWarnStub).to.not.have.been.called;
			expect(gamefield.otherRealPlayer(gamefield.nobody)).to.equal(gamefield.playerX);
			expect(consoleWarnStub).to.have.been.calledOnce;

			consoleWarnStub.restore();
		});

		it('Should return playerX when called with playerO', () => {
			expect(gamefield.otherRealPlayer(gamefield.playerO)).to.equal(gamefield.playerX);
		});

		it('Should return playerO when called with playerX', () => {
			expect(gamefield.otherRealPlayer(gamefield.playerX)).to.equal(gamefield.playerO);
		});
	});

	describe('RowAndColFromTotalIndex', () => {
		it('Should throw an error when called without a number as first argument', () => {
			expect(() => gamefield.RowAndColFromTotalIndex())
				.to.throw(TypeError)
				.that.has.property('message')
				.that.matches(/.*"undefined".*/);

			expect(() => gamefield.RowAndColFromTotalIndex('1'))
				.to.throw(TypeError)
				.that.has.property('message')
				.that.matches(/.*"string".*/);
		});

		it('Should throw an error when called with NaN as first argument', () => {
			expect(() => gamefield.RowAndColFromTotalIndex(NaN)).to.throw(/.*NaN.*/);
		});

		it('Should throw an error when called with an index that does not exist', () => {
			const rows = 4;
			const cols = 5;
			setGamefieldSize(rows, cols);

			const expectedMaxIndex = cols * rows - 1;

			expect(() => gamefield.RowAndColFromTotalIndex(-1))
				.to.throw(new RegExp('.*between 0 and ' + expectedMaxIndex + '.*'));

			expect(() => gamefield.RowAndColFromTotalIndex(0)).to.not.throw();
			expect(() => gamefield.RowAndColFromTotalIndex(1)).to.not.throw();
			expect(() => gamefield.RowAndColFromTotalIndex(expectedMaxIndex - 1)).to.not.throw();
			expect(() => gamefield.RowAndColFromTotalIndex(expectedMaxIndex)).to.not.throw();

			expect(() => gamefield.RowAndColFromTotalIndex(expectedMaxIndex + 1))
				.to.throw(new RegExp('.*between 0 and ' + expectedMaxIndex + '.*'));
		});

		describe('Should return correct results', () => {
			beforeEach(() => {
				setGamefieldSize(3, 8);
			});

			it('When called with index = 0 (==> row = 0, col = 0)', () => {
				expect(gamefield.RowAndColFromTotalIndex(0)).to.deep.equal({row: 0, col: 0});
			});

			it('When called with index = 1 (==> row = 0, col = 1)', () => {
				expect(gamefield.RowAndColFromTotalIndex(1)).to.deep.equal({row: 0, col: 1});
			});

			it('When called with index = 21 (==> row = 2, col = 5)', () => {
				expect(gamefield.RowAndColFromTotalIndex(21)).to.deep.equal({row: 2, col: 5});
			});
		});
	});

	describe('TotalIndexFromRowAndCol', () => {
		const rows = 4;
		const cols = 5;
		const maxRow = rows - 1;
		const maxCol = cols - 1;

		beforeEach(() => {
			setGamefieldSize(rows, cols);
		});

		it('Should throw an error when called without a number as first argument and number as second argument', () => {
			//suppress inspections because false signature is used on purpose to test how the function handles it

			//noinspection JSCheckFunctionSignatures
			expect(() => gamefield.TotalIndexFromRowAndCol(undefined, 1))
				.to.throw(TypeError)
				.that.has.property('message')
				.that.matches(/.*"undefined".*"number".*/);

			//noinspection JSCheckFunctionSignatures
			expect(() => gamefield.TotalIndexFromRowAndCol('1', 1))
				.to.throw(TypeError)
				.that.has.property('message')
				.that.matches(/.*"string".*"number".*/);
		});

		it('Should throw an error when called with a number as first argument and without a number as second' +
		   ' argument', () => {
			//suppress inspections because false signature is used on purpose to test how the function handles it

			//noinspection JSCheckFunctionSignatures
			expect(() => gamefield.TotalIndexFromRowAndCol(1))
				.to.throw(TypeError)
				.that.has.property('message')
				.that.matches(/.*"number".*"undefined".*/);

			//noinspection JSCheckFunctionSignatures
			expect(() => gamefield.TotalIndexFromRowAndCol(1, '1'))
				.to.throw(TypeError)
				.that.has.property('message')
				.that.matches(/.*"number".*"string".*/);
		});

		it('Should throw an error when called without a number as first or second argument', () => {
			//suppress inspections because false signature is used on purpose to test how the function handles it

			//noinspection JSCheckFunctionSignatures
			expect(() => gamefield.TotalIndexFromRowAndCol())
				.to.throw(TypeError)
				.that.has.property('message')
				.that.matches(/.*"undefined".*"undefined".*/);

			//noinspection JSCheckFunctionSignatures
			expect(() => gamefield.TotalIndexFromRowAndCol('1', '1'))
				.to.throw(TypeError)
				.that.has.property('message')
				.that.matches(/.*"string".*"string".*/);
		});

		it('Should throw an error when called with NaN as first argument', () => {
			expect(() => gamefield.TotalIndexFromRowAndCol(NaN, 1)).to.throw(/.*Row.*NaN.*/);
		});

		it('Should throw an error when called with NaN as second argument', () => {
			expect(() => gamefield.TotalIndexFromRowAndCol(1, NaN)).to.throw(/.*Col.*NaN.*/);
		});

		it('Should throw an error when called with NaN as both arguments', () => {
			expect(() => gamefield.TotalIndexFromRowAndCol(NaN, NaN)).to.throw(/.*NaN.*/);
		});

		it('Should throw an error when called with a row that does not exist', () => {
			setGamefieldSize(rows, cols);

			expect(() => gamefield.TotalIndexFromRowAndCol(-1, 0))
				.to.throw(new RegExp('.*Row.*between 0 and ' + maxRow + '.*'));

			expect(() => gamefield.TotalIndexFromRowAndCol(0, 0)).to.not.throw();
			expect(() => gamefield.TotalIndexFromRowAndCol(1, 0)).to.not.throw();
			expect(() => gamefield.TotalIndexFromRowAndCol(maxRow - 1, 0)).to.not.throw();
			expect(() => gamefield.TotalIndexFromRowAndCol(maxRow, 0)).to.not.throw();

			expect(() => gamefield.TotalIndexFromRowAndCol(maxRow + 1, 0))
				.to.throw(new RegExp('.*Row.*between 0 and ' + maxRow + '.*'));
		});

		it('Should throw an error when called with a col that does not exist', () => {
			expect(() => gamefield.TotalIndexFromRowAndCol(0, -1))
				.to.throw(new RegExp('.*Col.*between 0 and ' + maxCol + '.*'));

			expect(() => gamefield.TotalIndexFromRowAndCol(0, 0)).to.not.throw();
			expect(() => gamefield.TotalIndexFromRowAndCol(0, 1)).to.not.throw();
			expect(() => gamefield.TotalIndexFromRowAndCol(0, maxCol - 1)).to.not.throw();
			expect(() => gamefield.TotalIndexFromRowAndCol(0, maxCol)).to.not.throw();

			expect(() => gamefield.TotalIndexFromRowAndCol(0, maxCol + 1))
				.to.throw(new RegExp('.*Col.*between 0 and ' + maxCol + '.*'));
		});

		it('Should throw an error when called with both a row and a col that don\'t exist', () => {
			expect(() => gamefield.TotalIndexFromRowAndCol(-1, -1))
				.to.throw(new RegExp('.*between 0 and (?:' + maxRow + ')|(?:' + maxCol + ').*'));

			expect(() => gamefield.TotalIndexFromRowAndCol(0, 0)).to.not.throw();
			expect(() => gamefield.TotalIndexFromRowAndCol(1, 1)).to.not.throw();
			expect(() => gamefield.TotalIndexFromRowAndCol(maxRow - 1, maxCol - 1)).to.not.throw();
			expect(() => gamefield.TotalIndexFromRowAndCol(maxRow, maxCol)).to.not.throw();

			expect(() => gamefield.TotalIndexFromRowAndCol(maxRow + 1, maxCol + 1))
				.to.throw(new RegExp('.*between 0 and (?:' + maxRow + ')|(?:' + maxCol + ').*'));
		});

		describe('Should return correct results', () => {
			beforeEach(() => {
				setGamefieldSize(3, 8);
			});

			it('When called with row = 0, col = 0 (==> index = 0)', () => {
				expect(gamefield.TotalIndexFromRowAndCol(0, 0)).to.equal(0);
			});

			it('When called with row = 0, col = 1 (==> index = 1)', () => {
				expect(gamefield.TotalIndexFromRowAndCol(0, 1)).to.equal(1);
			});

			it('When called with row = 1, col = 1 (==> index = 9)', () => {
				expect(gamefield.TotalIndexFromRowAndCol(1, 1)).to.equal(9);
			});

			it('When called with row = 2, col = 5 (==> index = 21)', () => {
				expect(gamefield.TotalIndexFromRowAndCol(2, 5)).to.equal(21);
			});
		});

		it('Should be the inversion of RowAndColFromTotalIndex', () => {
			setGamefieldSize(3, 8);

			for (let i = 0; i < gamefield.numberOfRows * gamefield.numberOfCols; i++) {
				expect(() => gamefield.RowAndColFromTotalIndex(i)).to.not.throw();
				const {row, col} = gamefield.RowAndColFromTotalIndex(i);
				expect(() => gamefield.TotalIndexFromRowAndCol(row, col)).to.not.throw();
				expect(gamefield.TotalIndexFromRowAndCol(row, col)).to.equal(i);
			}
		});
	});

	describe('Restart', () => {
		it('Should call init with result of computeNextStartingPlayerAfterGameEnd', () => {
			const initStub = sinon.stub(gamefield, 'init');
			const computeNextStartingPlayerAfterGameEndStub = sinon.stub(gamefield, 'computeNextStartingPlayerAfterGameEnd');

			expect(initStub).to.not.have.been.called;
			expect(computeNextStartingPlayerAfterGameEndStub).to.not.have.been.called;

			gamefield.Restart();

			expect(initStub).to.have.been.calledOnce;
			expect(computeNextStartingPlayerAfterGameEndStub).to.have.been.calledOnce;
			expect(computeNextStartingPlayerAfterGameEndStub).to.have.been.calledBefore(initStub);

			initStub.restore();
			computeNextStartingPlayerAfterGameEndStub.restore();
		});
	});

	describe('StartNewGame', () => {
		let initStub, restartStub;

		beforeEach(() => {
			initStub = sinon.stub(gamefield, 'init');
			restartStub = sinon.stub(gamefield, 'Restart');
		});

		afterEach(() => {
			initStub.restore();
			restartStub.restore();
		});

		it('Should call init when called for the first time', () => {
			expect(initStub).to.not.have.been.called;
			expect(restartStub).to.not.have.been.called;

			gamefield.StartNewGame();

			expect(initStub).to.have.been.calledOnce;
			expect(restartStub).to.not.have.been.called;
		});

		it('Should call Restart when called for the second time', () => {
			expect(initStub).to.not.have.been.called;
			expect(restartStub).to.not.have.been.called;

			gamefield.StartNewGame();
			gamefield.StartNewGame();

			expect(initStub).to.have.been.calledOnce;
			expect(restartStub).to.have.been.calledOnce;
		});

		it('Should call Restart when called for the nth time (n > 1)', () => {
			expect(initStub).to.not.have.been.called;
			expect(restartStub).to.not.have.been.called;

			for (let i = 0; i < 10; i++) {
				gamefield.StartNewGame();
				expect(initStub).to.have.been.calledOnce;
				expect(restartStub.callCount).to.equal(i);
			}
		});

		it('Should always set hasEverBeenStarted to true', () => {
			expect(gamefield.hasEverBeenStarted).to.be.false;
			gamefield.StartNewGame();
			expect(gamefield.hasEverBeenStarted).to.be.true;
			gamefield.StartNewGame();
			expect(gamefield.hasEverBeenStarted).to.be.true;
		});
	});

	describe('computeNextStartingPlayerAfterGameEnd', () => {
		it('Should return playerX if playerO won', () => {
			gamefield.winner = gamefield.playerO;
			expect(gamefield.computeNextStartingPlayerAfterGameEnd()).to.deep.equal(gamefield.playerX);
		});

		it('Should return playerX if playerO won', () => {
			gamefield.winner = gamefield.playerX;
			expect(gamefield.computeNextStartingPlayerAfterGameEnd()).to.deep.equal(gamefield.playerO);
		});

		it('Should return current player if nobody won', () => {
			gamefield.winner = gamefield.nobody;

			gamefield.currPlayer = gamefield.playerX;
			expect(gamefield.computeNextStartingPlayerAfterGameEnd()).to.deep.equal(gamefield.playerX);

			gamefield.currPlayer = gamefield.playerO;
			expect(gamefield.computeNextStartingPlayerAfterGameEnd()).to.deep.equal(gamefield.playerO);
		});

		it('Should return playerX as default and print warning to console if neither playerX, nor playerO won and' +
		   ' neither of them are currPlayer', () => {
			gamefield.winner = gamefield.nobody;
			gamefield.currPlayer = gamefield.nobody;
			const consoleWarnStub = sinon.stub(console, 'warn');

			expect(consoleWarnStub).to.not.have.been.called;
			expect(gamefield.computeNextStartingPlayerAfterGameEnd()).to.deep.equal(gamefield.playerX);
			expect(consoleWarnStub).to.have.been.calledOnce;

			consoleWarnStub.restore();
		});
	});

	describe('checkForWin', () => {
		let winnerOfComboStub;

		beforeEach(() => {
			gamefield.winnerOfCombo = () => {};
			winnerOfComboStub = sinon.stub(gamefield, 'winnerOfCombo');

			setGamefieldSize();
		});

		afterEach(() => {
			winnerOfComboStub.restore();
		});

		describe('Should set properties correctly according to result', () => {
			it('By setting isWon property to true when playerX is winner', () => {
				winnerOfComboStub.returns(gamefield.playerX);
				expect(gamefield.isWon).to.be.false;
				gamefield.checkForWin(1, 1);
				expect(gamefield.isWon).to.be.true;
			});

			it('By setting winner property to playerX when playerX is winner', () => {
				winnerOfComboStub.returns(gamefield.playerX);
				expect(gamefield.winner).to.deep.equal(gamefield.nobody);
				gamefield.checkForWin(1, 1);
				expect(gamefield.winner).to.deep.equal(gamefield.playerX);
			});

			it('By setting isWon property to true when playerO is winner', () => {
				winnerOfComboStub.returns(gamefield.playerO);
				expect(gamefield.isWon).to.be.false;
				gamefield.checkForWin(1, 1);
				expect(gamefield.isWon).to.be.true;
			});

			it('By setting winner property to playerX when playerX is winner', () => {
				winnerOfComboStub.returns(gamefield.playerO);
				expect(gamefield.winner).to.deep.equal(gamefield.nobody);
				gamefield.checkForWin(1, 1);
				expect(gamefield.winner).to.deep.equal(gamefield.playerO);
			});

			it('By setting isWon property to true when playerX is winner and no more moves are left', () => {
				gamefield.occupiedFields = gamefield.fieldLength;
				winnerOfComboStub.returns(gamefield.playerX);
				expect(gamefield.isWon).to.be.false;
				gamefield.checkForWin(1, 1);
				expect(gamefield.isWon).to.be.true;
			});

			it('By setting isWon property to true when playerO is winner and no more moves are left', () => {
				gamefield.occupiedFields = gamefield.fieldLength;
				winnerOfComboStub.returns(gamefield.playerO);
				expect(gamefield.isWon).to.be.false;
				gamefield.checkForWin(1, 1);
				expect(gamefield.isWon).to.be.true;
			});

			it('By setting isWon property to true when nobody is winner and no more moves are left', () => {
				gamefield.occupiedFields = gamefield.fieldLength;
				winnerOfComboStub.returns(gamefield.nobody);
				expect(gamefield.isWon).to.be.false;
				gamefield.checkForWin(1, 1);
				expect(gamefield.isWon).to.be.true;
			});

			it('By setting winner property to nobody when nobody is winner and no more moves are left', () => {
				gamefield.occupiedFields = gamefield.fieldLength;
				winnerOfComboStub.returns(gamefield.nobody);
				expect(gamefield.winner).to.deep.equal(gamefield.nobody);
				gamefield.checkForWin(1, 1);
				expect(gamefield.winner).to.deep.equal(gamefield.nobody);
			});

			it('By setting isWon property to false when nobody is winner and there are more moves left', () => {
				gamefield.occupiedFields = 0;
				winnerOfComboStub.returns(gamefield.nobody);
				expect(gamefield.isWon).to.be.false;
				gamefield.checkForWin(1, 1);
				expect(gamefield.isWon).to.be.false;
			});
		});

		describe('Should check combinations correctly', () => {
			describe('By checking all affected combinations (and only those) when called with', () => {
				beforeEach(() => {
					setGamefieldSize(5, 5);

					for(let i = 0; i < gamefield.fieldLength; i++) {
						const {row, col} = gamefield.RowAndColFromTotalIndex(i);
						gamefield.field[row][col] = i;
					}
					winnerOfComboStub.returns(gamefield.nobody);
				});

				it('Top left corner', () => {
					expect(winnerOfComboStub).to.not.have.been.called;

					gamefield.checkForWin(0, 0);

					expect(winnerOfComboStub).to.have.been.calledThrice;
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field[0]);
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map(row => row[0]));
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map((row, i) => row[i]));
				});

				it('Top right corner', () => {
					expect(winnerOfComboStub).to.not.have.been.called;

					gamefield.checkForWin(0, gamefield.numberOfCols - 1);

					expect(winnerOfComboStub).to.have.been.calledThrice;
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field[0]);
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map(row => row[gamefield.numberOfCols - 1]));
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map((row, i) => row[gamefield.numberOfCols - 1 - i]));
				});

				it('Bottom left corner', () => {
					expect(winnerOfComboStub).to.not.have.been.called;

					gamefield.checkForWin(gamefield.numberOfRows - 1, 0);

					expect(winnerOfComboStub).to.have.been.calledThrice;
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field[gamefield.numberOfRows - 1]);
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map(row => row[0]));
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map((row, i) => row[gamefield.numberOfCols - 1 - i]));
				});

				it('Bottom right corner', () => {
					expect(winnerOfComboStub).to.not.have.been.called;

					gamefield.checkForWin(gamefield.numberOfRows - 1, gamefield.numberOfCols - 1);

					expect(winnerOfComboStub).to.have.been.calledThrice;
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field[gamefield.numberOfRows - 1]);
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map(row => row[gamefield.numberOfCols - 1]));
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map((row, i) => row[i]));
				});

				it('Middle', () => {
					expect(winnerOfComboStub).to.not.have.been.called;

					gamefield.checkForWin(Math.floor(gamefield.numberOfRows / 2), Math.floor(gamefield.numberOfCols / 2));

					expect(winnerOfComboStub.callCount).to.equal(4);
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field[Math.floor(gamefield.numberOfRows / 2)]);
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map(row => row[Math.floor(gamefield.numberOfCols / 2)]));
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map((row, i) => row[i]));
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map((row, i) => row[gamefield.numberOfCols - 1 - i]));
				});

				it('Non-middle and non-edge-field', () => {
					expect(winnerOfComboStub).to.not.have.been.called;

					gamefield.checkForWin(1, 2);

					expect(winnerOfComboStub).to.have.been.calledTwice;
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field[1]);
					expect(winnerOfComboStub).to.have.been.calledWith(gamefield.field.map(row => row[2]));
				});
			});
			
			describe('By being lazy and only check more combos if no winner has been found yet', () => {
				//the maximum amount of combinations to be checked is 4 (affected row, col and max. two diagonals)
				for (let n = 1; n <= 4; n++) {
					it('After ' + n + ' combos', () => {
						winnerOfComboStub.onCall(n - 1).returns(gamefield.playerX);
						winnerOfComboStub.returns(gamefield.nobody);

						expect(winnerOfComboStub).to.not.have.been.called;

						gamefield.checkForWin(1, 1);

						expect(winnerOfComboStub.callCount).to.equal(n);
					});
				}
			});
		});
	});
});

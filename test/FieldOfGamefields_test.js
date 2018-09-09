import Gamefield from "../source/Gamefield";
import FieldOfGamefields from "../source/FieldOfGamefields";
import SingleGamefield from '../source/SingleGamefield';
import chai, {expect} from "chai";
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('Class FieldOfGamefields', () => {
	let fieldOfGamefields;
	const singleGamefieldWithWinnerX = new SingleGamefield();
	singleGamefieldWithWinnerX.winner = singleGamefieldWithWinnerX.playerX;
	const singleGamefieldWithWinnerO = new SingleGamefield();
	singleGamefieldWithWinnerO.winner = singleGamefieldWithWinnerO.playerO;
	
	beforeEach(() => {
		fieldOfGamefields = new FieldOfGamefields();
	});
	
	it('Should be daughter class of Gamefield', () => {
		expect(fieldOfGamefields).to.be.instanceOf(Gamefield);
	});
	
	describe('Initially sets ', () => {
		it('isWon to false', () => {
			expect(fieldOfGamefields.isWon).to.be.false;
		});
		
		it('winner to nobody', () => {
			expect(fieldOfGamefields.winner).to.be.equal(fieldOfGamefields.nobody);
		});
		
		it('chooseAny to true', () => {
			//todo this is probably absolutely unnecessary. if possible, remove attribute
			expect(fieldOfGamefields.chooseAny).to.be.true;
		});
		
		it('activeSingleGamefields to an array containing all SingleGamefields indexes', () => {
			expect(fieldOfGamefields.activeSingleGamefields)
				.to
				.have
				.lengthOf(fieldOfGamefields.numberOfRows * fieldOfGamefields.numberOfCols);
			
			for (let i = 0; i < fieldOfGamefields.activeSingleGamefields.length; i++) {
				expect(fieldOfGamefields.activeSingleGamefields[i]).to.equal(i);
			}
		});
		
		it('field to a 2D array of SingleGamefields', () => {
			fieldOfGamefields.FlattenedField.forEach(singleField => {
				expect(singleField).to.be.instanceOf(SingleGamefield);
			});
		});
	});
	
	describe('winnerOfCombo', () => {
		it('When called with an array containing one SingleGamefield, should return its winner', () => {
			expect(fieldOfGamefields.winnerOfCombo([singleGamefieldWithWinnerX]))
				.to
				.equal(singleGamefieldWithWinnerX.playerX);
		});
		
		it('Should return an element when called with an array containing said element multiple times', () => {
			expect(fieldOfGamefields.winnerOfCombo(
				[
					singleGamefieldWithWinnerX, singleGamefieldWithWinnerX,
					singleGamefieldWithWinnerX, singleGamefieldWithWinnerX
				]
			)).to.equal(singleGamefieldWithWinnerX.playerX);
		});
		
		it('Should return nobody when called with an array containing at least two different items', () => {
			expect(fieldOfGamefields.winnerOfCombo(
				[
					singleGamefieldWithWinnerX, singleGamefieldWithWinnerX,
					singleGamefieldWithWinnerX, singleGamefieldWithWinnerO
				]
			)).to.equal(fieldOfGamefields.nobody);
		});
	});
	
	describe('CheckIfMoveIsValid', () => {
		beforeEach(() => {
			fieldOfGamefields.numberOfRows = 5;
			fieldOfGamefields.numberOfCols = 8;
			fieldOfGamefields.init();
		});
		
		it('Should return false if game has been won', () => {
			fieldOfGamefields.isWon = true;
			expect(fieldOfGamefields.CheckIfMoveIsValid(0, 0)).to.be.false;
		});
		
		it('Should return false if SingleGamefield has been won', () => {
			fieldOfGamefields.field[0][0].isWon = true;
			expect(fieldOfGamefields.CheckIfMoveIsValid(0, 0)).to.be.false;
		});
		
		it('Should return false if any index is out of bound', () => {
			const maxRows = fieldOfGamefields.numberOfRows;
			const maxCols = fieldOfGamefields.numberOfCols;
			expect(fieldOfGamefields.CheckIfMoveIsValid(-1, 0)).to.be.false;
			expect(fieldOfGamefields.CheckIfMoveIsValid(0, -1)).to.be.false;
			expect(fieldOfGamefields.CheckIfMoveIsValid(-1, -1)).to.be.false;
			expect(fieldOfGamefields.CheckIfMoveIsValid(maxRows, 0)).to.be.false;
			expect(fieldOfGamefields.CheckIfMoveIsValid(0, maxCols)).to.be.false;
			expect(fieldOfGamefields.CheckIfMoveIsValid(maxRows, maxCols)).to.be.false;
		});
		
		it('Should return false if SingleGamefield is not active', () => {
			fieldOfGamefields.activeSingleGamefields = [];
			const maxRows = fieldOfGamefields.numberOfRows;
			const maxCols = fieldOfGamefields.numberOfCols;
			
			for (let i = 0; i < maxRows; i++) {
				for (let j = 0; j < maxCols; j++) {
					expect(fieldOfGamefields.CheckIfMoveIsValid(i, j)).to.be.false;
				}
			}
		});
		
		it('Should return true if game has not been won, targeted tile exists, is active and has not been won', () => {
			fieldOfGamefields.activeSingleGamefields = [0];
			fieldOfGamefields.field[0][0].isWon = false;
			fieldOfGamefields.isWon = false;
			expect(fieldOfGamefields.CheckIfMoveIsValid(0, 0)).to.be.true;
		});
		
		describe('Should print warning to console and return false when called with wrong amount or types of' +
					 ' arguments', () => {
			const wrongArgs = [
				['0'],
				[0],
				[NaN],
				[NaN, 0],
				[0, NaN],
				[NaN, NaN],
				[0, '0'],
				[]
			];
			
			wrongArgs.forEach(args => {
				it('Arguments: ' + args.toString(), () => {
					const consoleWarnStub = sinon.stub(console, 'warn');
					expect(consoleWarnStub).to.not.have.been.called;
					
					expect(fieldOfGamefields.CheckIfMoveIsValid(...args)).to.be.false;
					
					expect(consoleWarnStub).to.have.been.calledOnce;
					consoleWarnStub.restore();
				});
			});
		});
	});
	
	describe('MakeMove', () => {
		let checkIfMoveIsValidStub;
		
		beforeEach(() => {
			checkIfMoveIsValidStub = sinon.stub(fieldOfGamefields, 'CheckIfMoveIsValid');
		});
		
		afterEach(() => {
			checkIfMoveIsValidStub.restore();
		});
		
		it('Should calculate row and col from both totalIndexes when called with two numbers', () => {
			let rowAndColFromTotalIndex = sinon.spy(fieldOfGamefields, 'RowAndColFromTotalIndex');
			let makeMove = sinon.spy(fieldOfGamefields, 'MakeMove');
			
			expect(rowAndColFromTotalIndex).to.not.have.been.called;
			fieldOfGamefields.MakeMove(0, 0);
			expect(rowAndColFromTotalIndex).to.have.been.called;
			expect(makeMove).to.have.been.calledWithExactly(0, 0, 0, 0);
			
			fieldOfGamefields.MakeMove(2, 3);
			expect(makeMove).to.have.been.calledWithExactly(0, 2, 1, 0);
			
			rowAndColFromTotalIndex.restore();
			makeMove.restore();
		});
		
		describe('Should print warning to console and return false when called with wrong amount or types of' +
					 ' arguments', () => {
			const wrongArgs = [
				['0'],
				[0],
				[NaN],
				[NaN, 0],
				[0, NaN],
				[NaN, NaN],
				[NaN, 0, 0, 0],
				[0, NaN, 0, 0],
				[0, 0, NaN, 0],
				[0, 0, 0, NaN],
				[NaN, NaN, NaN, NaN],
				[1, 2, 3, 4, 5],
				[]
			];
			
			wrongArgs.forEach(args => {
				it('Arguments: ' + args.toString(), () => {
					const consoleWarnStub = sinon.stub(console, 'warn');
					expect(consoleWarnStub).to.not.have.been.called;
					
					//either console.warn is called or an error is thrown
					//todo make this constistent
					try {
						expect(() => fieldOfGamefields.MakeMove(...args)).to.throw();
					} catch (e) {
						expect(consoleWarnStub).to.have.been.called;
					}
					
					consoleWarnStub.restore();
				});
			});
		});
		
		it('Should check if move is valid before making move', () => {
			checkIfMoveIsValidStub.returns(false);
			
			expect(checkIfMoveIsValidStub).to.not.have.been.called;
			fieldOfGamefields.MakeMove(0, 0);
			expect(checkIfMoveIsValidStub).to.have.been.calledOnce;
		});
		
		it('Should call SingleGamefield.MakeMove if move is valid', () => {
			checkIfMoveIsValidStub.returns(true);
			let makeMoveSpy = sinon.spy(fieldOfGamefields.field[0][0], 'MakeMove');
			
			expect(makeMoveSpy).to.not.have.been.called;
			fieldOfGamefields.MakeMove(0, 0);
			expect(makeMoveSpy).to.have.been.calledOnce;
			
			makeMoveSpy.restore();
		});
		
		it('Should not call SingleGamefield.MakeMove if move is not valid', () => {
			checkIfMoveIsValidStub.returns(false);
			let makeMoveSpy = sinon.spy(fieldOfGamefields.field[0][0], 'MakeMove');
			
			expect(makeMoveSpy).to.not.have.been.called;
			fieldOfGamefields.MakeMove(0, 0);
			expect(makeMoveSpy).to.not.have.been.called;
			
			makeMoveSpy.restore();
		});
		
		it('Should call checkForWin and increment occupiedFields if move is valid and SingleGamefield has been' +
			   ' won', () => {
			checkIfMoveIsValidStub.returns(true);
			let checkForWinSpy = sinon.spy(fieldOfGamefields, 'checkForWin');
			let checkInnerMoveIsValid = sinon.stub(fieldOfGamefields.field[0][0], 'CheckIfMoveIsValid').returns(true);
			fieldOfGamefields.field[0][0].isWon = true;
			
			expect(checkForWinSpy).to.not.have.been.called;
			fieldOfGamefields.MakeMove(0, 0);
			expect(checkForWinSpy).to.have.been.calledOnce;
			
			checkForWinSpy.restore();
			checkInnerMoveIsValid.restore();
		});
		
		it('Should not call checkForWin and increment occupiedFields if move is not valid and SingleGamefield has' +
			   ' been won', () => {
			checkIfMoveIsValidStub.returns(false);
			let checkForWinSpy = sinon.spy(fieldOfGamefields, 'checkForWin');
			let checkInnerMoveIsValid = sinon.stub(fieldOfGamefields.field[0][0], 'CheckIfMoveIsValid').returns(true);
			fieldOfGamefields.field[0][0].isWon = true;
			
			expect(checkForWinSpy).to.not.have.been.called;
			fieldOfGamefields.MakeMove(0, 0);
			expect(checkForWinSpy).to.not.have.been.called;
			
			checkForWinSpy.restore();
			checkInnerMoveIsValid.restore();
		});
		
		it('Should increment occupiedFields on every call if move is valid and SingleGamefield has been won', () => {
			checkIfMoveIsValidStub.returns(true);
			let checkInnerMoveIsValid = sinon.stub(fieldOfGamefields.field[0][0], 'CheckIfMoveIsValid').returns(true);
			fieldOfGamefields.field[0][0].isWon = true;
			
			for (let i = 1; i < 20; i++) {
				fieldOfGamefields.MakeMove(0, 0);
				expect(fieldOfGamefields.occupiedFields).to.equal(i);
			}
			
			checkInnerMoveIsValid.restore();
		});
		
		it('Should not increment occupiedFields on every call if move is not valid and SingleGamefield has been won', () => {
			checkIfMoveIsValidStub.returns(false);
			let checkInnerMoveIsValid = sinon.stub(fieldOfGamefields.field[0][0], 'CheckIfMoveIsValid').returns(true);
			fieldOfGamefields.field[0][0].isWon = true;
			
			for (let i = 1; i < 20; i++) {
				fieldOfGamefields.MakeMove(0, 0);
				expect(fieldOfGamefields.occupiedFields).to.equal(0);
			}
			
			checkInnerMoveIsValid.restore();
		});
		
		describe('Should set activeSingleGamefields correctly when SingleGamefield has not been won', () => {
			for (let i = 0; i < 9; i++) {
				it('When move is made in totalIndex ' + i, () => {
					checkIfMoveIsValidStub.returns(true);
					const {row, col} = fieldOfGamefields.RowAndColFromTotalIndex(i);
					let checkInnerMoveIsValid = sinon.stub(fieldOfGamefields.field[row][col], 'CheckIfMoveIsValid')
						.returns(true);
					fieldOfGamefields.field[row][col].isWon = false;
					
					fieldOfGamefields.MakeMove(i, i);
					expect(fieldOfGamefields.activeSingleGamefields).to.deep.equal([i]);
					
					checkInnerMoveIsValid.restore();
				});
			}
		});
		
		describe('Should set activeSingleGamefields correctly when SingleGamefield has been won', () => {
			const checkForNWonFields = n => {
				it('And ' + n + ' other SingleGamefields have been won', () => {
					checkIfMoveIsValidStub.returns(true);
					let checkInnerMoveIsValid = sinon.stub(fieldOfGamefields.field[0][0], 'CheckIfMoveIsValid')
						.returns(true);
					fieldOfGamefields.field[0][0].isWon = true;
					
					for(let i = 1; i <= n; i++) {
						const {row, col} = fieldOfGamefields.RowAndColFromTotalIndex(i);
						fieldOfGamefields.field[row][col].isWon = true;
					}
					
					fieldOfGamefields.MakeMove(0, 0);
					expect(fieldOfGamefields.activeSingleGamefields).to.deep.equal(
						new Array(9 - n - 1)
							.fill(0)
							.map((_, index) => index + n + 1)
					);
					
					checkInnerMoveIsValid.restore();
				});
			};
			
			for (let i = 0; i < 8; i++) {
				checkForNWonFields(i);
			}
		});
	});
});
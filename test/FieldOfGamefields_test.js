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
			expect(fieldOfGamefields.activeSingleGamefields).to.have.lengthOf(fieldOfGamefields.numberOfRows * fieldOfGamefields.numberOfCols);
			
			for(let i = 0; i < fieldOfGamefields.activeSingleGamefields.length; i++) {
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
		
		it('Should return true if game has not been won, targeted tile exists and is active', () => {
			fieldOfGamefields.activeSingleGamefields = [0];
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
		
		xit('Should check if move is valid before making move', () => {
			checkIfMoveIsValidStub.returns(false);
			
			expect(checkIfMoveIsValidStub).to.not.have.been.called;
			fieldOfGamefields.MakeMove(0, 0, fieldOfGamefields.playerX);
			expect(checkIfMoveIsValidStub).to.have.been.calledOnce;
		});
		
		xit('Should set targeted field to specified player if move is valid', () => {
			checkIfMoveIsValidStub.returns(true);
			
			fieldOfGamefields.MakeMove(0, 0, fieldOfGamefields.playerX);
			expect(fieldOfGamefields.field[0][0]).to.equal(fieldOfGamefields.playerX);
			
			fieldOfGamefields.MakeMove(0, 0, fieldOfGamefields.playerO);
			expect(fieldOfGamefields.field[0][0]).to.equal(fieldOfGamefields.playerO);
		});
		
		xit('Should not set targeted field to specified player if move is not valid', () => {
			checkIfMoveIsValidStub.returns(false);
			fieldOfGamefields.field[0][0] = fieldOfGamefields.nobody;
			
			fieldOfGamefields.MakeMove(0, 0, fieldOfGamefields.playerX);
			expect(fieldOfGamefields.field[0][0]).to.equal(fieldOfGamefields.nobody);
			
			fieldOfGamefields.MakeMove(0, 0, fieldOfGamefields.playerO);
			expect(fieldOfGamefields.field[0][0]).to.equal(fieldOfGamefields.nobody);
		});
		
		xit('Should increment occupiedFields on every call if move is valid', () => {
			checkIfMoveIsValidStub.returns(true);
			
			for (let i = 1; i < 20; i++) {
				fieldOfGamefields.MakeMove(0, 0, fieldOfGamefields.playerO);
				expect(fieldOfGamefields.occupiedFields).to.equal(i);
			}
		});
		
		xit('Should not increment occupiedFields on every call if move is not valid', () => {
			checkIfMoveIsValidStub.returns(false);
			
			for (let i = 1; i < 20; i++) {
				fieldOfGamefields.MakeMove(0, 0, fieldOfGamefields.playerO);
				expect(fieldOfGamefields.occupiedFields).to.equal(0);
			}
		});
		
		xit('Should check for win if move is valid', () => {
			checkIfMoveIsValidStub.returns(true);
			const checkForWinSpy = sinon.spy(fieldOfGamefields, 'checkForWin');
			
			expect(checkForWinSpy).to.not.have.been.called;
			fieldOfGamefields.MakeMove(0, 0, fieldOfGamefields.playerX);
			expect(checkForWinSpy).to.have.been.calledOnce;
			
			checkForWinSpy.restore();
		});
		
		xit('Should not check for win if move is not valid', () => {
			checkIfMoveIsValidStub.returns(false);
			const checkForWinSpy = sinon.spy(fieldOfGamefields, 'checkForWin');
			
			expect(checkForWinSpy).to.not.have.been.called;
			fieldOfGamefields.MakeMove(0, 0, fieldOfGamefields.playerX);
			expect(checkForWinSpy).to.not.have.been.called;
			
			checkForWinSpy.restore();
		});
	});
});
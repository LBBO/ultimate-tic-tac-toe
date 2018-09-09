import SingleGamefield from "../source/SingleGamefield";
import Gamefield from "../source/Gamefield";
import chai, {expect} from "chai";
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('Class SingleGamefield', () => {
	let singleGamefield;

	beforeEach(() => {
		singleGamefield = new SingleGamefield();
	});

	it('Should be daughter class of Gamefield', () => {
		expect(singleGamefield).to.be.instanceOf(Gamefield);
	});

	it('Should have a field filled with nobody', () => {
		singleGamefield.FlattenedField.forEach(tile => {
			expect(tile).to.equal(singleGamefield.nobody);
		});
	});

	describe('winnerOfCombo', () => {
		it('When called with an array containing one element, should return said element', () => {
			expect(singleGamefield.winnerOfCombo([1])).to.equal(1);
			expect(singleGamefield.winnerOfCombo([singleGamefield.playerX])).to.equal(singleGamefield.playerX);
		});

		it('Should return an element when called with an array containing said element multiple times', () => {
			expect(singleGamefield.winnerOfCombo([1, 1, 1, 1])).to.equal(1);
			expect(singleGamefield.winnerOfCombo(
				[
					singleGamefield.playerX, singleGamefield.playerX, singleGamefield.playerX, singleGamefield.playerX
				]
			)).to.equal(singleGamefield.playerX);
		});

		it('Should return nobody when called with an array containing at least two different items', () => {
			expect(singleGamefield.winnerOfCombo([0, 1, 1, 1])).to.equal(singleGamefield.nobody);
			expect(singleGamefield.winnerOfCombo(
				[
					singleGamefield.playerX, singleGamefield.playerX, singleGamefield.playerX, singleGamefield.playerO
				]
			)).to.equal(singleGamefield.nobody);
		});
	});

	describe('CheckIfMoveIsValid', () => {
		beforeEach(() => {
			singleGamefield.numberOfRows = 5;
			singleGamefield.numberOfCols = 8;
			singleGamefield.init();
		});

		it('Should call RowAndColFromTotalIndex when called with totalIndex', () => {
			const RowAndColFromTotalIndexStub = sinon.stub(singleGamefield, 'RowAndColFromTotalIndex')
				.returns({row: 0, col: 0});

			expect(RowAndColFromTotalIndexStub).to.not.have.been.called;

			singleGamefield.CheckIfMoveIsValid(0);

			expect(RowAndColFromTotalIndexStub).to.have.been.calledOnce;
		});

		it('Should return false if game has been won', () => {
			singleGamefield.isWon = true;
			expect(singleGamefield.CheckIfMoveIsValid(0)).to.be.false;
		});

		it('Should return false if any index is out of bound', () => {
			const maxRows = singleGamefield.numberOfRows;
			const maxCols = singleGamefield.numberOfCols;
			expect(singleGamefield.CheckIfMoveIsValid(-1, 0)).to.be.false;
			expect(singleGamefield.CheckIfMoveIsValid(0, -1)).to.be.false;
			expect(singleGamefield.CheckIfMoveIsValid(-1, -1)).to.be.false;
			expect(singleGamefield.CheckIfMoveIsValid(maxRows, 0)).to.be.false;
			expect(singleGamefield.CheckIfMoveIsValid(0, maxCols)).to.be.false;
			expect(singleGamefield.CheckIfMoveIsValid(maxRows, maxCols)).to.be.false;
		});

		it('Should return false if tile is not free', () => {
			singleGamefield.field[0][0] = singleGamefield.playerX;
			singleGamefield.field[1][0] = singleGamefield.playerO;
			expect(singleGamefield.CheckIfMoveIsValid(0, 0)).to.be.false;
			expect(singleGamefield.CheckIfMoveIsValid(1, 0)).to.be.false;
		});

		it('Should return true if game has not been won, targeted tile exists and is free', () => {
			singleGamefield.field[0][0] = singleGamefield.nobody;
			singleGamefield.isWon = false;
			expect(singleGamefield.CheckIfMoveIsValid(0, 0)).to.be.true;
		});

		describe('Should print warning to console and return false when called with wrong amount or types of' +
				 ' arguments', () => {
			const wrongArgs = [
				['0'],
				[NaN],
				[NaN, 0],
				[0, NaN],
				[NaN, NaN],
				[1, 2, 3],
				[]
			];

			wrongArgs.forEach(args => {
				it('Arguments: ' + args.toString(), () => {
					const consoleWarnStub = sinon.stub(console, 'warn');
					expect(consoleWarnStub).to.not.have.been.called;

					expect(singleGamefield.CheckIfMoveIsValid(...args)).to.be.false;

					expect(consoleWarnStub).to.have.been.calledOnce;
					consoleWarnStub.restore();
				});
			});
		});
	});

	describe('MakeMove', () => {
		let checkIfMoveIsValidStub;

		beforeEach(() => {
			checkIfMoveIsValidStub = sinon.stub(singleGamefield, 'CheckIfMoveIsValid');
		});

		afterEach(() => {
			checkIfMoveIsValidStub.restore();
		});

		it('Should check if move is valid before making move', () => {
			checkIfMoveIsValidStub.returns(false);

			expect(checkIfMoveIsValidStub).to.not.have.been.called;
			singleGamefield.MakeMove(0, 0, singleGamefield.playerX);
			expect(checkIfMoveIsValidStub).to.have.been.calledOnce;
		});

		it('Should set targeted field to specified player if move is valid', () => {
			checkIfMoveIsValidStub.returns(true);

			singleGamefield.MakeMove(0, 0, singleGamefield.playerX);
			expect(singleGamefield.field[0][0]).to.equal(singleGamefield.playerX);

			singleGamefield.MakeMove(0, 0, singleGamefield.playerO);
			expect(singleGamefield.field[0][0]).to.equal(singleGamefield.playerO);
		});

		it('Should not set targeted field to specified player if move is not valid', () => {
			checkIfMoveIsValidStub.returns(false);
			singleGamefield.field[0][0] = singleGamefield.nobody;

			singleGamefield.MakeMove(0, 0, singleGamefield.playerX);
			expect(singleGamefield.field[0][0]).to.equal(singleGamefield.nobody);

			singleGamefield.MakeMove(0, 0, singleGamefield.playerO);
			expect(singleGamefield.field[0][0]).to.equal(singleGamefield.nobody);
		});

		it('Should increment occupiedFields on every call if move is valid', () => {
			checkIfMoveIsValidStub.returns(true);

			for(let i = 1; i < 20; i++) {
				singleGamefield.MakeMove(0, 0, singleGamefield.playerO);
				expect(singleGamefield.occupiedFields).to.equal(i);
			}
		});

		it('Should not increment occupiedFields on every call if move is not valid', () => {
			checkIfMoveIsValidStub.returns(false);

			for(let i = 1; i < 20; i++) {
				singleGamefield.MakeMove(0, 0, singleGamefield.playerO);
				expect(singleGamefield.occupiedFields).to.equal(0);
			}
		});

		it('Should check for win if move is valid', () => {
			checkIfMoveIsValidStub.returns(true);
			const checkForWinSpy = sinon.spy(singleGamefield, 'checkForWin');

			expect(checkForWinSpy).to.not.have.been.called;
			singleGamefield.MakeMove(0, 0, singleGamefield.playerX);
			expect(checkForWinSpy).to.have.been.calledOnce;

			checkForWinSpy.restore();
		});

		it('Should not check for win if move is not valid', () => {
			checkIfMoveIsValidStub.returns(false);
			const checkForWinSpy = sinon.spy(singleGamefield, 'checkForWin');

			expect(checkForWinSpy).to.not.have.been.called;
			singleGamefield.MakeMove(0, 0, singleGamefield.playerX);
			expect(checkForWinSpy).to.not.have.been.called;

			checkForWinSpy.restore();
		});
	});
});
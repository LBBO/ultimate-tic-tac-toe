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
});
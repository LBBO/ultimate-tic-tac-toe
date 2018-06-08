import React from "react";
import Player from "./Player.jsx";

const playerX_SVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" version="1.1">
	<line style={{
						"fill": "none",
						"fillOpacity": "0",
						"stroke": "#3a3b63",
						"strokeWidth": "10",
						"strokeMiterlimit": "4",
						"strokeDasharray": "none",
						"strokeOpacity": "1"
					}} x1="10" x2="90" y1="10" y2="90" />
	<line style={{
						"fill": "none",
						"fillOpacity": "0",
						"stroke": "#3a3b63",
						"strokeWidth": "10",
						"strokeMiterlimit": "4",
						"strokeDasharray": "none",
						"strokeOpacity": "1"
					}} x1="10" x2="90" y1="90" y2="10" />
</svg>;
const playerO_SVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" version="1.1">
	<circle style={{
				"fill": "none",
				"fillOpacity": "0",
				"stroke": "#73dce6",
				"strokeWidth": "10",
				"strokeMiterlimit": "4",
				"strokeDasharray": "none",
				"strokeOpacity": "1"
			}} cx="50" cy="50" r="40" />
</svg>;

export default class Gamefield extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.notifyParentOnTileClick = props.onTileClick;
		this.notifyParentOfWin = props.onWin;

		this.nobody = new Player('empty', '');
		this.playerX = new Player('X', playerX_SVG);
		this.playerO = new Player('O', playerO_SVG);
		
		this.state.currentPlayer = this.playerX;
		this.init = this.init.bind(this);
		this.start = this.start.bind(this);
		this.generateOnTileClickHandler = this.generateOnTileClickHandler.bind(this);
		this.checkForWin = this.checkForWin.bind(this);
		
		this.init();
	}
	
	init(firstPlayer = this.playerO) {
		this.state.isRunning = false;
		this.state.winner = this.nobody;
		this.state.isWon = false;
		this.state.moves = 0;
		this.state.field = [];

		for (let i = 0; i < 3; i++) {
			this.state.field.push([this.nobody, this.nobody, this.nobody]);
		}
		
		this.state.currentPlayer = firstPlayer;
	}

	otherRealPlayer(player) {
		return player == this.playerO ? this.playerX : this.playerO;
	}
	
	start() {
		this.state.isRunning = true;
		this.setState(this.state);
	}
	
	generateOnTileClickHandler(index) {
		const row = Math.floor(index / 3);
		const col = index % 3;

		return () => {
			//only accept click if field isn't empty
			if (this.state.isRunning && this.state.field[row][col] === this.nobody) {
				this.state.field[row][col] = this.state.currentPlayer;
				this.state.moves++;
				this.state.currentPlayer = this.otherRealPlayer(this.state.currentPlayer);
				this.checkForWin(row, col);
				this.notifyParentOnTileClick();
				this.setState({});
			}
		};
	}

	winnerOfCombo(combo) {
		return combo.reduce((currWinner, currPlayer) => currPlayer === currWinner ? currWinner : this.nobody);
	}
	
	checkForWin(changedRowIndex, changedColIndex) {
		if (this.state.moves >= 5) {

			//check changed row
			this.state.winner = this.winnerOfCombo(this.state.field[changedRowIndex]);

			//check changed col
			if (this.state.winner === this.nobody) {
				this.state.winner = this.winnerOfCombo(this.state.field.map(row => row[changedColIndex]));
			}

			//check diagonal from top left to bottom right if it was changed
			//(diagonal from top left to bottom right has identical rowIndex and colIndex)
			if (this.state.winner === this.nobody && changedColIndex === changedRowIndex) {
				this.state.winner = this.winnerOfCombo(this.state.field.map((row, i) => row[i]));
			}

			//check diagonal from top right to bottom left if it was changed
			//(diagonal from top right to bottom left has "inverted" rowIndex and colIndex)
			if (this.state.winner === this.nobody && changedColIndex === this.state.field.length - 1 - changedRowIndex) {
				this.state.winner = this.winnerOfCombo(this.state.field.map((row, i) => row[this.state.field.length - 1 - i]));
			}

			if (this.state.winner != this.nobody || this.state.moves >= 9) {
				this.state.isWon = true;
				this.notifyParentOfWin();
			}
		}
	}
	
	render() {
		return (
			<div className={"wrapper" + (this.state.isWon ? ' hide' : '')}>
				{this.state.field
					.reduce((acc, curr) => acc.concat(curr))
					.map((player, index) =>
							 <div key={index} onClick={this.generateOnTileClickHandler(index)} className={player.name}>
								 {player.svg}
							 </div>
					)
				}
			</div>
		);
	}
}

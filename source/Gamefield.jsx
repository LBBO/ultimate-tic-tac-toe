import React from "react";
import Player from "./Player.jsx";

export default class Gamefield extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.notifyParentOnTileClick = props.onTileClick;
		this.notifyParentOnWin = props.onWin;

		this.nobody = new Player('empty', '');
		this.playerX = new Player('X',
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" version="1.1">
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
			</svg>
		);
		this.playerO = new Player('O',
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" version="1.1">
				<circle style={{
					"fill": "none",
					"fillOpacity": "0",
					"stroke": "#73dce6",
					"strokeWidth": "10",
					"strokeMiterlimit": "4",
					"strokeDasharray": "none",
					"strokeOpacity": "1"
				}} cx="50" cy="50" r="40" />
			</svg>
		);
		
		this.state.currentPlayer = this.playerX;
		this.init = this.init.bind(this);
		this.start = this.start.bind(this);
		this.generateOnTileClickHandler = this.generateOnTileClickHandler.bind(this);
		this.checkForWin = this.checkForWin.bind(this);
		
		this.init();
	}
	
	init(firstPlayer = this.playerO) {
		this.state.isRunning = false;
		this.state.isWon = false;
		this.state.field = [];
		this.state.moves = 0;
		this.state.winner = this.nobody;
		
		for (let i = 0; i < 3; i++) {
			this.state.field.push([this.nobody, this.nobody, this.nobody]);
		}
		
		this.state.currentPlayer = firstPlayer;
		
		//@todo only set state when component is mounted
		this.setState(this.state);
	}
	
	start() {
		this.state.isRunning = true;
		this.setState(this.state);
	}
	
	generateOnTileClickHandler(index) {
		const row = Math.floor(index / 3);
		const col = index % 3;
		return () => {
			if (this.state.isRunning && this.state.field[row][col] === this.nobody) {
				this.state.field[row][col] = this.state.currentPlayer;
				this.state.currentPlayer = this.state.currentPlayer === this.playerO ? this.playerX : this.playerO;
				this.state.moves++;
				this.checkForWin();
				this.setState({});
				this.notifyParentOnTileClick();
			}
		};
	}
	
	checkForWin() {
		if (this.state.moves >= 0) {
			let combos = [
				//these will be filled with the diagonals
				[], []
			];

			for (let i = 0; i < this.state.field.length; i++) {
				const row = this.state.field[i];
				const col = this.state.field.map(row => row[i]);

				combos.push(row);
				combos.push(col);
				combos[0].push(this.state.field[i][i]);
				combos[1].push(this.state.field[this.state.field.length - 1 - i][this.state.field.length - 1 - i]);
			}

			const winnerOfCombo = combo => combo.reduce((currWinner, currPlayer) => currPlayer === currWinner
				? currWinner
				: this.nobody);

			this.state.winner = combos.reduce(
				(winner, currCombo) => winner == this.nobody ? winnerOfCombo(currCombo) : winner,
				this.nobody
			);

			if (this.state.winner != this.nobody || this.state.moves >= 9) {
				this.state.isWon = true;
				this.notifyParentOnWin();
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
	
	makeMove(player, position) {
		this.state.field[position[0]][position[1]] = player;
	}
}

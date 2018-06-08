import React from "react";
import Player from "./Player.jsx";

export default class Gamefield extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {};
		this.nobody = new Player('', '');
		this.playerO = new Player('', 'O');
		this.playerX = new Player('', 'X');

		this.state.currentPlayer = this.playerX;
		this.init = this.init.bind(this);
		this.start = this.start.bind(this);
		this.generateOnTileClickHandler = this.generateOnTileClickHandler.bind(this);
		this.checkForWin = this.checkForWin.bind(this);
		
		this.init();
	}
	
	init(firstPlayer = this.playerX) {
		this.state.isRunning = false;
		this.state.field = [];
		
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
				this.checkForWin();
				this.setState({});
			}
		};
	}

	checkForWin() {

	}

	render() {
		return (
			<div className="wrapper">
				{this.state.field
					.reduce((acc, curr) => acc.concat(curr))
					.map((player, index) =>
							 <div key={index} onClick={this.generateOnTileClickHandler(index)}>{player.symbol}</div>
					)
				}
			</div>
		);
	}

	makeMove(player, position) {
		this.state.field[position[0]][position[1]] = player;
	}
}

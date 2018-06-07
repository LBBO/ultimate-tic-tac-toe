import React from "react";
import Player from "./Player.jsx";

export default class Gamefield extends React.Component {
	constructor() {
		super();

		this.field = [];
		this.emptyPlayer = new Player('', '');
		this.playerO = new Player('', 'O');
		this.playerX = new Player('', 'X');

		for(let i = 0; i < 3; i++) {
			this.field.push([this.emptyPlayer, this.emptyPlayer, this.emptyPlayer]);
		}
		this.field[0][0] = this.playerO;
		this.field[1][1] = this.playerX;
	}

	render() {
		return (
			<div className="wrapper">
				{this.field.reduce((acc, curr) => acc.concat(curr)).map((player, index) => <div key={index}>{player.symbol}</div>)}
			</div>
		);
	}

	makeMove(player, position) {
		this.field[position[0]][position[1]] = player;
	}
}

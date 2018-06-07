import React from "react";
import Player from "./Player.jsx";

export default class Gamefield extends React.Component {
	constructor() {
		super();

		this.field = [];
		this.emptyPlayer = new Player('', 'X');

		for(let i = 0; i < 3; i++) {
			this.field.push([this.emptyPlayer, this.emptyPlayer, this.emptyPlayer]);
		}
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

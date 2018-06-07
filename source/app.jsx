import React, {Component} from "react";
import Gamefield from "./Gamefield.jsx";

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			gameIsRunning: false,
			gameField: new Gamefield()
		};

		this.renderBottom = this.renderBottom.bind(this);
		this.renderTitle = this.renderTitle.bind(this);
		this.abort = this.abort.bind(this);
		this.startGame = this.startGame.bind(this);
	}
	
	renderTitle() {
		return (
			<div className="header">
				<span>TICK TACK</span>
				{this.state.gameIsRunning ? <span className="abort" onClick={this.abort}>Abort</span> : null}
			</div>
		);
	}

	renderBottom() {
		if (!this.state.gameIsRunning) {
			return (
				<div className="footer">
					<span className="newGame" onClick={this.startGame}>NEW GAME</span>
				</div>
			);
		} else {
			return (
				<div className="footer">
					<span className="userTurn">{this.state.gameField.currentPlayer.symbol}'s Turn</span>
				</div>
			);
		}
	}
	
	abort() {
		this.state.gameIsRunning = false;
		this.setState(this.state);
	}
	
	startGame() {
		this.state.gameIsRunning = true;
		this.setState(this.state);
	}

	render() {
		return (
			//<h1 className={"sample"}>Insert Tic Tac Toe here.</h1>
			<div className={this.state.gameIsRunning ? 'gameIsRunning' : 'gameIsNotRunning'}>
				{this.renderTitle()}
				{this.state.gameField.render()}
				{this.renderBottom()}
			</div>
		);
	}
}

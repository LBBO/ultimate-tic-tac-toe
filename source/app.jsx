import React, {Component} from "react";
import FieldOfGamefields from './FieldOfGamefields';
import FieldOfGamefieldsComponent from './FieldOfGamefieldsComponent';

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			gameIsRunning: false,
			gameField: new FieldOfGamefields()
		};
		
		this.renderBottom = this.renderBottom.bind(this);
		this.renderTitle = this.renderTitle.bind(this);
		this.renderGamefield = this.renderGamefield.bind(this);
		this.renderWinScreen = this.renderWinScreen.bind(this);
		this.stopGame = this.stopGame.bind(this);
		this.startGame = this.startGame.bind(this);
		this.forceRender = this.forceRender.bind(this);
		this.onTileClick = this.onTileClick.bind(this);
	}

	startGame() {
		this.state.gameField.StartNewGame();
		this.state.gameIsRunning = true;
		this.forceRender();
	}

	stopGame() {
		this.state.gameIsRunning = false;
		this.forceRender();
	}

	onTileClick(singleGamefieldIndex, tileIndex) {
		if (this.state.gameIsRunning) {
			this.state.gameField.MakeMove(singleGamefieldIndex, tileIndex);
			if (this.state.gameField.HasBeenWon) {
				this.stopGame();
			}
			this.forceRender();
		}
	}

	forceRender() {
		this.setState(this.state);
	}

	renderGamefield() {
		return <FieldOfGamefieldsComponent
			onTileClick={this.onTileClick}
			fieldOfGameFields={this.state.gameField}
		/>;
	}

	renderTitle() {
		return (
			<div className="header">
				<span className="title">ULTIMATE TIC TAC TOE</span>
				{this.state.gameIsRunning ? <span className="abort" onClick={this.stopGame}>ABORT</span> : null}
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
					<span className="userTurn">{this.state.gameField.CurrentPlayer.svg}s TURN</span>
				</div>
			);
		}
	}

	renderWinScreen() {
		return this.state.gameField.HasBeenWon ?
			<div className="winScreen">
						<span className="winner">{
							this.state.gameField.Winner.svg === null
								? 'NOBODY'
								: this.state.gameField.Winner.svg
						}</span>
				<aside>WON THE GAME</aside>
			</div>
			: null;
	}

	render() {
		return (
			<div className={'game ' + (this.state.gameIsRunning ? 'gameIsRunning' : 'gameIsNotRunning')}>
				{this.renderTitle()}
				{this.renderWinScreen()}
				{this.renderGamefield()}
				{this.renderBottom()}
			</div>
		);
	}
}

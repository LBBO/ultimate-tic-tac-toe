import React from "react";

export default class SingleGamefieldComponent extends React.Component {
	render() {
		let classes = ['singleGamefield', 'wrapper'];
		
		if (this.props.gameField.HasBeenWon) {
			classes.push('hasBeenWon');
		}
		
		if(this.props.active) {
			classes.push('active');
		}
		
		return (
			<div className={classes.join(' ')}>
				<div className="field">
					{
						this.props.gameField.FlattenedField
							.map((player, index) =>
									 <div key={index} onClick={() => this.props.onTileClick(index)}
										 className={player.name}>
										 {player.svg}
									 </div>
							)
					}
				</div>
				{this.props.gameField.HasBeenWon ?
					<div className={'winner ' + this.props.gameField.Winner.name}>
						{this.props.gameField.Winner.svg}
					</div>
					: null
				}
			</div>
		);
	}
}

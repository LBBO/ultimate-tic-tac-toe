import React from "react";

export default class SingleGamefieldComponent extends React.Component {
	render() {
		return (
			<div className={"singleGamefield wrapper" + (this.props.gameField.HasBeenWon ? ' hide' : '')}>
				{
					this.props.gameField.FlattenedField
						.map((player, index) =>
								 <div key={index} onClick={() => this.props.onTileClick(index)} className={player.name}>
									 {player.svg}
								 </div>
						)
				}
			</div>
		);
	}
}
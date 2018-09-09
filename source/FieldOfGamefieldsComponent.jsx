import React from "react";
import SingleGamefieldComponent from './SingleGamefieldComponent'

export default class FieldOfGamefieldComponent extends React.Component {
	constructor(props) {
		super(props);
		
		this.generateOnClick = this.generateOnClick.bind(this);
	}
	
	generateOnClick(SingleGamefieldIndex) {
		return (tileIndex) => {
			this.props.onTileClick(SingleGamefieldIndex, tileIndex)
		}
	}
	
	render() {
		let classes = ['fieldOfGamefields', 'wrapper'];
		
		if(this.props.fieldOfGameFields.chooseAny) {
			classes.push('chooseAny');
		}
		
		if(this.props.fieldOfGameFields.HasBeenWon) {
			classes.push('hide');
		}
		
		return (
			<div className={classes.join(' ')}>
				{
					this.props.fieldOfGameFields.FlattenedField
						.map((singleGamefield, index) =>
								 <SingleGamefieldComponent
									 key={'singleGamefield_' + index}
									 gameField={singleGamefield}
									 onTileClick={this.generateOnClick(index)}
									 active={this.props.fieldOfGameFields.activeSingleGamefields.indexOf(index) > -1}
								 >
								 </SingleGamefieldComponent>
						)
				}
			</div>
		);
	}
}

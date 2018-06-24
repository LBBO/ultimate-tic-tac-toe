import React from "react";
import SingleGamefieldComponent from './SingleGamefieldComponent'

export default class FieldOfGamefieldComponent extends React.Component {
	render() {
		return (
			<div className={"fieldOfGamefields wrapper" + (this.props.fieldOfGameFields.HasBeenWon ? ' hide' : '')}>
				{
					this.props.fieldOfGameFields.FlattenedField
						.map((singleGamefield, index) =>
								 <SingleGamefieldComponent
									 key={'singleGamefield_' + index}
									 gameField={singleGamefield}
								 >
								 </SingleGamefieldComponent>
						)
				}
			</div>
		);
	}
}

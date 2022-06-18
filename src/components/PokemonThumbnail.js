import React from "react";
import { render } from "react-dom";
import { withRouter } from "react-router-dom";

class PokemonThumb extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // const { id, image, name, types, _callback } = this.props;
    // console.log(name);
    const { history } = this.props;
    return (
      <div
        className={`card nes-btn background-2-type-${this.props.types[0].type.name}`}
        onClick={() => history.push(`/${this.props.id}`)}
      >
        <small>No{String(this.props.id).padStart(3, "0")}</small>
        <div className="img-container">
          <div className="img-background"></div>
          <div className="img-container">
            <img src={this.props.image} alt={this.props.name} />
          </div>
        </div>
        <div className="detail-wrapper">
          <h1 className="name">{this.props.name.toUpperCase()}</h1>
          {this.props.types
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((type) => {
              return (
                <span
                  key={this.props.name + type.type.name}
                  className={`type-button nes-badge background-type-${type.type.name}`}
                >
                  {`${type.type.name}`}
                </span>
              );
            })}{" "}
        </div>
      </div>
    );
  }
}

export default withRouter(PokemonThumb);

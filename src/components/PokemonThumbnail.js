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
      <div className={`card`} onClick={() => history.push(`/${this.props.id}`)}>
        <div className="detail-wrapper">
          <small>#{String(this.props.id).padStart(3, "0")}</small>
          <h1 className="name">{this.props.name}</h1>
          {this.props.types
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((type) => {
              return (
                <button
                  key={this.props.name + type.type.name}
                  className={`type-button background-type-${type.type.name}`}
                >
                  {`${type.type.name}`}
                </button>
              );
            })}{" "}
        </div>
        <div className="img-container">
          {/* <div className="img-background"></div> */}
          {/* <img src={this.props.image} alt={this.props.name} /> */}
        </div>
      </div>
    );
  }
}

export default withRouter(PokemonThumb);

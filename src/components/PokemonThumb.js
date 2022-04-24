import React from "react";

const PokemonThumb = ({ id, image, name, types, _callback }) => {
  const style = " card";
  return (
    <div className={style}>
      <div className="number">
        <small>#0{id}</small>
      </div>
      <img src={image} alt={name} />
      <div className="detail-wrapper">
        <h3>{name}</h3>
        {types.map((typeInfo) => {
          const { type } = typeInfo;
          const { name } = type;
          return <p key={name}> {`${name}`}</p>;
        })}{" "}
      </div>
    </div>
  );
};

export default PokemonThumb;

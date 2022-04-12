import React, { useEffect, useState } from "react";
import { toFirstCharUppercase } from "./constants";
import mockData from "../src/data/mockData";
import axios from "axios";

const Pokedex = (props) => {
  const { history } = props;
  const [pokemonData, setPokemonData] = useState(mockData);
  const [filter, setFilter] = useState("");

  // what does the response data look like
  useEffect(() => {
    // axios
    //   .get(`https://pokeapi.co/api/v2/pokemon?limit=10`)
    //   .then(function (response) {
    //     const { data } = response;
    //     const { results } = data;
    //     const newPokemonData = {};
    //     results.forEach((pokemon, index) => {
    //       newPokemonData[index + 1] = {
    //         id: index + 1,
    //         name: pokemon.name,
    //         sprites: {
    //           front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
    //       };
    //     });
    //     setPokemonData(newPokemonData);
    //   });
  }, []);

  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  };

  const getPokemonCard = (pokemonId) => {
    const { id, name, sprites, types } = pokemonData[pokemonId];
    var test = "";
    return (
      <div
        className="card"
        key={pokemonId}
        onClick={() => history.push(`/${id}`)}
      >
        <p>No{String(id).padStart(3, "0")}</p>
        <p>{`${name.toUpperCase()}`}</p>
        <img
          src={sprites.front_default}
          style={{ width: "130px", height: "130px" }}
          alt={name}
        />
        {types.map((type) => {
          return (
            <span className={`type-${type.type.name}`}>{type.type.name}</span>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <header position="static">
        <nav>
          <div>
            <span>Search</span>
            <input
              onChange={handleSearchChange}
              label="Pokemon"
              variant="standard"
            />
          </div>
        </nav>
      </header>
      {pokemonData ? (
        <div className="cards">
          {Object.keys(pokemonData).map(
            (pokemonId) =>
              pokemonData[pokemonId].name.includes(filter) &&
              getPokemonCard(pokemonId)
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Pokedex;

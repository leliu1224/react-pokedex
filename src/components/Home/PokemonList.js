import React, { useEffect, useState } from "react";
import PokemonThumbnail from "../PokemonThumbnail";

const PokemonList = (props) => {
  const [allPokemons2, setAllPokemons2] = useState([]);

  useEffect(() => {
    // setAllPokemons2([]);
    getPokemonInfo();
  }, [props.displayPokemons]);

  const getPokemonInfo = () => {
    // console.log(props.displayPokemons);
    // loop through all the return pokemons
    props.displayPokemons.forEach(async (pokemon) => {
      console.log(pokemon.name);
      let res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      let data = await res.json();
      //   // create a list of pokemons with stats, add new pokemon to that list
      //   // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js

      // this is causing the issues since it maintains the previous set of allPokemons and is just appending to it for the search
      // clear the allPokemons on every load/search
      // dont want to clear it on load since it's incredibly inefficient since it's just passing new pokemons on load more
      setAllPokemons2((allPokemons) => [...allPokemons, data]);
      // setAllPokemons2((allPokemons) => [
      //   ...allPokemons,
      //   { name: pokemon.name },
      // ]);
    });
  };

  return (
    <>
      {allPokemons2.length > 0 &&
        allPokemons2.map((pokemonDetails, index) => (
          // <h1 style={{ width: "100%", height: "100px" }}>
          //   {pokemonDetails.name}
          // </h1>
          <PokemonThumbnail
            key={pokemonDetails.name}
            id={pokemonDetails.id}
            image={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(
              pokemonDetails.id
            ).padStart(3, "0")}.png`}
            name={pokemonDetails.name}
            types={pokemonDetails.types}
          />
        ))}
    </>
  );
};

export default PokemonList;

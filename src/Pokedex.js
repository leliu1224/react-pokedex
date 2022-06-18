import React, { useEffect, useState } from "react";
import PokemonThumbnail from "./components/PokemonThumbnail";
import mockDataJson from "../src/data/pokedexData";
import pokemonDataJson from "../src/data/pokemonData";
import axios from "axios";

const Pokedex = (props) => {
  const { history } = props;
  //search filter
  const [searchFilter, setSearchFilter] = useState("");
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=1"
  );

  useEffect(() => {
    getAllPokemons();
  }, []);

  // get the stats for all the pokemons
  const getAllPokemons = async () => {
    let res = await fetch(loadMore);
    let data = await res.json();

    // set the next set of pokemons to fetch
    setLoadMore(data.next);

    // loop through all the return pokemons
    data.results.forEach(async (pokemon) => {
      let res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
      );
      let data = await res.json();
      // create a list of pokemons with stats, add new pokemon to that list
      // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js
      setAllPokemons((pokemonList) => [...pokemonList, data]);
    });

    // axios
    //   .get(`https://pokeapi.co/api/v2/pokemon?limit=10`)
    //   .then(function (response) {
    //     const { data } = response;
    //     const { results } = data;
    //     const newPokemonData = {};
    // set the next url for api request in state result.next
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
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  return (
    <section className="pokedex-container ">
      <h1 className="pokedex-text">PokeDex</h1>
      <div className="search-container">
        <input onChange={handleSearchChange} placeholder="Search Pokemon" />
      </div>

      <div className="cards">
        {allPokemons
          .sort((a, b) => a.id - b.id)
          .filter((pokemonDetails) => {
            return pokemonDetails.name.includes(searchFilter);
          })
          .map((pokemonDetails, index) => (
            <PokemonThumbnail
              key={index}
              id={pokemonDetails.id}
              image={pokemonDetails.sprites.front_default}
              name={pokemonDetails.name}
              types={pokemonDetails.types}
            />
          ))}
      </div>

      {/* <div className="load-more-container">
        <button className="load-more nes-btn" onClick={() => getAllPokemons()}>
          {"LOAD MORE"}
        </button>
      </div> */}

      {/* {pokemonData ? (
        <div className="cards">
          {Object.keys(pokemonData).map(
            (pokemonId) =>
              pokemonData[pokemonId].name.includes(filter) &&
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )} */}
    </section>
  );
};

export default Pokedex;

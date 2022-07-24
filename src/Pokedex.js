import React, { useEffect, useState } from "react";
import PokemonThumbnail from "./components/PokemonThumbnail";
import PokemonList from "./components/Home/PokemonList";
// import pokemonDataJson from "../src/data/pokedexData";
import pokemonDataJson from "../src/data/pokemonData";
import axios from "axios";

const Pokedex = (props) => {
  const { history } = props;
  //search filter
  const [searchValue, setSearchValue] = useState("");
  const [allPokemons, setAllPokemons] = useState([]);
  const [pokemonToDisplay, setPokemonToDisplay] = useState([]);
  const [pokemons, setPokemons] = useState(pokemonDataJson.pokemons);
  const [isFetching, setIsFetching] = useState(false);
  // this can be use as offset too
  const [offset, setOffset] = useState(0);

  //
  // break/return when the loop hits the limit (set manually)
  // append new loaded pokemons to the list
  // set up the filter for the json

  const [loadMore, setLoadMore] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=5"
  );

  useEffect(() => {
    getAllPokemons();
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    getMorePokemons();
  }, [isFetching]);

  const handleScroll = () => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;

    setIsFetching(true);
  };

  const applySearchFilter = (searchString) => {
    var loadPokemons = pokemons.filter((pokemon) => {
      return pokemon.name.indexOf(searchString) >= 0;
    });

    if (searchString === "") {
      // setOffset(0);
      loadPokemons = loadPokemons.slice(0, 10);
    }

    setPokemonToDisplay(loadPokemons);
    // loadPokemons.forEach(async (pokemon) => {
    //   let res = await fetch(
    //     `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
    //   );
    //   let data = await res.json();
    //   // create a list of pokemons with stats, add new pokemon to that list
    //   // https://stackoverflow.com/questions/26253351/correct-modification-of-state-arrays-in-react-js
    //   setAllPokemons((pokemonToDisplay) => [...pokemonToDisplay, data]);
    // });
  };

  const getMorePokemons = () => {
    getAllPokemons();
    setIsFetching(false);
  };

  // get the stats for all the pokemons
  const getAllPokemons = () => {
    // apply the filter here
    // check if the search filter is not empty
    // reset offset after the search is cleared
    console.log(offset);
    var loadPokemons = pokemons.slice(offset, offset + 10);
    // set the next set of pokemons to fetch
    setOffset(offset + 10);

    // setPokemonToDisplay((pokemonToDisplay) => [
    //   ...pokemonToDisplay,
    //   ...loadPokemons,
    // ]);

    setPokemonToDisplay(loadPokemons);
  };

  const handleSearchChange = (e) => {
    // console.log(pokemonToDisplay);
    setSearchValue(e.target.value);
    // setAllPokemons([]);
    applySearchFilter(e.target.value);
  };

  return (
    <section className="pokedex-container ">
      <h1 className="pokedex-text">Pokédex</h1>
      {/* <div className="search-container">
        <input
          onChange={handleSearchChange}
          value={searchValue}
          placeholder="Search Pokemon"
        />
      </div> */}

      <div className="cards">
        <PokemonList displayPokemons={pokemonToDisplay} />
      </div>
      {/* <div className="cards">
        {allPokemons.map((pokemonDetails, index) => (
          <PokemonThumbnail
            key={index}
            id={pokemonDetails.id}
            image={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(
              index + 1
            ).padStart(3, "0")}.png`}
            name={pokemonDetails.name}
            types={pokemonDetails.types}
          />
        ))}
      </div> */}

      {/* {offset < 151 && (
        <div className="load-more-container">
          <button className="load-more nes-btn" onClick={() => handleScroll()}>
            {"LOAD MORE"}
          </button>
        </div>
      )} */}

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

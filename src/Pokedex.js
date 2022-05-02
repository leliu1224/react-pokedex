import React, { useEffect, useState } from "react";
import { toFirstCharUppercase } from "./constants";
import PokemonThumb from "./components/PokemonThumb";
import mockDataJson from "../src/data/pokedexData";
import pokemonDataJson from "../src/data/pokemonData";
import axios from "axios";

const Pokedex = (props) => {
  const { history } = props;
  // set the url for the api request here
  // const [pokemonData, setPokemonData] = useState(mockData);
  const [filter, setFilter] = useState("");
  const [allPokemons, setAllPokemons] = useState([]);
  const [loadMore, setLoadMore] = useState(
    "https://pokeapi.co/api/v2/pokemon?limit=4"
  );

  // what does the response data look like
  useEffect(() => {
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
    getAllPokemons();
  }, []);

  const getAllPokemons = async () => {
    const res = await fetch(loadMore);
    const data = await res.json();
    // const data = mockDataJson;

    setLoadMore(data.next);

    function createPokemonObject(results) {
      results.forEach(async (pokemon, i) => {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
        );
        const data = await res.json();
        // create a list of pokemons with stats, add new pokemon to that list
        setAllPokemons((test) => [...test, data]);
        // await allPokemons.sort((a, b) => a.id - b.id);
        // if (i == 6) {
        //   console.log(JSON.stringify(currentList));
        // }
      });
    }
    createPokemonObject(data.results);
  };

  const handleSearchChange = (e) => {
    setFilter(e.target.value);
  };

  // const getPokemonCard = (pokemonId) => {
  //   const { id, name, sprites, types } = pokemonData[pokemonId];
  //   var test = "";
  //   // console.log(types[types.length - 1].type.name);
  //   let pills = types.reverse();
  //   console.log(types);
  //   console.log(pills);
  //   return (
  //     <div
  //       className={`card background-type-${types[types.length - 1].type.name}`}
  //       key={pokemonId}
  //       onClick={() => history.push(`/${id}`)}
  //     >
  //       <p>No{String(id).padStart(3, "0")}</p>
  //       <p>{`${name.toUpperCase()}`}</p>
  //       <img
  //         src={sprites.front_default}
  //         style={{ width: "130px", height: "130px" }}
  //         alt={name}
  //       />
  //       {pills.map((type) => {
  //         return (
  //           <span className={`type-pill background-2-type-${type.type.name}`}>
  //             {type.type.name}
  //           </span>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  return (
    <section className="pokedex-container nes-container is-rounded">
      <h1 className="pokedex-text">PokeDex</h1>
      <div>
        <input
          onChange={handleSearchChange}
          placeholder="Search Pokemon"
          className="nes-input"
        />
      </div>

      <div className="cards">
        {allPokemons
          .sort((a, b) => a.id - b.id)
          .map((pokemonStats, index) => (
            <PokemonThumb
              key={index}
              id={pokemonStats.id}
              image={pokemonStats.sprites.front_default}
              name={pokemonStats.name}
              types={pokemonStats.types}
            />
          ))}
      </div>
      <button className="load-more" onClick={() => getAllPokemons()}>
        {"<"}
      </button>
      {/* {pokemonData ? (
        <div className="cards">
          {Object.keys(pokemonData).map(
            (pokemonId) =>
              pokemonData[pokemonId].name.includes(filter) &&
              getPokemonCard(pokemonId)
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )} */}
    </section>
  );
};

export default Pokedex;

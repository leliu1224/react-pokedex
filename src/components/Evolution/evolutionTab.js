import React, { useEffect, useState } from "react";

import axios from "axios";

const EvolutionTab = ({ pokemon }) => {
  const { name, id, species, height, weight, stats, types, sprites, moves } =
    pokemon;

  const [pokemonEvolution, setPokemonEvolution] = useState();
  const [evolutionChain, setEvolutionChain] = useState([]);

  useEffect(() => {
    // - multiple get with axios
    // https://stackoverflow.com/questions/61385454/how-to-post-multiple-axios-requests-at-the-same-time
    // https://www.storyblok.com/tp/how-to-send-multiple-requests-using-axios

    const pokemonBasicInfo = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    axios
      .get(pokemonBasicInfo)
      .then((pokemonBasicInfoResponse) => {
        //   console.log(responseTwo.data.evolution_chain);
        // multiple pokemons can share the same evolution chain

        // 'https://pokeapi.co/api/v2/evolution-chain/1/' for Ivysaur
        // evolves_from_species":{"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon-species/1/"}

        axios
          .get(pokemonBasicInfoResponse.data.evolution_chain.url)
          .then((response) => {
            // console.log("success");
            // console.log(response.data);
            setPokemonEvolution(response.data);

            var evoChain = [];
            var evoData = response.data.chain;

            evoChain.push({
              species_name: name,
              min_level: 0,
              url: pokemon.species.url,
              id: id,
              trigger_name: "none",
            });

            do {
              // add base pokemon to this list
              var evoDetails = evoData.evolves_to[0];

              evoChain.push({
                species_name: evoDetails.species.name,
                min_level: !evoDetails
                  ? 1
                  : evoDetails.evolution_details[0].min_level,
                url: evoDetails.species.url,
                id: evoDetails.species.url
                  .replace("https://pokeapi.co/api/v2/pokemon-species/", "")
                  .replace("/", ""),
                trigger_name: !evoDetails
                  ? null
                  : evoDetails.evolution_details[0].trigger.name,
                item: !evoDetails ? null : evoDetails.evolution_details[0].item,
              });

              evoData = evoData.evolves_to[0];
            } while (!!evoData && evoData.evolves_to.length > 0);

            setEvolutionChain(evoChain);
          })
          .catch(function (error) {
            console.log(error);
          });
        // console.log(responseOne.data);
        // console.log(responseTwo.data);
      })

      .catch(function (error) {
        setPokemonEvolution(false);
      });
  }, []);

  return (
    <>
      {evolutionChain !== undefined &&
        evolutionChain.map((evolution, index) => {
          return (
            // current pokemon in the index
            // get next pokemon
            // => next pokemon requirement for level up
            // next pokemon
            <div className="evolution-tab-container">
              <div className="evolution-container">
                <p>By {evolution.trigger_name || ""}</p>
                <p>With {evolution.item || ""}</p>
                <p>Level {evolution.min_level || ""}</p>
              </div>
              <div className="evolution-container">
                <p>{evolution.species_name || ""}</p>
                <img
                  src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(
                    evolution.id
                  ).padStart(3, "0")}.png`}
                  alt=""
                />
              </div>

              {/* <p>{evolution.url}</p> */}
            </div>
          );
        })}
    </>
  );
};

export default EvolutionTab;
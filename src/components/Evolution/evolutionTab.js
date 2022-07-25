import React, { useEffect, useState } from "react";
import "./evolutionTab.css";

import axios from "axios";

const EvolutionTab = ({ pokemon }) => {
  const { name, id, species, height, weight, stats, types, sprites, moves } =
    pokemon;

  const [pokemonEvolution, setPokemonEvolution] = useState();
  const [evolutionChain, setEvolutionChain] = useState([]);

  const triggersDisplayName = {
    "level-up": "Lvl",
    trade: "Trade",
    "use-item": "Use",
    Happiness: "Happiness",
  };

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

            // var basePokemon =
            // evoChain.push({
            //   species_name: evoData.species,
            //   min_level: 0,
            //   url: pokemon.species.url,
            //   id: id,
            //   trigger_name: "none",
            // });

            do {
              // add base pokemon to this list
              // var evoDetails = evoData.evolves_to[0];

              evoChain.push({
                species_name: evoData.species.name,
                // min_level: !evoDetails
                //   ? 1
                //   : evoDetails.evolution_details[0].min_level,
                // url: evoDetails.species.url,
                id: evoData.species.url
                  .replace("https://pokeapi.co/api/v2/pokemon-species/", "")
                  .replace("/", ""),
                trigger: evoData.evolution_details[0]
                  ? evoData.evolution_details[0].min_happiness
                    ? "Happiness"
                    : evoData.evolution_details[0].trigger.name
                  : "",
                triggerValue: evoData.evolution_details[0]
                  ? evoData.evolution_details[0].min_level ||
                    evoData.evolution_details[0].min_happiness ||
                    evoData.evolution_details[0].item?.name.replace("-", " ") ||
                    ""
                  : "",
                // trigger_name: !evoDetails
                //   ? null
                //   : evoDetails.evolution_details[0].trigger.name,
                // item: !evoDetails ? null : evoDetails.evolution_details[0].item,
              });

              evoData = evoData.evolves_to[0];
            } while (!!evoData);

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
          var nextEvolution = evolutionChain[index + 1];

          if (nextEvolution == null) {
            return <p key={`empty-${index}`}></p>;
          }

          return (
            // current pokemon in the index
            // get next pokemon
            // => next pokemon requirement for level up
            // next pokemon
            <div
              className="evolution-tab-container"
              key={`${evolution.species_name}-${index}`}
            >
              <div className="evolution-container">
                <p className="name">{evolution.species_name || ""}</p>
                <img
                  src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(
                    evolution.id
                  ).padStart(3, "0")}.png`}
                  alt=""
                />
              </div>
              <div className="evolution-container trigger">
                <p>
                  {triggersDisplayName[nextEvolution.trigger]}{" "}
                  {nextEvolution.triggerValue || ""}
                </p>
                <div className="arrow"></div>
              </div>
              <div className="evolution-container">
                <p className="name">{nextEvolution.species_name || ""}</p>
                <img
                  src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(
                    nextEvolution.id
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

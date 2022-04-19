/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { toFirstCharUppercase } from "./constants";
import axios from "axios";
import pokemonMockData from "../src/data/pokemonData";
import pokemonAboutData from "../src/data/pokemonAboutData";
import pokemonEvolutionData from "../src/data/pokemonEvolutionData";
import Tab from "./components/Tab";
import TabContent from "./components/TabContent";
import TabNavItem from "./components/TabNavItem";

const Pokemon = (props) => {
  const { match, history } = props;
  const { params } = match;
  const { pokemonId } = params;
  const [pokemon, setPokemon] = useState(pokemonMockData);
  // https://pokeapi.co/api/v2/pokemon-species/{id or name}/
  const [aboutPokemon, setAboutPokemon] = useState(pokemonAboutData);
  const [evolution, setEvolution] = useState(pokemonEvolutionData);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    // axios
    //   .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
    //   .then(function (response) {
    //     const { data } = response;
    //     setPokemon(data);
    //   })
    //   .catch(function (error) {
    //     setPokemon(false);
    //   });
  }, [pokemonId]);

  const generatePokemonJSX = (pokemon) => {
    const { name, id, species, height, weight, stats, types, sprites, moves } =
      pokemon;
    const { flavor_text_entries, genera } = aboutPokemon;
    const { chain } = evolution;
    let classification = genera[7].genus;
    let flavor_text = flavor_text_entries[0].flavor_text;

    var evoChain = [];
    var evoData = evolution.chain;

    do {
      var evoDetails = evoData.evolves_to[0];

      evoChain.push({
        species_name: evoDetails.species.name,
        min_level: !evoDetails ? 1 : evoDetails.evolution_details[0].min_level,
        url: evoDetails.species.url,
        trigger_name: !evoDetails
          ? null
          : evoDetails.evolution_details[0].trigger.name,
        item: !evoDetails ? null : evoDetails.evolution_details[0].item,
      });

      evoData = evoData.evolves_to[0];
    } while (!!evoData && evoData.evolves_to.length > 0);

    console.log(evoChain);
    // let evolution = chain.evolves_to.species.name;
    // const fullImageUrl = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
    // const fullImageUrl = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/1.svg`;
    const { front_default } = sprites;
    return (
      <>
        <h1>
          {`No${String(id).padStart(3, "0")}`} {name.toUpperCase()}
          <img src={front_default} />
        </h1>
        {/* <img style={{ width: "300px", height: "300px" }} src={fullImageUrl} /> */}

        <div className="Tabs">
          <ul className="tab-list">
            <TabNavItem
              title="About"
              id="about"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabNavItem
              title="Stats"
              id="stats"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabNavItem
              title="Moves"
              id="moves"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabNavItem
              title="Evolution"
              id="evolution"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </ul>

          <div className="outlet">
            <TabContent id="about" activeTab={activeTab}>
              <p>{flavor_text}</p>
              <p>{classification}</p>
              <p>Height: {height}cm </p>
              <p>Weight: {weight / 10}kg </p>
              <h6> Types:</h6>
              {types.map((typeInfo) => {
                const { type } = typeInfo;
                const { name } = type;
                return <p key={name}> {`${name}`}</p>;
              })}{" "}
            </TabContent>
            <TabContent id="stats" activeTab={activeTab}>
              {stats.map((stat, i) => {
                return (
                  <li key={`${stat.stat.name}-${i}`}>
                    <span> {`${stat.stat.name}`}</span>
                    <span> {`${stat.base_stat}`}</span>
                  </li>
                );
              })}
            </TabContent>
            <TabContent id="moves" activeTab={activeTab}>
              {moves.map((move) => {
                return (
                  <>
                    <p>{move.move.name} - </p>
                    <p>
                      Level Learned at:{" "}
                      {move.version_group_details[0].level_learned_at}
                    </p>
                  </>
                );
              })}
            </TabContent>
            <TabContent id="evolution" activeTab={activeTab}>
              {evoChain.map((evolution) => {
                return (
                  <>
                    <p>{evolution.species_name}</p>
                    <p>{evolution.item}</p>
                    <p>{evolution.min_level}</p>
                    <p>{evolution.trigger_name}</p>
                    <p>{evolution.url}</p>

                    {/* <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.url
                        .replace(
                          "https://pokeapi.co/api/v2/pokemon-species/",
                          ""
                        )
                        .replace("/", "")}.png`}
                      alt=""
                    /> */}
                  </>
                );
              })}
            </TabContent>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {pokemon === undefined && <p>Loading...</p>}
      {pokemon !== undefined && pokemon && generatePokemonJSX(pokemon)}
      {pokemon === false && <p> Pokemon not found</p>}

      {pokemon !== undefined && (
        <button onClick={() => history.push("/")}>back to pokedex</button>
      )}
    </>
  );
};

export default Pokemon;

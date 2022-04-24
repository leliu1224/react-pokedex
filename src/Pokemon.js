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
  // https://stackoverflow.com/questions/44318631/how-get-the-value-of-match-params-id-on-react-router
  // https://stackoverflow.com/questions/70039498/how-to-use-props-match-params-id
  const { match, history } = props;
  const { pokemonId } = match.params;
  const [pokemonInfo, setPokemonInfo] = useState();
  // https://pokeapi.co/api/v2/pokemonInfo-species/{id or name}/
  // - rest of the pokemon data
  // - what properties are needed

  // about text

  // evolution

  // stats
  // moves
  // types
  // height, weight

  // flavor text
  const [pokemonFlavorText, setPokemonFlavorText] = useState(pokemonAboutData);
  // evolution
  const [pokemonEvolution, setPokemonEvolution] =
    useState(pokemonEvolutionData);
  // for the tabs
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    // - multiple get with axios
    // https://stackoverflow.com/questions/61385454/how-to-post-multiple-axios-requests-at-the-same-time
    // https://www.storyblok.com/tp/how-to-send-multiple-requests-using-axios

    const pokemonAboutText = axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`
    );
    const pokemonBasicInfo = axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`
    );
    const pokemonEvolutionInfo = axios.get(
      `https://pokeapi.co/api/v2/evolution-chain/${pokemonId}/`
    );

    // console.log(pokemonAboutText);

    axios
      .all([pokemonAboutText, pokemonBasicInfo, pokemonEvolutionInfo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];
          setPokemonInfo(responseOne.data);
          setPokemonFlavorText(responseTwo.data);
          setPokemonEvolution(responseThree.data);
        })
      )
      .catch(function (error) {
        setPokemonInfo(false);
        setPokemonFlavorText(false);
        setPokemonEvolution(false);
      });
    // axios
    //   .get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
    //   .then(function (response) {
    //     const { data } = response;
    //     setPokemonInfo(data);
    //     console.log(data);
    //   })
    //   .catch(function (error) {
    //     setPokemonInfo(false);
    //   });
  }, [pokemonId]);

  const generatePokemonJSX = (pokemon) => {
    const { name, id, species, height, weight, stats, types, sprites, moves } =
      pokemon;
    const { flavor_text_entries, genera } = pokemonFlavorText;
    const { chain } = pokemonEvolution;
    let classification = genera[7].genus;
    let flavor_text = flavor_text_entries[0].flavor_text
      .replace("\f", "\n")
      .replace("\u00ad\n", "")
      .replace("\u00ad", "")
      .replace(" -\n", " - ")
      .replace("-\n", "-")
      .replace("\n", " ");

    var evoChain = [];
    var evoData = pokemonEvolution.chain;

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
      {pokemonInfo === undefined && <p>Loading...</p>}
      {pokemonInfo !== undefined &&
        pokemonInfo &&
        generatePokemonJSX(pokemonInfo)}
      {pokemonInfo === false && <p> Pokemon not found</p>}

      {pokemonInfo !== undefined && (
        <button onClick={() => history.push("/")}>back to pokedex</button>
      )}
    </>
  );
};

export default Pokemon;

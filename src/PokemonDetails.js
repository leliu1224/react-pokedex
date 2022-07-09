/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { toFirstCharUppercase } from "./constants";
import axios from "axios";
// import pokemonMockData from "./data/pokemonData";
// import pokemonAboutData from "./data/pokemonAboutData";
// import pokemonEvolutionData from "./data/pokemonEvolutionData";
import Tab from "./components/Tab";
import TabContent from "./components/TabContent";
import TabNavItem from "./components/TabNavItem";
import EvolutionTab from "./components/Evolution/evolutionTab";
import MovesTab from "./components/Moves/movesTab";
import StatsTab from "./components/Stats/statsTab";

const Pokemon = (props) => {
  // https://stackoverflow.com/questions/44318631/how-get-the-value-of-match-params-id-on-react-router
  // https://stackoverflow.com/questions/70039498/how-to-use-props-match-params-id
  const { match, history } = props;
  const { pokemonId } = match.params;
  const [pokemonInfo, setPokemonInfo] = useState();
  // flavor text
  // type of pokemon (Seed)
  const [pokemonFlavorText, setPokemonFlavorText] = useState();
  // set the tab that is active
  const [activeTab, setActiveTab] = useState("evolution");

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

    axios
      .all([pokemonAboutText, pokemonBasicInfo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          setPokemonInfo(responseOne.data);
          setPokemonFlavorText(responseTwo.data); // evolution data is actually from here
        })
      )
      .catch(function (error) {
        setPokemonInfo(false);
        setPokemonFlavorText(false);
      });
  }, [pokemonId]);

  const generatePokemonJSX = (pokemon) => {
    const { name, id, species, height, weight, stats, types, sprites, moves } =
      pokemon;

    const { flavor_text_entries, genera } = pokemonFlavorText;

    let classification = genera[7].genus;

    let flavor_text = flavor_text_entries[0].flavor_text
      .replace("\f", "\n")
      .replace("\u00ad\n", "")
      .replace("\u00ad", "")
      .replace(" -\n", " - ")
      .replace("-\n", "-")
      .replace("\n", " ");

    // const fullImageUrl = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
    // const fullImageUrl = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/1.svg`;
    return (
      <section
        className={`pokemon-container background-type-${types[0].type.name}`}
      >
        <button className="back-button" onClick={() => history.push("/")}>
          {"<"}
        </button>
        <div className="pokemon-info">
          <div className="pokemon-details">
            <div className="pokemon-details-image">
              <img
                src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(
                  id
                ).padStart(3, "0")}.png`}
              />
            </div>
            <h2 className="name">{name}</h2>
            <div className="pokemon-details-text">
              {/* <p>{classification}</p>
              <p>Height: {height}cm </p>
              <p>Weight: {weight / 10}kg </p>
              <p className="inline-text">Types:</p> */}
              {types.map((typeInfo) => {
                const { type } = typeInfo;
                const { name } = type;
                return (
                  <button
                    key={name}
                    className={`type-button background-type-${name}`}
                  >
                    {" "}
                    {`${name}`}
                  </button>
                );
              })}
              <p>{flavor_text}</p>
            </div>
          </div>
        </div>
        {/* <img style={{ width: "300px", height: "300px" }} src={fullImageUrl} /> */}
        <div className="tab-content-container">
          <div className="tab-container">
            <ul className="tab-list">
              {/* <TabNavItem
                title="ABOUT"
                id="about"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              /> */}
              <TabNavItem
                title="STATS"
                id="stats"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <TabNavItem
                title="MOVES"
                id="moves"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <TabNavItem
                title="EVOLUTION"
                id="evolution"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </ul>
          </div>
          <div className="outlet">
            {/* <TabContent id="about" activeTab={activeTab}>
              <p>{flavor_text}</p>
            </TabContent> */}
            {activeTab === "stats" && (
              <TabContent id="stats" activeTab={activeTab}>
                <StatsTab pokemon={pokemonInfo} />
              </TabContent>
            )}
            {activeTab === "moves" && (
              <TabContent id="moves" activeTab={activeTab}>
                <MovesTab pokemon={pokemonInfo} />
              </TabContent>
            )}
            {activeTab === "evolution" && (
              <TabContent id="evolution" activeTab={activeTab}>
                <EvolutionTab pokemon={pokemonInfo} />
              </TabContent>
            )}
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {pokemonInfo === undefined && <p>Loading...</p>}
      {pokemonInfo !== undefined &&
        pokemonFlavorText !== undefined &&
        pokemonInfo &&
        generatePokemonJSX(pokemonInfo)}
      {pokemonInfo === false && <p> Pokemon not found</p>}
    </>
  );
};

export default Pokemon;

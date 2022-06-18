/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { toFirstCharUppercase } from "./constants";
import axios from "axios";
import pokemonMockData from "./data/pokemonData";
import pokemonAboutData from "./data/pokemonAboutData";
import pokemonEvolutionData from "./data/pokemonEvolutionData";
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
  // type of pokemon (Seed)
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

    // console.log(pokemonId);

    axios
      .all([pokemonAboutText, pokemonBasicInfo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          setPokemonInfo(responseOne.data);
          setPokemonFlavorText(responseTwo.data); // evolution data is actually from here

          console.log(responseTwo.data.evolution_chain);
          // multiple pokemons can share the same evolution chain

          // 'https://pokeapi.co/api/v2/evolution-chain/1/' for Ivysaur
          // evolves_from_species":{"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon-species/1/"}
          axios
            .get(responseTwo.data.evolution_chain.url)
            .then((response) => {
              // console.log("success");
              // console.log(response.data);
              setPokemonEvolution(response.data);
            })
            .catch(function (error) {
              console.log("error");

              console.log(error);
            });
          // console.log(responseOne.data);
          // console.log(responseTwo.data);
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
    const levelupMoves = moves.filter((move) => {
      return (
        move.version_group_details[0].move_learn_method.name === "level-up"
      );
    });
    console.log(
      levelupMoves.sort((a, b) =>
        a.version_group_details[0].level_learned_at >
        b.version_group_details[0].level_learned_at
          ? 1
          : b.version_group_details[0].level_learned_at >
            a.version_group_details[0].level_learned_at
          ? -1
          : 0
      )
    );
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

    // console.log(evoChain);
    // let evolution = chain.evolves_to.species.name;
    // const fullImageUrl = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
    // const fullImageUrl = `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/1.svg`;
    const { front_default } = sprites;
    return (
      <section className="pokemon-container">
        <button className="back-button" onClick={() => history.push("/")}>
          {"<"}
        </button>
        <h1 className="pokedex-text">PokeDex</h1>
        <div className="pokemon-info">
          <h2>{name.toUpperCase()}</h2>
          <div className="pokemon-details">
            <div className="pokemon-details-image">
              <img src={front_default} />
            </div>
            <div className="pokemon-details-text">
              <p>{classification}</p>
              <p>Height: {height}cm </p>
              <p>Weight: {weight / 10}kg </p>
              <p className="inline-text">Types:</p>
              {types.map((typeInfo) => {
                const { type } = typeInfo;
                const { name } = type;
                return <span key={name}> {`${name}`}</span>;
              })}
            </div>
          </div>
        </div>
        {/* <img style={{ width: "300px", height: "300px" }} src={fullImageUrl} /> */}
        <div className="tab-content-container">
          <div className="tab-container">
            <ul className="tab-list">
              <TabNavItem
                title="ABOUT"
                id="about"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
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
            <TabContent id="about" activeTab={activeTab}>
              <p>{flavor_text}</p>
            </TabContent>
            <TabContent id="stats" activeTab={activeTab}>
              {stats.map((stat, i) => {
                const widthPercetage = {
                  width: `${(stat.base_stat / 200) * 100}%`,
                };

                return (
                  <div className="stat-container">
                    <p className="stat-name">
                      {" "}
                      {`${stat.stat.name.replace("-", " ")}`}
                    </p>
                    <div className="stat-bar">
                      <div
                        className={`${stat.stat.name}`}
                        style={widthPercetage}
                      >
                        {`${stat.base_stat}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </TabContent>
            <TabContent id="moves" activeTab={activeTab}>
              <table className="moves-table">
                <thead>
                  <tr>
                    <td>Lvl</td>
                    <td>Name</td>
                  </tr>
                </thead>
                <tbody>
                  {levelupMoves.map((move) => {
                    return (
                      <tr>
                        <td>
                          {move.version_group_details[0].level_learned_at}
                        </td>
                        <td>{move.move.name.replace("-", " ")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </TabContent>
            <TabContent id="evolution" activeTab={activeTab}>
              {evoChain.map((evolution) => {
                return (
                  <div className="evolution-tab-container">
                    <div className="evolution-container">
                      <p>By {evolution.trigger_name || ""}</p>
                      <p>With {evolution.item || ""}</p>
                      <p>Level {evolution.min_level || ""}</p>
                    </div>
                    <div className="evolution-container">
                      <p>{evolution.species_name || ""}</p>
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.url
                          .replace(
                            "https://pokeapi.co/api/v2/pokemon-species/",
                            ""
                          )
                          .replace("/", "")}.png`}
                        alt=""
                      />
                    </div>

                    {/* <p>{evolution.url}</p> */}
                  </div>
                );
              })}
            </TabContent>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {pokemonInfo === undefined && <p>Loading...</p>}
      {pokemonInfo !== undefined &&
        pokemonInfo &&
        generatePokemonJSX(pokemonInfo)}
      {pokemonInfo === false && <p> Pokemon not found</p>}
    </>
  );
};

export default Pokemon;

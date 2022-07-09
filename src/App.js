import React from "react";
import Pokedex from "./Pokedex";
import PokemonDetails from "./PokemonDetails";
import "./css/normalize.css";
import "./css/styles.scss";
import "./css/global.css";
import "./css/colors.css";
import { Route, Switch } from "react-router-dom";

const App = () => (
  <Switch>
    <Route exact path="/" render={(props) => <Pokedex {...props} />} />
    <Route
      exact
      path="/:pokemonId"
      render={(props) => <PokemonDetails {...props} />}
    />
  </Switch>
);

export default App;

import React, { useEffect, useState } from "react";
import "./movesTab.css";

const MovesTab = ({ pokemon }) => {
  const { name, id, species, height, weight, stats, types, sprites, moves } =
    pokemon;

  const [levelupMoves, setLevelupMoves] = useState([]);

  useEffect(() => {
    let allMoves = moves.filter((move) => {
      return (
        move.version_group_details[0].move_learn_method.name === "level-up"
      );
    });

    allMoves.sort((a, b) =>
      a.version_group_details[0].level_learned_at >
      b.version_group_details[0].level_learned_at
        ? 1
        : b.version_group_details[0].level_learned_at >
          a.version_group_details[0].level_learned_at
        ? -1
        : 0
    );

    setLevelupMoves(allMoves);
  }, []);

  return (
    <ul className="moves-list">
      {levelupMoves.map((move) => {
        return (
          <li className="move-item" key={move.move.name}>
            <p className="move-name">{move.move.name.replace("-", " ")}</p>
            <p className="move-level">
              Level {move.version_group_details[0].level_learned_at}
            </p>
          </li>
        );
      })}
    </ul>
  );
};

export default MovesTab;

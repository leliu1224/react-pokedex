import React, { useEffect, useState } from "react";
import "./statsTab.css";

const StatsTab = ({ pokemon }) => {
  const { name, id, species, height, weight, stats, types, sprites, moves } =
    pokemon;

  const statsLabels = [
    "HP",
    "Attack",
    "Defense",
    "Sp. Atk",
    "Sp. Def",
    "Speed",
  ];

  useEffect(() => {}, []);

  return (
    <div className="stat-container">
      <table>
        <tbody>
          {statsLabels.map((stat, i) => {
            const widthPercetage = {
              width: `${(stat.base_stat / 200) * 100}%`,
            };

            return (
              <tr key={stats[i].stat.name}>
                <td>{`${stat}`}</td>
                <td>
                  {`${stats[i].base_stat}`}
                  <div
                    className={`range-view ${stats[i].stat.name}`}
                    style={{
                      "--percent": `${(stats[i].base_stat / 150) * 100}%`,
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StatsTab;

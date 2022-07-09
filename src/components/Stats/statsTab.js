import React, { useEffect, useState } from "react";

const StatsTab = ({ pokemon }) => {
  const { name, id, species, height, weight, stats, types, sprites, moves } =
    pokemon;

  useEffect(() => {}, []);

  return (
    <>
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
              <div className={`${stat.stat.name}`} style={widthPercetage}>
                {`${stat.base_stat}`}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default StatsTab;

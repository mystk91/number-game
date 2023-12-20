import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";

//Displays various game stasitics for user. Lets them reset / delete their stats
//    props.stats - a statistics object containing game stats of the user
//    props.premium - true if they have purchased random mode
function Statistics(props) {
  //Adds a random tab and daily tab if user has random mode
  const [statsTabs, setStatsTabs] = useState();

  //Used to change styles on the clicked tab
  const clickedRef = useRef({
    random: " clicked",
    daily: "",
  });
  function setClickedRef(point) {
    clickedRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    if (props.premium) {
      setStatsTabs(
        <div className="statistics-tabs">
          <button
            onClick={() => changeStatsTab("random")}
            className={"random-stats" + clickedRef.current[`random`]}
          >
            Random Mode
          </button>
          <button
            onClick={() => changeStatsTab("daily")}
            className={"random-stats" + clickedRef.current[`daily`]}
          >
            Daily Mode
          </button>
        </div>
      );
    }
    return () => {};
  }, []);

  //Changes the stats tab to either "random" or "daily"
  function changeStatsTab(mode = "random") {
    if (mode === "random") {
      setClickedRef({
        random: " clicked",
        daily: "",
      });
    } else if (mode === "daily") {
      setClickedRef({
        random: "",
        daily: " clicked",
      });
    }
    setStatsTabs(
      <div className="statistics-tabs">
        <button
          onClick={() => changeStatsTab("random")}
          className={"random-stats" + clickedRef.current[`random`]}
        >
          Random Mode
        </button>
        <button
          onClick={() => changeStatsTab("daily")}
          className={"random-stats" + clickedRef.current[`daily`]}
        >
          Daily Mode
        </button>
      </div>
    );
  }

  //Converts an inputted date to the format: Jan 03, 2023
  function convertToDate(date){
    let newDate = date.toLocaleString("default", {
      month: "short",
      day: "numeric",
    });
    return date;
  }

  //Resets the stats of a single game mode
  // gameMode- a string with the name of the game mode
  function resetStats(gameMode) {}

  return (
    <div className="statistics">
      {statsTabs}
      <h1>Game Statistics</h1>

      <div className="stats-game-mode">
        <span className="stats-game-name">4 Random</span>
        <div className="average-30">Average {props.stats[`4random-scores`].average30.numberOfGames}: {props.stats[`4random-scores`].average30.average.toFixed(3)}</div>
        <div className="games-all">Total Games Played: {props.stats[`4random-scores`].scores.length}</div>
        <div className="average-all">Lifetime Average: {props.stats[`4random-scores`].average.toFixed(3)}</div>
        <div className="average-30">Best Average 30: {props.stats[`4random-scores`].best30.average.toFixed(3)}, {props.stats[`4random-scores`].best30.date}</div>

      </div>
      This is the statistics panel.
    </div>
  );
}

export default Statistics;

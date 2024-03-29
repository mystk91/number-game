import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";
import HistogramProfile from "./HistogramProfile";
import Calendar from "../Parts/CalendarIcon";
import CalendarIcon from "../Parts/CalendarIcon";

//Displays various game stasitics for user. Lets them reset / delete their stats
//    props.stats - a statistics object containing game stats of the user
//    props.premium - true if they have purchased random mode
//    props.user    - the user object with their session
function Statistics(props) {
  //Adds a random tab and daily tab if user has random mode
  const [statsTabs, setStatsTabs] = useState();

  //Used to create the stat sheets from the stats object
  const [stats, setStats] = useState();
  const [modal, setModal] = useState();

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
        <div className="statistics-tabs" aria-label="Game Mode Statistics Tabs">
          <button
            onClick={() => changeStatsTab("random")}
            className={"random-stats" + clickedRef.current[`random`]}
          >
            Random Mode
          </button>
          <button
            onClick={() => changeStatsTab("daily")}
            className={"daily-stats" + clickedRef.current[`daily`]}
          >
            Daily Mode
          </button>
          <div className="stats-tab-empty"></div>
        </div>
      );
      createStats("random");
    } else {
      createStats("daily");
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
      createStats("random");
    } else if (mode === "daily") {
      setClickedRef({
        random: "",
        daily: " clicked",
      });
      createStats("daily");
    }
    setStatsTabs(
      <div className="statistics-tabs" aria-label="Game Mode Statistics Tabs">
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
        <div className="stats-tab-empty"></div>
      </div>
    );
  }

  //Converts an inputted date to the format: 01/26/2023
  function convertToDate(date) {
    date = new Date(date);
    let newDate = date.toLocaleString("default", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    newDate =
      newDate.slice(0, newDate.length - 4) + newDate.slice(newDate.length - 2);
    return newDate;
  }

  //Adds a row for best 30 score in random mode if user has played 30+ games
  function createBest30(i) {
    if (props.stats[`${i}random-scores`].best30.average) {
      return (
        <div className="averages" aria-label="Statistic">
          <div className="best-30">
            <div className="stat-name">Best 30 Average</div>
            <div className="stat-value">
              {`${props.stats[`${i}random-scores`].best30.average.toFixed(3)} `}
            </div>
          </div>

          <div className="best30-date">
            <div className="stat-name">Date</div>
            <div className="stat-value">
              {convertToDate(props.stats[`${i}random-scores`].best30.date)}
            </div>
          </div>
          <div className="show-histogram-container random">
            <button
              className="show-histogram"
              onClick={() =>
                showHistogramModal(i, "Digits", "Lifetime Average: ", "average")
              }
            >
              Show Scores
            </button>
          </div>

          <div className="random-histogram">
            {createHistogram(i, "Random", "", "best30")}
          </div>
        </div>
      );
    } else {
      return (
        <div className="averages" aria-label="Statistic">
          <div className="best-30">
            <div className="stat-name">Best 30 Average</div>
            <div className="stat-value">----</div>
          </div>

          <div className="best30-date">
            <div className="stat-name">Date</div>
            <div className="stat-value">--/--/--</div>
          </div>
        </div>
      );
    }
  }

  //Creates the stats sheets by looking through the stats object
  // gameModeType - "random" or "daily"
  function createStats(gameModeType) {
    let statsArr = [];
    if (gameModeType === "random") {
      for (let i = 2; i <= 7; i++) {
        if (props.stats[`${i}random-scores`]) {
          let statsHTML = (
            <div
              className="stats-game-mode random"
              key={"random-stats-" + i}
              aria-label={`Stats: ${i} Random`}
            >
              <header className="stats-game-name" aria-label={`${i} Random`}>
                <div>{i} Random</div>
                <div className="stats-icon" aria-label="Random Mode Icon">
                  {i}
                  <img
                    src="images/site/randomDice.png"
                    alt="Random mode icon with a six sided dice"
                  />
                </div>
              </header>
              <div className="averages-container random">
                <div className="averages" aria-label="Statistic">
                  <div className="average-30">
                    <div className="stat-name">
                      {`${
                        props.stats[`${i}random-scores`].average30.numberOfGames
                      } 
                      Game Average`}
                    </div>
                    <div className="stat-value">
                      {props.stats[
                        `${i}random-scores`
                      ].average30.average.toFixed(3)}
                    </div>
                  </div>
                  <div className="show-histogram-container random">
                    <button
                      className="show-histogram"
                      onClick={() =>
                        showHistogramModal(
                          i,
                          "Random",
                          `${
                            props.stats[`${i}random-scores`].average30
                              .numberOfGames
                          } Game Average: `,
                          "average30"
                        )
                      }
                    >
                      Show Scores
                    </button>
                  </div>
                  <div className="random-histogram">
                    {createHistogram(i, "Random", "", "average30")}
                  </div>
                </div>

                {createBest30(i)}
                <div className="averages" aria-label="Statistic">
                  <div className="average-all">
                    <div className="stat-name">Lifetime Average</div>
                    <div className="stat-value">
                      {props.stats[`${i}random-scores`].average.toFixed(3)}
                    </div>
                  </div>
                  <div className="games-all">
                    <div className="stat-name">Total Games Played</div>
                    <div className="stat-value">
                      {props.stats[`${i}random-scores`].scores.length}
                    </div>
                  </div>
                  <div className="show-histogram-container random">
                    <button
                      className="show-histogram"
                      onClick={() =>
                        showHistogramModal(
                          i,
                          "Random",
                          `Lifetime Average: `,
                          "average"
                        )
                      }
                    >
                      Show Scores
                    </button>
                  </div>
                  <div className="random-histogram">
                    {createHistogram(i, "Random", "", "average")}
                  </div>
                </div>
              </div>
              <div className="reset-stats-container">
                <button
                  className="reset-stats"
                  onClick={() => resetStatsConfirmation(i, "Random")}
                >
                  Reset Stats
                </button>
              </div>
            </div>
          );
          statsArr.push(statsHTML);
        }
      }
    } else {
      for (let i = 2; i <= 7; i++) {
        if (props.stats[`${i}digits-scores`]) {
          let statsHTML = (
            <div
              className="stats-game-mode daily"
              key={"daily-stats-" + i}
              aria-label={`Stats: ${i} Digits`}
            >
              <header className="stats-game-name" aria-label={`${i} Digits`}>
                <div>{i} Digits</div>
                <div className="daily-icon">
                  <CalendarIcon />
                </div>
              </header>
              <div className="averages-container daily">
                <div className="averages" aria-label="Statistic">
                  <div className="average-30">
                    <div className="stat-name">Monthly Average</div>
                    <div className="stat-value">
                      {props.stats[
                        `${i}digits-scores`
                      ].average30.average.toFixed(3)}
                    </div>
                  </div>
                  <div className="games-30">
                    <div className="stat-name">Monthly Games</div>
                    <div className="stat-value">
                      {props.stats[`${i}digits-scores`].scores30.length}
                    </div>
                  </div>
                  <div className="show-histogram-container daily">
                    <button
                      className="show-histogram"
                      onClick={() =>
                        showHistogramModal(
                          i,
                          "Digits",
                          "Monthly Average: ",
                          "average30"
                        )
                      }
                    >
                      Show Scores
                    </button>
                  </div>
                  <div className="daily-histogram">
                    {createHistogram(i, "Digits", "", "average30")}
                  </div>
                </div>
                <div className="averages" aria-label="Statistic">
                  <div className="average-all">
                    <div className="stat-name">Lifetime Average</div>
                    <div className="stat-value">
                      {props.stats[`${i}digits-scores`].average.toFixed(3)}
                    </div>
                  </div>
                  <div className="games-all">
                    <div className="stat-name">Total Games Played</div>
                    <div className="stat-value">
                      {props.stats[`${i}digits-scores`].scores.length}
                    </div>
                  </div>
                  <div className="show-histogram-container daily">
                    <button
                      className="show-histogram"
                      onClick={() =>
                        showHistogramModal(
                          i,
                          "Digits",
                          "Lifetime Average: ",
                          "average"
                        )
                      }
                    >
                      Show Scores
                    </button>
                  </div>
                  <div className="daily-histogram">
                    {createHistogram(i, "Digits", "", "average")}
                  </div>
                </div>
              </div>
              <div className="reset-stats-container">
                <button
                  className="reset-stats"
                  onClick={() => resetStatsConfirmation(i, "Digits")}
                >
                  Reset Stats
                </button>
              </div>
            </div>
          );
          statsArr.push(statsHTML);
        }
      }
    }

    if (statsArr.length > 0) {
      setStats(statsArr);
    } else {
      setStats(
        <div className="stats-error-message">Your game history is empty.</div>
      );
    }
  }

  //Creates a confirmation modal asking if user is sure they want to reset stats
  // digits - integer with number of digits of game stats being reset
  // mode- a string with the name of the game mode. "random" or "digits"
  function resetStatsConfirmation(digits, mode) {
    if (!modal) {
      setModal(
        <div className="reset-modal" aria-label="Reset Stats Modal">
          <div className="reset-modal-container" aria-label="Reset Stats Container">
            <span className="modal-top">
              <button
                className="close-modal"
                onClick={() => setModal()}
                aria-label="Close Reset Stats Modal"
              >
                X
              </button>
            </span>
            <span className="headline">
              <h1 className="headline-text">{`${digits} ${mode}`}</h1>
            </span>
            <div className="reset-modal-body">
              <div className="reset-text">
                Are you sure you want to reset these stats?
              </div>
              <div className="reset-confirmation-btns">
                <button
                  className="cancel-btn confirmation-btn"
                  onClick={() => setModal()}
                >
                  Keep Stats
                </button>
                <button
                  className="reset-btn confirmation-btn"
                  onClick={() => resetStats(digits, mode)}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      setModal();
    }
  }

  //Creates a modal that shows the histogram for the game model
  function showHistogramModal(digits, mode, averageLabel, scoreType) {
    setModal(
      <div
        className="histogram-modal"
        onClick={() => setModal()}
        aria-label="Histogram Modal"
      >
        <div
          className="histogram-modal-container"
          onClick={(e) => e.stopPropagation()}
          aria-label="Histogram Container"
        >
          <span className="modal-top">
            <button
              className="close-modal"
              onClick={() => setModal()}
              aria-label="Close Histogram Modal"
            >
              X
            </button>
          </span>
          <span className="headline">
            <h1 className="headline-text">{`${digits} ${mode}`}</h1>
          </span>

          <HistogramProfile
            averageLabel={averageLabel}
            attempts={6}
            scoresObj={props.stats[`${digits}${mode.toLowerCase()}-scores`]}
            scoreType={scoreType}
            modal={true}
          />
        </div>
      </div>
    );
  }

  //Creates a histogram that will be inside the scores container
  function createHistogram(digits, mode, averageLabel, scoreType) {
    return (
      <HistogramProfile
        averageLabel={averageLabel}
        attempts={6}
        scoresObj={props.stats[`${digits}${mode.toLowerCase()}-scores`]}
        scoreType={scoreType}
      />
    );
  }

  //Resets the stats of a single game mode
  // digits - integer with number of digits of game stats being reset
  // mode- a string with the name of the game mode. "random" or "digits"
  async function resetStats(digits, mode) {
    mode = mode.toLowerCase();
    let reqObj = {
      session: props.user.session,
      mode: digits + mode,
    };
    const options = {
      method: "POST",
      body: JSON.stringify(reqObj),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let res = await fetch("/api/reset-stats", options);
    let resObj = await res.json();
    setModal();
    if (resObj.success) {
      props.stats[`${digits}${mode}-scores`] = "";
      createStats(mode);
    }
  }

  return (
    <div className="statistics" aria-label="Statistics Container">
      {modal}
      {statsTabs}
      <h1>Game Statistics</h1>
      <div className="stats-game-modes-container">{stats}</div>
    </div>
  );
}

export default Statistics;

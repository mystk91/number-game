import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
import "./Leaderboards.css";
import "../../normalize.css";
import "../../custom.css";

//Creates leaderboards for the games that can be viewed by clicking different tabs
function Leaderboards(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  //Used to change the class to " active" on the leaderboard tabs, changing their appearance
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState({
    tab2: "",
    tab3: "",
    tab4: "",
    tab5: " active",
    tab6: "",
    tab7: "",
  });

  const [numberOfDigits, setNumberOfDigits] = useState(5);

  //Displays a list of the top scoring users
  const [activeLeaderboard, setActiveLeaderboard] = useState();

  //Stores all of the leaderboards in one object
  const leaderboardsRef = useRef();
  function setLeaderboardsRef(point) {
    setLeaderboardsRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setUp();
    return () => {};
  }, []);

  //Fetches the leaderboards from the DB and stores them in leaderboardsRef
  async function setUp() {
    //Some Test Users
    let names = [
      "DarknessDolphin",
      "oliv28",
      "ragakor",
      "MiceIce",
      "juagler",
      "cheetlion",
      "Dree",
      "Wao",
      "Prizs",
      "Wrolki",
    ];
    let scores = [
      3.553, 3.654, 3.8, 4.03, 4.153, 4.253, 4.453, 4.59, 5.604, 6.034,
    ];

    let newLeaderboard = [];
    for (let i = 0; i < 10; i++) {
      let row = (
        <li className="leaderboard-row" key={i}>
          <div className="player-rank">{i + 1}</div>
          <div className="player-username">{names[i]}</div>
          <div className="player-average">{scores[i]}</div>
        </li>
      );
      newLeaderboard.push(row);
    }
    setActiveLeaderboard(newLeaderboard);

    let res = await fetch("/api/getLeaderboards");
    let resObj = await res.json();
    if (resObj.error) {
      setActiveLeaderboard(
        <div className="leaderboards-error">Error Loading Leaderboards</div>
      );
    } else {
      setLeaderboardsRef(resObj);
    }
  }

  //Displays a modal that gives information about leaderboards
  function leaderboardInfo() {
    //To do
    console.log("here's some information about leaderboards");
  }

  //Switches the leaderboard currently being displayed
  async function changeLeaderboard(n) {
    let newTab = {
      tab2: "",
      tab3: "",
      tab4: "",
      tab5: "",
      tab6: "",
      tab7: "",
    };
    newTab[`tab` + n] = " active";
    setActiveLeaderboardTab(newTab);
    setNumberOfDigits(n);

    /*
    let leaderboardData = leaderboardsRef.current[`Leaderboard-` + n];

    console.log(leaderboardData);

    leaderboardData = leaderboardData.toArray();
    leaderboardData.sort(function (a, b) {
      return b.average - a.average;
    });

    let newLeaderboard = [];
    for (let i = 0; i < leaderboardData; i++) {
      let row = (
        <li className="leaderboard-row" key={i}>
          <div className="player-rank">{leaderboardData[i].rank}</div>
          <div className="player-username">{leaderboardData[i].username}</div>
          <div className="player-average">{leaderboardData[i].average}</div>
        </li>
      );
      newLeaderboard.push(row);
    }

    setActiveLeaderboard(newLeaderboard);
    */
  }

  return (
    <div className="leaderboards">
      <header className="leaderboards-header">
        <div className="empty"></div>
        <h1>Leaderboards</h1>
        <div className="leaderboard-info-container">
          <button
            className="leaderboard-info"
            onClick={leaderboardInfo}
          ><img src="/images/site/whiteQuestionMark.png" /></button>
        </div>
      </header>
      <main>
        <div className="leaderboards-container">
          <ul className="leaderboard-tabs">
            <li
              className={"leaderboard-tab" + activeLeaderboardTab[`tab2`]}
              onClick={() => {
                changeLeaderboard(2);
              }}
            >
              <div>2 Digits</div>
            </li>
            <li
              className={"leaderboard-tab" + activeLeaderboardTab[`tab3`]}
              onClick={() => {
                changeLeaderboard(3);
              }}
            >
              <div>3 Digits</div>
            </li>
            <li
              className={"leaderboard-tab" + activeLeaderboardTab[`tab4`]}
              onClick={() => {
                changeLeaderboard(4);
              }}
            >
              <div>4 Digits</div>
            </li>
            <li
              className={"leaderboard-tab" + activeLeaderboardTab[`tab5`]}
              onClick={() => {
                changeLeaderboard(5);
              }}
            >
              <div>5 Digits</div>
            </li>
            <li
              className={"leaderboard-tab" + activeLeaderboardTab[`tab6`]}
              onClick={() => {
                changeLeaderboard(6);
              }}
            >
              <div>6 Digits</div>
            </li>
            <li
              className={"leaderboard-tab" + activeLeaderboardTab[`tab7`]}
              onClick={() => {
                changeLeaderboard(7);
              }}
            >
              <div>7 Digits</div>
            </li>
          </ul>

          <div className="leaderboard">
            <label className="leaderboard-digits-label">
              {numberOfDigits + " Digits - Random Mode"}
            </label>
            <li className="leaderboard-labels">
              <label className="player-rank-label">Rank</label>
              <label className="player-username-label">Name</label>
              <label className="player-average-label">Average</label>
            </li>
            <ul className="leaderboard-entries">{activeLeaderboard}</ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Leaderboards;

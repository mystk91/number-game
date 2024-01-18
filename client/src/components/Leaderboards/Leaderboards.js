import React, {
  useState,
  useEffect,
  useRef,
} from "react";
import "./Leaderboards.css";
import "../../normalize.css";
import "../../custom.css";
import AdRandomModal from "../Navbar/AdRandomModal";

//Creates leaderboards for the games that can be viewed by clicking different tabs
function Leaderboards(props) {
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
  const leaderboardsRef = useRef({});
  function setLeaderboardsRef(point) {
    leaderboardsRef.current = point;
  }

  //Used to display a modal that shows information about the leaderboards,
  //Such as how it works / how to qualify for it
  const [modal, setModal] = useState();
  const [adModal, setAdModal] = useState();

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setUp();
  }, []);

  //Fetches the leaderboards from the DB and stores them in leaderboardsRef
  async function setUp() {
    let res = await fetch("/api/getLeaderboards");
    let resObj = await res.json();
    if (resObj.error) {
      setActiveLeaderboard(
        <div className="leaderboards-error">Error Loading Leaderboards</div>
      );
    } else {
      setLeaderboardsRef(resObj);
      changeLeaderboard(5, true);
    }
    checkPremium();
  }

  //Displays a modal that gives information about leaderboards
  function leaderboardInfo() {
    if (!modal) {
      setModal(
        <div className="leaderboard-modal" >
          <div className="leaderboard-modal-container" aria-label="Leaderboard Info">
            <span className="leaderboard-modal-top">
              <button
                className="close-leaderboard-modal"
                onClick={() => setModal()}
                aria-label="Close Leaderboard Info"
              >
                X
              </button>
            </span>
            <span className="headline">
              <div className="headline-text">Leaderboards</div>
            </span>
            <div className="leadboard-modal-body">
              <div>
                Leaderboards show the top average scores for the Random Mode of
                Numblr.
              </div>
              <div>
                Only the last 30 games within 30 days are counted towards these
                scores. Scores are updated hourly.
              </div>
              <div className="leaderboard-info-btns">
              {showBuyRandomRef.current}
              <button className="confirmation-btn" onClick={() => setModal()}>
                Got it!
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

  //Shows a button that will lead user to purchase random mode version
  const showBuyRandomRef = useRef();
  function setShowBuyRandomRef(point) {
    showBuyRandomRef.current = point;
  }

  //Checks if user has Random Mode already
  //This is called when page loads
  async function checkPremium() {
    let resObj;
    if (props.user) {
      const options = {
        method: "POST",
        body: JSON.stringify(props.user),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      let res = await fetch("/api/checkPremium", options);
      resObj = await res.json();
    }
    if (resObj.premium !== true) {
      setShowBuyRandomRef(
        <button className="random-mode-info-btn" onClick={() => {setModal(); setAdModal(<AdRandomModal key={new Date()}/>)}}>
        Random Mode?
      </button>
      );
    }
  }

  //Switches the leaderboard currently being displayed
  function changeLeaderboard(n, firstCall = false) {
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

    let leaderboardData = leaderboardsRef.current[`Leaderboard-` + n];

    let newLeaderboard = [];
    for (let i = 0; i < leaderboardData.length; i++) {
      let row = (
        <tr className="leaderboard-row" key={i} aria-label={`Rank ${i+1}: ${leaderboardData[i].username}, Average: ${leaderboardData[i].average.toFixed(3)}`}>
          <td className="player-rank" aria-label="Rank">{i + 1}</td>
          <td className="player-username" aria-label="Name">{leaderboardData[i].username}</td>
          <td className="player-average" aria-label="Average">
            {leaderboardData[i].average.toFixed(3)}
          </td>
        </tr>
      );
      newLeaderboard.push(row);
    }

    setActiveLeaderboard(newLeaderboard);
    if (!firstCall) {
      setActiveLeaderboard();
      setTimeout(() => {
        setActiveLeaderboard(newLeaderboard);
      }, 1);
    }
  }

  //Used by a button at bottom of page to scroll user back to the top
  function goToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="leaderboards">
      {adModal}
      {modal}
      <header className="leaderboards-header">
        <div className="empty"></div>
        <div className="header-text">Leaderboards</div>
        <div className="leaderboard-info-container">
          <button className="leaderboard-info" onClick={leaderboardInfo} aria-label="Leaderboard Info">
            <img src="/images/site/whiteQuestionMark.png" alt="Question Mark Icon" />
          </button>
        </div>
      </header>
      <main>
        <div className="leaderboards-container">
          <ul className="leaderboard-tabs" aria-label="Leaderboard Modes">
            <li>
              <button
                className={"leaderboard-tab" + activeLeaderboardTab[`tab2`]}
                onClick={() => {
                  changeLeaderboard(2);
                }}
              >
                <div>2 Digits</div>
              </button>
            </li>
            <li>
              <button
                className={"leaderboard-tab" + activeLeaderboardTab[`tab3`]}
                onClick={() => {
                  changeLeaderboard(3);
                }}
              >
                <div>3 Digits</div>
              </button>
            </li>
            <li>
              <button
                className={"leaderboard-tab" + activeLeaderboardTab[`tab4`]}
                onClick={() => {
                  changeLeaderboard(4);
                }}
              >
                <div>4 Digits</div>
              </button>
            </li>
            <li>
              <button
                className={"leaderboard-tab" + activeLeaderboardTab[`tab5`]}
                onClick={() => {
                  changeLeaderboard(5);
                }}
              >
                <div>5 Digits</div>
              </button>
            </li>
            <li>
              <button
                className={"leaderboard-tab" + activeLeaderboardTab[`tab6`]}
                onClick={() => {
                  changeLeaderboard(6);
                }}
              >
                <div>6 Digits</div>
              </button>
            </li>
            <li>
              <button
                className={"leaderboard-tab" + activeLeaderboardTab[`tab7`]}
                onClick={() => {
                  changeLeaderboard(7);
                }}
              >
                <div>7 Digits</div>
              </button>
            </li>
          </ul>

          <table className="leaderboard">
            <caption className="leaderboard-caption">
              {numberOfDigits + " Digits - Random Mode"}
            </caption>
            <thead>
              <tr className="leaderboard-labels" aria-label="Leaderboard Labels">
                <th className="player-rank-label">Rank</th>
                <th className="player-username-label">Name</th>
                <th className="player-average-label">Average</th>
              </tr>
            </thead>
            <tbody className="leaderboard-entries">{activeLeaderboard}</tbody>
          </table>
        </div>
      </main>
      <button className="go-to-top" onClick={goToTop} aria-label="Go to top of page">
        <img src="./images/game/upArrow.png" alt="Arrow pointing up"></img>
      </button>
    </div>
  );
}

export default Leaderboards;

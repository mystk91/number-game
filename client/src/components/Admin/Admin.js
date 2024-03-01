import React, { useState, useEffect, useRef } from "react";
import "./Admin.css";
import "../../normalize.css";
import "../../custom.css";

//Admin page
function Admin(props) {
  const [visitors, setVisitors] = useState();
  const [premiumUsers, setPremiumUsers] = useState();
  const [gamesCompleted, setGamesCompleted] = useState();
  const [randomGamesCompleted, setRandomGamesCompleted] = useState();
  const [dailyGamesCompleted, setDailyGamesCompleted] = useState();

  const [modal, setModal] = useState();

  //Stores all of the leaderboards in one object
  const leaderboardsRef = useRef({});
  function setLeaderboardsRef(point) {
    leaderboardsRef.current = point;
  }

  const [numberOfDigits, setNumberOfDigits] = useState(5);

  //Used to change the class to " active" on the leaderboard tabs, changing their appearance
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState({
    tab2: "",
    tab3: "",
    tab4: "",
    tab5: " active",
    tab6: "",
    tab7: "",
  });

  //Displays a list of the top scoring users
  const [activeLeaderboard, setActiveLeaderboard] = useState();

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setUp();

    return () => {};
  }, []);

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
        <tr className="leaderboard-row" key={i}>
          <td className="player-rank">{leaderboardData[i].rank}</td>
          <td className="player-username">{leaderboardData[i].username}</td>
          <td className="player-average">
            {leaderboardData[i].average.toFixed(3)}
          </td>
          <td className="player-strikes">{leaderboardData[i].strikes}</td>
          <td className="player-id">{leaderboardData[i].userId}</td>
          <td>
            <button
              className="give-strike-btn"
              onClick={() => giveStrike(leaderboardData[i].userId)}
            >
              Give "{leaderboardData[i].username}"" Strike
            </button>
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

  //Retrieves info from DB and presents it visually
  async function setUp() {
    let res = await fetch("/api/admin-get-all-info");
    let resObj = await res.json();
    if (!resObj.error) {
      setVisitors(resObj.siteStats.visitors);
      setPremiumUsers(resObj.siteStats.premiumUsers);
      setGamesCompleted(resObj.siteStats.gamesCompleted);
      setRandomGamesCompleted(resObj.siteStats.randomGamesCompleted);
      setDailyGamesCompleted(resObj.siteStats.dailyGamesCompleted);

      setLeaderboardsRef(resObj.leaderboards);

      changeLeaderboard(5, true);
    }
  }

  //Gives an account strike to the user, and shadowbans them from the leaderboard until they change their name
  async function giveStrike(userId) {
    let reqObj = { userId: userId };
    const options = {
      method: "POST",
      body: JSON.stringify(reqObj),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let res = await fetch("/admin/give-strike", options);
    let resObj = await res.json();
    if (resObj.success) {
      setModal(
        <div className="admin-modal">
          <div>
            <div>Strike set</div>
            <button onClick={() => setModal()}>Okay!</button>
          </div>
        </div>
      );
    } else {
      setModal(
        <div className="admin-modal">
          <div>
            <div>There was an error</div>
            <button onClick={() => setModal()}>Okay!</button>
          </div>
        </div>
      );
    }
  }

  //Adds fake accounts so they will be on the leaderboard, should only be used one time
  //Function and route should be commented out if its been used
  async function addFakeAccounts() {
    fetch("/admin/add-fake-accounts", { method: "POST" });
  }

  //Removes all fake accounts from Accounts
  //Function and route should be commented out if its been used
  async function removeFakeAccounts() {
    fetch("/admin/remove-fake-accounts", { method: "DELETE" });
  }

  //Updates the test account, used for seeing how large the account can get
  async function updateTestAccount() {
    fetch("/admin/update-test-account", { method: "POST" });
  }

  //Adds the first games to the database if they don't exist, Only use when we have an empty game database. Probably will only use this once
  async function addFirstGames() {
    fetch("/admin/add-first-games", { method: "POST" });
  }


  return (
    <div className="admin-page">
      {modal}
      <div className="site-stats">
        <div className="num-visitors">Visitors: {visitors}</div>
        <div className="num-premiums">Premium Users: {premiumUsers}</div>
        <div className="num-games-completed">
          Games Completed: {gamesCompleted}
        </div>
        <div className="num-random-completed">
          Random Games: {randomGamesCompleted}
        </div>
        <div className="num-daily-completed">
          Daily Games: {dailyGamesCompleted}
        </div>
      </div>

      <main>
        <div className="leaderboards-container">
          <ul className="leaderboard-tabs">
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
              <tr className="leaderboard-labels">
                <th className="player-rank-label">Rank</th>
                <th className="player-username-label">Name</th>
                <th className="player-average-label">Average</th>
                <th className="player-strikes-label">Strikes</th>
                <th className="player-id-label">userId</th>
              </tr>
            </thead>
            <tbody className="leaderboard-entries">{activeLeaderboard}</tbody>
          </table>
        </div>
      </main>

      <hr className="admin-hr"></hr>

      <h1>Messages</h1>
      <div className="admin-messages"></div>

      <hr className="admin-hr"></hr>

      <h1>Fake Accounts</h1>
      <div className="fake-accounts">
        <button className="add-fake-accounts" onClick={addFakeAccounts}>
          Add Fake Accounts
        </button>
        <button className="remove-fake-accounts" onClick={removeFakeAccounts}>
          Remove Fake Accounts
        </button>
      </div>

      <hr className="admin-hr"></hr>
      <h1>Test Account</h1>
      <button className="update-test-account" onClick={updateTestAccount}>
        Update Test Account
      </button>

      <hr className="admin-hr"></hr>
      <h1>Add First Games</h1>
      <button className="add-first-games" onClick={addFirstGames}>
        Add First Games
      </button>

      <hr className="admin-hr"></hr>



    </div>
  );
}

export default Admin;

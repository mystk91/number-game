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

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    setUp();

    return () => {};
  }, []);

  //Retrieves info from DB and presents it visually
  async function setUp() {
    let res = await fetch("/api/admin-get-all-info");
    let resObj = await res.json();
    console.log(resObj);
    if (!resObj.error) {
      setVisitors(resObj.siteStats.visitors);
      setPremiumUsers(resObj.siteStats.premiumUsers);
      setGamesCompleted(resObj.siteStats.gamesCompleted);
      setRandomGamesCompleted(resObj.siteStats.randomGamesCompleted);
      setDailyGamesCompleted(resObj.siteStats.dailyGamesCompleted);
    }
  }

  return (
    <div className="admin-page">
      <div className="site-stats">
        <div className="num-visitors">Visitors: {visitors}</div>
        <div className="num-premiums">Premium Users: {premiumUsers}</div>
        <div className="num-games-completed">Games Completed: {gamesCompleted}</div>
        <div className="num-random-completed">Random Games: {randomGamesCompleted}</div>
        <div className="num-daily-completed">Daily Games: {dailyGamesCompleted}</div>
      </div>
    </div>
  );
}

export default Admin;

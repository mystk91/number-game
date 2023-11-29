import React, { useState, useEffect } from "react";
import "../../normalize.css";
import "../../custom.css";
import Navbar from "../Navbar/Navbar";
import Leaderboards from "../Leaderboards/Leaderboards";

//Creates a page for the leaderboards with a navbar
function LeaderboardsPage(props) {
  let [leaderboardPage, setLeaderboardPage] = useState();

  //Runs on mount. Gets users profile pic and starts game
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  async function fetchUser() {
    let res = await fetch("/api/profile_picture");
    let resObj = await res.json();
    setLeaderboardPage(
      <div className="leaderboards-page">
        <Navbar digits={0} user={resObj} />
        <Leaderboards />
      </div>
    );
  }

  return leaderboardPage;
}

export default LeaderboardsPage;

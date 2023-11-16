import React from "react";
import "../../normalize.css";
import "../../custom.css";
import Navbar from "../Navbar/Navbar";
import Leaderboards from "../Leaderboards/Leaderboards";

//Creates a page for the leaderboards with a navbar
function LeaderboardsPage(props) {
  return (
    <div className="leaderboards-page">
      <Navbar digits={0} />
      <Leaderboards />
    </div>
  );
}

export default LeaderboardsPage;

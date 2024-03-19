import React, { useState, useEffect } from "react";
import "../../normalize.css";
import "../../custom.css";
import Navbar from "../Navbar/Navbar";
import NavbarDynamic from "../Navbar/NavbarDynamic";
import Leaderboards from "../Leaderboards/Leaderboards";
import { Helmet } from "react-helmet";

//Creates a page for the leaderboards with a navbar
function LeaderboardsPage(props) {
  let [leaderboardPage, setLeaderboardPage] = useState();

  //Runs on mount. Gets users profile pic and starts game
  useEffect(() => {
    document.title = "Numbler - Leaderboards";
    fetchUser();
    return () => {};
  }, []);

  async function fetchUser() {
    let user;
    let profile = localStorage.getItem("profile");
    if (profile) {
      let profileObj = JSON.parse(profile);
      const options = {
        method: "POST",
        body: JSON.stringify(profileObj),
        withCredentials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      let res = await fetch("/api/account-info", options);
      let accountInfo = await res.json();
      user = {
        loggedIn: accountInfo.loggedIn,
        premium: accountInfo.premium,
        imageUrl: accountInfo.imageUrl,
        session: profileObj.session,
      };
    } else {
      user = {
        loggedIn: false,
        premium: false,
        imageUrl: "/images/site/account2.png",
      };
    }
    setLeaderboardPage(
      <div className="leaderboards-page">
        <Helmet>
          <meta
            name="description"
            content={`Numbler Leaderboards for Random Mode.`}
          />
          <meta
            name="keywords"
            content="numbler, numbler leaderboards, numbler leaderboard, leaderboard, leaderboards, random mode"
          />
        </Helmet>
        <NavbarDynamic digits={0} user={user} instructions={" invisible"} />
        <Leaderboards user={user} />
      </div>
    );
  }

  return leaderboardPage;
}

export default LeaderboardsPage;

import React, { useState, useEffect } from "react";
import "../../normalize.css";
import "../../custom.css";
import Navbar from "../Navbar/Navbar";
import NavbarDynamic from "../Navbar/NavbarDynamic";
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
    let resObj;
    let profile = localStorage.getItem("profile");
    if (props.user) {
      resObj = props.user;
    } else if (profile) {
      let profileObj = JSON.parse(profile);
      resObj = {
        session: profileObj.session,
        imageUrl: profileObj.profile_picture,
        loggedIn: true,
      };
    } else {
      let res = await fetch("/api/profile_picture");
      resObj = await res.json();
    }
    if (resObj.session) {
      const options = {
        method: "POST",
        body: JSON.stringify(resObj),
        withCredentials: true,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      let checkPremium = await fetch("/api/checkPremium", options);
      let checkPremiumObj = await checkPremium.json();
      if (checkPremiumObj.premium) {
        resObj.premium = true;
      }
    }
    setLeaderboardPage(
      <div className="leaderboards-page">
        <NavbarDynamic digits={0} user={resObj} instructions={" invisible"} />
        <Leaderboards user={resObj} />
      </div>
    );
  }

  return leaderboardPage;
}

export default LeaderboardsPage;

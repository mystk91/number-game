import React, { useState, useEffect, useCallback } from "react";
import "../../normalize.css";
import "../../custom.css";
import NumberGameRegular from "../Game/NumberGameRegular";
import NumberGameLocal from "../Game/NumberGameLocal";
import NavbarDynamic from "../Navbar/NavbarDynamic";
import MyProfile from "../Profile/MyProfile";

//Creates a profile page for the website that displays the navbar and the users profile
//The game page will either use localStorage or data from players account
function ProfilePage(props) {
  let [profilePage, setProfilePage] = useState();

  //Runs on mount. Checks if the user is logged in and sets the corresponding game page
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  //Checks if the user is logged in and retreives their information for the profile page
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
    let username;
    let statsObj;
    let premium;
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
      let getProfile = await fetch("/api/profile", options);
      let profileObj = await getProfile.json();
      username = profileObj.username;
      statsObj = profileObj.statsObj;
      premium = profileObj.premium;
      if (profileObj.premium) {
        resObj.premium = true;
      }

      let today = new Date();
      //Removes old games from stats and updates the averages
      for (let i = 2; i <= 7; i++) {
        if (statsObj[`${i}random-scores`]) {
          let shifted = false;
          while (
            today.getTime() -
              new Date(statsObj[`${i}random-scores`].scores30[0].date).getTime() >
            2592000000
          ) {
            statsObj[`${i}random-scores`].scores30.shift();
            shifted = true;
          }
          if (shifted) {
            let average30 =
              statsObj[`${i}random-scores`].scores30.reduce((total, x) => {
                return total + x.score;
              }, 0) / statsObj[`${i}random-scores`].scores30.length;

            statsObj[`${i}random-scores`].average30.average = average30;
            statsObj[`${i}random-scores`].average30.numberOfGames =
              statsObj[`${i}random-scores`].scores30.length;
          }

          if(statsObj[`${i}random-scores`].best30.average === 8){
            statsObj[`${i}random-scores`].best30.average = "";
            statsObj[`${i}random-scores`].best30.date = "";
          }
        }

        if (statsObj[`${i}digits-scores`]) {
          let shifted = false;
          while (
            today.getTime() -
              new Date(statsObj[`${i}digits-scores`].scores30[0].date).getTime() >
            2592000000
          ) {
            statsObj[`${i}digits-scores`].scores30.shift();
            shifted = true;
          }
          if (shifted) {
            let average30 =
              statsObj[`${i}digits-scores`].scores30.reduce((total, x) => {
                return total + x.score;
              }, 0) / statsObj[`${i}digits-scores`].scores30.length;

            statsObj[`${i}digits-scores`].average30.average = average30;
          }
        }
      }
    }
    if (resObj.session) {
      setProfilePage(
        <div className="profile-page">
          <NavbarDynamic digits={0} user={resObj} />
          <MyProfile
            user={resObj}
            username={username}
            stats={statsObj}
            premium={premium}
          />
        </div>
      );
    } else {
      window.location = "/login";
    }
  }

  return profilePage;
}

export default ProfilePage;

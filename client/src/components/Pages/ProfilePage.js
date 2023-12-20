import React, {
  useState,
  useEffect,
  useCallback
} from "react";
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
    }
    if (resObj.session) {
      setProfilePage(
        <div className="profile-page">
          <NavbarDynamic digits={0} user={resObj} />
          <MyProfile user={resObj} username={username} stats={statsObj} premium={premium} />
        </div>
      );
    } else {
      window.location = ("/login");
    }
  }

  return profilePage;
}

export default ProfilePage;

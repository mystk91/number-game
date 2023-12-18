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
import Navbar from "../Navbar/Navbar";

//Creates a profile page for the website that displays the navbar and the users profile
//The game page will either use localStorage or data from players account
function ProfileCSS(props) {
  let [profilePage, setProfilePage] = useState();

  //Runs on mount. Checks if the user is logged in and sets the corresponding game page
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  //Checks if the user is logged in and retreives their information for the profile page
  async function fetchUser() {
    let resObj;
    let res = await fetch("/api/profile_picture");
    resObj = await res.json();
    /*
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
    */
    if (true){
    //if (resObj.session) {
      setProfilePage(
        <div className="profile-page">
          <Navbar user={resObj} />
          <MyProfile />
        </div>
      );
    } else {
      window.location = ("/login");
    }
  }

  return profilePage;
}

export default ProfileCSS;

import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import "../../normalize.css";
import "../../custom.css";
import Navbar from "../Navbar/Navbar";
import NavbarDynamic from "../Navbar/NavbarDynamic";
import ResetPassword from "../LoginSystem/ForgotPasswordRegular";

//Creates the page used for password reset
function ResetPasswordPage(props) {
  let [passwordPage, setPasswordPage] = useState();

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
      console.log("using local object " + resObj);
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
    setPasswordPage(
      <div className="reset-password-page">
        <NavbarDynamic digits={0} user={resObj} instructions={" invisible"} />
        <ResetPassword />
      </div>
    );
  }
  return passwordPage;
}

export default ResetPasswordPage;

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
import LoginRegular from "../LoginSystem/LoginRegular";

//Creates the page used for password reset
function LoginPage(props) {
  let [loginPage, setLoginPage] = useState();

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
    let checkSessionObj;
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
      let checkSession = await fetch("/api/checkSession", options);
      checkSessionObj = await checkSession.json();
    }

    if (!checkSessionObj) {
      localStorage.removeItem("profile");
      setLoginPage(
        <div className="login-page">
          <Navbar digits={0} user={resObj} login={false} />
          <LoginRegular />
        </div>
      );
    } else {
      window.location = "/";
    }
  }

  return loginPage;
}

export default LoginPage;

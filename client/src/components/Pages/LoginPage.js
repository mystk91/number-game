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
    let res = await fetch("/api/profile_picture");
    let resObj = await res.json();
    setLoginPage(
      <div className="login-page">
        <Navbar digits={0} user={resObj} login={false} />
        <LoginRegular />
      </div>
    );
  }

  return loginPage;
}

export default LoginPage;

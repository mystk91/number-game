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
import SignupRegular from "../LoginSystem/SignupRegular";

//Creates the page used for password reset
function SignupPage(props) {
  let [signupPage, setSignupPage] = useState();

  //Runs on mount. Gets users profile pic and starts game
  useEffect(() => {
    fetchUser();
    return () => {};
  }, []);

  async function fetchUser() {
    let res = await fetch("/api/profile_picture");
    let resObj = await res.json();
    setSignupPage(
      <div className="signup-page">
        <Navbar digits={0} user={resObj} />
        <SignupRegular />
      </div>
    );
  }

  return signupPage;
}

export default SignupPage;

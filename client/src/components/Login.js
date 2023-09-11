import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
import "./Login.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";

function Login(props) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  // Used to set the class and hide the modal
  const [displayModal, setDisplayModal] = useState("");

  /* Hides the modal when you click outside the main box */
  function hideLoginModal(e) {
    if (e.target.classList[0] === "login-modal") {
      setDisplayModal(" hide-modal");
    }
  }

  /* Hides the modal when you click on the X */
  function hideLoginButton(e) {
    setDisplayModal(" hide-modal");
  }

  //Used to set the errors that can occur on login.
  const [errUsername, setErrUsername] = useState();
  const [errPassword, setErrPassword] = useState();

  //Handles to lhe login logic 
  async function login(e) {
    e.preventDefault();
    const url = "http://localhost:5000/api/validate";
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    const formDataString = JSON.stringify(formDataObj);
    const options = {
      method: "POST",
      body: formDataString,
      withCredentials: true,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    let res = await fetch(url, options);
    if (res.status == 302) {
      e.target.submit();
    } else {
      let errors = await res.json();
      setErrUsername(<div className="error">{errors.username}</div>);
      setErrPassword(<div className="error">{errors.password}</div>);
    }
  }

  return (
    <div className={"login-modal" + displayModal} onClick={hideLoginModal}>
      <div className="login-box">
        <span className="login-top">
          <button
            className="close-login"
            onClick={(e) => hideLoginButton(e)}
          >
            X
          </button>
        </span>
        <img src="./images/site/siteLogo.png" className="site-logo" />
        <form
          action="http://localhost:5000/api/login"
          method="POST"
          className="login-form"
          onSubmit={(e) => login(e)}
        >
          <div>
            <label for="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
            />
            {errUsername}
          </div>
          <div>
            <label for="current-password">Password</label>
            <input
              id="current-password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            {errPassword}
            <a
              href="/account/recover-password"
              className="recover-password-link"
            >
              Forgot password?
            </a>
          </div>
          <div>
            <button type="submit" className="submit-btn">
              Sign in
            </button>
          </div>
        </form>

        <LoginButton
          href="/login/google"
          className="google"
          imageURL="./images/login-logos/google-logo.jpg"
          buttonText="Sign in with Google"
        />
        <LoginButton
          href="/login/apple"
          className="apple"
          imageURL="./images/login-logos/apple-logo.png"
          buttonText="Sign in with Apple"
        />
        <LoginButton
          href="/login/facebook"
          className="facebook"
          imageURL="./images/login-logos/facebook-logo.jpg"
          buttonText="Sign in with Facebook"
        />

        <div className="signup-cont">
          Not a member?{" "}
          <a href="/signup" className="signup-link">
            Sign up!
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;

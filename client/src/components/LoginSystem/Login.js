import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import "./Login.css";
import "../../normalize.css"
import "../../custom.css";
import LoginOption from "./LoginOption";
import ForgotPassword from "./ForgotPassword";
import Signup from "./Signup";

//Creates a Login Modal
function Login(props) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  //Sets the current screen displayed on the login modal.
  const [currentScreen, setCurrentScreen] = useState("");

  // Used to set the class and hide the modal and component
  const [hideModal, setHideModal] = useState("");
  const [hideComponent, setHideComponent] = useState("");

  /* Hides the modal when you click outside the main box */
  function hideLoginModal(e) {
    if (e.target.classList[0] === "login-modal") {
      setHideComponent(" hide-modal");
    }
  }

  /* Hides the modal when you click on the X */
  function hideModalButton(e) {
    setHideComponent(" hide-modal");
  }

  //Used to set the errors that can occur on login.
  const [errEmail, setErrEmail] = useState();
  const [errPassword, setErrPassword] = useState();

  //Changes the modal to the signup screen
  const signupScreen = <Signup />;
  function getSignupScreen(e) {
    e.preventDefault();
    setHideModal(" hide-modal");
    setCurrentScreen(signupScreen);
  }

  //Changes the modal to the forgot password screen
  const forgotScreen = <ForgotPassword />;
  function getForgotScreen(e) {
    e.preventDefault();
    setHideModal(" hide-modal");
    setCurrentScreen(forgotScreen);
  }

  //Handles to lhe login logic
  async function login(e) {
    e.preventDefault();
    const url = "/api/validate";
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    formDataObj.location = window.location;
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
      let loginURL = "/api/login";
      let resLogin = await fetch(loginURL, options);
      if (resLogin.status == 302) {
        window.location.reload();
      }
      else{
        window.location = "/login";
      }
    } else {
      let errors = await res.json();
      setErrEmail(<div className="error">{errors.email}</div>);
      setErrPassword(<div className="error">{errors.password}</div>);
    }
  }

  return (
    <div className={hideComponent}>
      <div className="sub-modals"> {currentScreen}</div>
      <div className={"login-modal" + hideModal} onMouseDown={hideLoginModal}>
        <div className={"login-box"}>
          <span className="login-top">
            <button className="close-login" onClick={(e) => hideModalButton(e)}>
              X
            </button>
          </span>
          <img src="/images/site/siteLogo.png" className="site-logo" />
          <form
            action="/api/login"
            method="POST"
            className="login-form"
            onSubmit={(e) => login(e)}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          >
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="text" />
              {errEmail}
            </div>
            <div>
              <label htmlFor="current-password">Password</label>
              <input id="current-password" name="password" type="password" />
              {errPassword}
              <a
                href="/forgotPassword"
                className="recover-password-link"
                onClick={(e) => getForgotScreen(e)}
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

          <div className="login-options">
            <LoginOption
              href="/login/google"
              className="google"
              imageURL="/images/login-logos/google-logo.jpg"
              buttonText="Sign in with Google"
            />
            <LoginOption
              href="/login/apple"
              className="apple"
              imageURL="/images/login-logos/apple-logo.png"
              buttonText="Sign in with Apple"
            />
            <LoginOption
              href="/login/facebook"
              className="facebook"
              imageURL="/images/login-logos/facebook-logo.jpg"
              buttonText="Sign in with Facebook"
            />
          </div>

          <div className="signup-cont">
            Not a member?{" "}
            <a
              href="/signup"
              className="signup-link"
              onClick={(e) => getSignupScreen(e)}
            >
              Sign up!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

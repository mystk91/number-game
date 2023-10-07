import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import "./LoginRegular.css";
import "../normalize.css";
import "../custom.css";
import LoginButton from "./LoginButton";

//A non-modal version of the login screen. It links to the other screens instead of creating multiple modals
function LoginRegular(props) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  //Used to set the errors that can occur on login.
  const [errEmail, setErrEmail] = useState();
  const [errPassword, setErrPassword] = useState();

  //Handles to lhe login logic
  async function login(e) {
    e.preventDefault();
    const url = "/api/validate";
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
      setErrEmail(<div className="error">{errors.email}</div>);
      setErrPassword(<div className="error">{errors.password}</div>);
    }
  }

  return (
    <div className={"login-regular"}>
      <div className={"login-box-regular"}>
        <span className="login-top-regular"></span>
        <img src="./images/site/siteLogo.png" className="site-logo" />
        <form
          action="/api/login"
          method="POST"
          className="login-form"
          onSubmit={(e) => login(e)}
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
            <a href="/reset-password" className="recover-password-link">
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
        </div>

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

export default LoginRegular;

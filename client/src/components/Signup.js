import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  Component,
} from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
import "./Signup.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";

function Signup(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  // Used to set the class and hide the modal and the component
  const [hideModal, setHideModal] = useState("");
  const [hideComponent, setHideComponent] = useState("");

  //Used to change the screen when an account is created, display a message.
  const [currentScreen, setCurrentScreen] = useState();

  /* Hides the modal when you click outside the main box */
  function hideSignupModal(e) {
    if (e.target.classList[0] === "signup-modal") {
      setHideModal(" hide-modal");
    }
  }

  /* Hides the modal when you click on the X */
  function hideModalButton(e) {
    setHideModal(" hide-modal");
  }

  //Used to display errors on the form
  const [errEmail, setErrEmail] = useState();
  const [errPassword, setErrPassword] = useState();

  //Attempts to create an account
  async function createAccount(e) {
    e.preventDefault();
    const url = e.target.action;
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    const formDataString = JSON.stringify(formDataObj);
    const options = {
      method: "POST",
      body: formDataString,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(url, options);
    if (res.status == 302) {
      setHideModal(" .hide-modal");
      setCurrentScreen(successScreen);
    } else {
      const errors = await res.json();
      setErrEmail(<div className="error">{errors.email}</div>);
      setErrPassword(<div className="error">{errors.password}</div>);
    }
  }

  let successScreen = (
    <div className="signup-modal">
      <div className="signup-box">
        <div className="signup-success-message">
          An account verification link has been sent to your email.
        </div>
        <button
          type="submit"
          className="submit-btn"
          onClick={() => {
            setHideComponent(" hide-component");
          }}
        >
          Okay!
        </button>
      </div>
    </div>
  );

  return (
    <div className={hideComponent}>
      <div className="sub-modals">{currentScreen}</div>
      <div className={"signup-modal" + hideModal}>
        <div className={"signup-box"}>
          <span className="signup-top">
            <button
              className="close-signup"
              onClick={(e) => hideModalButton(e)}
            >
              X
            </button>
          </span>
          <div className="signup-label">Create an account</div>
          <form
            action="/api/create-account"
            method="post"
            className="signup-form"
            onSubmit={(e) => createAccount(e)}
          >
            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="text" maxLength={32} />
              {errEmail}
            </div>
            <div className="form-input">
              <label htmlFor="current-password">Password</label>
              <input
                id="current-password"
                name="password"
                type="password"
                maxLength={16}
              />
              {errPassword}
            </div>
            <div>
              <button type="submit" className="submit-btn">
                Sign up!
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;

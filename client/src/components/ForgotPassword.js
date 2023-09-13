import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
import "./ForgotPassword.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";

function ForgotPassword(props) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  // Used to set the class and hide the modal and box
  const [hideModal, setHideModal] = useState("");
  const [hideComponent, setHideComponent] = useState("");

  /* Hides the modal when you click outside the main box */
  function hideForgotModal(e) {
    if (e.target.classList[0] === "forgot-modal") {
      setHideModal(" hide-modal");
    }
  }

  /* Hides the modal when you click on the X */
  function hideForgotButton(e) {
    setHideModal(" hide-modal");
  }

  //Used to change the screen when a password reset is sent.
  const [currentScreen, setCurrentScreen] = useState();

  //Used to set the errors that occur if email address doesn't exist.
  const [errUsername, setErrUsername] = useState();

  //Checks if the email address exists and sends a password reset it if does
  async function forgotPasswordSubmit(e) {
    e.preventDefault();
    const url = "/api/forgot-password";
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
      setCurrentScreen(successScreen);
      setHideModal(" .hide-modal");
    } else {
      let errors = await res.json();
      setErrUsername(<div className="error">{errors.username}</div>);
    }
  }

  //Creates a screen that pops up after a valid email is submitted
  let successScreen = (
    <div className="forgot-modal">
      <div className="forgot-box">
        <div className="forgot-success-message">
          A password reset link has been sent to your email.
        </div>
        <button
          type="submit"
          className="submit-btn"
          onClick={() => setHideComponent(" hide-component")}
        >
          Okay!
        </button>
      </div>
    </div>
  );

  return (
    <div className={hideComponent}>
      <div className="sub-modals">{currentScreen}</div>
      <div className={"forgot-modal" + hideModal}>
        <div className={"forgot-box"}>
          <span className="forgot-top">
            <button
              className="close-login"
              onClick={(e) => hideForgotButton(e)}
            >
              X
            </button>
          </span>
          <div className="reset-label">Reset your password</div>
          <form
            method="POST"
            className="forgot-form"
            onSubmit={(e) => forgotPasswordSubmit(e)}
          >
            <div>
              <label htmlFor="username">Email</label>
              <input id="username" name="username" type="text" />
              {errUsername}
            </div>
            <div>
              <button type="submit" className="submit-btn">
                Send Password Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

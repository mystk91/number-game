import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
import "./ForgotPasswordRegular.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

//A non-modal version of the forgot password screen.
function ForgotPassword(props) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    inputReference.current.focus();
    return () => {};
  }, []);

  //Used to give focus to the form input on load
  const inputReference = useRef(null);

  //Used to keep track of the inputed values
  const [emailValue, setEmailValue] = useState();

  //Used to display Email input errors
  function displayEmailErrors() {
    let emailRegExp = new RegExp(
      "^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$"
    );
    if (!emailRegExp.test(emailValue)) {
      setErrEmail(<div className="error">Invalid email address</div>);
      return false;
    } else {
      setErrEmail();
      return true;
    }
  }

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
  const [errEmail, setErrEmail] = useState();

  //Checks if the email address exists and sends a password reset it if does
  async function forgotPasswordSubmit(e) {
    e.preventDefault();
    setHideModal(" hide-modal");
    setCurrentScreen(loadingScreen);
    let noEmailErrors = displayEmailErrors();
    if (noEmailErrors) {
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
      if (res.status == 200) {
        setCurrentScreen(successScreen);
      } else {
        setCurrentScreen();
        let errors = await res.json();
        setErrEmail(<div className="error">{errors.email}</div>);
        setHideModal("");
      }
    }
  }

  //Creates a screen that pops up after a valid email is submitted
  let successScreen = (
    <div className="forgot-regular">
      <div className="forgot-box">
        <div className="forgot-success-message">
          A password reset link has been sent to your email.
        </div>
      </div>
    </div>
  );

  //Appears when the password reset is processsing
  let loadingScreen = (
    <div className="loading-reset-password">
      <LoadingIcon />
    </div>
  );
  

  return (
    <div className={hideComponent}>
      <div className="sub-modals">{currentScreen}</div>
      <div className={"forgot-regular" + hideModal}>
        <div className={"forgot-box-regular"}>
          <span className="forgot-top-regular"></span>
          <div className="reset-label">Reset your password</div>
          <form
            method="POST"
            className="forgot-form"
            onSubmit={(e) => forgotPasswordSubmit(e)}
          >
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="text"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                onBlur={displayEmailErrors}
                ref={inputReference}
              />
              {errEmail}
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

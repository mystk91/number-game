import React, { useState, useEffect, useRef } from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
import "./EmailVerification.css";
import "../normalize.css";
import "../custom.css";
import { useParams } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

//The component that appears when you click on a email verification link.
function EmailVerification(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  const [currentScreen, setCurrentScreen] = useState();

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    checkVerification();
    return () => {};
  }, []);

  //Checks if the email verification is valid, updates the visible screens accordingly
  function checkVerification() {
    //setCurrentScreen(loadingScreen);
    setCurrentScreen(failureScreen);
  }

  let loadingScreen = (
    <div className="loading-verification">
      <LoadingIcon />
    </div>
  );

  let successScreen = (
    <div className="verify-success">
      <div className="verify-success-container">
        <div className="verify-success-message">Your account has been created!</div>
        <a href="/login">
          <button className="submit-btn">Continue to Login</button>
        </a>
      </div>
    </div>
  );

  let failureScreen = (
    <div className="verify-failure">
      <div className="verify-failure-container">
        <div className="verify-failure-message">This verification code does not exist or has expired.</div>
      </div>
    </div>
  );

  return currentScreen;
}

export default EmailVerification;

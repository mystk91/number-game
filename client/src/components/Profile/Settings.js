import React, { useState, useEffect, useRef } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";
import ChangeUsername from "./ChangeUsername";
import DeleteAccount from "./DeleteAccount";
import ResetPassword from "../LoginSystem/ForgotPassword";

//Lets user change email, password, and username, premium status
function Settings(props) {
  const [username, setUsername] = useState(props.username);
  const [modal, setModal] = useState();
  const [randomMode, setRandomMode] = useState();

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    checkRandomMode();
    return () => {};
  }, []);

  function checkRandomMode() {
    if (props.premium) {
      setRandomMode(
        <div className="change-settings">
          <div>You have purchased Random Mode</div>
        </div>
      );
    } else {
      setRandomMode(
        <div className="change-settings no-random">
          <div>You don't have Random Mode</div>
          <a href="/products/random-mode">
            <button className="random-modal-btn sign-up">Sign me up!</button>
          </a>
        </div>
      );
    }
  }

  return (
    <div className="account-settings" aria-label="Settings Container">
      {modal}
      <h1>Account Settings</h1>
      <main>
        <div
          className="settings-option-container"
          aria-label="Username Setting"
        >
          <div className="settings-option username">
            <div>Username</div>
          </div>
          <div className="change-settings">
            <div className="username">{username}</div>
            <button
              className="change-username-btn"
              onClick={() => {
                setModal(<ChangeUsername user={props.user} key={new Date()} />);
              }}
            >
              Change Username
            </button>
            <div className="username-info"></div>
          </div>
        </div>

        <div
          className="settings-option-container"
          aria-label="Password Setting"
        >
          <div className="settings-option">
            <div>Password</div>
          </div>
          <div className="change-settings">
            <button
              className="change-password-btn"
              onClick={() => {
                setModal(<ResetPassword key={new Date()} />);
              }}
            >
              Change Password
            </button>
          </div>
        </div>

        <div
          className="settings-option-container"
          aria-label="Random Mode Info"
        >
          <div className="settings-option">
            <div>Random Mode</div>
          </div>
          {randomMode}
        </div>

        <div
          className="settings-option-container"
          aria-label="Delete Account Setting"
        >
          <div className="settings-option">
            <div>Delete Your Account</div>
          </div>
          <div className="change-settings delete-account">
            <div>Want to delete your account?</div>
            <button
              className="delete-account-btn"
              onClick={() => {
                setModal(<DeleteAccount user={props.user} key={new Date()} />);
              }}
            >
              Start Here
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;

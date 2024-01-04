import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";
import ChangeUsername from "./ChangeUsername";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";
import ResetPassword from "../LoginSystem/ForgotPassword";

//Lets user change email, password, and username, premium status
function Settings(props) {
  const [username, setUsername] = useState(props.username);
  const [changeUsername, setChangeUsername] = useState();
  const [changePassword, setChangePassword] = useState();
  const [deleteAccount, setDeleteAccount] = useState();
  const [randomMode, setRandomMode] = useState();

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    checkRandomMode();
    return () => {};
  }, []);

  function checkRandomMode() {
    if (props.premium) {
      setRandomMode(<div className="change-settings"><div><span className="inline">You have purchased</span> <span className="inline">Random Mode</span></div></div>);
    } else {
      setRandomMode(
        <div className="change-settings no-random">
          <div><span className="inline">You don't have</span> <span className="inline">Random Mode</span></div>
          <a href="/products/random-mode" >
            <button className="random-modal-btn sign-up">Sign me up!</button>
          </a>
        </div>
      );
    }
  }

  return (
    <div className="account-settings">
      <h1>Account Settings</h1>
      <main>
        <div className="settings-option-container">
          <div className="settings-option username"><div>Username</div></div>
          <div className="change-settings">
            <div className="username">{username}</div>
            <button
              className="change-username-btn"
              onClick={() => {
                setChangeUsername(<ChangeUsername user={props.user} key={new Date()} />);
              }}
            >
              Change Username
            </button>
            <div className="username-info"></div>
          </div>
          {changeUsername}
        </div>

        <div className="settings-option-container">
          <div className="settings-option"><div>Password</div></div>
          <div className="change-settings">
            <button
              className="change-password-btn"
              onClick={() => {
                setChangePassword(<ResetPassword key={new Date()} />);
                //setChangePassword(<ChangePassword user={props.user} key={new Date()} />);
              }}
            >
              Change Password
            </button>
          </div>
          {changePassword}
        </div>

        <div className="settings-option-container">
          <div className="settings-option"><div>Random Mode</div></div>
          {randomMode}
        </div>

        <div className="settings-option-container">
          <div className="settings-option"><div>Delete Your Account</div></div>
          <div className="change-settings delete-account">
            <div><span className="inline">Want to delete</span> <span className="inline">your account?</span></div>
            <button
              className="delete-account-btn"
              onClick={() => {
                setDeleteAccount(<DeleteAccount user={props.user} key={new Date()} />);
              }}
            >
              Start Here
            </button>
            {deleteAccount}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Settings;

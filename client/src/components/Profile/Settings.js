import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";
import ChangeUsername from "./ChangeUsername";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";

//Lets user change email, password, and username, premium status
function Settings(props) {
  const [username, setUsername] = useState(props.username);
  const [changeUsername, setChangeUsername] = useState();
  const [changePassword, setChangePassword] = useState();
  const [deleteAccount, setDeleteAccount] = useState();

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="account-settings">
      <h1>Account Settings</h1>

      <div className="settings-option-container">
        <div className="settings-option">Username</div>
        <div className="change-settings">
          <div className="your-username">{username}</div>
          <button
            className="change-username-btn"
            onClick={() => {
              setChangeUsername(<ChangeUsername user={props.user} />);
            }}
          >
            Change Username
          </button>
          <div className="username-info"></div>
        </div>
        {changeUsername}
      </div>

      <div className="settings-option-container">
        <div className="settings-option">Password</div>
        <div className="change-settings">
          <div></div>
          <button
            className="change-password-btn"
            onClick={() => {
              setChangePassword(<ChangePassword user={props.user} />);
            }}
          >
            Change Password
          </button>
        </div>
        {changePassword}
      </div>

      <div className="settings-option-container">
        <div className="settings-option">Delete Your Account</div>
        <div className="change-settings">
          <div>Want to delete your account?</div>
          <button
            className="delete-account-btn"
            onClick={() => {
              setDeleteAccount(<DeleteAccount user={props.user} />);
            }}
          >Start Here</button>
          {deleteAccount}
        </div>
      </div>
      
    </div>
  );
}

export default Settings;

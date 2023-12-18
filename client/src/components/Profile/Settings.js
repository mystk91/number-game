import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";
import ChangeUsername from "./ChangeUsername";

//Lets user change email, password, and username, premium status
function Settings(props) {
  const [username, setUsername] = useState(props.username);
  const [changeUsername, setChangeUserName] = useState();

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
          <button className="change-username" onClick={()=>{setChangeUserName(<ChangeUsername user={props.user} />)}}>
            Change Username
          </button>
          <div className="username-info"></div>
        </div>
        {changeUsername}
      </div>


      <div className="settings-option-container">


      </div>






    </div>
  );
}

export default Settings;

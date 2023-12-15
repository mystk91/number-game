import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProfileComponents.css";
import "../../normalize.css";
import "../../custom.css";

//Lets user change email, password, and username, premium status
function Settings(props) {

  
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {

    return () => {};
  }, []);

  return <div className="account-settings">
    This is the account settings panel.
  </div>;
}

export default Settings;

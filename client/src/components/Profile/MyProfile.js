import React, { useState, useEffect, useRef, useCallback } from "react";
import "./MyProfile.css";
import "../../normalize.css";
import "../../custom.css";
import Settings from "./Settings";
import Statistics from "./Statistics";
import Contact from "./Contact";

//A component that holds other components associated with account information, setting, and statistics
//    props.user - which the page retrieves on load
//    props.stats - inserts game statistics into Statistics component, a statObj
//    props.username - their username, also part of props.user
//    props.premium - true if they have purchased random mode
function MyProfile(props) {
  const statsTab = <Statistics user={props.user} stats={props.stats} premium={props.premium} key="statsTab"/>;
  const [activeTab, setActiveTab] = useState(statsTab);
  const [username, setUsername] = useState(props.username);

  //Used to give the buttons an effect indicating they are clicked
  const [activeButton, setActiveButton] = useState({
    statistics: " active",
    settings: "",
    contact: "",
  });

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    if (props.tabName) {
      switchTab(props.tabName);
    }
    return () => {};
  }, []);

  //Used to switch tabs
  function switchTab(tabName) {
    switch (tabName) {
      case "settings": {
        setActiveTab(<Settings user={props.user} />);
        setActiveButton({
          statistics: "",
          settings: " active",
          contact: "",
        });
        break;
      }
      case "statistics": {
        setActiveTab(statsTab);
        setActiveButton({
          statistics: " active",
          settings: "",
          contact: "",
        });
        break;
      }
      case "contact": {
        setActiveTab(<Contact />);
        setActiveButton({
          statistics: "",
          settings: "",
          contact: " active",
        });
        break;
      }
      default: {
        setActiveTab(statsTab);
        setActiveButton({
          statistics: " active",
          settings: "",
          contact: "",
        });
      }
    }
  }

  return (
    <div className="profile">
      <div className="profile-tabs-container">
        <div className="username-tab">
          <div className="username-container">{username}</div>
        </div>
        <ul className="profile-tabs">
          <li>
            <button
              className={"statistics-tab" + activeButton[`statistics`]}
              onClick={() => {
                switchTab("statistics");
              }}
            >
              <img
                src="./images/account/icons/stats-icon.svg"
                alt="statistics icon"
                width="56px"
              />
              <label className="tab-button-label">Statistics</label>
            </button>
          </li>
          <li>
            <button
              className={"settings-tab" + activeButton[`settings`]}
              onClick={() => {
                switchTab("settings");
              }}
            >
              <img
                src="./images/account/icons/settings-icon.svg"
                alt="settings icon"
                width="56px"
              />
              <label className="tab-button-label">Settings</label>
            </button>
          </li>
          <li>
            <button
              className={"contact-tab" + activeButton[`contact`]}
              onClick={() => {
                switchTab("contact");
              }}
            >
              <img
                src="./images/account/icons/contact-icon.svg"
                alt="contact icon"
                width="56px"
              />
              <label className="tab-button-label">Contact</label>
            </button>
          </li>
        </ul>
      </div>

      <div className="active-tab">{activeTab}</div>
    </div>
  );
}

export default MyProfile;

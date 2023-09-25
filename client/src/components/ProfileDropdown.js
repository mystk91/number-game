import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import uniqid from "uniqid";
import "./ProfileDropdown.css";
import "../normalize.css";
import "../custom.css";

//A dropdown menu that will only appear if the user is logged in
// Props: (hidden = true) - the menu will be hidden. this is used for animating the dropdown
function ProfileDropdown(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  const [profileDropdown, setProfileDropdown] = useState();

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    if (props.hidden === "true") {
      setProfileDropdown(dropdownHidden);
    } else {
      setProfileDropdown(dropdownVisible);
    }
    return () => {};
  }, []);

  //Logs the user out
  function logout(){

  }

  let dropdownVisible = (
    <ul className="profile-dropdown visible">
      <li>
        <a href="/profile">My Profile</a>
      </li>
      <li>
        <a onClick={logout} className="logout-link">Logout</a>
      </li>
    </ul>
  );

  let dropdownHidden = (
    <ul className="profile-dropdown hidden">
      <li>
        <a href="/profile">My Profile</a>
      </li>
      <li>
        <a href="/api/logout" className="logout-link">Logout</a>
      </li>
    </ul>
  );

  return profileDropdown;
}

export default ProfileDropdown;

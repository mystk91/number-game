import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import "../../normalize.css";
import "../../custom.css";
import Navbar from "../Navbar/Navbar";
import NumberGameRegular from "../Game/NumberGameRegular";

//Creates a standard page for the website that displays the navbar and the game
function GamePageRegular(props) {
  return (
    <div className="game-page">
      <Navbar digits={props.digits} />
      <NumberGameRegular digits={props.digits} attempts={props.attempts} />
    </div>
  );
}

export default GamePageRegular;

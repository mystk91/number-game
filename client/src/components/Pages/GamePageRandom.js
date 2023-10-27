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
import NumberGameRandom from "../Game/NumberGameRandom";

//Creates a standard page for the website that displays the navbar and the game
function GamePage(props) {
  return (
    <div className="game-page">
      <Navbar digits={props.digits} />
      <NumberGameRandom digits={props.digits} attempts={props.attempts} />
    </div>
  );
}

export default GamePage;

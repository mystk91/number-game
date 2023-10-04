import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import "../normalize.css";
import "../custom.css";
import Navbar from "./Navbar";
import NumberGame from "./NumberGame";

//Creates a standard page for the website that displays the navbar and the game
function GamePage(props) {
  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    document.title = "Numblr - " + props.digits + " Digits";

    return () => {};
  }, []);

  return (
    <div className="game-page">
      <Navbar />
      <NumberGame digits={props.digits} attempts={props.attempts} />
    </div>
  );
}

export default GamePage;

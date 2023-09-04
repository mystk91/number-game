import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import update from "immutability-helper";
import uniqid from "uniqid";
//import logo from './logo.svg';
//import { SomeContext } from "../App";
//Rename all Boilerplate as your new Component
import "./Navbar.css";
import "../normalize.css";
import "../custom.css";
import { Link } from "react-router-dom";
//import styled, { css, ThemeProvider } from 'styled-components';

function Navbar(props) {
  const [property, setProperty] = useState("initialValue");
  const propRef = useRef("initialValue");
  function setPropRef(point) {
    propRef.current = point;
  }

  //componentDidMount, runs when component mounts, then componentDismount
  useEffect(() => {
    return () => {};
  }, []);
  //componentDidUpdate, runs after render
  useEffect(() => {}, [property]);
  //componentDismount
  useEffect(() => {
    return () => {};
  });

  return (
    <nav className="navigation-bar">
      <div className="game-modes">
        <label>Game Modes</label>
        <ul className="game-modes-list">
          <li>
            <a href="/2digits">2 Digits</a>
          </li>
          <li>
            <a href="/3digits">3 Digits</a>
          </li>
          <li>
            <a href="/4digits">4 Digits</a>
          </li>
          <li>
            <a href="/5digits">5 Digits</a>
          </li>
          <li>
            <a href="/6digits">6 Digits</a>
          </li>
          <li>
            <a href="/7digits">7 Digits</a>
          </li>
        </ul>
      </div>

      <div className="logo">Numblr</div>

      <ul className="tools">

      </ul>
    </nav>
  );
}

export default Navbar;

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
//export const SomeContext = createContext('defaultValue');
import "./normalize.css";
import "./custom.css";
import "./App.css";
import NumberGame from "./components/NumberGame";
import Navbar from "./components/Navbar";
import GamePage from "./components/GamePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import styled, { css } from 'styled-components';

function App() {
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
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/" element={<GamePage digits={4} attempts={6} />} />
          <Route
            path="/2digits"
            element={<GamePage digits={2} attempts={6} />}
          />
          <Route
            path="/3digits"
            element={<GamePage digits={3} attempts={6} />}
          />
          <Route
            path="/4digits"
            element={<GamePage digits={4} attempts={6} />}
          />
          <Route
            path="/5digits"
            element={<GamePage digits={5} attempts={6} />}
          />
          <Route
            path="/6digits"
            element={<GamePage digits={6} attempts={6} />}
          />
          <Route
            path="/7digits"
            element={<GamePage digits={7} attempts={6} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

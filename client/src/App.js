import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import "./normalize.css";
import "./custom.css";
import "./App.css";
import NumberGame from "./components/NumberGame";
import Navbar from "./components/Navbar";
import GamePage from "./components/GamePage";
import Instructions from "./components/Instructions";
import Login from "./components/Login";
import LoginRegular from "./components/LoginRegular";
import Signup from "./components/Signup";
import SignupRegular from "./components/SignupRegular";
import ForgotPassword from "./components/ForgotPassword";
import ForgotPasswordRegular from "./components/ForgotPasswordRegular";
import NewPasswordPage from "./components/ResetPassword-Page";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
          <Route
            path="/new-password/:verificationCode"
            element={<NewPasswordPage />}
          />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/login" element={<LoginRegular />} />
          <Route path="/signup" element={<SignupRegular />} />
          <Route path="/reset-password" element={<ForgotPasswordRegular />} />
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

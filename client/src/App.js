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
import NumberGame from "./components/Game/NumberGame";
import Navbar from "./components/Navbar/Navbar";
import GamePage from "./components/Pages/GamePage";
import GamePageRandom from "./components/Pages/GamePageRandom";
import GamePageRegular from "./components/Pages/GamePageRegular";
import Instructions from "./components/Navbar/Instructions";
import InstructionsFive from "./components/Navbar/InstructionsFive";
import Login from "./components/LoginSystem/Login";
import LoginRegular from "./components/LoginSystem/LoginRegular";
import Signup from "./components/LoginSystem/Signup";
import SignupRegular from "./components/LoginSystem/SignupRegular";
import ForgotPassword from "./components/LoginSystem/ForgotPassword";
import ForgotPasswordRegular from "./components/LoginSystem/ForgotPasswordRegular";
import NewPasswordPage from "./components/Pages/NewPasswordPage";
import EmailVerification from "./components/LoginSystem/EmailVerification";
import LoadingIcon from "./components/Parts/LoadingIcon";
import Histogram from "./components/Game/Histogram";
import ShareScore from "./components/Game/ShareScore";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/share"
            element={
              <ShareScore
                hints={["XXYXH", "GXYXH", "GYYXL", "GGGGE", "", ""]}
              />
            }
          />
          <Route path="/hist" element={<Histogram digits={4} attempts={6} />} />
          <Route
            path="/new-password/:verificationCode"
            element={<NewPasswordPage />}
          />
          <Route path="/icon" element={<LoadingIcon />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/five" element={<InstructionsFive />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/login" element={<LoginRegular />} />
          <Route path="/signup" element={<SignupRegular />} />
          <Route
            path="/verify-email/:verificationCode"
            element={<EmailVerification />}
          />
          <Route path="/reset-password" element={<ForgotPasswordRegular />} />
          <Route path="/" element={<GamePage digits={5} attempts={6} />} />
          <Route path="/regular" element={<GamePageRegular digits={6} attempts={6} />} />
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

          <Route
            path="/2random"
            element={<GamePageRandom digits={2} attempts={6} />}
          />
          <Route
            path="/3random"
            element={<GamePageRandom digits={3} attempts={6} />}
          />
          <Route
            path="/4random"
            element={<GamePageRandom digits={4} attempts={6} />}
          />
          <Route
            path="/5random"
            element={<GamePageRandom digits={5} attempts={6} />}
          />
          <Route
            path="/6random"
            element={<GamePageRandom digits={6} attempts={6} />}
          />
          <Route
            path="/7random"
            element={<GamePageRandom digits={7} attempts={6} />}
          />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

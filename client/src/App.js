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
import SignupPage from "./components/Pages/SignupPage";
import LoginPage from "./components/Pages/LoginPage";
import GamePageRandom from "./components/Pages/GamePageRandom";
import GamePageRegular from "./components/Pages/GamePageRegular";
import NumberGameLocal from "./components/Game/NumberGameLocal";
import Instructions from "./components/Navbar/Instructions";
import InstructionsFive from "./components/Navbar/InstructionsFive";
import Login from "./components/LoginSystem/Login";
import LoginRegular from "./components/LoginSystem/LoginRegular";
import Signup from "./components/LoginSystem/Signup";
import SignupRegular from "./components/LoginSystem/SignupRegular";
import ForgotPassword from "./components/LoginSystem/ForgotPassword";
import ForgotPasswordRegular from "./components/LoginSystem/ForgotPasswordRegular";
import ResetPasswordPage from "./components/Pages/ResetPasswordPage";
import NewPasswordPage from "./components/Pages/NewPasswordPage";
import EmailVerification from "./components/LoginSystem/EmailVerification";
import LoadingIcon from "./components/Parts/LoadingIcon";
import Histogram from "./components/Game/Histogram";
import ShareScore from "./components/Game/ShareScore";
import LeaderboardsPage from "./components/Pages/LeaderboardsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NumberGameRegular from "./components/Game/NumberGameRegular";
import GamePageDaily from "./components/Pages/GamePageDaily";

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
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/icon" element={<LoadingIcon />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/five" element={<InstructionsFive />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/verify-email/:verificationCode"
            element={<EmailVerification />}
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/regular"
            element={<GamePageRegular digits={6} attempts={6} />}
          />
          <Route
            path="/local"
            element={<NumberGameLocal digits={5} attempts={6} />}
          />
          <Route
            path="/old2"
            element={<GamePage digits={2} attempts={6} />}
          />
          <Route
            path="/old3"
            element={<GamePage digits={3} attempts={6} />}
          />
          <Route
            path="/old4"
            element={<GamePage digits={4} attempts={6} />}
          />
          <Route
            path="/old5"
            element={<GamePage digits={5} attempts={6} />}
          />
          <Route
            path="/old6"
            element={<GamePage digits={6} attempts={6} />}
          />
          <Route
            path="/old7"
            element={<GamePage digits={7} attempts={6} />}
          />

          <Route
            path="/digits2"
            element={<GamePageDaily digits={2} attempts={6} />}
          />
          <Route
            path="/digits3"
            element={<GamePageDaily digits={3} attempts={6} />}
          />
          <Route
            path="/digits4"
            element={<GamePageDaily digits={4} attempts={6} />}
          />
          <Route path="/" element={<GamePageDaily digits={5} attempts={6} />} />
          <Route
            path="/digits5"
            element={<GamePageDaily digits={5} attempts={6} />}
          />
          <Route
            path="/digits6"
            element={<GamePageDaily digits={6} attempts={6} />}
          />
          <Route
            path="/digits7"
            element={<GamePageDaily digits={7} attempts={6} />}
          />

          <Route
            path="/random2"
            element={<GamePageRandom digits={2} attempts={6} />}
          />
          <Route
            path="/random3"
            element={<GamePageRandom digits={3} attempts={6} />}
          />
          <Route
            path="/random4"
            element={<GamePageRandom digits={4} attempts={6} />}
          />
          <Route
            path="/random5"
            element={<GamePageRandom digits={5} attempts={6} />}
          />
          <Route
            path="/random6"
            element={<GamePageRandom digits={6} attempts={6} />}
          />
          <Route
            path="/random7"
            element={<GamePageRandom digits={7} attempts={6} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./components/Pages/SignupPage";
import LoginPage from "./components/Pages/LoginPage";
import LoginComplete from "./components/Pages/LoginComplete";
import GamePageRandom from "./components/Pages/GamePageRandom";
import NumberGameLocal from "./components/Game/NumberGameLocal";
import ResetPasswordPage from "./components/Pages/ResetPasswordPage";
import NewPasswordPage from "./components/Pages/NewPasswordPage";
import EmailVerification from "./components/LoginSystem/EmailVerification";
import LeaderboardsPage from "./components/Pages/LeaderboardsPage";
import GamePageDaily from "./components/Pages/GamePageDaily";
import ProfilePage from "./components/Pages/ProfilePage";
import StorePage from "./components/Pages/StorePage";
import StoreSuccessPage from "./components/Pages/StoreSuccessPage";
import Homepage from "./components/Pages/Homepage";
import SiteMessagePage from "./components/Pages/SiteMessagePage";
import Privacy from "./components/Policy/Privacy";
import Refund from "./components/Policy/Refund";

function App() {
  return (
    <div className="Numbler">
      <BrowserRouter>
        <Routes>
          <Route
            path="/new-password/:verificationCode"
            element={<NewPasswordPage />}
          />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/complete" element={<LoginComplete />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/verify-email/:verificationCode"
            element={<EmailVerification />}
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
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
          <Route path="/" element={<Homepage />} />
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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/products/random-mode" element={<StorePage />} />

          <Route
            path="/products/random-mode/success"
            element={<StoreSuccessPage />}
          />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/refund-policy" element={<Refund />} />
          <Route
            path="*"
            element={
              <SiteMessagePage
                message={"You went somewhere that doesn't exist."}
                buttonText={"Oops!"}
                buttonUrl="/"
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

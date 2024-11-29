import { useState } from "react";
import "./App.css";
import Home from "./components/Home.jsx";
import NavBar from "./components/NavBar";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <BrowserRouter>
      <NavBar
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
      />

      <Routes>
        <Route
          path="/login"
          element={
            <Login
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
            />
          }
          wallet={walletAddress}
          setWallet={setWalletAddress}
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              walletAddress={walletAddress}
              setWalletAddress={setWalletAddress}
            />
          }
        />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

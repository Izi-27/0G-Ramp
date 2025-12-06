import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "./lib/wagmi";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import OnRamp from "./pages/OnRamp";
import OffRamp from "./pages/OffRamp";
import Transactions from "./pages/Transactions";
import Developers from "./pages/Developers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InitialLoader } from "./components/InitialLoader";

const queryClient = new QueryClient();

function RootApp() {
  const [showContent, setShowContent] = useState(false);

  const handleLoadComplete = () => {
    setShowContent(true);
  };

  return (
    <>
      <InitialLoader onLoadComplete={handleLoadComplete} />
      {showContent && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onramp" element={<OnRamp />} />
            <Route path="/offramp" element={<OffRamp />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/developers" element={<Developers />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({ accentColor: "#FF4FD8" })}>
          <RootApp />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

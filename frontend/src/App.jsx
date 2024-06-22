import React, { useState, useEffect, useRef } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Desktop from "./Coponents/Pages/Desktop";
import socket from "./functions/socket";
import "./App.css";
const { v4: uuidv4 } = require("uuid");

const App = () => {
  const [clientId] = useState(uuidv4());
  const [message, setMessage] = useState("");

  const [processComplete, setProcessComplete] = useState(false);

  useEffect(() => {
    // Define socket event handlers
    const setupSocketEventHandlers = () => {
      socket.on("connect", () => {
        console.log("Connected to the server with socket ID:", socket.id);
        console.log("Registering user with ID:", clientId);
        socket.emit("register", clientId);
      });

      socket.on("processingComplete", (resultDir) => {
        console.log("Processing complete with result directory:", resultDir);
        setProcessComplete(true);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from the server");
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      socket.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });
    };

    setupSocketEventHandlers();

    return () => {
      // Clean up the socket event handlers
      console.log("Cleaning up socket listeners");
      socket.off("connect");
      socket.off("processingComplete");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect_attempt");
    };
  }, [clientId]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Desktop clientId={clientId} processComplete={processComplete} />
            }
          />
        </Routes>
      </BrowserRouter>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default App;

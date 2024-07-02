import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Desktop from "./Coponents/Pages/Desktop";
import socket from "./functions/socket";
import "./App.css";
const { v4: uuidv4 } = require("uuid");

const App = () => {
  const [clientId] = useState(uuidv4());

  useEffect(() => {
    // Define socket event handlers
    const setupSocketEventHandlers = () => {
      socket.on("connect", () => {
        console.log("Connected to the server with socket ID:", socket.id);
        console.log("Registering user with ID:", clientId);
        socket.emit("register", clientId);
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
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Desktop clientId={clientId} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

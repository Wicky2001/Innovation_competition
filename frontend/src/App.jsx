import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Desktop from "./Coponents/Pages/Desktop";
import { io } from "socket.io-client";

import "bootstrap/dist/css/bootstrap.min.css";
const { v4: uuidv4 } = require("uuid");

const App = () => {
  const [clientId] = useState(uuidv4());
  const [message, setMessage] = useState("");
  const socket = useRef(null);

  const [processComplete, setProcessComplete] = useState(false);

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io("http://localhost:5001", {
      transports: ["websocket"], // Force WebSocket
      reconnectionAttempts: 5, // Retry up to 5 times
      reconnectionDelay: 2000, // Wait for 2 seconds before attempting reconnection
    });

    // Define socket event handlers
    const setupSocketEventHandlers = () => {
      socket.current.on("connect", () => {
        console.log(
          "Connected to the server with socket ID:",
          socket.current.id
        );
        console.log("Registering user with ID:", clientId);
        socket.current.emit("register", clientId);
      });

      socket.current.on("processingComplete", (resultDir) => {
        console.log("Processing complete with result directory:", resultDir);

        setProcessComplete(true);
      });

      socket.current.on("disconnect", () => {
        console.log("Disconnected from the server");
      });

      socket.current.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      socket.current.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });
    };

    setupSocketEventHandlers();

    return () => {
      // Clean up the socket event handlers
      console.log("Cleaning up socket listeners");
      socket.current.off("connect");
      socket.current.off("processingComplete");
      socket.current.off("disconnect");
      socket.current.off("connect_error");
      socket.current.off("reconnect_attempt");
      socket.current.disconnect();
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

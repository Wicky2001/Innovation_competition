const { v4: uuidv4 } = require("uuid");
import socket from "./socket";

// Listen for the 'processingComplete' event from the server

socket.on("connect", () => {
  const userId = uuidv4();
  console.log("Connected to the server");
  socket.emit("register", userId);
});

socket.on("processingComplete", (resultDir) => {
  console.log(resultDir);
  const messageDiv = document.getElementById("message");
  messageDiv.innerHTML = `Processing complete. <a href="/download-results">Download results</a>`;
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});

import socket from "./socket";

const { v4: uuidv4 } = require("uuid");

// Listen for the 'processingComplete' event from the server

socket.on("connect", () => {
  const userId = uuidv4();
  console.log("Web socket is established");
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

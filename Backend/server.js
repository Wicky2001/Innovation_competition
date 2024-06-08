// server.js
const fs = require('fs'); // Import the core fs module
const fsPromises = require('fs').promises;  // Import fsPromises.promises directly
const path = require('path');
const multer = require("multer");
const archiver = require('archiver');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/dpn",(req,res)=>{

  
})


// Start the server
app.listen(5001, () => {
  console.log(`Server started...`);
});
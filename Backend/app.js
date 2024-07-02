const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const archiver = require("archiver");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const corsOptions = {
  origin: "*", // Change to specific origins as needed
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const baseDirectory = "./PDF/";
let connectedClients = {}; // Store connected clients

let chatDirectoryPath;
let chatDirectoryName;
let reports_location;
let zipFilePath = null;

// Custom middleware to create directories and set destination directory for multer
async function createInnerDirectoriesMiddleware(req, res, next) {
  if (req.path === "/upload_files" && req.method === "POST") {
    try {
      const chatDir = await createChatDirectory();
      if (!chatDir) throw new Error("Chat directory not created.");
      const innerDirs = await createInnerDirectories(chatDir);
      req.innerDirectories = innerDirs;
      next();
    } catch (error) {
      console.error("Error creating inner directories:", error);
      res.status(500).json({ error: "Error creating inner directories" });
    }
  } else {
    next();
  }
}

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      let destinationDir;
      if (file.fieldname === "markingSchemeFiles") {
        destinationDir = req.innerDirectories.directories[0];
      } else if (file.fieldname === "answerSheetFiles") {
        destinationDir = req.innerDirectories.directories[1];
      }
      cb(null, destinationDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

async function createChatDirectory() {
  const uniqueDirectoryName = `chat_${Date.now()}`;
  const fullChatDirectoryPath = path.join(
    __dirname,
    baseDirectory,
    uniqueDirectoryName
  );
  chatDirectoryPath = fullChatDirectoryPath;
  chatDirectoryName = uniqueDirectoryName;
  try {
    await fsPromises.mkdir(fullChatDirectoryPath);
    return fullChatDirectoryPath;
  } catch (error) {
    throw new Error("Chat directory not created.");
  }
}

async function createInnerDirectories(chatDir) {
  try {
    const markingSchemeDirectory = path.join(chatDir, "markingScheme");
    const studentAnswerDirectory = path.join(chatDir, "studentAnswers");
    await fsPromises.mkdir(markingSchemeDirectory);
    await fsPromises.mkdir(studentAnswerDirectory);
    return { directories: [markingSchemeDirectory, studentAnswerDirectory] };
  } catch (error) {
    throw new Error("Inner directories not properly created.");
  }
}

app.use(createInnerDirectoriesMiddleware);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

app.post(
  "/upload_files",
  upload.fields([
    { name: "markingSchemeFiles", maxCount: 1 },
    { name: "answerSheetFiles", maxCount: 10 },
  ]),
  fileUpload
);

async function fileUpload(req, res) {
  const clientId = req.query.clientId;
  const { innerDirectories } = req;

  if (
    !innerDirectories ||
    !innerDirectories.directories ||
    innerDirectories.directories.length !== 2
  ) {
    res.status(500).json({ error: "Inner directories not properly created." });
    return;
  }

  try {
    const resultDir = await processFiles(
      chatDirectoryPath,
      chatDirectoryName,
      clientId
    );
    if (connectedClients[clientId]) {
      connectedClients[clientId].emit("processingComplete", resultDir);
    } else {
      res.status(401).send("Not authorized");
      return;
    }

    res.status(200).send("Files uploaded and processing started");
  } catch (error) {
    console.error("Error during file processing:", error.message);
    res.status(500).json({ error: error.message });
  }
}

function processFiles(dirForProcess, chatDirectoryName, clientId) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(
      "C:\\Users\\Wicky\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Python 3.8\\Scripts\\python.exe",
      ["-m", "Backend.Model.main", dirForProcess, chatDirectoryName],
      {
        env: {
          ...process.env,
          PYTHONPATH:
            "C:\\Users\\Wicky\\Documents\\GitHub\\Innovation_competition",
        },
      }
    );

    let resultData = "";
    let errorData = "";

    pythonProcess.stdout.on("data", (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Python process exited with code ${code}. Error: ${errorData}`
          )
        );
        return;
      }

      try {
        const jsonData = JSON.parse(resultData);
        reports_location = jsonData.reports_location;
        if (jsonData.status === "success") {
          try {
            createZip(clientId);
          } catch (error) {
            console.error("Error creating zip:", error);
          }
        } else {
          console.error("Creating reports was not successful");
        }
        resolve(jsonData);
      } catch (error) {
        reject(
          new Error(
            `Error parsing JSON data received from Python script: ${error}`
          )
        );
      }
    });

    pythonProcess.on("error", (error) => {
      reject(new Error(`Error spawning Python process: ${error.message}`));
    });
  });
}

const createZip = (clientId) => {
  const zipFilename = "results.zip";
  const zipPath = path.join(reports_location, zipFilename);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);
  archive.directory(reports_location, false);
  archive.finalize();

  output.on("finish", () => {
    const dataForFrontEnd = {
      zipFilePath: zipPath,
      chatId: chatDirectoryName,
      processComplete: true,
    };
    connectedClients[clientId].emit("data", dataForFrontEnd); // sending location of the zip file to frontend
  });

  archive.on("error", (err) => {
    console.error("Archiving error:", err);
  });
};

app.get("/download-results", (req, res) => {
  const zipLocation = req.query.zip_location;
  const acceptHeader = req.headers.accept;
  const clientId = req.query.clientId;

  console.log("Received client ID:", clientId);
  console.log("Received zip_location:", zipLocation); // Debugging log
  console.log("Received Accept header:", acceptHeader); // Debugging log

  // Ensure the Accept header is for a zip file
  if (acceptHeader !== "application/zip") {
    return res.status(400).send("Invalid Accept header");
  }

  // Ensure zipLocation is provided
  if (!zipLocation) {
    return res.status(400).send("zip_location query parameter is required");
  }

  const filePath = path.resolve(zipLocation);
  console.log("Resolved file path:", filePath); // Debugging log

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath); // Debugging log
    return res.status(404).send("File not found");
  }

  // Send the zip file
  res.setHeader("Content-Type", "application/zip");
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error sending file");
    }
  });
});

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("register", (clientId) => {
    console.log("User registered:", clientId);
    connectedClients[clientId] = socket;
  });

  socket.on("disconnect", () => {
    // Remove client from connectedClients
    for (const [key, value] of Object.entries(connectedClients)) {
      if (value.id === socket.id) {
        console.log("A client disconnected:", socket.id);
        console.log("The client also unregistered:", value.id);
        delete connectedClients[key];
        break;
      }
    }
  });
});

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

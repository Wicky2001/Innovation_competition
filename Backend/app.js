// server.js
const fs = require('fs'); // Import the core fs module
const fsPromises = require('fs').promises;  // Import fsPromises.promises directly
const path = require('path');
const multer = require("multer");
const archiver = require('archiver');
const cors = require('cors');

const corsOptions = {
  origin: '*', // Change to specific origins as needed
  methods: ['GET', 'POST'], 
};


const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const baseDirectory = "./PDF/";

const testDir="./PDF/chat_1715886407427/";


let connectedClients = {}; // Store connected clients




// Initialize multer with the storage configuration


// Custom middleware to create directories and set destination directory for multer
async function createInnerDirectoriesMiddleware(req, res, next) {

if (req.path === '/upload_files' && req.method === 'POST') {
  console.log(req.path);
  console.log(req.method);
  try {
    const chatDir = await createChatDirectory();
    if (!chatDir) {
      throw new Error('Chat directory not created.');
    }
    const innerDirs = await createInnerDirectories(chatDir);
    req.innerDirectories = innerDirs;
    console.log(innerDirs)
    next();
  } catch (error) {
    console.error("Error creating inner directories:", error);
    res.status(500).json({ error: "Error creating inner directories" });
  }
}else{
  next()
}
 
}

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      let destinationDir;

      if (file.fieldname === "markingSchemeFiles") {
        destinationDir = req.innerDirectories.directories[0];
        console.log("Destination directory for markingSchemeFiles:", destinationDir);
      } else if (file.fieldname === "answerSheetFiles") {
        destinationDir =  req.innerDirectories.directories[1];
        console.log("Destination directory for answerSheetFiles:", destinationDir);
      }

      cb(null, destinationDir);
    } catch (error) {
      console.error("Error while setting destination directory:", error);
      cb(error);
    }
  },
  

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});


const upload = multer({ storage });

async function createChatDirectory() {
  const uniqueDirectoryName = `chat_${Date.now()}`;
  const fullChatDirectoryPath = path.join(__dirname, baseDirectory, uniqueDirectoryName);
  try {
    await fsPromises.mkdir(fullChatDirectoryPath); // Use fsPromises.mkdir for asynchronous directory creation
    console.log('Directory created:', fullChatDirectoryPath);
    return fullChatDirectoryPath;
  } catch (error) {
    console.error('Error creating directory:', error);
    throw new Error('Chat directory not created.');
  }
}

async function createInnerDirectories(chatDir) {
  try {
    const markingSchemeDirectory = path.join(chatDir, "markingScheme");
    const studentAnswerDirectory = path.join(chatDir, "studentAnswers");
    await fsPromises.mkdir(markingSchemeDirectory);
    console.log('Directory created:', markingSchemeDirectory);
    await fsPromises.mkdir(studentAnswerDirectory);
    console.log('Directory created:', studentAnswerDirectory);
    return { "directories": [markingSchemeDirectory, studentAnswerDirectory] };
  } catch (error) {
    console.error('Error creating inner directories:', error);
    throw new Error('Inner directories not properly created.');
  }
}
app.use(createInnerDirectoriesMiddleware);


app.get('/', (req, res) => {
  console.log("requesting index....");
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});



// Route for uploading files
app.post("/upload_files", upload.fields([
  { name: 'markingSchemeFiles', maxCount: 1 },
  { name: 'answerSheetFiles', maxCount: 10 }
]), fileUpload);


// Define the async function separately
async function fileUpload(req, res) {
  
  console.log("req found......")
  
  const clientId = req.query.clientId;


  const { innerDirectories } = req;


  console.log("Directories created:", innerDirectories);
  if (!innerDirectories || !innerDirectories.directories || innerDirectories.directories.length !== 2) {
    res.status(500).json({ error: 'Inner directories not properly created.' });
    return;
  }
  else{



  // Simulate file processing with a delay
  processFiles((err, resultDir) => {
    if (err) {
      return res.status(500).send('Error processing files');
    }
    if (connectedClients[clientId] !=" ") {
      
      // const documentsIndex = resultDir.indexOf('Innovation_competition') + 'Innovation_competition'.length;
      // const resultDir = absolutePath.slice(documentsIndex + 1);
      connectedClients[clientId].emit('processingComplete', resultDir);
      console.log(`event is emmited ${resultDir}`);
    }
    else{
      res.status(401).send('not authorized');
      return;
    }
    
    console.log('processingComplete event emitted with resultDir:', resultDir);
    res.status(200).send('Files uploaded and processing started');
    return;
  }
);
  
  }
  // res.json({ message: "Successfully uploaded files" });
}

function processFiles(callback) {
  setTimeout(() => {
    const resultDir = path.resolve(__dirname, testDir);
    console.log(`result dir is created, now you can log it: ${resultDir}`);
    callback(null, resultDir);
  }, 5000);
}

app.get('/download-results', (req, res) => {
  console.log("Request is found for download...");
  // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  // res.setHeader('Pragma', 'no-cache');
  // res.setHeader('Expires', '0');
  // res.setHeader('Surrogate-Control', 'no-store');
  const zipFilename = 'results.zip';
  const zipPath = path.join(__dirname,testDir, zipFilename);

  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('finish', () => {
    console.log('Folder zipped successfully!');
    res.download(zipPath, zipFilename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error downloading  file');
      } else {
        console.log('File sent successfully!');
        fs.unlink(zipPath, (err) => {
          if (err) {
            console.error('Error deleting zip file:', err);
          } else {
            console.log('Temporary zip file deleted');
          }
        });
      }
    });
  });

  archive.on('error', (err) => {
    console.error('Archiving error:', err);
    res.status(500).send('Error creating archive');
  });

  archive.pipe(output);

  // Ensure the correct directory is archived
  const evaluatedPapersPath = path.join(testDir, 'evaluatedPapers');
  archive.directory(evaluatedPapersPath, false);

  archive.finalize();
});


// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('register', ( clientId) => {
    console.log('User registered:',  clientId);

    connectedClients[clientId]=socket;
  
    // Additional logic to handle user registration if needed
  });

  // Other event handlers can be added here
});

const PORT =  5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

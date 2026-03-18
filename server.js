const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session"); 
const path = require("path");
const dotenv = require("dotenv"); 

const app = express();

// Specify the path to the environment variable file 'config.env' [cite: 1042, 1043]
dotenv.config({ path: './config.env' });

// SETTINGS & MIDDLEWARE
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(session({
  secret: "smu-is113-secret-key",
  resave: false,
  saveUninitialized: false
}));

// ROUTES
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home'); 
const recipeRoutes = require('./routes/recipes');
const reviewRoutes = require('./routes/review')
app.use('/auth', authRoutes);
app.use('/', homeRoutes);
app.use('/',recipeRoutes);

// Connect to MongoDB function
async function connectDB() {
  try {
    // connecting to Database with our config.env file and DB is constant in config.env [cite: 1047, 1061]
    await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfully"); 
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); 
  }
}

// function to start the server
function startServer() {
  const port = 3000; 
  
  // Start the server and listen on the specified port
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`); 
  });
}

// call connectDB first and when connection is ready we start the web server [cite: 1072, 1073]
connectDB().then(startServer);
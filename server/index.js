require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const imagesRoutes  = require('./routes/images');
const path = require("path");
const bodyParser = require('body-parser');

app.use(bodyParser.json());


// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// Serve static files from the 'public' folder
app.use("/images", express.static(path.join(__dirname, "public", "images")));

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use( "/api/images" , imagesRoutes);
app.use("/api/delete", imagesRoutes)


const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));

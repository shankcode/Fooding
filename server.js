require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

//---------- HTTP to HTTPS if any --------------//
app.enable("trust proxy");
app.use((req, res, next) => {
  if (
    req.headers["x-forwarded-proto"] !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    var secureUrl = "https://" + req.headers["host"] + req.url;
    res.writeHead(301, { Location: secureUrl });
    res.end();
  }
  next();
});

//------------ Middleware -------------//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//--------- Static File ----------//
app.use(express.static("fooding/build"));

//----------- Requiring and Mounting Routes ------------//
const food = require("./routes/food");
const push_notification = require("./routes/push_notify");
app.use("/api", food);
app.use("/push", push_notification);

//---------- Database Connection ------------//
const db = process.env.database_uri;
//Attempt connecting to database
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(connect => {
    console.log("Database connected successfully");
  })
  .catch(error => console.log(`Error in database connection. -- ${error}`));

//---------------- Serve static assets if in production ------------//
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("fooding/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "fooding", "build", "index.html"));
  });
}

//----------- Port Init. ---------------//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}...`);
});

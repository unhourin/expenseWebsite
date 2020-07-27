import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import ExpenseMangament from "./ExpenseManagement";
import Detailed from "./Detailed"
import EP from "./employeeLsit"

const express = require("express");
const app = express();

app.get("/", function(req, res) {
  res.send("go to /posts to see posts");
});

app.listen(4000, function() {
  console.log("Example app listening on port 4000!");
});

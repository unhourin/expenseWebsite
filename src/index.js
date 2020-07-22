import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import ExpenseMangament from "./ExpenseManagement";
import Detailed from "./Detailed"
import EP from "./employeeLsit"
// import Demo from "./checkBox";
// import TableDisplay from "./table";

ReactDOM.render(<ExpenseMangament />, document.querySelector("#root"));
// ReactDOM.render(<EP />, document.querySelector("#root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

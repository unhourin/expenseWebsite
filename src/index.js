import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
// import ExpenseMangament from "./Expense";
import App from './App';

ReactDOM.render(<App />, document.querySelector("#root"));

serviceWorker.unregister();
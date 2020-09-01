import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import expenseReducer from "./expenseStore/expenseReducer";
// import { composeWithDevTools } from "redux-devtools-extension";
// import logger from "redux-logger";

export const store = createStore(expenseReducer, applyMiddleware(thunk));

import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ExpenseMangament from "./Component/ExpenseManagement/ExpenseManagement";
import ExpenseDetails from "./Component/ExpenseDetails/ExpenseDetails";
import Testas from "./Component/ExpenseManagement/component/test.js";
import { Provider } from "react-redux";
import { store } from "./store/store";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route path="/expense" component={ExpenseMangament}></Route>
          <Route
            path="/details/:employee_id/:employee_name"
            component={ExpenseDetails}
          />
          <Route path="/test" component={Testas} />
        </Router>
      </Provider>
    );
  }
}
export default App;

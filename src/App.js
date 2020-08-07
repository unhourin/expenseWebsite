import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ExpenseMangament from './ExpenseManagement';
import ExpenseDetails from './ExpenseDetails';

class App extends React.Component {
    render() {
        return (
            <Router>
                <Route path="/expense" component={ExpenseMangament} />
                <Route path="/details/:employee_id/:employee_name/:expense_id" component={ExpenseDetails} />
            </Router>
        )
    }
}
export default App;
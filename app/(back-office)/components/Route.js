// Import necessary modules
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Import components
import Dashboard from '/invdashboard/home/classes/page.jsx';
import ClassDetails from '/invdashboard/home/classes/ClassDetails'; // Assuming you have a component for class details

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/invdashboard/home/classes/page.jsx" exact component={Dashboard} />
        <Route path="/class-details/:id" component={ClassDetails} />
        {/* Other routes if needed */}
      </Switch>
    </Router>
  );
};

export default App;

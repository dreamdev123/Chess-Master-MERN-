import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Start from './components/Start';
import Lobby from './components/Lobby';
import Game from './components/Game';

const App = () => (
  <div className="App">
    <Router basename={process.env.PUBLIC_URL}>
      <Route exact path="/" component={Start} />
      <Route path="/lobby" component={Lobby} />
      <Route path="/game/:id" component={Game} />
    </Router>
  </div>
);

export default App;
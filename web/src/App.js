import React from "react";
import { Switch, Route } from "react-router-dom";

import Lobby from "./pages/Lobby";
import CoolKing from "./pages/CoolKing";

import "./App.css";

function App() {
  return (
    <div className="App" id="App">
      <Switch>
        <Route exact path="/">
          {Lobby}
        </Route>
        <Route path="/cool-king">{CoolKing}</Route>
      </Switch>
    </div>
  );
}

export default App;

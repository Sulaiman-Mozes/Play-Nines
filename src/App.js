import React, { Component } from 'react';
import './App.css';

import Game from './components/game-component'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []

    }
  };

  getData = (data) => {
    this.setState(prevState => ({
      cards: prevState.cards.concat(data)
    }))
  }
  render() {
    return (
      <div className="App">
        <Game />
      </div>
    );
  }
}

export default App;

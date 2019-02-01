import { Component } from 'react';
import logo from './logo.svg';
import template from './App.pug';
import { greeting } from './core';

class App extends Component {
  render() {
    return template({
      // variables
      greeting: greeting('Emmet'),
      logo,
    });
  }
}

export default App;

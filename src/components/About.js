/*
const React = require('react')

const About = () => (
  <div>
    <h2>About</h2>
    <p>Contact Us</p>
  </div>
);


module.exports = About;
*/
import React, { Component } from 'react';
import { startFirebaseUI } from './firebase.js'

class App extends Component {
  componentDidMount() {
    startFirebaseUI ('#firebaseui')
  }
  render() {
    return (
      <div id="firebaseui"></div>
    );
  }
}

module.exports = About;
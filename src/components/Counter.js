import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import '../style.css';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';

class Counter extends React.Component{
  
  constructor(){
    super();
    this.state = {
      count: 0,
      isSignedIn: false
    }
    this.increment = this.increment.bind(this);
    this.logout = this.logout.bind(this); 
          this.uiConfig = {
              signInFlow: "popup",
                  signInOptions: [
                  firebase.auth.EmailAuthProvider.PROVIDER_ID
              ],
            callbacks: {
                  signInSuccessWithAuthResult: (result) => false
              }
          };
  }

  componentDidMount() {
            firebase.auth().onAuthStateChanged(user => {
           var theUser = user;
 
            this.setState({
              isSignedIn: !!user
              //user: theUser,
            })
        })
  }
  increment(){
    this.setState({
      count: this.state.count + 1
    })
  }

logout() {
    auth.signOut()
    .then(() => {
      this.setState({
        isSignedIn: false
      });
    });
}
  render(){
    let isLoggedIn = this.state.isSignedIn;
    const renderAuthButton = ()=>{
      if(isLoggedIn == false)
        return <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>;
      else
      {
        return(
        <div>
          <p>{this.state.count}</p>
          <button onClick={this.increment}>+</button>
          <button onClick={this.logout}>LogOut</button>
        </div>
        );
       }
    }
    return(
      <div>
        {renderAuthButton()}
      </div>
    );
  }
}
module.exports = Counter;
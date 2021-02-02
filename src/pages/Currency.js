import React from "react";

import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../mystyle.css'

class Currency extends React.Component {
  constructor(){
    super();
      this.state = {
      path: 'currencies',
      currentItem: '',
      username: '',
      items: [],
      itemsOrig: [],// immutable
      viewItems :[],
      user: null,
      optionsOne: [],
      bizinfo: [],
      country: '',
      log: 0,
      name: '',
      msymbol: '',
      uid: '',
      id: '',
      businessKeyId: '',
      base_currency: false,
      search: false,
      initialized: false,
      isExists: false,
      displayPane: 'list'
     
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this); 
    this.initialize = this.initialize.bind(this); 
    this.initialize2 = this.initialize2.bind(this); 
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
      this.setState({
          user
        })
    });

      this.initialize();
  }

  initialize(){
   var m_user = firebase.auth().currentUser;
   var uid = this.state.uid;//m_user.uid;
   const companyRef = firebase.database().ref('business_info/'+
    uid+'/').orderByChild('id');   
  
    companyRef.on('value',  snapshot => {
      var items = snapshot.val();
      var newState = [];
        for (let item in items) {        
          newState.push({
         address:  items[item].address,
        //  allowClientQuotations: items[item].allowClientQuotations,
          businessName: items[item].businessName,
          emailHome: items[item].emailHome,
          emailOffice: items[item].emailOffice,
          businessKeyId: item,
        //  imageName:  items[item].imageName,
        //  imgURL:  items[item].imgURL,
          locationCountry: items[item].locationCountry,
        //  log:  items[item].log,
        //  system_set:  items[item].system_set, 
          taxIdentifier: items[item].taxIdentifier,
          telephoneHome: items[item].telephoneHome,
          telephoneOffice: items[item].telephoneOffice
        //  uid:  items[item].uid
        })
        }
          this.setState({
            bizinfo: newState
          })
    });
   
  }


  initialize2(){
   var m_user = firebase.auth().currentUser;
   var uid = m_user.uid;

   var businessKeyId ="";
   var mBizInfo = this.state.bizinfo.slice();
    for(let x of mBizInfo){
       businessKeyId = x.businessKeyId ;
    }
      const itemsRef = firebase.database().ref('currencies/'+
       uid+'/'+businessKeyId)
       .orderByChild('country');
        itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          newState.push({
            country: items[item].country,
            log: items[item].log,
            name: items[item].name,
            msymbol: items[item].symbol,
            uid: items[item].uid,
            id: item,
            businessKeyId: businessKeyId,
            base_currency: items[item].base_currency
          });
        }// end for loop
          this.setState({
            items: newState,
            itemsOrig: newState,
            isExists: true
        });
      }); 

  }

  handleChange(e){
    if(e.target.name === "searchbar"){
      if(e.target.value === ""){
          this.setState({
          items: this.state.itemsOrig
        })
      } else{
        let newState = [];
        var searchTerm = e.target.value;
        var firstLetter = searchTerm.slice(0,1).toUpperCase();
        var remainingLetters = searchTerm.slice(1);
        searchTerm=firstLetter+remainingLetters;

       {this.state.items.filter(item => item.country.
        includes(searchTerm)).map(filteredItem => (
          newState.push({            
            country: filteredItem.country,
            log: filteredItem.log,
            name: filteredItem.name,
            msymbol: filteredItem.msymbol,
            uid: filteredItem.uid,
            id: filteredItem.id,
            businessKeyId: filteredItem.businessKeyId,
            base_currency: filteredItem.base_currency
          })
        ))}

        this.setState({
          items: newState
        })
      }
    } else
      this.setState({
        [e.target.name]: e.target.value
      })
  }

  handleSubmit(e){
    e.preventDefault();
      if(!this.state.user){
        alert("Please Log in!");
        return;
      }
    var d = new Date();
    var n = d.getTime();
    var country = this.state.country;
      if(country === '' || country === null){
        alert("Please Enter Country!");
        return;
      }
    var name = this.state.name;
      if(name === '' || name === null){
        alert("Please Enter Name!");
        return;
      }
    var m_user = firebase.auth().currentUser;
    var uid = m_user.uid;
    var businessKeyId ="";
   var mBizInfo = this.state.bizinfo.slice();
    for(let x of mBizInfo){
       businessKeyId = x.businessKeyId ;
    }
    var saved = "Saved!"; 
    var itemsRef = null;
       if(this.state.isExists){
        itemsRef = firebase.database().ref('currencies/'+uid+'/'+businessKeyId+'/'+this.state.id);
        saved = "Updated!";
        const item = {
          country: this.state.country,
          log: n,
          name: this.state.name,
          symbol: this.state.msymbol,
          uid: this.state.uid,
          id: this.state.id,
          businessKeyId: businessKeyId,
          base_currency: this.state.base_currency
        }
        itemsRef.set(item);
      }    
      else {
        itemsRef = firebase.database().ref('currencies/'+uid+'/'+businessKeyId);
          const item = {
            country: this.state.country,
            log: n,
            name: this.state.name,
            symbol: this.state.msymbol,
            uid: this.state.uid,
            businessKeyId: businessKeyId,
            base_currency: this.state.base_currency
        }
        itemsRef.push(item);
      }

      this.setState({
        displayPane: 'list',
        items: this.state.itemsOrig,
        isExists: true
      })
      
      alert(saved);
      
  }

  handleClick(index) {
    if(index === 1){
      this.initialize();
      this.setState({
        displayPane: 'list',
        items: this.state.itemsOrig,
        isExists: true
      })
    }
    if(index === 2){
      this.clear();
      this.setState({
        displayPane: 'form',
      })
    }

  }

  logout() { 
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
  }

  viewItem(itemId){
    this.setState({
      displayPane: 'form'
    })
  var m_user = firebase.auth().currentUser;
  var uid = m_user.uid; 
  var myvalue = this.state.items.map((item) =>{
      let myid=item.id;
      if(myid === itemId){
        this.setState({
            country: item.country,
            log: item.log,
            name: item.name,
            msymbol: item.msymbol,
            uid: item.uid,
            id: itemId,
            businessKeyId: item.businessKeyId,
            base_currency: item.base_currency
        })
      }
  });

  }

  clear(){
    this.setState({
      country: '',
      log: 0,
      name: '',
      msymbol: '',
      id: '',
      isExists: false,
    })

  }

  removeItem(itemId) {
   var m_user = firebase.auth().currentUser;
   var uid = m_user.uid;
   var businessKeyId ="";
   var mBizInfo = this.state.bizinfo.slice();
    for(let x of mBizInfo){
       businessKeyId = x.businessKeyId ;
    }
      const itemRef = firebase.database()
      .ref(`/currencies/${uid}/${businessKeyId}/${itemId}`);
      itemRef.remove();
      
  }

  render(){

    const renderAuthButton = () => {
      if(this.state.user == null)
       return <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>;
       else{
               if(this.state.initialized == false){
                this.setState({
                  initialized: true
                })
                this.initialize2();
                return (<div>Loading..</div>);
              }
            if(this.state.displayPane === 'list'){
              const listItems = this.state.items.map((item) => 
              <li key={item.id}>
               <h3>{item.name} {item.msymbol} </h3>
               <p><strong>{item.country}</strong></p>
                <p><button onClick={() => this.viewItem(item.id)}>View</button>
                <button onClick={() => this.removeItem(item.id)} style={{marginLeft: "10px"}}>Remove</button>
               </p>
             </li>
              );
              return(
              <div><input class="w3-input" type="text" name="searchbar" placeholder="Search Currency Name.." onChange={this.handleChange}/>
              <ul>{listItems}</ul></div>
              );    
            }
            else{
              /* display form */
              return(
                <div>
        <button class="w3-button w3-yellow" style={{float: "right"}} type = "submit" onClick={() => this.clear()}>Clear</button>
                  <form class="w3-container" onSubmit={this.handleSubmit} >
                    <input class="w3-input" type="text" name="name" placeholder="Currency Name" onChange={this.handleChange} value={this.state.name} />
                    <input class="w3-input" type="text" name="msymbol" placeholder="Symbol" onChange={this.handleChange} value={this.state.msymbol} />
                    <input class="w3-input" type="text" name="country" placeholder="Country" onChange={this.handleChange} value={this.state.country} />
                    <label>Base Currency:</label>
                    <input type="checkbox" checked={this.state.base_currency} ref="complete" onChange={this.handleChange} value={this.state.base_currency}/>
                    <button type="submit" name="save" >Save</button>
                  </form>
                 </div>
              );
            }          
          }
    }  
    return (
 <div className="w3-container" >
 <div className="w3-container" >
    <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Currency List</button>
    <button onClick={() => this.handleClick(2)} style={{marginLeft: "10px"}}>+Add New</button>
  </div>
 
  {renderAuthButton()}
 
</div>
  );
 }
}

export default Currency;
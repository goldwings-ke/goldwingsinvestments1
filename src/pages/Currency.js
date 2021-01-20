import React from "react";

import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../style.css'

class Currency extends React.Component {
  constructor(){
    super();
      this.state = {
      path: 'tax_codes',
      currentItem: '',
      username: '',
      items: [],
      itemsOrig: [],// immutable
      viewItems :[],
      user: null,
      optionsOne: [],
      bizinfo: [],
      businessKeyId: '',
      log: 0,
      tax_code: '',
      tax_rate: 0,
      uid: 'QK4rcq2YhZf5BoNsXklZShBTwHw1',
      id: '',
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
      const itemsRef = firebase.database().ref('tax_codes/'+
       uid+'/'+businessKeyId)
       .orderByChild('tax_code');
        itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          newState.push({
            businessKeyId: items[item].businessKeyId,
            log: items[item].log,
            tax_code: items[item].tax_code,
            tax_rate: items[item].tax_rate,
            uid: items[item].uid,
            id: item
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
       {this.state.items.filter(item => item.tax_code.
        includes(e.target.value)).map(filteredItem => (
          newState.push({            
            businessKeyId:  filteredItem.businessKeyId,
            log: filteredItem.log,
            tax_code: filteredItem.tax_code,
            tax_rate: filteredItem.tax_rate,
            uid: filteredItem.uid,
            id: filteredItem.id
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
    var taxCode = this.state.tax_code;
      if(taxCode === '' || taxCode === null){
        alert("Please Enter Tax Code!");
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
        itemsRef = firebase.database().ref('tax_codes/'+uid+'/-M7sDl_6e3H4iUPEEyuI/'+this.state.id);
        saved = "Updated!";
      }    
      else {
        itemsRef = firebase.database().ref('tax_codes/'+uid+'/-M7sDl_6e3H4iUPEEyuI');
      }

      const item = {
        businessKeyId: businessKeyId,
        log: n,
        tax_code: this.state.tax_code,
        tax_rate: this.state.tax_rate,
        uid: uid
      }
      if(this.state.isExists)
        itemsRef.set(item);
      else
        itemsRef.push(item);
      
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
            businessKeyId: item.businessKeyId,
            log: item.log,
            tax_code: item.tax_code,
            tax_rate: item.tax_rate,
            uid: item.uid,
            id: itemId,
        })
      }
  });

  }

  clear(){
    this.setState({
      log: 0,
      tax_code: '',
      tax_rate: 0,
      id: '',
      isExists: false
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
      .ref(`/tax_codes/${uid}/${businessKeyId}/${itemId}`);
      itemRef.remove();
      
  }

  render(){
    var address ="";
    var businessName = "";
    var emailHome = "";
    var emailOffice = "";
    var locationCountry = "";
    var taxIdentifier = "";
    var telephoneHome = "";
    var telephoneOffice = "";
    var mBizInfo = [];
    const footer = () => {
      if(this.state.user){
        mBizInfo = this.state.bizinfo.slice();
          for(let x of mBizInfo){
            businessName = x.name;
            address = x.address ;
            emailHome = x.emailHome;
            emailOffice = x.emailOffice ;
            locationCountry = x.locationCountry;
            taxIdentifier = x.taxIdentifier;
            telephoneHome = x.telephoneHome;
            telephoneOffice = x.telephoneOffice;
        }
        var mFooter = address+" "+locationCountry + " " +telephoneHome+ " "+ telephoneOffice+" " +emailHome + " " +emailOffice+ " "+
        taxIdentifier;
        return(
          <div>{mFooter}</div>
        );
      }
      return(
        <div>Welcome!</div>
      )
    }
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
               <h3>{item.tax_code} </h3>
               <p>Tax Rate %: <strong>{item.tax_rate}</strong></p>
                <p><button onClick={() => this.viewItem(item.id)}>View</button>
                <button onClick={() => this.removeItem(item.id)} style={{marginLeft: "10px"}}>Remove</button>
               </p>
             </li>
              );
              return(
              <div><input class="w3-input" type="text" name="searchbar" placeholder="Search Tax Code Name.." onChange={this.handleChange}/>
              <ul>{listItems}</ul></div>
              );    
            }
            else{
              /* display form */
              return(
                <div>
        <button class="w3-button w3-yellow" style={{float: "right"}} type = "submit" onClick={() => this.clear()}>Clear</button>
                  <form class="w3-container" onSubmit={this.handleSubmit} >
                    <input class="w3-input" type="text" name="tax_code" placeholder="Tax Code Name" onChange={this.handleChange} value={this.state.tax_code} />
                    <label>Tax Rate %:</label>
                    <input class="w3-input" type="number" name="tax_rate" placeholder="0.0" onChange={this.handleChange} value={this.state.tax_rate} />
                    <button type="submit" name="save" style={{width: "20%"}}>Save</button>
                  </form>
                 </div>
              );
            }          
          }
    }  
    return (
 <div className="w3-container" style={{width: "80%"}}>
 <div className="w3-container" >
    <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Tax Settings List</button>
    <button onClick={() => this.handleClick(2)} style={{marginLeft: "10px"}}>+Add New</button>
  </div>
 
  {renderAuthButton()}
 
</div>
  );
 }
}

export default Currency;
import React from "react";

import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../style.css'

class ChartOfAccounts extends React.Component {
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
      account_name: '',
      account_no: 0,
      account_type: '',
      businessKeyId: '',
      custom_account_no: "",
      depth: 0,
      log: 0,
      main_account_no: 0,
      position: 0,
      sub_account_of: 0,
      system_account: false,
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
      const itemsRef = firebase.database().ref('chart_of_accounts/'+
       uid+'/'+businessKeyId)
       .orderByChild('account_no');
        itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          newState.push({
          account_name: items[item].account_name,
          account_no: items[item].account_no,
          account_type: items[item].account_type,
          businessKeyId: businessKeyId,
          custom_account_no: items[item].custom_account_no,
          depth: items[item].depth,
          log: items[item].log,
          main_account_no: items[item].main_account_no,
          position: items[item].position,
          sub_account_of: items[item].sub_account_of,
          system_account: items[item].system_account,
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
       {this.state.items.filter(item => item.account_no.
        includes(e.target.value)).map(filteredItem => (
          newState.push({            
            account_name: filteredItem.account_name,
            account_no: filteredItem.account_no,
            account_type: filteredItem.account_type,
            businessKeyId: filteredItem.businessKeyId,
            custom_account_no: filteredItem.custom_account_no,
            depth: filteredItem.depth,
            log: filteredItem.log,
            main_account_no: filteredItem.main_account_no,
            position: filteredItem.position,
            sub_account_of: filteredItem.sub_account_of,
            system_account: filteredItem.system_account,
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
    
    var system_account = this.state.system_account;
      if(system_account){
        alert("This is a system account. You can't edit!");
        return;
      }
    var account_name = this.state.account_name;
      if(account_name === '' || account_name === null){
        alert("Please Enter Account Name!");
        return;
      }
    var account_no = this.state.account_no;
      if(!account_no){
        alert("Please Enter Account no!");
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
    var data = "";
       if(this.state.isExists){
        itemsRef = firebase.database().ref('chart_of_accounts/'+uid+'/-M7sDl_6e3H4iUPEEyuI/'+this.state.id);
        saved = "Updated!";

        data = {
          account_name: this.state.account_name,
          account_no: this.state.account_no,
          account_type: this.state.account_type,
          businessKeyId: this.state.businessKeyId,
          custom_account_no: this.state.custom_account_no,
          depth: this.state.depth,
          log: n,
          main_account_no: this.state.main_account_no,
          position: this.state.position,
          sub_account_of: this.state.sub_account_of,
          system_account: false,
          uid: this.state.uid,
          id: this.state.id
        }
      }    
      else {
        itemsRef = firebase.database().ref('chart_of_accounts/'+uid+'/-M7sDl_6e3H4iUPEEyuI');

        data = {
          account_name: this.state.account_name,
          account_no: this.state.account_no,
          account_type: this.state.account_type,
          businessKeyId: this.state.businessKeyId,
          custom_account_no: this.state.custom_account_no,
          depth: this.state.depth,
          log: n,
          main_account_no: this.state.main_account_no,
          position: this.state.position,
          sub_account_of: this.state.sub_account_of,
          system_account: false,
          uid: this.state.uid
        }

      }

      if(this.state.isExists)
        itemsRef.set(data);
      else
        itemsRef.push(data);
      
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
            account_name: item.account_name,
            account_no: item.account_no,
            account_type: item.account_type,
            businessKeyId: item.businessKeyId,
            custom_account_no: item.custom_account_no,
            depth: item.depth,
            log: item.log,
            main_account_no: item.main_account_no,
            position: item.position,
            sub_account_of: item.sub_account_of,
            system_account:item.system_account,
            uid: item.uid,
            id: itemId
        })
      }
  });

  }

  clear(){
    this.setState({
      account_name: '',
      account_no: 0,
      account_type: '',
      custom_account_no: "",
      depth: 0,
      log: 0,
      main_account_no: 0,
      position: 0,
      sub_account_of: 0,
      system_account: false,
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
      .ref(`/chart_of_accounts/${uid}/${businessKeyId}/${itemId}`);
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
               <h3>{item.account_name} {item.account_no} </h3>
               <p><strong>{item.account_type}<br/>
               {item.main_account_no}</strong></p>
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
                    <input class="w3-input" type="text" name="account_name" placeholder="Account Name" onChange={this.handleChange} value={this.state.account_name} />
                    <label>Account Type:</label><br/>
                    <select id = "dropdown" ref = {(input)=> this.menu = input}>
                      {this.state.optionsOne.map((type,index) => {
                        return (
                          <option value ={type.value}>{type.label}</option>
                      )
                    })}
                   </select>
                    <input class="w3-input" type="text" name="account_type" placeholder="Account Type" onChange={this.handleChange} value={this.state.account_type} />
                    <label>Sub Account Of:</label><br/>
                    <select id = "dropdown" ref = {(input)=> this.menu = input}>
                      {this.state.optionsTwo.map((subacc,index) => {
                        return (
                          <option value ={subacc.value}>{subacc.label}</option>
                      )
                    })}
                   </select>
                    <p>Account No: {this.state.account_no}</p>
                    <input class="w3-input" type="text" name="account_no" placeholder="Custom Account No" onChange={this.handleChange} value={this.state.custom_account_no} />
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
    <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Chart Of Accounts List</button>
    <button onClick={() => this.handleClick(2)} style={{marginLeft: "10px"}}>+Add New</button>
  </div>
 
  {renderAuthButton()}
 
</div>
  );
 }
}

export default ChartOfAccounts;
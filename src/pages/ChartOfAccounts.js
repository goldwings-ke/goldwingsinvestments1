import React from "react";

import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../mystyle.css'

const systemAccountsArray = [
            ["100","Fixed_Assets","Fixed Assets","0","1","100","true"],
        ["150","Fixed_Assets","Accumulated Depreciation","0","1","150","true"],
        ["190","Fixed_Assets","Asset Disposal Account","0","1","190","true"],
        ["200","Current_Assets","Current Assets","0","1","200","true"],
        ["202","Current_Assets","Accounts Receivable","0","1","202","true"],
        ["202.1","Current_Assets","Allowance For Doubtfull Debts","202","2","202","true"],
        ["203","Current_Assets","Inventory Stocks","0","1","203","true"],
        ["203.1","Current_Assets","Purchases Returns Allowances","203","2","203","true"],
        ["204","Current_Assets","Prepaid Expenses","0","1","204","true"],
        ["290","Current_Assets","Bank","0","1","280","true"],
        ["291","Current_Assets","Bank Point-Of-Sale","0","1","291","true"],
        ["300","Long_Term_Liability","Long Term Liability","0","1","300","true"],
        ["400","Current_Liability","Current Liability","0","1","400","true"],
        ["401","Current_Liability","Accounts Payable","0","1","401","true"],
        ["402","Current_Liability","Taxation","0","1","402","true"],
        ["402.1","Current_Liability","Corporate Tax","402","2","402","true"],
        ["402.2","Current_Liability","VAT","402","2","402","true"],
        ["402.3","Current_Liability","Sales Tax","402","2","402","true"],
        ["402.4","Current_Liability","PAYE","402","2","402","true"],
        ["404","Current_Liability","Payroll","0","1","404","true"],
        ["500","Equity","Capital","0","1","500","true"],
        ["501","Equity","Retained Earnings","0","1","501","true"],
        ["600","Income","Income","0","1","600","true"],
        ["600.1","Income","Sales Returns","600","2","600","true"],
        ["601","Income","Gain On Asset Disposal","0","1","601","true"],
        ["602","Income","Foreign Exchange Gain","0","1","602","true"],
        ["603","Income","Interest Income","0","1","603","true"],
        ["604","Income","Bad Debts Recovered","0","1","604","true"],
        ["700","Expenses","Cost Of Goods Sold","0","1","700","true"],
        ["702","Expenses","Foreign Exchange Loss","0","1","702","true"],
        ["703","Expenses","Loss On Asset Disposal","0","1","703","true"],
        ["704","Expenses","Bad Debts Expense","0","1","704","true"],
        ["705","Expenses","Bad Debts Provision","0","1","705","true"],
        ["716","Expenses","Depreciation","0","1","716","true"],
        ["717","Expenses","Salary and Wages","0","1","717","true"],
];

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
      optionsOne: ["Fixed_Assets","Current_Assets","Current_Liability",
                "Long_Term_Liability","Equity","Income","Expenses"],
      optionsTwo: [],
      optionsThree: [],
      bizinfo: [],
      optionsFA: [],
      optionsCA: [],
      optionsLTL: [],
      optionsCL: [],
      optionsEquity: [],
      optionsIncome: [],
      optionsExpenses: [],
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
    this.setSpinners = this.setSpinners.bind(this); 
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
        let count_fa = 0;
        let count_ca = 0;
        let count_cl = 0;
        let count_ltl = 0;
        let count_equity = 0;
        let count_income = 0;
        let count_expenses = 0;
        let new_account_type = false;
        let mAccountName = "";
          newState.push({
          account_name: "NONE",
          account_no: 0,
          account_type: "NONE",
          businessKeyId: businessKeyId,
          custom_account_no: '',
          depth: 0,
          log: 0,
          main_account_no: 0,
          position: 0,
          sub_account_of: 0,
          system_account: true,
          uid: uid,
          id: "NONE"
          });

        for (let item in items) {
          if(items[item].account_type === 'Fixed_Assets' && count_fa === 0){
            mAccountName = "--FIXED ASSETS--";
            new_account_type = true;
            count_fa = 1;
          }        
          if(items[item].account_type === 'Current_Assets' && count_ca === 0){
            mAccountName = "--CURRENT ASSETS--";
            new_account_type = true;
            count_ca = 1;
          }        
          if(items[item].account_type === 'Current_Liability' && count_cl === 0){
            mAccountName = "--CURRENT LIABILITY--";
            new_account_type = true;
            count_cl = 1;
          }        
          if(items[item].account_type === 'Long_Term_Liability' && count_ltl === 0){
            mAccountName = "--LONG TERM LIABILITY--";
            new_account_type = true;
            count_ltl = 1;
          }
          if(items[item].account_type === 'Equity' && count_equity === 0){
            mAccountName = "--EQUITY--";
            new_account_type = true;
            count_equity = 1;
          }        
          if(items[item].account_type === 'Income' && count_income === 0){
            mAccountName = "--INCOME--";
            new_account_type = true;
            count_income = 1;
          }
          if(items[item].account_type === 'Expenses' && count_expenses === 0){
            mAccountName = "--EXPENSES--";
            new_account_type = true;
            count_expenses = 1;
          }
          if(new_account_type)
          {
            count_expenses = 1;
            newState.push({
              account_name: mAccountName,
              account_no: 0,
              account_type: "NONE",
              businessKeyId: businessKeyId,
              custom_account_no: '',
              depth: 0,
              log: 0,
              main_account_no: 0,
              position: 0,
              sub_account_of: -1,
              system_account: true,
              uid: uid,
              id: "NONE"
            });
          }
          new_account_type = false;

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


       let newState = [];
       {this.state.items.filter(item => item.account_type.
        includes(this.state.account_type)).map(filteredItem => (
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
            optionsThree: newState
          })
          
    
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

       {this.state.items.filter(item => item.account_name.
        includes(searchTerm)).map(filteredItem => (
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
 /*    
    if(e.target.name === 'account_type'){
      let newState = [];
       {this.state.items.filter(item => item.account_type.
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
  */  
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
       if(this.state.isExists){
        itemsRef = firebase.database().ref('chart_of_accounts/'+uid+'/-M7sDl_6e3H4iUPEEyuI/'+this.state.id);
        saved = "Updated!";

        const data = {
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
         itemsRef.set(data);
      }    
      else {
        itemsRef = firebase.database().ref('chart_of_accounts/'+uid+'/-M7sDl_6e3H4iUPEEyuI');

        const data = {
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
        itemsRef.push(data);
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

  setSpinners(){
    const accountsArray = this.state.items.slice();
      let newState = [];
      let accountType = this.state.account_type;
      accountsArray.map((item) =>{
      let myaccounttype = item.account_type;
    
      if(myaccounttype === accountType)
        newState.push({
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
      });      
      
 
      this.setState({
       optionsThree: newState 
      })

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
              const accounts = this.state.items.slice(1);
              const listItems = accounts.map((item) =>
 
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
              <div><input class="w3-input" type="text" name="searchbar" placeholder="Search Account Name" onChange={this.handleChange}/>
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
                    <p>Account No: {this.state.account_no}</p>
                    <label>Account Type:</label><br/>
                    <select id = "dropdown" ref = {(input)=> this.menu = input} onChange={this.handleChange} name="account_type">
                      {this.state.optionsOne.map((type,index) => {
                        if(this.state.account_type  === type)
                        return (
                          <option value ={index} selected>{type}</option>
                        ) 
                        else
                        return (
                          <option value ={index}>{type}</option>
                        ) 
                    })}
                   </select><br/>
 
                <label>SubAccount Of:</label><br/>
       <select id = "dropdown" ref = {(input)=> this.menu2 = input} onChange={this.handleChange} name="sub_account_of">    
                  {this.state.items.map((item) => {
                  var rfbDepth = item.depth;
                  var rfbAccountName = item.account_name;
                  var rfbAccountNo = item.account_no;
                  var rfbSubAccountNo = item.sub_account_of;
                  var myTxt ="";
                  var gap = '⬜';
                  var gap2 =<span>&nbsp;</span>
                    for(let i=0;i<rfbDepth;i++)
                      myTxt = myTxt.concat(gap);
                      myTxt = myTxt.concat(rfbAccountName);
                      if(rfbAccountNo === this.state.sub_account_of && rfbAccountName !== '--FIXED ASSETS--' && rfbAccountName !== '--CURRENT ASSETS--' && rfbAccountName !== '--CURRENT LIABILITY--' && rfbAccountName !== '--LONG TERM LIABILITY--' && rfbAccountName !== '--EQUITY--' && rfbAccountName !== '--EXPENSES--' && rfbAccountName !== '--INCOME--')
                        return (
                          <option value ={rfbSubAccountNo} selected>{myTxt}</option>
                        )
                      else
                        return (
                          <option value ={rfbSubAccountNo}>{myTxt}</option>
                        )
                  })}
                  
                </select>
                <p>Sub Account of No: {this.state.sub_account_of}</p>
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

const SubAccount = ({myitems}) =>
                <select id = "dropdown" ref = {(input)=> this.menu2 = input} onChange={this.handleChange} name="sub_account_of">
                  {myitems.map((item) => {
                    if(this.state.account_type === item.account_type){
                  var rfbDepth = item.depth;
                  var rfbAccountName = item.account_name;
                  var rfbAccountNo = item.account_no;
                  var rfbSubAccountNo = item.sub_account_of;
                  var myTxt ="";
                  var gap = '⬜';
                  var gap2 =<span>nbsp;</span>
                    for(let i=0;i<rfbDepth;i++)
                      myTxt = myTxt.concat(gap);
                      myTxt = myTxt.concat(rfbAccountName);
                      if(rfbAccountNo === this.state.sub_account_of)
                        return (
                          <option value ={rfbSubAccountNo} selected>{myTxt}</option>
                        )
                      else
                        return (
                          <option value ={rfbSubAccountNo}>{myTxt}</option>
                        )
                    }
                  })}
                </select>

export default ChartOfAccounts;
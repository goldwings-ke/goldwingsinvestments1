import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../mystyle.css'


class Customers extends React.Component {
  constructor(){
    super();
        this.state = {
      path: 'customers',
      currentItem: '',
      username: '',
      items: [],
      itemsOrig: [],// immutable
      viewItems :[],
      user: null,
      optionsOne: [],
      bizinfo: [],
      id: '',
      balance: '',
      billing_address: '',
      business_identifier: '',
      code: '',
      credit_limit: '',
      currency: '',
      delivery_address: '',
      email_address: '',
      invoices: '',
      log: 0,
      name: '',
      phone_contact1: '',
      phone_contact2: '',
      tax_no: '',
      uid: 'QK4rcq2YhZf5BoNsXklZShBTwHw1',
      businessKeyId: '',
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
      const itemsRef = firebase.database().ref('customers/'+
       uid+'/'+businessKeyId)
       .orderByChild('name');
        itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        let currencyOption = [];
        let currencyUnique = [];
        for (let item in items) {
          newState.push({
            id: item,
            businessKeyId:  items[item].businessKeyId,
            uid:  items[item].uid,
            currency: items[item].currency,
            delivery_address: items[item].delivery_address,
            email_address: items[item].email_address,
            invoices: items[item].invoices,
            log: items[item].log,
            name: items[item].name,
            phone_contact1: items[item].phone_contact1,
            phone_contact2: items[item].phone_contact2,
            tax_no: items[item].tax_no,
            balance: items[item].balance,
            billing_address: items[item].billing_address,
            business_identifier: items[item].business_identifier,
            code: items[item].code,
            credit_limit: items[item].credit_limit
          });
        }// end for loop
        this.setState({
          items: newState,
          itemsOrig: newState,
          isExists: true
        });
      }); 

// populate currency
  var count = 0;
    const taxRef = firebase.database().ref('currencies/'+
       uid+'/'+businessKeyId);
        taxRef.on('value', (snapshot) => {
          let currency_items = snapshot.val();
          let newCurrencyState = [];
          let currencyOption = [];
            for (let mCurrencyItem in currency_items) {
              let name = currency_items[mCurrencyItem].name;
              let symbol = currency_items[mCurrencyItem].symbol;
              count++;
              currencyOption.push({
                value: symbol,
                label: symbol
              });
              newCurrencyState.push({
                id: mCurrencyItem,
                country: currency_items[mCurrencyItem].country,
                name: currency_items[mCurrencyItem].name,
                symbol: currency_items[mCurrencyItem].symbol
              });
            }
            this.setState({
              currencyItems: newCurrencyState,
              optionsOne: currencyOption
            });
        });
      if(count === 0){
       let type = "NONE";
       let currencyOption = [];
        currencyOption.push({
          value: type,
          label: type
        });

        this.setState({
          optionsOne: currencyOption
        });
      }

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
        
       {this.state.items.filter(item => item.name.
        includes(searchTerm)).map(filteredItem => (
          newState.push({
            id: filteredItem.id,
            currency: filteredItem.currency, 
            businessKeyId:  filteredItem.businessKeyId,
            delivery_address: filteredItem.delivery_address,
            email_address:  filteredItem.email_address,
            invoices:   filteredItem.invoices,
            phone_contact1:  filteredItem.phone_contact1,
            phone_contact2:  filteredItem.phone_contact2,
            name: filteredItem.name,
            log:  filteredItem.log,
            tax_no:  filteredItem.tax_no, 
            balance:  filteredItem.balance,
            billing_address:  filteredItem.billing_address,
            business_identifier:  filteredItem.business_identifier,
            uid:  filteredItem.uid,
            code: filteredItem.code,
            credit_limit: filteredItem.credit_limit
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
    var name = this.state.name;
      if(name === '' || name === null){
        alert("Please Enter Customer Name!");
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
        itemsRef = firebase.database().ref('customers/'+uid+'/'+businessKeyId+'/'+this.state.id);
        saved = "Updated!";
        const item = {
          id: this.state.id,
          balance: '0',
          billing_address: this.state.billing_address,
          business_identifier: this.state.business_identifier,
          code: this.state.code,
          credit_limit: this.state.credit_limit,
          currency: this.state.currency,
          delivery_address: this.state.delivery_address,
          email_address: this.state.email_address,
          invoices: '0',
          log: n,
          name: this.state.name,
          phone_contact1: this.state.phone_contact1,
          phone_contact2: this.state.phone_contact2,
          tax_no: this.state.tax_no,
          uid: uid,
          businessKeyId: businessKeyId
        }
        itemsRef.set(item);
      }    
      else {
        itemsRef = firebase.database().ref('customers/'+uid+'/'+businessKeyId);
        const item = {
          balance: '0',
          billing_address: this.state.billing_address,
          business_identifier: this.state.business_identifier,
          code: this.state.code,
          credit_limit: this.state.credit_limit,
          currency: this.state.currency,
          delivery_address: this.state.delivery_address,
          email_address: this.state.email_address,
          invoices: '0',
          log: n,
          name: this.state.name,
          phone_contact1: this.state.phone_contact1,
          phone_contact2: this.state.phone_contact2,
          tax_no: this.state.tax_no,
          uid: uid,
          businessKeyId: businessKeyId
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
    if(index === 1)
      this.setState({
        displayPane: 'list',
        items: this.state.itemsOrig,
        isExists: true
    })
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
        /*this.menu.value = item.currency;*/
        this.setState({
            id: itemId,
            balance: item.balance,
            billing_address: item.billing_address,
            business_identifier: item.business_identifier,
            code: item.code,
            credit_limit: item.credit_limit,
            currency: item.currency,
            delivery_address: item.delivery_address,
            email_address: item.email_address,
            invoices: item.invoices,
            log:  item.log,
            name: item.name,
            phone_contact1: item.phone_contact1,
            phone_contact2: item.phone_contact2,
            tax_no: item.tax_no,
            businessKeyId:  item.businessKeyId,
            uid:  item.uid
        })


      }

  });

  }

  clear(){
    this.setState({
      id: '',
      balance: '',
      billing_address: '',
      business_identifier: '',
      code: '',
      credit_limit: '',
      currency: '',
      delivery_address: '',
      email_address: '',
      invoices: '',
      log: 0,
      name: '',
      phone_contact1: '',
      phone_contact2: '',
      tax_no: '',
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
      .ref(`/customers/${uid}/${businessKeyId}/${itemId}`);
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
    const renderBizName = () =>{ 
      var mybizinfo = this.state.bizinfo.slice();
      var mbusinessName = "";
          for(let x of mybizinfo){
            mbusinessName = x.businessName ;
          }
          return(
            <span>{mbusinessName}</span>
          )
    }
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
               <h3>{item.name} </h3>
               <p>Contact: <strong>{item.phone_contact1} {item.phone_contact2}</strong></p>
                <p><button onClick={() => this.viewItem(item.id)}>View</button>
                <button onClick={() => this.removeItem(item.id)} style={{marginLeft: "10px"}}>Remove</button>
               </p>
             </li>
              );
              return(
              <div><input class="w3-input" type="text" name="searchbar" placeholder="Search Name.." onChange={this.handleChange}/>
              <ul>{listItems}</ul></div>
              );    
            }
            else{
              /* display form */
              return(
                <div>
        <button class="w3-button w3-yellow" style={{float: "right"}} type = "submit" onClick={() => this.clear()}>Clear</button>
                <form class="w3-container" onSubmit={this.handleSubmit} >
                <input class="w3-input" type="text" name="name" placeholder="Customer Name" onChange={this.handleChange} value={this.state.name} />
                <input class="w3-input" type="text" name="code" placeholder="Code No" onChange={this.handleChange} value={this.state.code} />                
                <input class="w3-input" type="text" name="phone_contact1" placeholder="Phone Contact 1" onChange={this.handleChange} value={this.state.phone_contact1} />
                <input class="w3-input" type="text" name="phone_contact2" placeholder="Phone Contact 2" onChange={this.handleChange} value={this.state.phone_contact2} />                                            
                <input class="w3-input" type="text" name="tax_no" placeholder="Tax No." onChange={this.handleChange} value={this.state.tax_no} />                                                
                <input class="w3-input" type="text" name="email_address" placeholder="Email Address" onChange={this.handleChange} value={this.state.email_address} />
                <input class="w3-input" type="text" name="billing_address" placeholder="Billing Address" onChange={this.handleChange} value={this.state.billing_address} />
                <input class="w3-input" type="text" name="business_identifier" placeholder="Business Identifier" onChange={this.handleChange} value={this.state.business_identifier}/>
                <input class="w3-input" type="text" name="credit_limit" placeholder="Credit Limit" onChange={this.handleChange} value={this.state.credit_limit} />
                <input class="w3-input" type="text" name="delivery_address" placeholder="Delivery Address" onChange={this.handleChange} value={this.state.delivery_address} />
                      
               <label>Currency:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu = input} name="currency" onChange={this.handleChange}>
                  {this.state.optionsOne.map((cur) => {
                    if(cur === this.state.currency)
                    return (
                      <option value ={cur.value} selected>{cur.label}</option>
                    ) 
                    else return (
                      <option value ={cur.value}>{cur.label}</option>
                    )
                  })}
               </select>
                  <button type="submit" name="save" >Save</button>
                </form>
                </div>
              );
            }          
          }
    }  
    return (
 <div className="w3-container" >
  <div className="w3-container w3-teal" >
    <h1>{renderBizName()}</h1>
    {this.state.user ? <button onClick={this.logout}>Log Out</button>
      : null
    }
    <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Customers List</button>
    <button onClick={() => this.handleClick(2)} style={{marginLeft: "10px"}}>+Add New</button>
  </div>

  {/*<img src={Dome} alt="Dome Tent" />*/}
  <h1>⛺</h1>
  <div className="w3-container w3-teal" >
        <p>CUSTOMERS</p>
  </div>
  <div className="w3-container w3-pink" >
    <p>Wedding Tents, Dome Tents, Chairs, Tables, Seat Covers, Table Cloths, Lights.. services etc </p>
  </div>
  {renderAuthButton()}
  <div className="w3-container w3-teal" >
    <p>{footer()}</p>
  </div>
</div>
  );
 }
}

export default Customers;
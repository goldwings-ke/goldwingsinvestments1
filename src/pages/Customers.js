import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../style.css'

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
      optionsTwo: [],
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
      viewRecord: false,
      isExists: false,
      search: false,
      initialized: false
     
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this); 
    this.onlyUnique = this.onlyUnique.bind(this); 
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
          itemsOrig: newState
        });
      }); 

  }
  
  onlyUnique(){

  }

  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e){
    e.preventDefault;
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
  var m_user = firebase.auth().currentUser;
  var uid = m_user.uid; 
  var myvalue = this.state.items.map((item) =>{
      let myid=item.id;
      if(myid === itemId){
        this.menu.value = item.currency;
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
            uid:  item.uid,
            isExists: true
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
            if(this.state.isExists){
              const listItems = this.state.items.map((item) => 
              <li key={item.id}>
               <h3>{item.name} </h3>
               <p>Contact: <strong>{item.phone_contact1} {item.phone_contact2}</strong></p>
                <p><button onClick={() => this.viewItem(item.id)}>View</button>
                <button onClick={() => this.removeItem(item.id)}>Remove</button>
               </p>
             </li>
              );
              return(
              <div><input class="w3-input" type="text" name="searchbar" placeholder="Search Name.." onChange={this.handleChange}/>
              <ul>{listItems}</ul></div>
              );    
            }
            else{
              return(
                <div>Edit | Add Customer</div>
              );
            }          
          }
    }  
    return (
 <div className="w3-container" style={{width: "80%"}}>
  <div className="w3-container w3-teal" >
    <h1>Goldwings Investments Limited</h1>
  </div>

  {/*<img src={Dome} alt="Dome Tent" />*/}
  <h1>⛺</h1>

  <div className="w3-container w3-pink" >
    <p>Wedding Tents, Dome Tents, Chairs, Tables, Seat Covers, Table Cloths, Lights.. services etc </p>
  </div>
  {renderAuthButton()}
  <div className="w3-container w3-teal" >
    <p>Riverside Drive, Office Park | Phone 0722-514880, 4446538, 4449210 | Email: goldwingsevents@gmail.com | P.O. Box 16852 - 00620</p>
  </div>
</div>
  );
 }
}

export default Customers;
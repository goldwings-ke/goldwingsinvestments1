import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../mystyle.css'

class Home extends React.Component {
  constructor(){
    super();
        this.state = {
      username: '',
      viewItems :[],
      user: null,
      optionsOne: [],
      bizinfo: [],
      bizinfoOrig: [],
      address: '',
      allowClientQuotations: false,
      businessName: '',
      emailHome: '',
      emailOffice: '',
      id: '',
      imageName: '',
      imgURL: '',
      locationCountry: '',
      log: 0,
      system_set: '',
      taxIdentifier: '',
      telephoneHome: '',
      telephoneOffice: '',
      uid: '',
      search: false,
      initialized: false,
      isExists: false,
      displayPane: 'list'
     
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this); 
    this.initialize = this.initialize.bind(this);
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
    
  }

  initialize(){
   var m_user = firebase.auth().currentUser;
   var uid = m_user.uid;
   const companyRef = firebase.database().ref('business_info/'+
    uid).orderByChild('businessName');   
  
    companyRef.on('value',  snapshot => {
      var items = snapshot.val();
      var newState = [];
        for (let item in items) {
          newState.push({
            address: items[item].address,
            allowClientQuotations: items[item].allowClientQuotations,
            businessName: items[item].businessName,
            emailHome: items[item].emailHome,
            emailOffice: items[item].emailOffice,
            id: item,
            imageName: items[item].imageName,
            imgURL: items[item].imgURL,
            locationCountry: items[item].locationCountry,
            log: items[item].log,
            system_set: items[item].system_set,
            taxIdentifier: items[item].taxIdentifier,
            telephoneHome: items[item].telephoneHome,
            telephoneOffice: items[item].telephoneOffice,
            uid: items[item].uid
        })
        }
          this.setState({
            bizinfo: newState,
            bizinfoOrig: newState
          })
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
        
       {this.state.bizinfo.filter(item => item.businessName.
        includes(searchTerm)).map(filteredItem => (
          newState.push({
            address: filteredItem.address,
            allowClientQuotations: filteredItem.allowClientQuotations,
            businessName: filteredItem.businessName,
            emailHome: filteredItem.emailHome,
            emailOffice: filteredItem.emailOffice,
            id: filteredItem.id,
            imageName: filteredItem.imageName,
            imgURL: filteredItem.imgURL,
            locationCountry: filteredItem.locationCountry,
            log: filteredItem.log,
            system_set: filteredItem.system_set,
            taxIdentifier: filteredItem.taxIdentifier,
            telephoneHome: filteredItem.telephoneHome,
            telephoneOffice: filteredItem.telephoneOffice,
            uid: filteredItem.uid
          })
        ))}

        this.setState({
          bizinfo: newState
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

    var fullName = this.state.fullName;
      if(fullName === '' || fullName === null){
        alert("Please Enter Business Name!");
        return;
      }
    var m_user = firebase.auth().currentUser;
    var uid = m_user.uid;

    var saved = "Saved!"; 
    var itemsRef = null;
       if(this.state.isExists){
        itemsRef = firebase.database().ref('business_info/'+uid+'/'+this.state.id);
        saved = "Updated!";
        const item = {
          address: this.state.address,
          allowClientQuotations: this.state.allowClientQuotations,
          businessName: this.state.businessName,
          emailHome: this.state.emailHome,
          emailOffice: this.state.emailOffice,
          id: this.state.id,
          imageName: this.state.imageName,
          imgURL: this.state.imgURL,
          locationCountry: this.state.locationCountry,
          log: n,
          system_set: this.state.system_set,
          taxIdentifier: this.state.taxIdentifier,
          telephoneHome: this.state.telephoneHome,
          telephoneOffice: this.state.telephoneOffice,
          uid: uid,
        }
        itemsRef.set(item);
      }    
      else {
        itemsRef = firebase.database().ref('business_info/'+uid);
        const item = {
          address: this.state.address,
          allowClientQuotations: this.state.allowClientQuotations,
          businessName: this.state.businessName,
          emailHome: this.state.emailHome,
          emailOffice: this.state.emailOffice,
          imageName: this.state.imageName,
          imgURL: this.state.imgURL,
          locationCountry: this.state.locationCountry,
          log: n,
          system_set: this.state.system_set,
          taxIdentifier: this.state.taxIdentifier,
          telephoneHome: this.state.telephoneHome,
          telephoneOffice: this.state.telephoneOffice,
          uid: uid
        }
         itemsRef.push(item);
      }

      
      this.setState({
        displayPane: 'list',
        items: this.state.bizinfoOrig,
        isExists: true
      })
      
      alert(saved);
  }

  handleClick(index) {
    if(index === 1)
      this.setState({
        displayPane: 'list',
        items: this.state.bizinfoOrig,
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
  var myvalue = this.state.bizinfo.map((item) =>{
      let myid=item.id;
      if(myid === itemId){
        this.setState({
            address: item.address,
            allowClientQuotations: item.allowClientQuotations,
            businessName: item.businessName,
            emailHome: item.emailHome,
            emailOffice: item.emailOffice,
            id: itemId,
            imageName: item.imageName,
            imgURL: items.imgURL,
            locationCountry: item.locationCountry,
            log: item.log,
            system_set: item.system_set,
            taxIdentifier: item.taxIdentifier,
            telephoneHome: item.telephoneHome,
            telephoneOffice: itemtelephoneOffice,
            uid: uid
        })
      }
  });

  }

  clear(){
    this.setState({
      address: '',
      allowClientQuotations: flase,
      businessName: '',
      emailHome: '',
      emailOffice: '',
      id: '',
      imageName: '',
      imgURL: '',
      locationCountry: '',
      log: 0,
      system_set: '',
      taxIdentifier: '',
      telephoneHome: '',
      telephoneOffice: '',
      isExists: false
    })

  }

  removeItem(itemId) {
   var m_user = firebase.auth().currentUser;
   var uid = m_user.uid;
   var businessKeyId ="";
   var mBizInfo = this.state.bizinfo.slice();
    for(let x of mBizInfo){
       businessKeyId = x.id;
    }
      const itemRef = firebase.database()
      .ref(`/business_info/${uid}/${itemId}`);
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
    var bizinfoSet = false;
    const footer = () => {
      if(this.state.user){
        mBizInfo = this.state.bizinfo.slice();
          for(let x of mBizInfo){
            businessName = x.businessName;
            address = x.address ;
            emailHome = x.emailHome;
            emailOffice = x.emailOffice ;
            locationCountry = x.locationCountry;
            taxIdentifier = x.taxIdentifier;
            telephoneHome = x.telephoneHome;
            telephoneOffice = x.telephoneOffice;
        }
        var mFooter = businessName+" : "+address+" "+locationCountry + " " +telephoneHome+ " "+ telephoneOffice+" " +emailHome + " " +emailOffice+ " "+
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
                this.initialize();
                return (<div>Loading..</div>);
              }
            if(this.state.displayPane === 'list'){
              const listItems = this.state.bizinfo.map((item) => 
              <li key={item.id}>
               <h3>{item.businessName} </h3>
               <p>Contact: <strong>{item.telephoneHome} {item.telephoneOffice}</strong></p>
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
                <input class="w3-input" type="text" name="firstName" placeholder="First Name" onChange={this.handleChange} value={this.state.firstName} />
                <input class="w3-input" type="text" name="middleName" placeholder="Middle Name" onChange={this.handleChange} value={this.state.middleName} />
                <input class="w3-input" type="text" name="lastName" placeholder="Last Name" onChange={this.handleChange} value={this.state.lastName} />
                <label>Full Name:</label>
                <p class="w3-input" >{this.state.fullName}</p>
                <input class="w3-input" type="text" name="code" placeholder="Code No" onChange={this.handleChange} value={this.state.code} />                
                <input class="w3-input" type="text" name="phone_contact1" placeholder="Phone Contact 1" onChange={this.handleChange} value={this.state.phone_contact1} />
                <input class="w3-input" type="text" name="phone_contact2" placeholder="Phone Contact 2" onChange={this.handleChange} value={this.state.phone_contact2} />                                            
                <input class="w3-input" type="text" name="tax_no" placeholder="Tax No." onChange={this.handleChange} value={this.state.tax_no} />                                                
                <input class="w3-input" type="text" name="email_address" placeholder="Email Address" onChange={this.handleChange} value={this.state.email_address} />
                <input class="w3-input" type="text" name="billing_address" placeholder="Billing Address" onChange={this.handleChange} value={this.state.billing_address} />
                <input class="w3-input" type="text" name="business_identifier" placeholder="Business Identifier" onChange={this.handleChange} value={this.state.business_identifier}/>
                <input class="w3-input" type="text" name="credit_limit" placeholder="Credit Limit" onChange={this.handleChange} value={this.state.credit_limit} />
                <input class="w3-input" type="text" name="delivery_address" placeholder="Delivery Address" onChange={this.handleChange} value={this.state.delivery_address} />
                      
                 <div class="w3-dropdown-hover">
                  <button class="w3-button">Select Currency!</button>
                  <div class="w3-dropdown-content w3-bar-block w3-border">
                   <span class="w3-bar-item w3-button" onClick={this.handleChange} value="">Link 1</span>
                   <span class="w3-bar-item w3-button">Link 2</span>
                   <span class="w3-bar-item w3-button">Link 3</span>
                  </div>
                 </div>
                  <input class="w3-input" type="text" name="currency" placeholder="Currency.." onChange={this.handleChange} value={this.state.currency} />
                  <button type="submit" name="save" style={{width: "20%"}}>Save</button>
                </form>
                </div>
              );
            }          
          }
    }  
    return (
 <div className="w3-container" style={{width: "80%"}}>
  <div className="w3-container w3-teal" >
    <h1>Blue Lines</h1>
    {this.state.user ? <button onClick={this.logout}>Log Out</button>
      : null
    }
    <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Business Names List</button>
    <button onClick={() => this.handleClick(2)} style={{marginLeft: "10px"}}>+Add New</button>
  </div>

  {/*<img src={Dome} alt="Dome Tent" />*/}
  <h1>⛺</h1>
  <div className="w3-container w3-teal" >
        <p>HOME
        <button onClick={() => this.initialize()} style={{marginLeft: "10px"}}>Refresh🔄</button>
        </p>
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

export default Home;
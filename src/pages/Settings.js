import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../style.css'
import TaxSettings from './TaxSettings'

class Settings extends React.Component {
  constructor(){
  super();
    this.state = {
      bizinfo: [],
      displayPane: "settings"
    }

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

  logout(){ 
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      })
  }

  handleClick(index){
    if(index === 1){
        this.setState({
          displayPane: "settings"
        })
    }

    if(index === 3){
      this.setState({
        displayPane: "tax"
      })
    }
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
        )
      }
      return(
        <div>Welcome!</div>
      )
    }
    const renderDefault = () =>{
      if(this.state.displayPane === "tax")
      return(
        <TaxSettings/>
      );
      else{
        return(
        <div>  
        <h1>Settings</h1>
        <div class="w3-row-padding">
          <div class="w3-col s4">
            <h3 style={{width: "100%"}} >Chart of Accounts<br/>
            <i class="fas fa-book"></i></h3>
          </div>
          <div class="w3-col s4" onClick={() => this.handleClick(3)}>
            <h3 style={{width: "100%"}} >Tax Settings<br/>
            <i class="fas fa-balance-scale"></i></h3>
          </div>
          <div class="w3-col s4">
            <h3 style={{width: "100%"}} onClick={() => this.handleClick(4)}>Currencies<br/>
            <i className="fa fa-usd"></i></h3>
          </div>
        </div>
        </div>
        );
      }
    }
    return (
 

    <div className="w3-container" style={{width: "80%"}}>
      <div className="w3-container w3-teal" >
        <h1>Goldwings Investments Limited</h1>
        {this.state.user ? <button onClick={this.logout}>Log Out</button>
        : null
        }
        <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Settings</button>
      </div>
      {/*<img src={Dome} alt="Dome Tent" />*/}
      <h1>⛺</h1>

      <div className="w3-container w3-pink" >
        <p>Wedding Tents, Dome Tents, Chairs, Tables, Seat Covers, Table Cloths, Lights.. services etc </p>
      </div>
        {renderDefault()}
        
      <div className="w3-container w3-teal" >
        <p>{footer()}</p>
      </div>
    </div>
    );
  }
}

export default Settings;
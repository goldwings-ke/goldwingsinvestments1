import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../mystyle.css'
import TaxSettings from './TaxSettings';
import Currency from './Currency';
import ChartOfAccounts from './ChartOfAccounts';
import PaymentType from './PaymentType';
import ClassGroup from './ClassGroup';
import WareHouse from './WareHouse';
import FixedAssets from './FixedAssets';
//import Dome from './Dome.jpg';

class Settings extends React.Component {
  constructor(){
  super();
    this.state = {
      user: null,
      bizinfo: [],
      businessName: '',
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
   var uid = m_user.uid;
   const companyRef = firebase.database().ref('business_info/'+
    uid+'/').orderByChild('id');   
    companyRef.on('value',  snapshot => {
      var items = snapshot.val();
      var newState = [];
      var businessName ="";
        for (let item in items) {    
          businessName: items[item].businessName;    
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
            bizinfo: newState,
            businessName: businessName
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
    if(index === 1)
        this.setState({
          displayPane: "settings"
        })
    
    if(index === 2)
        this.setState({
          displayPane: "chartofaccounts"
        })
    if(index === 3)
      this.setState({
        displayPane: "tax"
      })
    if(index === 4)
      this.setState({
        displayPane: "currency"
      })
    if(index === 5)
      this.setState({
        displayPane: "paymenttype"
      })
    if(index === 6)
      this.setState({
        displayPane: "classgroup"
      })
    if(index === 7)
      this.setState({
        displayPane: "warehouse"
      })    
    if(index === 8)
      this.setState({
        displayPane: "assets"
      })    
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
            businessName = x.businessName;
            address = x.address ;
            emailHome = x.emailHome;
            emailOffice = x.emailOffice ;
            locationCountry = x.locationCountry;
            taxIdentifier = x.taxIdentifier;
            telephoneHome = x.telephoneHome;
            telephoneOffice = x.telephoneOffice;
          }
        var mFooter = businessName+" : "+ address+" "+locationCountry + " " +telephoneHome+ " "+ telephoneOffice+" " +emailHome + " " +emailOffice+ " "+
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
      if(this.state.user == null)
       return <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>;
      else if(this.state.displayPane === "tax")
      return(
        <TaxSettings/>
      );
      else if(this.state.displayPane === "currency")
      return(
        <Currency/>
      );
      else if(this.state.displayPane === "chartofaccounts")
      return(
        <ChartOfAccounts/>
      );
      else if(this.state.displayPane === "paymenttype")
      return(
        <PaymentType/>
      );
      else if(this.state.displayPane === "classgroup")
      return(
        <ClassGroup/>
      );
      else if(this.state.displayPane === "warehouse")
      return(
        <WareHouse/>
      );
     else if(this.state.displayPane === "assets")
      return(
        <FixedAssets/>
      );
      else{
       return(
       <div>  
        <h1>(Click to select)</h1>
        <div class="w3-row-padding">
          <div class="w3-col s6 w3-center" onClick={() => this.handleClick(2)}>
            <h3 >Chart of Accounts &nbsp;
            <i class="fas fa-book"></i></h3>
          </div>
          <div class="w3-col s6 w3-center" onClick={() => this.handleClick(3)}>
            <h3 >Tax Settings  &nbsp;
            <i class="fas fa-balance-scale"></i></h3>
          </div>
        </div>
        <div class="w3-row-padding">
          <div class="w3-col s6 w3-center" onClick={() => this.handleClick(4)}>
            <h3 >Currencies &nbsp;
            <i className="fa fa-usd"></i></h3>
          </div>
          <div class="w3-col s6 w3-center" onClick={() => this.handleClick(5)}>
            <h3 >Payment Type &nbsp;💰</h3>
          </div>
        </div>
        <div class="w3-row-padding">
          <div class="w3-col s6 w3-center" onClick={() => this.handleClick(6)}>
            <h3>Group By Class &nbsp;📋</h3>
          </div> 
          <div class="w3-col s6 w3-center" onClick={() => this.handleClick(7)}>
            <h3>Inventory Warehouse &nbsp;
            🏪</h3>
          </div>  
        </div>  
        <div class="w3-row-padding" >
          <div class="w3-col s6 w3-center" onClick={() => this.handleClick(8)}>
            <h3>Fixed Assets &nbsp;🏠</h3>
          </div>
         </div>  
       </div>
 
        );
      }
    }
    return (
 

    <div className="w3-container" >
      <div className="w3-container w3-teal" >
        <h1>{renderBizName()}</h1>
        {this.state.user ? <button onClick={this.logout}>Log Out</button>
        : null
        }
        <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Settings</button>
      </div>
      {/*<img src={require('./pages/Dome.jpg')} alt="Dome Tent" />*/}
      <h1>⛺</h1>
        <div className="w3-container w3-teal" >
        <p>SETTINGS</p>
      </div>
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
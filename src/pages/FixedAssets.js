import React from "react";
import React from "react";

import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../mystyle.css';

class FixedAssets extends React.Component {
  constructor(){
    super();
      this.state = {
      currentItem: '',
      username: '',
      items: [],
      itemsOrig: [],// immutable
      viewItems :[],
      user: null,
      optionsOne: [],
      classNameUnique: [
        "Land and Buildings","Motor Vehicles","Plant and Machinery",
        "Fixtures and Fittings","Furniture and Equipment",
        "Computers and Accessories"],
      classNoUnique: ["I","II","III","IV"],
      classNoMaped: ["I","II","III","III","III","IV"],
      depreciationRatesUnique: [25,12.5],
      depreciationRatesMaped: [25,12.5,12.5,12.5,12.5,12.5],
      depreciationMethodOptions: ["Straight Line","Reducing Balance"],
      groupOptions: [],
      depreciationOptions:[],
      bizinfo: [],
      asset_Class_Name: '',
      asset_Class_No: '',
      asset_Name: '',
      asset_No: '',
      businessKeyId: '',
      cost: 0,
      depreciation_Method: '',
      depreciation_Rate: 0,
      description: '',
      group: '',
      id: '',
      log: 0,
      logedInUserId: '',
      residual_Value: 0,
      useful_Life: 0,
      newgroup: '',
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
   uid = m_user.uid;
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
      const itemsRef = firebase.database().ref('assets_list/'+
       uid+'/'+businessKeyId)
       .orderByChild('name');
        itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        const classNameUnique = this.state.classNameUnique.slice();
        const classNoMaped = this.state.classNoMaped.slice();
        const depreciationRatesMaped = this.state.depreciationRatesMaped.slice();
        const classNoUnique = this.state.classNoUnique.slice();
        const depreciationRatesUnique = this.state.depreciationRatesUnique.slice();
        let mgroupOption = [];
        let groupUnique = [];
        for (let item in items) {
          let group = items[item].group;
          var n = groupUnique.indexOf(group);
            if(n === -1 ) {//false
              mgroupOption.push({
                value: group,
                label: group
              });
              groupUnique.push(group);
            }

          let classname = items[item].asset_Class_Name;
          var n = classNameUnique.indexOf(classname);
            if(n === -1 ) {//false
              classNameUnique.push(classname);
              classNoMaped.push(items[item].asset_Class_No);
              depreciationRatesMaped.push(items[item].depreciation_Rate);
            }
          let classno = items[item].asset_Class_No;
          var n = classNoUnique.indexOf(classno);
            if(n === -1 ) {//false
              classNoUnique.push(classno);
            }
          let depreciation_Rate = items[item].depreciation_Rate;
          var n = depreciationRatesUnique.indexOf(depreciation_Rate);
            if(n === -1 ) {//false
              depreciationRatesUnique.push(depreciation_Rate);
            }
          newState.push({
            asset_Class_Name: items[item].asset_Class_Name,
            asset_Class_No: items[item].asset_Class_No,
            asset_Name: items[item].asset_Name,
            asset_No: items[item].asset_No,
            businessKeyId: businessKeyId,
            cost: items[item].cost,
            depreciation_Method: '',
            depreciation_Rate: items[item].depreciation_Rate,
            description: items[item].description,
            group: items[item].group,
            id: item,
            log: items[item].log,
            logedInUserId: uid,
            residual_Value: items[item].residual_Value,
            useful_Life: items[item].useful_Life
          });
        }// end for loop
            
        this.setState({
          classNameUnique: classNameUnique,
          classNoMaped: classNoMaped,
          depreciationRatesMaped: depreciationRatesMaped,
          classNoUnique: classNoUnique,
          depreciationRatesUnique: depreciationRatesUnique,
          groupOptions: mgroupOption
        })
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
        
       {this.state.items.filter(item => item.asset_Name.
        includes(searchTerm)).map(filteredItem => (
          newState.push({   
            asset_Class_Name: filteredItem.asset_Class_Name,
            asset_Class_No: filteredItem.asset_Class_No,
            asset_Name: filteredItem.asset_Name,
            asset_No: filteredItem.asset_No,
            businessKeyId: filteredItem.businessKeyId,
            cost: filteredItem.cost,
            depreciation_Method: filteredItem.depreciation_Method,
            depreciation_Rate: filteredItem.depreciation_Rate,
            description: filteredItem.description,
            group: filteredItem.group,
            id: filteredItem.id,
            log: filteredItem.log,
            logedInUserId: filteredItem.logedInUserId,
            residual_Value: filteredItem.residual_Value,
            useful_Life: filteredItem.useful_Life
          })
        ))}

        this.setState({
          items: newState
        })
      }
    }  else if(e.target.name === 'asset_Class_Name' || e.target.name === 'newasset_Class_Name') {
      var  asset_Class_Name = "";
      var newasset_Class_Name = "";
        if(e.target.name === 'asset_Class_Name'){
            asset_Class_Name = e.target.value;
        } else {
           asset_Class_Name = e.target.value;
           newasset_Class_Name = e.target.value;
        }
        this.setState({
             asset_Class_Name: asset_Class_Name,
          newasset_Class_Name: asset_Class_Name
        })
    } else if(e.target.name === 'asset_Class_No' || e.target.name === 'newasset_Class_No') {
      var  asset_Class_No = "";
      var newasset_Class_No = "";
        if(e.target.name === 'asset_Class_No'){
            asset_Class_No = e.target.value;
        } else {
           asset_Class_No = e.target.value;
           newasset_Class_No = e.target.value;
        }
        this.setState({
             asset_Class_No: asset_Class_No,
          newasset_Class_No: asset_Class_No
        })
    } else if(e.target.name === 'group' || e.target.name === 'newgroup') {
      var group = "";
      var newgroup = "";
        if(e.target.name === 'group'){
            group = e.target.value;
        } else {
           group = e.target.value;
           newgroup = e.target.value;
        }
        this.setState({
             group: group,
          newgroup: group
        })
    } else if(e.target.name === 'depreciation_Method' || e.target.name === 'newdepreciation_Method') {
      var depreciation_Method = "";
      var newdepreciation_Method = "";
        if(e.target.name === 'depreciation_Method'){
            depreciation_Method = e.target.value;
        } else {
           depreciation_Method = e.target.value;
           newdepreciation_Method = e.target.value;
        }
        this.setState({
             depreciation_Method: depreciation_Method,
          newdepreciation_Method: depreciation_Method
        })
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
        itemsRef = firebase.database().ref('assets_list/'+uid+'/'+businessKeyId+'/'+this.state.id);
        saved = "Updated!";
        const item = {
          asset_Class_Name: this.state.asset_Class_Name,
          asset_Class_No: this.state.asset_Class_No,
          asset_Name: this.state.asset_Name,
          asset_No: this.state.asset_No,
          businessKeyId: businessKeyId,
          cost: this.state.cost,
          depreciation_Method: this.state.depreciation_Method,
          depreciation_Rate: this.state.depreciation_Rate,
          description: this.state.description,
          group: this.state.group,
          id: this.state.id,
          log: n,
          logedInUserId: uid,
          residual_Value: this.state.residual_Value,
          useful_Life: this.state.useful_Life
        }
        itemsRef.set(item);
      }    
      else {
        itemsRef = firebase.database().ref('assets_list/'+uid+'/'+businessKeyId);
        const item = {
          asset_Class_Name: this.state.asset_Class_Name,
          asset_Class_No: this.state.asset_Class_No,
          asset_Name: this.state.asset_Name,
          asset_No: this.state.asset_No,
          businessKeyId: businessKeyId,
          cost: this.state.cost,
          depreciation_Method: this.state.depreciation_Method,
          depreciation_Rate: this.state.depreciation_Rate,
          description: this.state.description,
          group: this.state.group,
          log: n,
          logedInUserId: uid,
          residual_Value: this.state.residual_Value,
          useful_Life: this.state.useful_Life
          }
        itemsRef.push(item);
      }

      this.setState({
        displayPane: 'list',
        items: this.state.itemsOrig,
        isExists: true
      })
      
      
      alert(saved);
      this.clear();
      this.initialize2();
      
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

  var myvalue = this.state.items.map((item) =>{
      let myid=item.id;
      if(myid === itemId){
        this.setState({
          asset_Class_Name: item.asset_Class_Name,
          asset_Class_No: item.asset_Class_No,
          asset_Name: item.asset_Name,
          asset_No: item.asset_No,
          businessKeyId: item.businessKeyId,
          cost: item.cost,
          depreciation_Method: item.depreciation_Method,
          depreciation_Rate: item.depreciation_Rate,
          description: item.description,
          group: item.group,
          id: itemId,
          log: item.log,
          logedInUserId: item.logedInUserId,
          residual_Value: item.residual_Value,
          useful_Life: item.useful_Life
            
        })
      }
  });

  }

  clear(){
    this.setState({
      asset_Class_Name: '',
      asset_Class_No: '',
      asset_Name: '',
      asset_No: '',
      cost: 0,
      depreciation_Method: '',
      depreciation_Rate: 0,
      description: '',
      group: '',
      id: '',
      log: 0,
      logedInUserId: '',
      residual_Value: 0,
      useful_Life: 0,
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
      .ref(`/assets_list/${uid}/${businessKeyId}/${itemId}`);
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
               <h3>{item.asset_Name}</h3>
               <p><strong>{item.asset_Class_Name} : {item.asset_Class_No}</strong></p>
                <p><button onClick={() => this.viewItem(item.id)}>View</button>
                <button onClick={() => this.removeItem(item.id)} style={{marginLeft: "10px"}}>Remove</button>
               </p>
             </li>
              );
              return(
              <div><input class="w3-input" type="text" name="searchbar" placeholder="Search Fixed Asset name.." onChange={this.handleChange}/>
              <ul>{listItems}</ul></div>
              );    
            }
            else{
              /* display form */
              return(
                <div>
        <button class="w3-button w3-yellow" style={{float: "right"}} type = "submit" onClick={() => this.clear()}>Clear</button>
                  <form class="w3-container" onSubmit={this.handleSubmit} >
                    <input class="w3-input" type="text" name="asset_Name" placeholder="Asset Name" onChange={this.handleChange} value={this.state.asset_Name} />
                    <input class="w3-input" type="text" name="asset_No" placeholder="Asset No" onChange={this.handleChange} value={this.state.asset_No} />
                    <input class="w3-input" type="text" name="description" placeholder="Description" onChange={this.handleChange} value={this.state.description} />
                <label>Group:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu8 = input} name="group" onChange={this.handleChange}>
                  {this.state.groupOptions.map((group) => {
                  if(group.value === this.state.group)
                    return (
                      <option value ={group.value} selected>{group.label}</option>
                    )
                  else return (
                      <option value ={group.value}>{group.label}</option>
                    )  
                  })}
                </select><br/>
                  <label>New  Group:</label><br/>
                    <input class="w3-input" type="text" name="newgroup" placeholder="New Group" onChange={this.handleChange} ref = {(input)=> this.menu9 = input} value={this.state.newgroup} />
                <label>Asset Class No:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu = input} name="asset_Class_No" onChange={this.handleChange}>
                  {this.state.classNoUnique.map((depr) => {
                    if(depr === this.state.asset_Class_No)
                    return (
                      <option value ={depr} selected>{depr}</option>
                    ) 
                    else return (
                      <option value ={depr}>{depr}</option>
                    )
                  })}
               </select>
                <input class="w3-input" type="text" name="newasset_Class_No" placeholder="New Asset Class No" onChange={this.handleChange} ref = {(input)=> this.menu2 = input} />
                <label>Asset Class Name:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu3 = input} name="asset_Class_Name" onChange={this.handleChange}>
                  {this.state.classNameUnique.map((depr) => {
                    if(depr === this.state.asset_Class_Name)
                    return (
                      <option value ={depr} selected>{depr}</option>
                    ) 
                    else return (
                      <option value ={depr}>{depr}</option>
                    )
                  })}
               </select>
                <input class="w3-input" type="text" name="newasset_Class_Name" placeholder="New Asset Class Name" onChange={this.handleChange} ref = {(input)=> this.menu4 = input} />
                <label>Depreciation Rate %:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu5 = input} name="depreciation_Rate" onChange={this.handleChange}>
                  {this.state.depreciationRatesUnique.map((depr,index) => {
                    if(depr === this.state.depreciation_Rate)
                    return (
                      <option value ={depr} selected>{depr}</option>
                    ) 
                    else return (
                      <option value ={depr}>{depr}</option>
                    )
                  })}
               </select><br/>
               <label>New Depreciation Rate %</label><br/>
                <input class="w3-input" type="number" name="newdepreciation_Rate" placeholder="0.0" onChange={this.handleChange} ref = {(input)=> this.menu6 = input} />
                <label>Depreciation Method:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu7 = input} name="depreciation_Method" onChange={this.handleChange}>
                  {this.state.depreciationMethodOptions.map((depr_options) => {
                    if(depr_options === this.state.depreciation_Method)
                    return (
                      <option value ={depr_options} selected>{depr_options}</option>
                    ) 
                    else return (
                      <option value ={depr_options}>{depr_options}</option>
                    )
                  })}
               </select>
               <input class="w3-input" type="text" name="newdepreciation_Method" placeholder="New Depreciation method" onChange={this.handleChange} ref = {(input)=> this.menu8 = input} />
               <label>Cost:</label>
               <input class="w3-input" type="number" name="cost" placeholder="0.0" onChange={this.handleChange} value={this.state.cost} />
               <label>Useful Life (Years)</label>
               <input class="w3-input" type="number" name="useful_Life" placeholder="0.0" onChange={this.handleChange} value={this.state.useful_Life} />
               <label>Residual Value</label>
               <input class="w3-input" type="number" name="residual_Value" placeholder="0.0" onChange={this.handleChange} value={this.state.residual_Value} />
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
    <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Fixed Assets List</button>
    <button onClick={() => this.handleClick(2)} style={{marginLeft: "10px"}}>+Add New👑</button>
  </div>
 
  {renderAuthButton()}
 
</div>
  );
 }
}

export default FixedAssets;
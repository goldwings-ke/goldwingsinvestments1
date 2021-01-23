import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../style.css'

class Inventory extends React.Component {
  constructor(){
    super();
        this.state = {
      path: 'inventory',
      base_currency: '',
      currentItem: '',
      username: '',
      items: [],
      itemsOrig: [],// immutable
      taxItems: [],
      taxOptions: [],
      user: null,
      stockIssueOptions: ['FIFO','LIFO','Weighted Average'],
      bizinfo: [],
      businessKeyId: '',
      cost_Price: 0,
      depth: 0,
      description: '',
      id: '',
      lead_Time_Days: 0,
      location: '',
      log: 0,
      main_Account: '',
      myIndex: 0,
      ref: '',
      reorder_Level: 0,
      reorder_Qty: 0,
      sale_Price: 0,
      stock_Issue_Method: '',
      stock_Name: '',
      stock_No: '',
      taxType: '',
      tax_Rate: 0,
      uid: '',
      warehouse: '',
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
      const itemsRef = firebase.database().ref('inventory/'+
       uid+'/'+businessKeyId)
       .orderByChild('main_Account');
        itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];

          newState.push({
            businessKeyId: businessKeyId,
            cost_Price: 0,
            depth: 0,
            description: '',
            id: '',
            lead_Time_Days: 0,
            location: '',
            log: 0,
            main_Account: 'NONE',
            myIndex: 0,
            ref: 'NONE',
            reorder_Level: 0,
            reorder_Qty: 0,
            sale_Price: 0,
            stock_Issue_Method: 'NONE',
            stock_Name: 'NONE',
            stock_No: '',
            taxType: 'NONE',
            tax_Rate: 0,
            uid: uid,
            warehouse: ''
          })

        for (let item in items) {

          newState.push({
            businessKeyId: businessKeyId,
            cost_Price: items[item].cost_Price,
            depth: items[item].depth,
            description: items[item].description,
            id: item,
            lead_Time_Days: items[item].lead_Time_Days,
            location: items[item].location,
            log: items[item].log,
            main_Account: items[item].main_Account,
            myIndex: items[item].myIndex,
            ref: items[item].ref,
            reorder_Level: items[item].reorder_Level,
            reorder_Qty: items[item].reorder_Qty,
            sale_Price: items[item].sale_Price,
            stock_Issue_Method: items[item].stock_Issue_Method,
            stock_Name: items[item].stock_Name,
            stock_No: items[item].stock_No,
            taxType: items[item].taxType,
            tax_Rate: items[item].tax_Rate,
            uid: uid,
            warehouse: items[item].warehouse
          })
        }// end for loop
        
        this.setState({
          items: newState,
          itemsOrig: newState
        });
      }); 
// populate Tax codes
  var count = 0;
    const taxRef = firebase.database().ref('tax_codes/'+
       uid+'/'+businessKeyId);
        taxRef.on('value', (snapshot) => {
          let tax_items = snapshot.val();
          let newTaxState = [];
          let taxOption = [];
            for (let mTaxItem in tax_items) {
              let type = tax_items[mTaxItem].tax_code;
              let rate = tax_items[mTaxItem].tax_rate;
              if(count === 0){
                taxOption.push({
                  value: "NONE",
                  label: "NONE"
                });

                newTaxState.push({
                  id: "NONE",
                  businessKeyId: tax_items[mTaxItem].businessKeyId,
                  log: tax_items[mTaxItem].log,
                  taxType: "NONE",
                  tax_rate: 0,
                  uid: tax_items[mTaxItem].uid,
                });
              }
              
              taxOption.push({
                value: type,
                label: type
              });
              newTaxState.push({
                id: mTaxItem,
                businessKeyId: tax_items[mTaxItem].businessKeyId,
                log: tax_items[mTaxItem].log,
                taxType: tax_items[mTaxItem].tax_code,
                tax_rate: tax_items[mTaxItem].tax_rate,
                uid: tax_items[mTaxItem].uid,
              });
              count++;
            }
            this.setState({
              taxItems: newTaxState,
              taxOptions: taxOption
            });
        });
      if(count === 0){
       let type = "NONE";
       let taxOption = [];
        taxOption.push({
          value: type,
          label: type
        });

        this.setState({
          taxOptions: taxOption
        });
      }

      //Base base_currency
       const itemsRef = firebase.database().ref('currencies/'+
       uid+'/'+businessKeyId)
       .orderByChild('country');
        itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let mBaseCurrency = '';
        for (let item in items) {
          if(items[item].base_currency === true)
            base_currency = items[item].name;
        }// end for loop
        this.setState({
          base_currency: mBaseCurrency,
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
        
       {this.state.items.filter(item => item.stock_Name.
        includes(e.target.value)).map(filteredItem => (
          newState.push({
            businessKeyId: filteredItem.businessKeyId,
            cost_Price: filteredItem.cost_Price,
            depth: filteredItem.depth,
            description: filteredItem.description,
            id: filteredItem.id,
            lead_Time_Days: filteredItem.lead_Time_Days,
            location: filteredItem.location,
            log: filteredItem.log,
            main_Account: filteredItem.main_Account,
            myIndex: filteredItem.myIndex,
            ref: filteredItem.ref,
            reorder_Level: filteredItem.reorder_Level,
            reorder_Qty: filteredItem.reorder_Qty,
            sale_Price: filteredItem.sale_Price,
            stock_Issue_Method: filteredItem.stock_Issue_Method,
            stock_Name: filteredItem.stock_Name,
            stock_No: filteredItem.stock_No,
            taxType: filteredItem.taxType,
            tax_Rate: filteredItem.tax_rate,
            uid: filteredItem.uid,
            warehouse: filteredItem.warehouse
          })
        ))}

        this.setState({
          items: newState
        })
      }
    } else
      this.setState({
        [e.target.name]: e.target.value.trim()
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
    var mDepth = 2;
    var itemName = this.state.itemName;
      if(itemName === ''){
        alert("Please Enter Item name!");
        return;
      }
    var m_user = firebase.auth().currentUser;
    var uid = m_user.uid;

    var itemName = this.state.itemName;
    var mRef = this.menu3.value.trim();
      if(mRef === "" )
        mRef = "NONE";
    var mMainAccount = "";
      if(mRef === "NONE" ){
        mMainAccount = "NONE";
        mDepth = 0;
      } else{
        var myitemsOrig = this.state.itemsOrig.slice(); 
          for (let item of myitemsOrig) {
            if(item.ref === mRef){
              mMainAccount = item.mainAccount;
              mDepth = item.depth + 1;
            }
          }   
      }

    var mCostPrice = this.state.costPrice;
    var mSalePrice = this.state.salePrice;
    var category = this.menu.value;
    var taxtype = this.menu2.value;
      if(taxtype === null || taxtype === '')
        taxtype = "NONE";
      if(this.state.category !== '')
        category = this.state.category;
      if(mCostPrice < 0)
        mCostPrice = 0.0;
      if(mSalePrice < 0)
        mSalePrice = 0.0;
    var saved = "Saved!";    
    var itemsRef = null;

      if(this.state.isExists){
        itemsRef = firebase.database().ref('inventory/'+uid+'/-M7sDl_6e3H4iUPEEyuI/'+this.state.id);
        saved = "Updated!";
        const item = {
          businessKeyId: this.state.businessKeyId,
          cost_Price: this.state.cost_Price,
          depth: this.state.depth,
          description: this.state.description,
          id: this.state.id,
          lead_Time_Days: this.state.lead_Time_Days,
          location: this.state.location,
          log: this.state.log,
          main_Account: this.state.main_Account,
          myIndex: this.state.myIndex,
          ref: this.state.ref,
          reorder_Level: this.state.reorder_Level,
          reorder_Qty: this.state.reorder_Qty,
          sale_Price: this.state.sale_Price,
          stock_Issue_Method: this.state.stock_Issue_Method,
          stock_Name: this.state.stock_Name,
          stock_No: this.state.stock_No,
          taxType: this.state.taxType,
          tax_Rate: this.state.tax_Rate,
          uid: this.state.uid,
          warehouse: this.state.warehouse
        }
        itemsRef.set(item);
      }    
      else {
        itemsRef = firebase.database().ref('inventory/'+uid+'/-M7sDl_6e3H4iUPEEyuI');
        const item = {
          businessKeyId: this.state.businessKeyId,
          cost_Price: this.state.cost_Price,
          depth: this.state.depth,
          description: this.state.description,
          lead_Time_Days: this.state.lead_Time_Days,
          location: this.state.location,
          log: this.state.log,
          main_Account: this.state.main_Account,
          myIndex: this.state.myIndex,
          ref: this.state.ref,
          reorder_Level: this.state.reorder_Level,
          reorder_Qty: this.state.reorder_Qty,
          sale_Price: this.state.sale_Price,
          stock_Issue_Method: this.state.stock_Issue_Method,
          stock_Name: this.state.stock_Name,
          stock_No: this.state.stock_No,
          taxType: this.state.taxType,
          tax_Rate: this.state.tax_Rate,
          uid: this.state.uid,
          warehouse: this.state.warehouse
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
      //  this.menu3.value = item.ref;
      //  this.menu.value = item.category;
        this.setState({
           businessKeyId: item.businessKeyId,
          cost_Price: item.cost_Price,
          depth: item.depth,
          description: this.state.description,
          id: itemId,
          lead_Time_Days: item.lead_Time_Days,
          location: item.location,
          log: item.log,
          main_Account: item.main_Account,
          myIndex: item.myIndex,
          ref: item.ref,
          reorder_Level: item.reorder_Level,
          reorder_Qty: item.reorder_Qty,
          sale_Price: item.sale_Price,
          stock_Issue_Method: item.stock_Issue_Method,
          stock_Name: item.stock_Name,
          stock_No: item.stock_No,
          taxType: item.taxType,
          tax_Rate: item.tax_Rate,
          uid: item.uid,
          warehouse: this.state.warehouse,
          isExists: true
        })

      }

  });

  }

  clear(){
    this.setState({
      cost_Price: 0,
      depth: 0,
      description: '',
      id: '',
      lead_Time_Days: 0,
      location: '',
      log: 0,
      main_Account: '',
      myIndex: 0,
      ref: '',
      reorder_Level: 0,
      reorder_Qty: 0,
      sale_Price: 0,
      stock_Issue_Method: '',
      stock_Name: '',
      stock_No: '',
      taxType: '',
      tax_Rate: 0,
      warehouse: '',
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
      .ref(`/inventory/${uid}/${businessKeyId}/${itemId}`);
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
               <h3>{item.stock_Name} {this.state.base_currency}{item.cost_Price}</h3>
               <p>Category: <strong>{item.main_Account}</strong></p>
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

    //  ref: ''
                <div>
        <button class="w3-button w3-yellow" style={{float: "right"}} type = "submit" onClick={() => this.clear()}>Clear</button>
                <form class="w3-container" onSubmit={this.handleSubmit} >
                <input class="w3-input" type="text" name="stock_Name" placeholder="Stock Name" onChange={this.handleChange} value={this.state.stock_Name} />
                <input class="w3-input" type="text" name="stock_No" placeholder="Stock No" onChange={this.handleChange} value={this.state.stock_No} />
                <input class="w3-input" type="text" name="description" placeholder="Description" onChange={this.handleChange} value={this.state.description} />
                <label>Sub Item Of:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu3 = input}>
                  {this.state.items.map((item,index) => {
                  var rfbDepth = item.depth;
                  var rfbItemName = item.itemName;
                  var myTxt ="";
                    for(let i=0;i<rfbDepth;i++)
                      myTxt += " ";
                      myTxt +=rfbItemName;
                      return (
                        <option value ={myTxt}>{rfbItemName}</option>
                      )
                  })}
                </select><br/>
                <label>Stock Issue Method:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu = input} >
                  {this.state.stockIssueOptions.map((stock) => {
                    return (
                      <option value ={stock}>{stock}</option>
                    )
                  })}
                </select><br/>
                <label>Re-order Level:</label><br/>
                <input class="w3-input" type="number" name="reorder_Level" placeholder="0.0" onChange={this.handleChange} value={this.state.reorder_Level} />      
                <label>Re-order Qty:</label><br/>          
                <input class="w3-input" type="number" name="reorder_Qty" placeholder="0.0" onChange={this.handleChange} value={this.state.reorder_Qty} />
                <label>Lead Time (Days):</label><br/>
                <input class="w3-input" type="number" name="lead_Time_Days" placeholder="0.0" onChange={this.handleChange} value={this.state.lead_Time_Days} />
                <input class="w3-input" type="text" name="location" placeholder="Location" onChange={this.handleChange} value={this.state.location} />
                <label>Cost Price: </label>
                <input class="w3-input" type="number" name="cost_Price" placeholder="0.0" onChange={this.handleChange} value={this.state.cost_Price} />   
                <label>Sale Price:</label>   
                <input class="w3-input" type="number" name="sale_Price" placeholder="0.0" onChange={this.handleChange} value={this.state.sale_Price} />
                <label>Tax Type:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu2 = input}>
                  {this.state.taxOptions.map((tax,index) => {
                    return (
                      <option value ={tax.value}>{tax.label}</option>
                    )
                  })}
               </select>
                <p>Tax Rate: {this.state.tax_Rate}</p>
                <input class="w3-input" type="text" name="warehouse" placeholder="Store Name" onChange={this.handleChange} value={this.state.warehouse} />
                  <button type="submit" name="save" style={{maxWidth: "20%"}}>Save</button>
                </form>
                </div>
              );
            }          
          }
    }  
    return (
 <div className="w3-container" style={{width: "80%"}}>
  <div className="w3-container w3-teal" >
    <h1>Goldwings Investments Limited</h1>
    {this.state.user ? <button onClick={this.logout}>Log Out</button>
      : null
    }
    <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Inventory Items List</button>
    <button onClick={() => this.handleClick(2)} style={{marginLeft: "10px"}}>+Add New</button>
  </div>

  {/*<img src={Dome} alt="Dome Tent" />*/}
  <h1>⛺</h1>

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

export default Inventory;
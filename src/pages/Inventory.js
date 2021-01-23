import React, {Component} from "react";
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase.js';
import '../style.css'

class Inventory extends React.Component {
  constructor(){
    super();
        this.state = {
      path: 'non_inventory_items',
      currentItem: '',
      username: '',
      items: [],
      itemsOrig: [],// immutable
      user: null,
      optionsOne: [],
      bizinfo: [],
      currencyItems: [],
      id: '',
      barCode: '', 
      businessKeyId: '',
      category: '',
      costPrice:  0.0,
      depth:   0,
      description: '',
      itemName:'',
      log: 0,
      mainAccount:  '', 
      ref:  '',
      salePrice:  0.0,
      taxType: '',
      tax_rate: 0.0,
      uid: 'QK4rcq2YhZf5BoNsXklZShBTwHw1',
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
      const itemsRef = firebase.database().ref('non_inventory_items/'+
       uid+'/'+businessKeyId)
       .orderByChild('category');
        itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        let categoryOption = [];
        let categoryUnique = [];
        for (let item in items) {
          let cat = items[item].category;
          var n = categoryUnique.indexOf(cat);
            if(n === -1 ) {//false
              categoryOption.push({
                value: cat,
                label: cat
              });
              categoryUnique.push(cat);
            }

          newState.push({
            id: item,
            barCode: items[item].barCode, 
            businessKeyId:  items[item].businessKeyId,
            category: items[item].category,
            costPrice:  items[item].costPrice,
            depth:   items[item].depth,
            description:  items[item].description,
            itemName: items[item].itemName,
            log:  items[item].log,
            mainAccount:  items[item].mainAccount, 
            ref:  items[item].ref,
            salePrice:  items[item].salePrice,
            taxType:  items[item].taxType,
            uid:  items[item].uid
          });
              
        }// end for loop
        
        this.setState({
          items: newState,
          itemsOrig: newState,
          optionsOne: categoryOption
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
              optionsTwo: taxOption
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
          optionsTwo: taxOption
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
        
       {this.state.items.filter(item => item.itemName.
        includes(e.target.value)).map(filteredItem => (
          newState.push({
          id: filteredItem.id,
          barCode: filteredItem.barCode, 
          businessKeyId:  filteredItem.businessKeyId,
          category: filteredItem.category,
          costPrice:  filteredItem.costPrice,
          depth:   filteredItem.depth,
          description:  filteredItem.description,
          itemName: filteredItem.itemName,
          log:  filteredItem.log,
          mainAccount:  filteredItem.mainAccount, 
          ref:  filteredItem.ref,
          salePrice:  filteredItem.salePrice,
          taxType:  filteredItem.taxType,
          uid:  filteredItem.uid
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
        itemsRef = firebase.database().ref('non_inventory_items/'+uid+'/-M7sDl_6e3H4iUPEEyuI/'+this.state.id);
        saved = "Updated!";
        const item = {
          barCode: this.state.barCode, 
          businessKeyId:  this.state.businessKeyId,
          category: category,
          costPrice:  mCostPrice,
          depth:   mDepth,
          description: this.state.description,
          id: this.state.id,
          itemName: itemName,
          log: n,
          mainAccount:  mMainAccount, 
          ref:  mRef,
          salePrice:  mSalePrice,
          taxType:  taxtype,
          uid:  this.state.uid
        }
        itemsRef.set(item);
      }    
      else {
        itemsRef = firebase.database().ref('non_inventory_items/'+uid+'/-M7sDl_6e3H4iUPEEyuI');
        const item = {
          barCode: this.state.barCode, 
          businessKeyId:  this.state.businessKeyId,
          category: category,
          costPrice:  mCostPrice,
          depth:   mDepth,
          description: this.state.description,
          itemName: itemName,
          log: n,
          mainAccount:  mMainAccount, 
          ref:  mRef,
          salePrice:  mSalePrice,
          taxType:  taxtype,
          uid:  this.state.uid
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
            id: itemId,
            barCode: item.barCode, 
            businessKeyId:  item.businessKeyId,
            category: item.category,
            costPrice:  item.costPrice,
            depth:   item.depth,
            description:  item.description,
            itemName: item.itemName,
            log:  item.log,
            mainAccount:  item.mainAccount, 
            ref:  item.ref,
            salePrice:  item.salePrice,
            taxType:  item.taxType,
            uid:  item.uid,
            isExists: true
        })

      }

  });

  }

  clear(){
    this.setState({
      id: '',
      barCode: '', 
      businessKeyId:  '',
      category: '',
      costPrice:  0.0,
      depth:   '',
      description:  '',
      itemName: '',
      log:  0,
      mainAccount:  '', 
      ref:  '',
      salePrice:  0.0,
      taxType:  '',
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
      .ref(`/non_inventory_items/${uid}/${businessKeyId}/${itemId}`);
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
               <h3>{item.itemName} sh{item.salePrice}</h3>
               <p>Category: <strong>{item.category}</strong></p>
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
                <input class="w3-input" type="text" name="itemName" placeholder="Item Name" onChange={this.handleChange} value={this.state.itemName} />
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
                <label>Category:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu = input} >
                  {this.state.optionsOne.map((cat,index) => {
                    return (
                      <option value ={cat.value}>{cat.label}</option>
                    )
                  })}
                </select><br/>
                <input class="w3-input" type="text" name="category" placeholder="New Category" onChange={this.handleChange} value={this.state.category} />                
                <input class="w3-input" type="text" name="barCode" placeholder="Bar Code" onChange={this.handleChange} value={this.state.barCode} />
                <input class="w3-input" type="text" name="description" placeholder="Description" onChange={this.handleChange} value={this.state.description} />
                <label>Cost Price: </label>
                <input class="w3-input" type="number" name="costPrice" placeholder="0.0" onChange={this.handleChange} value={this.state.costPrice} />   
                <label>Sale Price:</label>   
                <input class="w3-input" type="number" name="salePrice" placeholder="0.0" onChange={this.handleChange} value={this.state.salePrice} />
                <label>Tax Type:</label><br/>
                <select id = "dropdown" ref = {(input)=> this.menu2 = input}>
                  {this.state.optionsTwo.map((tax,index) => {
                    return (
                      <option value ={tax.value}>{tax.label}</option>
                    )
                  })}
               </select>
                  <input class="w3-input" type="text" name="taxType" placeholder="Tax Type" onChange={this.handleChange} value={this.state.taxType} />
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
    <button onClick={() => this.handleClick(1)} style={{marginLeft: "10px"}}>Non-Inventory Items List</button>
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
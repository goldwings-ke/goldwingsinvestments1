import React, { Component } from 'react';
import '../mystyle.css';
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase';
import ReactTable from "react-table"; 
import styled from "styled-components";

// Styled component named StyledButton
const StyledButton = styled.button`
  background-color: black;
  font-size: 16px;
  color: white;
`;
class Invoices extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      bizinfo: [],
      items: [],
      itemsOrig: [],
      itemsAll: [],
      itemsInvoice: [],
      itemsQuote: [],
      itemsStocks: [],
      taxItems: [],
      classItems: [],
      user: null,
      displayPanel: 'invoiceList',
      id: '',
      invoiceNoPushId: '',
      businessKeyId: '',
      address:  '',
      businessName: '',
      emailHome: '',
      emailOffice: '',
      locationCountry: '',
      taxIdentifier: '',
      telephoneHome: '',
      telephoneOffice: '',
          ACCOUNT_NAME: '',
          ADDRESS: '',
          AMOUNT: 0,
          COMMENT: '',
          CUSTOMER_ORDER_DATE: '',
          DELIVERY_DATE: 0,
          DELIVERY_NO: '',
          DESCRIPTION: '',
          DISPATCHED_DATE: 0,
          DISPATCHED_THRU: '',
          INVOICE_DATE: 0,
          INVOICE_DATE_TXT: '',
          INVOICE_NO: '',
          INVOICE_TYPE: '',
          ITEMS: '',
          LINE_NO: 0,
          MEMO: '',
          MYCLASS:'',
          NAME: '',
          PRICE: 0.0,
          PROFORMA_DATE: 0,
          PROFORMA_NO: '',
          QTY: 0.0,
          TAX: 0.0,
          TAX_RATE: 0.0,
          TAX_TYPE: '',
          TOTAL: 0.0,
          UNITS: '',
          USER_NAME: '',
          debtorsledger_contra_id: '',
          log: 0,
          loged_in_user_id: '',
          posting_contra_id: '',
          uniqueRowId: '',
          unique_id: '',
          initialized: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this); 
    this.handleInvoice = this.handleInvoice.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.initialize = this.initialize.bind(this);
    this.initialize2 = this.initialize2.bind(this);
    this.removeEmptyRow = this.removeEmptyRow.bind(this);
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

  handleRefresh(e){
       this.setState({
          items: this.state.itemsOrig
       })
  }

  handleChange(e) {

    if(e.target.name === "searchbar"){
      if(e.target.value === ""){
       this.setState({
          items: this.state.itemsOrig
       })
      } else
      {
        let newState = [];
        var searchTerm = e.target.value;
        var firstLetter = searchTerm.slice(0,1).toUpperCase();
        var remainingLetters = searchTerm.slice(1);
        searchTerm=firstLetter+remainingLetters;
        
        {this.state.items.filter(item => item.NAME.
          includes(searchTerm)).map(filteredItem => (
            newState.push({
              id: filteredItem.itemId,
              NAME: filteredItem.NAME,
              MEMO: filteredItem.MEMO,
              INVOICE_DATE_TXT: filteredItem.INVOICE_DATE_TXT,
              INVOICE_DATE: filteredItem.INVOICE_DATE,
              TOTAL: filteredItem.TOTAL,
              invoiceNoPushId: filteredItem.invoiceNoPushId
          })
        ))}

        this.setState({
          items: newState
        })
      }
    } else {
        var my_id = e.target.id;
        var targetName = e.target.name;
        var newState = [];
      var myvalue = this.state.itemsInvoice.map((item) => {
      let myid=item.id;
      var ACCOUNT_NAME = item.ACCOUNT_NAME;
      var ADDRESS = item.ADDRESS;
      var AMOUNT = item.AMOUNT;
      var COMMENT = item.COMMENT;
      var CUSTOMER_ORDER_DATE = item.CUSTOMER_ORDER_DATE;
      var DELIVERY_DATE = item.DELIVERY_DATE;
      var DELIVERY_NO = item.DELIVERY_NO;
      var DESCRIPTION = item.DESCRIPTION;
      var DISPATCHED_DATE = item.DISPATCHED_DATE;
      var DISPATCHED_THRU = item.DISPATCHED_THRU;
      var INVOICE_DATE = item.INVOICE_DATE;
      var INVOICE_DATE_TXT = item.INVOICE_DATE_TXT;
      var INVOICE_NO = item.INVOICE_NO;
      var INVOICE_TYPE = item.INVOICE_TYPE;
      var ITEMS = item.ITEMS;
      var LINE_NO = item.LINE_NO;
      var MEMO = item.MEMO;
      var MYCLASS = item.MYCLASS;
      var NAME = item.NAME;
      var PRICE = item.PRICE;
      var PROFORMA_DATE = item.PROFORMA_DATE;
      var PROFORMA_NO = item.PROFORMA_NO;
      var QTY = item.QTY;
      var TAX = item.TAX;
      var TAX_RATE = item.TAX_RATE;
      var TAX_TYPE = item.TAX_TYPE;
      var TOTAL = item.TOTAL;
      var UNITS = item.UNITS;
      var USER_NAME = item.USER_NAME;
      var businessKeyId = item.businessKeyId;
      var debtorsledger_contra_id = item.debtorsledger_contra_id;
      var id = item.id;
      var invoiceNoPushId = item.invoiceNoPushId;
      var log = item.log;
      var loged_in_user_id = item.loged_in_user_id;
      var posting_contra_id = item.posting_contra_id;
      var uniqueRowId = item.uniqueRowId;
      var unique_id = item.unique_id;
      
      var recalc = false;
      if(myid === my_id){
        if(targetName === 'ITEMS'){
          ITEMS = e.target.value;
        }
        if(targetName === 'QTY'){
          QTY = Number(e.target.value);
          recalc = true;
         
        }
        if(targetName === 'PRICE'){
          PRICE = Number(e.target.value);
          recalc = true;
        }

        if(targetName === 'TAX_TYPE'){
          TAX_TYPE = e.target.value;
          var mytaxrate = this.state.taxItems.map((item) =>{
            if(item.taxType === TAX_TYPE)
              TAX_RATE = item.tax_rate;
          })
          recalc = true;
        }
        if(recalc){
            AMOUNT = QTY * PRICE;
            TAX = (TAX_RATE * AMOUNT) / 100;
            TOTAL = TAX + AMOUNT;
        }
      }
        newState.push({
          ACCOUNT_NAME: ACCOUNT_NAME,
          ADDRESS: ADDRESS,
          AMOUNT: AMOUNT,
          COMMENT: COMMENT,
          CUSTOMER_ORDER_DATE: CUSTOMER_ORDER_DATE,
          DELIVERY_DATE: DELIVERY_DATE,
          DELIVERY_NO: DELIVERY_NO,
          DESCRIPTION: DESCRIPTION,
          DISPATCHED_DATE: DISPATCHED_DATE,
          DISPATCHED_THRU: DISPATCHED_THRU,
          INVOICE_DATE: INVOICE_DATE,
          INVOICE_DATE_TXT: INVOICE_DATE_TXT,
          INVOICE_NO: INVOICE_NO,
          INVOICE_TYPE: INVOICE_TYPE,
          ITEMS: ITEMS,
          LINE_NO: LINE_NO,
          MEMO: MEMO,
          MYCLASS: MYCLASS,
          NAME: NAME,
          PRICE: PRICE,
          PROFORMA_DATE: PROFORMA_DATE,
          PROFORMA_NO: PROFORMA_NO,
          QTY: QTY,
          TAX: TAX,
          TAX_RATE: TAX_RATE,
          TAX_TYPE: TAX_TYPE,
          TOTAL: TOTAL,
          UNITS: UNITS,
          USER_NAME: USER_NAME,
          businessKeyId: businessKeyId,
          debtorsledger_contra_id: debtorsledger_contra_id,
          id: id,
          invoiceNoPushId: invoiceNoPushId,
          log: log,
          loged_in_user_id: loged_in_user_id,
          posting_contra_id:posting_contra_id,
          uniqueRowId: uniqueRowId,
          unique_id: unique_id
        })
      });

        this.setState({
          itemsInvoice: newState
        });
    }

  }
  handleSubmit(itemId) {
    if(!this.state.user){
      alert("Please Log in!");
      return; 
    }
    var d = new Date();
    var n = d.getTime();
    var mDepth = 2;
    var customername = this.state.NAME;
      if(customername === ''){
        alert("Please Enter Customer Name!");
        return;
      }
    var m_user = firebase.auth().currentUser;
    var uid = m_user.uid;
    var businessKeyId = "";
    var mBizInfo = this.state.bizinfo.slice();
    for(let x of mBizInfo){
       businessKeyId = x.businessKeyId ;
    }
    var saved = "Saved!"; 
    if(this.state.isExists)
    {
      const insertRef = firebase.database().ref('salesdaybook/'+
       uid+'/'+businessKeyId+'/'+this.state.id);
      var saved = "Updated!";  
      const item = {
          ACCOUNT_NAME: this.state.ACCOUNT_NAME,
          ADDRESS: this.state.ADDRESS,
          AMOUNT: this.state.AMOUNT,
          COMMENT: this.state.COMMENT,
          CUSTOMER_ORDER_DATE: this.state.CUSTOMER_ORDER_DATE,
          DELIVERY_DATE: this.state.DELIVERY_DATE,
          DELIVERY_NO: this.state.DELIVERY_NO,
          DESCRIPTION: this.state.DESCRIPTION,
          DISPATCHED_DATE: this.state.DISPATCHED_DATE,
          DISPATCHED_THRU: this.state.DISPATCHED_THRU,
          INVOICE_DATE: this.state.INVOICE_DATE,
          INVOICE_DATE_TXT: this.state.INVOICE_DATE_TXT,
          INVOICE_NO: this.state.INVOICE_NO,
          INVOICE_TYPE: this.state.INVOICE_TYPE,
          ITEMS: this.state.ITEMS,
          LINE_NO: this.state.LINE_NO,
          MEMO: this.state.MEMO,
          MYCLASS: this.state.MYCLASS,
          NAME: this.state.NAME,
          PRICE: this.state.PRICE,
          PROFORMA_DATE: this.state.PROFORMA_DATE,
          PROFORMA_NO: this.state.PROFORMA_NO,
          QTY: this.state.QTY,
          TAX: this.state.TAX,
          TAX_RATE: this.state.TAX_RATE,
          TAX_TYPE: this.state.TAX_TYPE,
          TOTAL: this.state.TOTAL,
          UNITS: this.state.UNITS,
          USER_NAME: this.state.USER_NAME,
          businessKeyId: businessKeyId,
          debtorsledger_contra_id: this.state.debtorsledger_contra_id,
          id: this.state.id,
          invoiceNoPushId: this.state.invoiceNoPushId, 
          log: this.state.log,
          loged_in_user_id: uid,
          posting_contra_id: this.state.posting_contra_id,
          uniqueRowId: this.state.uniqueRowId,
          unique_id: this.state.unique_id
      }
     insertRef.set(item);
    }
    else
    {
      const updateRef = firebase.database().ref('salesdaybook/'+
       uid+'/'+businessKeyId);     
      const item = {
          ACCOUNT_NAME: this.state.ACCOUNT_NAME,
          ADDRESS: this.state.ADDRESS,
          AMOUNT: this.state.AMOUNT,
          COMMENT: this.state.COMMENT,
          CUSTOMER_ORDER_DATE: this.state.CUSTOMER_ORDER_DATE,
          DELIVERY_DATE: this.state.DELIVERY_DATE,
          DELIVERY_NO: this.state.DELIVERY_NO,
          DESCRIPTION: this.state.DESCRIPTION,
          DISPATCHED_DATE: this.state.DISPATCHED_DATE,
          DISPATCHED_THRU: this.state.DISPATCHED_THRU,
          INVOICE_DATE: this.state.INVOICE_DATE,
          INVOICE_DATE_TXT: this.state.INVOICE_DATE_TXT,
          INVOICE_NO: this.state.INVOICE_NO,
          INVOICE_TYPE: this.state.INVOICE_TYPE,
          ITEMS: this.state.ITEMS,
          LINE_NO: this.state.LINE_NO,
          MEMO: this.state.MEMO,
          MYCLASS: this.state.MYCLASS,
          NAME: this.state.NAME,
          PRICE: this.state.PRICE,
          PROFORMA_DATE: this.state.PROFORMA_DATE,
          PROFORMA_NO: this.state.PROFORMA_NO,
          QTY: this.state.QTY,
          TAX: this.state.TAX,
          TAX_RATE: this.state.TAX_RATE,
          TAX_TYPE: this.state.TAX_TYPE,
          TOTAL: this.state.TOTAL,
          UNITS: this.state.UNITS,
          USER_NAME: this.state.USER_NAME,
          businessKeyId: businessKeyId,
          debtorsledger_contra_id: this.state.debtorsledger_contra_id,
          id: this.state.id,
          invoiceNoPushId: this.state.invoiceNoPushId, 
          log: this.state.log,
          loged_in_user_id: uid,
          posting_contra_id: this.state.posting_contra_id,
          uniqueRowId: this.state.uniqueRowId,
          unique_id: this.state.unique_id
      }
     insertRef.push(item);
     
    }
    alert(saved)

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
   const m_user = firebase.auth().currentUser;
   var uid = m_user.uid;  
    var businessKeyId ="";
    var mBizInfo = this.state.bizinfo.slice();
    for(let x of mBizInfo){
       businessKeyId = x.businessKeyId ;
    }
 
 var classItems = [];
      classItems.push("NONE");

  const itemsRef = firebase.database().ref('salesdaybook/'+
    uid+'/'+businessKeyId);
//var keyId =""; 
    itemsRef.on('value', (snapshot) => {
//    keyId =  snapshot.key; 
      let items = snapshot.val();
      let DataCache = [];
      let DataCacheAll = [];
      let DataCacheInvoices = [];
      let inDB = 0;
      for (let item in items) {
          let mClass = items[item].MYCLASS;
          var n = classItems.indexOf(mClass);
            if(n === -1 ) {//false
              classItems.push(mClass);
            }

        var invoicePushId = items[item].invoiceNoPushId;
        for(let i=0;i<DataCacheInvoices.length;i++){
            let val= DataCacheInvoices[i];
            if(val === invoicePushId){
               inDB = 1;
            }
        }
        if(inDB === 0){
            DataCache.push({
              id: item,
              NAME: items[item].NAME,
              MEMO: items[item].MEMO,
              INVOICE_DATE_TXT: items[item].INVOICE_DATE_TXT,
              INVOICE_DATE: items[item].INVOICE_DATE,
              TOTAL: items[item].TOTAL,
              invoiceNoPushId: items[item].invoiceNoPushId
            });
            DataCacheInvoices.push(invoicePushId);
        }
        
        DataCacheAll.push({
          ACCOUNT_NAME: items[item].ACCOUNT_NAME,
          ADDRESS: items[item].ADDRESS,
          AMOUNT: items[item].AMOUNT,
          COMMENT: items[item].COMMENT,
          CUSTOMER_ORDER_DATE: items[item].CUSTOMER_ORDER_DATE,
          DELIVERY_DATE: items[item].DELIVERY_DATE,
          DELIVERY_NO: items[item].DELIVERY_NO,
          DESCRIPTION: items[item].DESCRIPTION,
          DISPATCHED_DATE: items[item].DISPATCHED_DATE,
          DISPATCHED_THRU: items[item].DISPATCHED_THRU,
          INVOICE_DATE: items[item].INVOICE_DATE,
          INVOICE_DATE_TXT: items[item].INVOICE_DATE_TXT,
          INVOICE_NO: items[item].INVOICE_NO,
          INVOICE_TYPE: items[item].INVOICE_TYPE,
          ITEMS: items[item].ITEMS,
          LINE_NO: items[item].LINE_NO,
          MEMO: items[item].MEMO,
          MYCLASS: items[item].MYCLASS,
          NAME: items[item].NAME,
          PRICE: items[item].PRICE,
          PROFORMA_DATE: items[item].PROFORMA_DATE,
          PROFORMA_NO: items[item].PROFORMA_NO,
          QTY: items[item].QTY,
          TAX: items[item].TAX,
          TAX_RATE: items[item].TAX_RATE,
          TAX_TYPE: items[item].TAX_TYPE,
          TOTAL: items[item].TOTAL,
          UNITS: items[item].UNITS,
          USER_NAME: items[item].USER_NAME,
          businessKeyId: items[item].businessKeyId,
          debtorsledger_contra_id: items[item].debtorsledger_contra_id,
          id: item,
          invoiceNoPushId: items[item].invoiceNoPushId,
          log: items[item].log,
          loged_in_user_id: items[item].loged_in_user_id,
          posting_contra_id: items[item].posting_contra_id,
          uniqueRowId: items[item].uniqueRowId,
          unique_id: items[item].unique_id
        });
        inDB = 0;
      } // end for loop
      this.setState({
        items: DataCache,
        itemsAll: DataCacheAll,
        itemsOrig: DataCache,
          classItems
      });
    });


      // populate Items choice
      const dbRef = firebase.database().ref('non_inventory_items/'+
       uid+'/'+businessKeyId)
       .orderByChild('category');
        dbRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newItemsState = [];
        for (let item in items) {

          newItemsState.push({
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
          itemsStocks: newItemsState
        });
      }); 

// populate Tax codes
  var count = 0;
  var newTaxState = [];
        newTaxState.push({
          id: "NONE",
          businessKeyId: businessKeyId,
          log: 0,
          taxType: "NONE",
          tax_rate: 0,
           uid: uid
        });

    const taxRef = firebase.database().ref('tax_codes/'+
       uid+'/'+businessKeyId);
        taxRef.on('value', (snapshot) => {
          let tax_items = snapshot.val();    
            for (let mTaxItem in tax_items) {
              newTaxState.push({
                id: mTaxItem,
                businessKeyId: tax_items[mTaxItem].businessKeyId,
                log: tax_items[mTaxItem].log,
                taxType: tax_items[mTaxItem].tax_code,
                tax_rate: tax_items[mTaxItem].tax_rate,
                uid: tax_items[mTaxItem].uid,
              });
            }
            this.setState({
              taxItems: newTaxState
            });
        });

  }

  showInvoice(invoicePushId) {
  var newState = [];
  var myvalue = this.state.itemsAll.map((item) =>{
      let myid=item.invoiceNoPushId;
      
      if(myid === invoicePushId){
        newState.push({
          ACCOUNT_NAME: item.ACCOUNT_NAME,
          ADDRESS: item.ADDRESS,
          AMOUNT: item.AMOUNT,
          COMMENT: item.COMMENT,
          CUSTOMER_ORDER_DATE: item.CUSTOMER_ORDER_DATE,
          DELIVERY_DATE: item.DELIVERY_DATE,
          DELIVERY_NO: item.DELIVERY_NO,
          DESCRIPTION: item.DESCRIPTION,
          DISPATCHED_DATE: item.DISPATCHED_DATE,
          DISPATCHED_THRU: item.DISPATCHED_THRU,
          INVOICE_DATE: item.INVOICE_DATE,
          INVOICE_DATE_TXT: item.INVOICE_DATE_TXT,
          INVOICE_NO: item.INVOICE_NO,
          INVOICE_TYPE: item.INVOICE_TYPE,
          ITEMS: item.ITEMS,
          LINE_NO: item.LINE_NO,
          MEMO: item.MEMO,
          MYCLASS: item.MYCLASS,
          NAME: item.NAME,
          PRICE: item.PRICE,
          PROFORMA_DATE: item.PROFORMA_DATE,
          PROFORMA_NO: item.PROFORMA_NO,
          QTY: item.QTY,
          TAX: item.TAX,
          TAX_RATE: item.TAX_RATE,
          TAX_TYPE: item.TAX_TYPE,
          TOTAL: item.TOTAL,
          UNITS: item.UNITS,
          USER_NAME: item.USER_NAME,
          businessKeyId: item.businessKeyId,
          debtorsledger_contra_id: item.debtorsledger_contra_id,
          id: item.id,
          invoiceNoPushId: item.invoiceNoPushId,
          log: item.log,
          loged_in_user_id: item.loged_in_user_id,
          posting_contra_id: item.posting_contra_id,
          uniqueRowId: item.uniqueRowId,
          unique_id: item.unique_id

        })
      }
  });
      this.setState({
        itemsInvoice: newState,
        displayPanel: 'invoice'
      })
    
  }

  logout() { 
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    }); 
  }

  handleInvoice(e){
  
      this.setState({
        displayPanel: 'invoiceList'
      });
  }

  handleEdit(e){
      this.setState({
        displayPanel: 'edit'
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
      .ref(`/salesdaybook/${uid}/${businessKeyId}/${itemId}`);
      itemRef.remove();
  }

  removeEmptyRow(e) {
    var array = this.state.itemsInvoice.slice(); // make a separate copy of the array
    var index = array.indexOf(e.target.value)
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({itemsInvoice: array});
    }
  }
  addRow(){
    var m_user = firebase.auth().currentUser;
    var uid = m_user.uid;
    var mbusinessKeyId ="";
    var mBizInfo = this.state.bizinfo.slice();
    var myitemsInvoice = this.state.itemsInvoice.slice();
    var myitemsAll = this.state.itemsAll.slice();
    var minvoiceNoPushId = "";
    var d = new Date();
    var n = d.getTime();
    var newState =[];
    var mlineno = Math.max.apply(Math, myitemsInvoice.map(function(o) { return o.LINE_NO; }));
  
    mlineno = mlineno + 1;
      for(let x of mBizInfo){
        mbusinessKeyId = x.businessKeyId ;
      }
      myitemsInvoice.map((item) =>{
        minvoiceNoPushId = item.invoiceNoPushId;
      })
          newState.push({
          ACCOUNT_NAME: '',
          ADDRESS: '',
          AMOUNT: 0,
          COMMENT: '',
          CUSTOMER_ORDER_DATE: '',
          DELIVERY_DATE: '',
          DELIVERY_NO: '',
          DESCRIPTION: '',
          DISPATCHED_DATE: '',
          DISPATCHED_THRU: '',
          INVOICE_DATE: '',
          INVOICE_DATE_TXT: '',
          INVOICE_NO: '',
          INVOICE_TYPE: '',
          ITEMS: '',
          LINE_NO: mlineno,
          MEMO: '',
          MYCLASS: '',
          NAME: '',
          PRICE: 0,
          PROFORMA_DATE: '',
          PROFORMA_NO: '',
          QTY: 0,
          TAX: 0,
          TAX_RATE: 0,
          TAX_TYPE: 'NONE',
          TOTAL: 0,
          UNITS: '',
          USER_NAME: '',
          businessKeyId: mbusinessKeyId,
          debtorsledger_contra_id: '',
          id: '',
          invoiceNoPushId: minvoiceNoPushId,
          log: n,
          loged_in_user_id: uid,
          posting_contra_id: '',
          uniqueRowId: '',
          unique_id: 0
        })
        this.setState({
          itemsInvoice: myitemsInvoice.concat(newState)
        })
}
  render() {
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
    const renderDefaultView = () => {
			if(this.state.user == null)
       return <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>;
       else{
         if(this.state.displayPanel==='invoiceList'){
              if(this.state.initialized == false){
                this.setState({
                  initialized: true
                })
                this.initialize2();
                return (<div>Loading..</div>);
              }
          var listItems =this.state.items.map((item) => 
            <li key={item.id}>
            <h3>{item.NAME} Ksh {item.TOTAL}</h3>
            <p>Date: <strong>{item.INVOICE_DATE_TXT}</strong>
            <br/>{item.MEMO}
            <button onClick={() => this.showInvoice(item.invoiceNoPushId)}>Show</button>
            </p>
            </li>
          );
            return (
            <div>
              <input class="w3-input" type="search" name ="searchbar" placeholder="Search Name.." onChange={this.handleChange}/>
              <div class="w3-bar w3-teal" >
              <StyledButton onClick={() => this.handleRefresh()} style={{fontSize: "xx-large", marginLeft: "10px"}}>🔄 </StyledButton><StyledButton style={{fontSize: "xx-large", marginLeft: "10px"}}>🖨️</StyledButton>
              </div>
              <ul>{listItems}</ul>
            </div>
            );
         } else if(this.state.displayPanel==='invoice'){

            const headers = ["No","Item","Qty","Price","Amount","Tax","Tax Type","Class","Total"]
            const rows = this.state.itemsInvoice.slice()
            
            var amount = 0;
            var tax = 0;
            var total = 0;
            var mybizName =this.state.businessName;
            var invoiceheader = "Invoice";
            var invoiceDate ="";
            var invoiceNo = "";
            var proformaNo = "";
            var memo = "";
            var comment = "";
            var customer_name = "";
            for(let i=0;i<rows.length;i++){
                if(i == 0){
                  invoiceDate = rows[i].INVOICE_DATE_TXT;
                  invoiceNo = rows[i].INVOICE_NO;
                  proformaNo = rows[i].PROFORMA_NO;
                  memo = rows[i].MEMO;
                  customer_name = rows[i].NAME;
                  comment = rows[i].COMMENT;
                }
                amount += rows[i].AMOUNT;
                tax += rows[i].TAX;
                total += rows[i].TOTAL;
            }
 
            var listItems =this.state.itemsInvoice.map((item) => 
                <tr><td>{item.LINE_NO}</td>
                <td>{item.ITEMS}</td>
                <td>{item.QTY}</td>
                <td>{item.PRICE}</td>
                <td>{item.AMOUNT}</td>
                <td>{item.TAX}</td>
                <td>{item.TAX_TYPE}</td>
                <td>{item.MYCLASS}</td>
                <td>{item.TOTAL}</td>
                </tr>
            );
              
            return (
              <div>
                <span style={{color: "black"}}>{mybizName}</span><span style={{float: "right", color: "blue", fontSize: "x-large"}}>  {invoiceheader}</span>
                <p style={{color: "blue"}}>Address: {this.state.address} {this.state.telephoneOffice} {this.state.telephoneHome} {this.state.emailHome} {this.state.emailOffice} </p>
                <hr/>
                <span style={{color: "black"}}>To: {customer_name}</span><span style={{color: "black", float: "right"}}>Invoice No: {invoiceNo}</span><br/>
                <span style={{color: "blue"}}>  Date: {invoiceDate}</span><span style={{float: "right"}}>Order No:{proformaNo}</span><br/>
                  <label>Memo:</label>
                  <p>{memo}</p>

                <table style={{width: "100%"}}>
                  <TableHeaders headers={headers} />
                  <tbody>
                    {listItems}
                    <tr>
                    <td></td><td></td><td></td><td>Total</td>
                    <td>{amount}</td><td>{tax}</td><td></td><td></td><td>{total}</td>
                    </tr>
                  </tbody>
                </table>
                 <label>Comments:</label><br/> 
                    <p>{comment}</p>
                <StyledButton onClick={() => this.handleEdit()}> 🖊️Edit </StyledButton>

              </div>
            );
         }else {// edit invoice
            const headers = ["No","Item","Qty","Price","Amount","Tax","Tax Type","Class","Total","",""]
            const rows = this.state.itemsInvoice.slice()
            var amount = 0;
            var tax = 0;
            var total = 0;
            var mybizName =this.state.businessName;
            var invoiceheader = "Invoice";
            var invoiceDate ="";
            var invoiceNo = "";
            var proformaNo = "";
            var memo ="";
            var comment = "";
            var customer_name ="";
            var itemId ="";
            for(let i=0;i<rows.length;i++){
               if(i == 0){
                  invoiceDate = rows[i].INVOICE_DATE_TXT;
                  invoiceNo = rows[i].INVOICE_NO;
                  proformaNo = rows[i].PROFORMA_NO;
                  memo = rows[i].MEMO;
                  comment = rows[i].COMMENT;
                  customer_name = rows[i].NAME;
                  itemId = rows[i].id;
                }
                amount += rows[i].AMOUNT;
                tax += rows[i].TAX;
                total += rows[i].TOTAL;
            }
            const myData = [].concat(this.state.itemsStocks)
              .sort((a, b) => a.category > b.category ? 1 : -1)
            var len= [4,5,5,5,5,5,5,5,5];
            var xitems = this.state.itemsInvoice.slice();
            var count = 1;
              for(let yitems of xitems){
                 count =1;
                 let a = yitems.LINE_NO.toString().length;
                      if( a > len[0]) len[0] = a;
                   a = yitems.ITEMS.length;
                  if( a > len[1]) len[1] = a;
                    a = yitems.QTY.toString().length;
                      if( a > len[2]) len[2] = a;
                    a = yitems.PRICE.toString().length;
                      if( a > len[3]) len[3] = a;   
                    a = yitems.AMOUNT.toString().length;
                      if( a > len[4]) len[4] = a;   
                    a = yitems.TAX.toString().length;
                      if( a > len[5]) len[5] = a;
                    a = yitems.TAX_TYPE.length;
                      if( a > len[6]) len[6] = a; 
                    a = yitems.MYCLASS.length;
                      if( a > len[7]) len[7] = a;
                    a = yitems.TOTAL.toString().length;
                      if( a > len[8]) len[8] = a;
              }
              let lenStr =[];
              for(let i=0;i<len.length;i++){
                let a= len[i];
                let b= Math.pow(10, a-1);
                lenStr[i] = b+"px";
              }
            var listItems =this.state.itemsInvoice.map((item,index) => 
                <tr  >
                <td style={{width: lenStr[0]}}><span name="LINE_NO"  >{item.LINE_NO}</span></td>
              <select id={item.id} name="ITEMS" onChange={this.handleChange}>
                {myData.map((myitem,myindex) => {
                var rfbDepth = myitem.depth;
                var rfbItemName = myitem.itemName;
                var myTxt ="";
                for(let i=0;i<rfbDepth;i++)
                  myTxt += "  ";
                  myTxt +=rfbItemName;
                  if(item.ITEMS === rfbItemName)
                    return (
                      <option value ={myTxt} selected>{myTxt}</option>
                    );
                     else
                    return (
                      <option value ={myTxt}>{myTxt}</option>
                    );
                })}
              </select>                
                <td style={{width: lenStr[2]}}><input type="number" name="QTY" id={item.id} onChange={this.handleChange}value={item.QTY} /></td>
                <td style={{width: lenStr[3]}}><input type="number" name="PRICE" id={item.id} onChange={this.handleChange} value={item.PRICE} /></td>
                <td style={{width: lenStr[4]}}><p> {item.AMOUNT} </p></td>
                <td style={{width: lenStr[5]}}><p>{item.TAX} </p></td>
                <td style={{width: lenStr[6]}}>
                <select id = {item.id} name="TAX_TYPE" onChange={this.handleChange} ref = {(input)=> this.menu2 = input}>
                  {this.state.taxItems.map((tax,index) => {
                    if(item.TAX_TYPE === tax.taxType){
                      return (
                        <option value ={tax.taxType} selected>{tax.taxType}</option>
                      )
                    } 
                    else{
                      return (
                        <option value ={tax.taxType}>{tax.taxType}</option> 
                      )            
                    }
                  })}
               </select>
                </td>
                <td style={{width: lenStr[7]}}>
                <select id = {item.id} name="MYCLASS" onChange={this.handleChange} ref = {(input)=> this.menu3 = input}>
                  {this.state.classItems.map((myclass,index) => {
                    if(item.MYCLASS === myclass){
                      return (
                        <option value ={myclass} selected>{myclass}</option>
                      )
                    } 
                    else{
                      return (
                        <option value ={myclass}>{myclass}</option> 
                      )            
                    }
                  })}
               </select>
                </td>
                <td style={{width: lenStr[8]}}><p>{item.TOTAL} </p></td>
                <td><StyledButton onClick={() => this.removeItem(item.id)}>X</StyledButton></td>
                <td><button onClick={() => this.handleSubmit(item.id)}> Save</button></td>
                </tr>
            );
            return (
              <div>
              <span style={{float: "left", color: "#2F4F4F", fontSize: "x-large"}}>{mybizName}</span>
              <span style={{float: 'right', color: "#2F4F4F", fontSize: "x-large"}}>{invoiceheader}</span><br/><br/>
               <p style={{color: "blue"}}>Address: {this.state.address} {this.state.telephoneOffice} {this.state.telephoneHome} {this.state.emailHome} {this.state.emailOffice} </p>
                <hr/>
                <span style={{color: "black"}}>To: {customer_name}</span><span style={{color: "blue", float: "right"}}>Invoice No: {invoiceNo}</span><br/>
                <span style={{color: "blue"}}>  Date: {invoiceDate}</span><span style={{float: "right"}}>Order No:{proformaNo}</span><br/>
                  <label>Memo:</label><br/> 
                <span ><textarea name="MEMO" rows={4} cols={10} wrap="soft" maxlength="40" onChange={this.handleChange}  style={{width: "100%"}} >{memo}</textarea></span><br/>
                <button onClick={() => this.addRow()}>+Add Row</button>
                
                <div class="w3-responsive"> 
                  <table class="w3-table-all w3-tiny" >
                  <TableHeaders headers={headers} />
                  <tbody>

                    {listItems}
                    <tr>
                    <td></td><td></td><td></td><td>Total</td>
                    <td>{amount}</td><td>{tax}</td><td></td><td>{total}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
                <label>Comments:</label><br/> 
                <span ><textarea name="COMMENT" rows={4} cols={10} wrap="soft" maxlength="40" onChange={this.handleChange} style={{width: "100%"}} >{comment}</textarea></span>
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
    <button onClick={() => this.handleInvoice()} style={{marginLeft: "10px"}}>Invoices List</button>
    <button onClick={() => this.handleClick(2)} style={{marginLeft: "10px"}}>+Add New</button>
  </div>

  {/*<img src={Dome} alt="Dome Tent" />*/}
  <h1>⛺</h1>
  <div className="w3-container w3-teal" >
        <p>INVOICES</p>
  </div>
                 <div className="w3-container w3-pink" >
    <p>Wedding Tents, Dome Tents, Chairs, Tables, Seat Covers, Table Cloths, Lights.. services etc </p>
                 </div>
                {renderDefaultView()}
                  <div className="w3-container w3-teal" >
                    <p>{footer()}</p>
                  </div>
              </div>

    );
    
  }
}

const TableHeaders = ({ headers }) =>
  <thead>
    <tr>
      { headers.map(header => <th>{ header }</th>) }
    </tr>
  </thead>

const TableRow = ({ row }) =>
  <tr>
    { row.map(cell => <td>{cell}</td>)}
  </tr>

export default Invoices;

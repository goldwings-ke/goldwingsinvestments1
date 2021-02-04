import React, { Component } from 'react';
import '../components/photos.css';
import { FirebaseAuth } from 'react-firebaseui';
import firebase, { auth, provider } from '../components/firebase';
import {storage} from '../components/firebase'
class Gallery extends React.Component {
    constructor(props) {
    super(props);
    this.state = { 
      user: null,
      currentIndex: null,
      imgUrls: [],
      uploadUrl: "",
      uploadImage: null,
      progress: 0,
      address:  '',
      businessName: '',
      emailHome: '',
      emailOffice: '',
      locationCountry: '',
      taxIdentifier: '',
      telephoneHome: '',
      telephoneOffice: ''
    };
    this.closeModal = this.closeModal.bind(this);
    this.findNext = this.findNext.bind(this);
    this.findPrev = this.findPrev.bind(this);
    this.renderImageContent = this.renderImageContent.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
     this.logout = this.logout.bind(this); 

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
          //userlogedin: !!userlogedin
          user
        })
    });
      const itemsRef = firebase.database().ref('gallery');
        itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          newState.push({
            id: item,
            imageUrl: items[item].imageUrl, 
            imageName:  items[item].name,
            price: items[item].price,
            capacity: items[item].capacity
          });
              
        }// end for loop
        
        this.setState({
          imgUrls: newState
        });
          
      }); 

        const companyRef = firebase.database().ref('business_info/'+
    'QK4rcq2YhZf5BoNsXklZShBTwHw1/-M7sDl_6e3H4iUPEEyuI');

    companyRef.on('value', (snapshot) => {

        this.setState({
          address:  snapshot.child("address").val(),
        //  allowClientQuotations: items[item].allowClientQuotations,
          businessName: snapshot.child("businessName").val(),
          emailHome: snapshot.child("emailHome").val(),
          emailOffice: snapshot.child("emailOffice").val(),
        //  id: items[item].id, 
        //  imageName: items[item].imageName,
        //  imgURL: items[item].imgURL,
          locationCountry: snapshot.child("locationCountry").val(),
        //  log: items[item].log,
        //  system_set: items[item].system_set, 
          taxIdentifier: snapshot.child("taxIdentifier").val(),
          telephoneHome: snapshot.child("telephoneHome").val(),
          telephoneOffice: snapshot.child("telephoneOffice").val()
        //  uid: items[item].uid
        });
    });
  }

  renderImageContent(src, index) {
    return (
      <div onClick={(e) => this.openModal(e, index)}> 
        <img src={src.imageUrl} key={src.imageUrl} className='photo' />
      </div>
    ) 
  }
  openModal(e, index) {
    this.setState ({ currentIndex: index });
  }
  closeModal(e) {
    if (e != undefined) {
      e.preventDefault();
    }
    this.setState ({ currentIndex: null });
  }
  findPrev(e) {
    if (e != undefined) {
      e.preventDefault();
    }
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex -1
    }));
  }
  findNext(e) {
    if (e != undefined) {
      e.preventDefault();
    }
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex + 1
    }));
  }

 handleChange = (e) => {
 
    if(e.target.files[0]){
      this.setState({
        uploadImage: e.target.files[0]
      })
    }
   
  };

  handleUpload = () => {

  }

  logout() { 
    auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    }); 
  }

  render() {
   const renderDefaultView = () => {
			if(this.state.user === null)
       return (<div><h3>Goldwings Investments Limited</h3>
       <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/></div>);
       else{
        var mybizName = this.state.businessName;
         if(mybizName === '')
            mybizName = "Goldwings Investments Limited";
         return(
          <div>
          <h2 style={{marginLeft: "5px"}}>{mybizName}🛒</h2>
          <h1>🔥 This Gallery Is Lit 🔥</h1>
          <progress style={{marginLeft: "5px"}} value={this.state.progress} max="100" />
          <br/>
          <input type="file" onChange = {this.handleChange}/>
          <button style={{marginLeft: "5px"}} onClick = {this.handleUpload} >Upload</button>
              <button style={{marginLeft: "5px"}} onClick={() => this.logout()}>Log Out</button>

          <p><input type="text" placeholder="Search item.." /></p>
          <div className="gallery-grid">
            {this.state.imgUrls.map(this.renderImageContent)}
          </div>
          <GalleryModal 
            closeModal={this.closeModal} 
            findPrev={this.findPrev} 
            findNext={this.findNext} 
            hasPrev={this.state.currentIndex > 0} 
            hasNext={this.state.currentIndex + 1 < this.state.imgUrls.length} 
            src={this.state.imgUrls[this.state.currentIndex]} />
        </div>
          );
       }
   }
    return (
      <div className="gallery-container">
        {renderDefaultView()}
      </div>
    );
  }
}

class GalleryModal extends React.Component {
  constructor() {
    super();
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);
  }  
  componentWillUnMount() {
    document.body.removeEventListener('keydown', this.handleKeyDown);
  }
  handleKeyDown(e) {
    if (e.keyCode === 27)
      this.props.closeModal();
    if (e.keyCode === 37 && this.props.hasPrev)
      this.props.findPrev();
    if (e.keyCode === 39 && this.props.hasNext)
      this.props.findNext();
  }

    handleUpload = () => {
    const uploadTask = storage.ref(`gallery/${this.state.uploadImage.name}`)
    .put(this.state.uploadImage);
    uploadTask.on(
    "state_changed",
    snapshot => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes)
        * 100);
        
        this.setState({
          progress: progress
        })
    },
    error => {
      console.log(error)
    },
    () => {
      storage
      .ref("gallery")
      .child(this.state.uploadImage.name)
      .getDownloadURL()
      .then(url => {
          this.setState({
           uploadUrl: url
          })
      });
    }
    );
    
  };

  render () {
    const { closeModal, hasNext, hasPrev, findNext, findPrev, src } = this.props;
    if (!src) {
      console.log('whut')
      return null;
    }
    return (
      <div>
        <div className="modal-overlay" onClick={closeModal}></div>
        <div isOpen={!!src} className="modal">
          <div className='modal-body'>
            <a href="#" className='modal-close' onClick={closeModal} onKeyDown={this.handleKeyDown}>&times;</a>
            {hasPrev && <a href="#" className='modal-prev' onClick={findPrev} onKeyDown={this.handleKeyDown}>&lsaquo;</a>}
            {hasNext && <a href="#" className='modal-next' onClick={findNext} onKeyDown={this.handleKeyDown}>&rsaquo;</a>}
            <img src={src.imageUrl} />
          </div>
        </div>
      </div>
    )
  }
}

export default Gallery;

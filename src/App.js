import React, { Component } from 'react';
//
import './App.css';
import Navigation from './components/Navigation/Navigation';
//import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register'
import Particles from 'react-particles-js';
//import Clarifai from 'clarifai';
//import Scroll from './components/Scroll/Scroll';




const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }

}

const initialState = {
      input: '',
      imageURL: '',
      boxes: [],
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',  
  }
}

class  App extends Component {

  constructor(){
    super();
    this.state = initialState;
  }


  loadUser = (data) => {
    this.setState({user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


  calculateFaceLocation = (data) =>{
    const boxes = [];
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(data);

    for (let i = 0; i < data.outputs[0].data.regions.length; i++) {
      const clarifaiFace = data.outputs[0].data.regions[i].region_info.bounding_box;;
      const box = {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
      //console.log('i=', i, 'obj=', box);
      boxes.push(box);
      this.setState({box: box});
    }
    return boxes;
    


    // return {
    //   leftCol: clarifaiFace.left_col * width,
    //   topRow: clarifaiFace.top_row * height,
    //   rightCol: width - (clarifaiFace.right_col * width),
    //   bottomRow: height - (clarifaiFace.bottom_row * height)
    // }
    
  }



  displayFaceBox = (boxes) => {
    //console.log(boxes);
    this.setState({boxes: boxes});
  }



  onInputChange = (event) => {
    //console.log(event.target.value);
    this.setState({input: event.target.value});

  }


  onButtonSubmit = () => {

    this.setState({imageURL: this.state.input});    
  
    //app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)


    
    fetch('http://localhost:3001/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            input: this.state.input
        })
    })
    .then (response => response.json())
    .then (response => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          }).then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}));
              // this.setState({user: {entries: count}}); not working, because it's overwriteing the whole object with empty values, obly etries get correct value
            }).catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err => console.log(err));
    
}



  onRouteChange = (route) => {
    //this.state.route === 'signin' ? this.setState({route: 'home'}) : this.setState({route: 'signin'});
    if (route === 'signout'){
      this.setState(initialState);
    } else if (route=== 'home') {
      this.setState({isSignedIn: true})  
    } 
    this.setState({route: route});
  }

  render (){
    const { imageURL, route, boxes } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
       
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'  
           ? <div> 
              {/* <Logo /> */}
             
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition imageURL={imageURL} boxes={boxes}/>
              
            </div>
          : (
            route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }

}

export default App;

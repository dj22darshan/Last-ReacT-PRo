import React, { Component } from 'react';
import './App.css';
import MapShow from './MapContainer'
import ApiInfo from './ApiInfo'
import SideBar from './SideBar'
import MenuBtn from './MenuButton'
import ModalView from './Modal'


const ESCAPE_BUTTON = 27,
      ENTER_BUTTON = 13

class App extends Component {
  state = {
    locations: [],
    venueInfo: {},
    query: ''
  }
    componentDidMount() {
      document.addEventListener('keyup', es => {
      es.preventDefault()
          
      if (es.keyCode === ESCAPE_BUTTON) {
        document.querySelector('.sidebar')
          .classList.toggle('sidebar-expanded')

        document.querySelector('.menu-btn')
          .classList.toggle('menu-btn-hidden')
      }    
    })

    fetch(`https://api.foursquare.com/v2/venues/explore?ll=34.9003,33.6232&client_id=${ApiInfo.client_id}&client_secret=${ApiInfo.client_secret}&v=${ApiInfo.version_date}`)
    .then(repsonse => repsonse.json())
    .then(data => {
      const locations = data.response.groups[0].items.map(item => {
        return {
          position: { lat: item.venue.location.lat, lng: item.venue.location.lng },
          title: item.venue.name,
          id: item.venue.id,
          category: item.venue.categories[0].name,
          address: item.venue.location.address,
          state: item.venue.location.state,
          coordinates: item.venue.location.lat + ', ' + item.venue.location.lng,
        }
      })
      
      this.setState({ locations })
    }) 
    .catch(errorFetch => {
      console.log('Failed in Fetching', errorFetch)
    })
  }

 menuBtnHandler = e => {
    e.target.classList.add('menu-btn-hidden')
    document.querySelector('.sidebar')
      .classList.add('sidebar-expanded')
  }

  closeBtnHandler = es => {
    document.querySelector('.sidebar')
      .classList.remove('sidebar-expanded')
    document.querySelector('.menu-btn')
      .classList.remove('menu-btn-hidden')
  }

  sidebarItemClick = es => {
    this.setState({
      query: es.target.textContent.replace(/- /g, '')
    })
    
    const modal = document.querySelector('.details-modal')
    // Search for the clikced location and retrieve the data
    for (const location of this.state.locations) {
      if (location.title === es.target.textContent.replace(/- /g, '')) {
        this.setState({ venueInfo: location })
        modal.style.display = 'block'
        modal.style.opacity = '1'
        }
      }    
    }

    sidebarInputClick = es => {
    this.setState({
      query: ''
    })
   //pop-up modal when the location is clicked in the search bar
   const modal = document.querySelector('.details-modal')

    modal.style.opacity = '0'

    setTimeout(() => {
      modal.style.display = 'none'
    }, 500)
  }
  sidebarItemKeyUp = e => {
    if (e.keyCode === ENTER_BUTTON) {
      this.setState({
        query: e.target.textContent.replace(/- /g, '')
      })
   } 
 }
  //closes the modal
  modalCloseButton = e => {
    const modal = document.querySelector('.details-modal')

    modal.style.opacity = '0'
    setTimeout(() => {
      modal.style.display = 'none'
    }, 500)
  } 

updateQuery = e => {
    this.setState({
      query: e.target.value})
  }

  render() {
    return (
      <div className="App">
          <header className="App-header">
          <h1 className="App-title">Best Places in Larnaca Area</h1>
          <p className="credit">Project created with the use of <br /> Google Map's and Foursquare's Data</p>
          <MenuBtn
              onMenClick={this.menuBtnHandler} />
           </header>
          <ModalView
              venueInfo={this.state.venueInfo}
              closeModal={this.modalCloseButton} />
         
          <SideBar
              onCloseClick={this.closeBtnHandler}
              places={this.state.locations}
              currentQuery={this.state.query}
              onQueryInput={this.updateQuery}
              onItemClick={this.sidebarItemClick}
              onInputClick={this.sidebarInputClick}
              onItemFocus={this.sidebarItemFocus}
              onItemKeyUp={this.sidebarItemKeyUp} />

        <div className="map">
           <MapShow
            queryText={this.state.query}
            locations={this.state.locations} />
        </div>
      </div>
    )
  }
  
}

export default App;

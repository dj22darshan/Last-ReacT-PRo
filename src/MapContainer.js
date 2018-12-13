import {  Map, Marker, InfoWindow,  GoogleApiWrapper} from 'google-maps-react'
import React from 'react'
import PropTypes from 'prop-types'
import escaperegexp from 'escape-string-regexp'


//Exports the Map and the markers
export class MapContainer extends React.Component {
  state = {
    activeMaker: {}, selectedPlace: {}, InfoWindowShow: false
  }

   render() {
    const reg = new RegExp(escaperegexp(this.props.queryText).toLowerCase().trim())
    const bound = new this.props.google.maps.LatLngBounds()
    for (let i = 0; i < this.props.locations.length; i++) {
      bound.extend(this.props.locations[i].position)
    }
     return (
      <Map
        role="application"
        onClick={this.onClickMap}
        initialCenter={{ lat: 34.0, lng: 33.0}}
        google={this.props.google}
        bounds={bound}>
        
          {this.props.locations.filter(location => {
            return reg.test(location.title.toLowerCase())
          })
        
          .map(location => {
            return (
              <Marker
                key={location.id}
                position={{ lat: location.position.lat, lng: location.position.lng}}
                title={location.title}
                onClick={this.onClickMarker}
                category={location.category}
                address={location.address}
                state={location.state}
                coordinates={location.coordinates}
                />
            )
          })}
       
          <InfoWindow className="InfoWin" marker={this.state.activeMaker} visible={this.state.InfoWindowShow}>
            <body>
              <header>
                <h1>{this.state.selectedPlace.title}</h1>
                <h3><span aria-labelledby="category">Category</span>: <span id="category">{!this.state.selectedPlace.category ? 'N/A' : this.state.selectedPlace.category}</span></h3>
              </header>
              <main>
                <ul>
                  <li><span aria-labelledby="place-address">Address</span>: <span id="place-address">{!this.state.selectedPlace.address ? 'N/A' : this.state.selectedPlace.address}</span></li>
                  <li><span aria-labelledby="place-state">State</span>: <span id="place-state">{!this.state.selectedPlace.state ? 'N/A' : this.state.selectedPlace.state}</span></li>
                  <li><span aria-labelledby="place-coordinates">Coordinates</span>: <span id="place-coords">{this.state.selectedPlace.coordinates}</span></li>
                </ul>
              </main>
            </body>
          </InfoWindow>
      </Map>
    )
  }

  //Component will re render
  componentDidMount() {
    this.forceUpdate()
  }

//Marker Clicked
  onClickMarker = (props, marker, e) => {
    this.setState({
      InfoWindowShow: true, selectedPlace: props,activeMaker: marker, 
    })
  }
//Map Clicked
  onClickMap = () => {
    this.setState({
      InfoWindowShow : false,activeMaker: {},selectedPlace: {}
    })
  }
}

MapContainer.propTypes = {
  locations: PropTypes.array.isRequired,
  queryText: PropTypes.string.isRequired
}


export default GoogleApiWrapper({
  apiKey: 'AIzaSyAJjkGrYGR_mcuy7Z14ZJ-5rug5qUGW6Bw'
})(MapContainer)
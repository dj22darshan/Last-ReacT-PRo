import React from 'react'
import PropTypes from 'prop-types'
import escaperegexp from 'escape-string-regexp'


function SideBar(props) {
     
  const reg = new RegExp(escaperegexp(props.currentQuery).toLowerCase().trim())
    return (
      <div className="sidebar">
        <button aria-label="Close sidebar" onClick={props.onCloseClick} className="close-sidebar">X</button>
        <div>
        <label htmlFor="search-place">Search a Address</label>
        <input
          id="search-venue"
          onChange={props.onQueryChange}
          onClick={props.onInputClick}
          type="text"
          placeholder="Search..."
          value={props.currentVal} />
      </div>
        <ul>
        {}
          {props.places.filter(place => {
            return reg.test(place.title.toLowerCase())
          })
          .map((place, index) => {
            return (
              <li
                tabIndex="0"
                onKeyUp={props.onItemKeyUp}
                onClick={props.onItemClick}
                key={index}>{'- ' + place.title}</li>
            )
          })}
        </ul>
      </div>
    )
}

SideBar.propTypes = {
  places: PropTypes.array.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  currentQuery: PropTypes.string.isRequired,
  onQueryInput: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onInputClick: PropTypes.func.isRequired,
  onItemKeyUp: PropTypes.func.isRequired
}


export default SideBar
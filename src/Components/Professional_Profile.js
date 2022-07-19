import React from 'react'

function Professional_Profile(props) {
  return (
    <div>
        {console.log("professional_profile page: ", props)}
        <h3>{props.lastname}, {props.firstname}</h3>
        {props.place}, {props.office}<br />
        <br />
        {props.address}<br />
        {props.postnumber} {props.postalDistrict}<br /><br />

        {props.phone}<br /><br />
    </div>
  )
}

export default Professional_Profile
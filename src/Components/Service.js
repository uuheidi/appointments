import React from 'react';
import { Link } from 'react-router-dom';

function Service(props) {
  return (
    <div>
        <h3>{props.name}</h3>
                        <div><b>Kategoria: </b>{props.cat}</div>
                        <div><b>Kuvaus</b></div>
                          <div>{props.description}</div>
                          <div className="row">
                        <div className="box-3">
                          <small>Kesto</small><br />{props.time} min</div>

                        <div className="box-3">
                          <small>Suositushinta / käynti</small><br />
                          {props.price} €</div>
    </div>
    </div>
  )
}

function ServiceShort(props) {
    return (
      <div>
          <h3>{props.name}</h3>
                          <div><b>Kategoria: </b>{props.cat}</div>
                          <div><b>Kuvaus</b></div>
                            <div class="description">{props.description}</div>
                            <div style={{paddingTop: 5}}><Link to="/admin_services">Katso koko kuvaus Palvelut-sivulta</Link></div>
                            <div className="row">
                          <div className="box-3">
                            <small>Kesto</small><br />{props.time} min</div>
  
                          <div className="box-3">
                            <small>Suositushinta / käynti</small><br />
                            {props.price} €</div>
      </div>
      </div>
    )
  }

export { Service, ServiceShort }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VolsDisponibles(){
    const navigate = useNavigate();
    const[volsDisponibles, setVolsDisponibles] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:9100/volsDisponibles')
        .then(res => res.json())
        .then(data => setVolsDisponibles(data))
        .catch(err => console.log(err))
    }, [])
    const showContent = (vol) => {
    navigate('/showContent', {state: {vol}});
  };

    return(
        <div className="row">
        {volsDisponibles.map((vol) => (
          <div className="col-md-4 mb-4" key={vol.id}>
            <div
              className="card h-100 shadow-sm carte-vol"
              onClick={()=>showContent(vol)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={vol.image}
                className="card-img-top"
                alt="Destination"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{vol.ville_depart} → {vol.ville_destination}</h5>
                <p className="card-text mb-1"><strong>Date :</strong> {vol.date_depart}</p>
                <p className="card-text mb-1"><strong>Heure :</strong> {vol.heure_depart}</p>
                <p className="card-text"><strong>Compagnie :</strong> {vol.compagnie}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
}
export default VolsDisponibles;
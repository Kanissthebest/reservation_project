import { useEffect, useState } from "react";

function MesReservation() {
  const [vols, setVol] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let user = null;
  try{
    const stored = localStorage.getItem("connectedUser")
    user = stored ? JSON.parse(stored) : null;
  } catch(err){
    console.error("Erreur lors du parsing", err)
  }
    fetch(`${import.meta.env.VITE_API_URL}/mes-reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ utilisateur_id: user.id }),
    })
      .then((res) => res.json())
      .then((data) =>{
        if(Array.isArray(data)){
          setVol(data)
        }else{
          console.warn('Reponse inattendu', data)
          setVol([])
        }
      }
         )
      .catch((err) => {
        console.error(err);
        setMessage("Erreur de chargement de l'historique");
      });
  }, []);

  return (
    <div className="container my-5">
      <h2 className="mb-4">Mes réservations</h2>
      {message && <div className="alert alert-danger">{message}</div>}

      {vols.length === 0 && !message && (
        <p className="text-muted">Vous n'avez aucune réservation pour le moment.</p>
      )}

      <div className="row">
        {vols.map((vol) => (
          <div key={vol.reservation_id} className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {vol.ville_depart} — {vol.ville_destination}
                </h5>
                <p className="card-text mb-1">
                  <strong>Date :</strong> {vol.date_depart}
                </p>
                <p className="card-text mb-1">
                  <strong>Heure :</strong> {vol.heure_depart}
                </p>
                <p className="card-text mb-1">
                  <strong>Compagnie :</strong> {vol.compagnie}
                </p>
                <p className="card-text mb-1">
                  <strong>Classe :</strong> {vol.classe}
                </p>
                <p className="card-text">
                  <strong>Prix :</strong> {vol.prix} €
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MesReservation;

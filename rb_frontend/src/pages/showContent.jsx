import { useLocation } from "react-router-dom";
import BtnReservation from "../components/btnReservation";

function ShowContent() {
  const location = useLocation();
  const vol = location.state?.vol;

  if (!vol) {
    return (
      <div className="container my-4">
        <div className="alert alert-warning">Aucun détail de vol disponible.</div>
      </div>
    );
  }


  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            Détails du vol : {vol.ville_depart} --- {vol.ville_destination}
          </h4>
        </div>
        <div className="card-body">
          <p><strong>Classe :</strong> {vol.classe}</p>
          <p><strong>Compagnie :</strong> {vol.compagnie}</p>
          <p><strong>Prix :</strong> {vol.prix} €</p>
          <p><strong>Places disponibles :</strong> {vol.nb_places}</p>
          <p><strong>Heure de départ :</strong> {vol.heure_depart}</p>
          <div className="mt-4">
            <BtnReservation vol={vol} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowContent;

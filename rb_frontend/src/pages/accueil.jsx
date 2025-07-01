import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RechercheVol from "../components/rechercheVol";
import VolsDisponibles from "../components/volDisponibles";

function Accueil() {
  const user = JSON.parse(localStorage.getItem("connectedUser"));
  const navigate = useNavigate();
  useEffect(()=>{
    if(user?.role === 'admin')
  {
      navigate('/admin')
  }
  })
  

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center">Reserver vite votre billet de voyage</h1>

      {user && (
        <div className="alert alert-success text-center">
          Bienvenue <strong>{user.nom}</strong> !
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Rechercher un vol</h5>
        </div>
        <div className="card-body">
          <RechercheVol />
        </div>
       
      </div>
      <hr className="my-5" />
      <h4 className="text-info mb-3">🛩️ Vols à la Une</h4>
       <div className="card-body">
          <VolsDisponibles />
        </div>
    </div>
  );
}

export default Accueil;

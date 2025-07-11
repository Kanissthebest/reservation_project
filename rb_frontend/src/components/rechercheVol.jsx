import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RechercheVol() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ville_depart: '',
    ville_destination: '',
    date_depart: ''
  });

  const [volsTrouve, setVoltrouve] = useState([]);
  const [error, setError] = useState(''); // ✅ Pour stocker le message d'erreur

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // ✅ Réinitialise les erreurs précédentes

    fetch('http://localhost:9100/recherche/vols', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(async (res) => {
      const result = await res.json();

      if (!res.ok) {
        setVoltrouve([]); //  Vide les résultats précédents
        setError(result.message || 'Erreur lors de la recherche'); // Affiche le message du backend
        return;
      }

      setVoltrouve(result);
    }).catch(err => {
      setError("Erreur de connexion au serveur.");
      console.error("Erreur fetch:", err);
    });
  };

  const showContent = (vol) => {
    navigate('/showContent', {state: {vol}});
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            name="ville_depart"
            className="form-control"
            placeholder="Ville de départ"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="ville_destination"
            className="form-control"
            placeholder="Ville de destination"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            name="date_depart"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-primary w-100">Rechercher</button>
        </div>
      </form>

      {/*  Affichage de l’erreur s’il y en a */}
      {error && <p className="text-danger">{error}</p>}

      {/*  Résultats */}
      <div className="row">
        {volsTrouve.map((vol) => (
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
    </>
  );
}

export default RechercheVol;

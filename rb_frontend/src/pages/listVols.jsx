import { useEffect, useState } from "react";

function ListeVols() {
  const [vols, setVols] = useState([]);
  const [form, setForm] = useState({
    id: null,
    ville_depart: '',
    ville_destination: '',
    date_depart: '',
    heure_depart: '',
    compagnie: '',
    classe: 'économique',
    prix: '',
    image: '',
    nb_places: ''
  });

  const chargerVols = () => {
    fetch(`${import.meta.env.VITE_API_URL}/vols`)
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)){
          setVols(data)
        }else{
          console.warn('Resultatat inattendu', data)
          setVols([])
        }
      });
  };

  useEffect(() => {
    chargerVols();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (vol) => {
    setForm({ ...vol }); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEdit = form.id !== null;
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/vols/${form.id}`
      : `${import.meta.env.VITE_API_URL}/ajout-vol`;

    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        chargerVols();
        setForm({
          id: null,
          ville_depart: '',
          ville_destination: '',
          date_depart: '',
          heure_depart: '',
          compagnie: '',
          classe: 'économique',
          prix: '',
          image: '',
          nb_places: ''
        });
      })
      .catch(err => console.error("Erreur soumission :", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    fetch(`${import.meta.env.VITE_API_URL}/vols/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        chargerVols();
      })
      .catch(err => console.error("Erreur suppression :", err));
  };

  return (
    <div className="container my-5">
      <h3 className="text-primary mb-4">
        {form.id ? "✏️ Modifier un vol" : " Ajouter un vol"}
      </h3>

      <form onSubmit={handleSubmit} className="row g-3 bg-light p-4 rounded shadow-sm">
        {[
          { label: "Ville de départ", name: "ville_depart" },
          { label: "Ville de destination", name: "ville_destination" },
          { label: "Date de départ", name: "date_depart", type: "date" },
          { label: "Heure de départ", name: "heure_depart", type: "time" },
          { label: "Compagnie", name: "compagnie" },
          { label: "Prix (€)", name: "prix", type: "number" },
          { label: "Image (URL)", name: "image" },
          { label: "Places disponibles", name: "nb_places", type: "number" }
        ].map(({ label, name, type = "text" }) => (
          <div className="col-md-4" key={name}>
            <label className="form-label">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}

        <div className="col-md-4">
          <label className="form-label">Classe</label>
          <select
            name="classe"
            value={form.classe}
            onChange={handleChange}
            className="form-select"
          >
            <option value="économique">Économique</option>
            <option value="business">Business</option>
          </select>
        </div>

        <div className="col-12 text-end mt-3">
          <button type="submit" className={`btn ${form.id ? "btn-warning" : "btn-success"}`}>
            {form.id ? " Enregistrer les modifications" : " Ajouter le vol"}
          </button>
        </div>
      </form>

      <hr className="my-5" />
      <h4 className="text-info mb-3">🛩️ Vols disponibles</h4>

      <div className="row">
        {vols.map((vol) => (
          <div className="col-md-4 mb-4" key={vol.id}>
            <div className="card h-100 shadow border-0">
              {vol.image && (
                <img src={vol.image} alt="destination" className="card-img-top" height="170" />
              )}
              <div className="card-body">
                <h5 className="card-title text-primary">
                  {vol.ville_depart} → {vol.ville_destination}
                </h5>
                <p className="card-text">
                  Compagnie: {vol.compagnie}<br />
                  Classe: {vol.classe}<br />
                  Prix: {vol.prix} €<br />
                  Date: {vol.date_depart}<br />
                  Heure: {vol.heure_depart}<br />
                  Places: {vol.nb_places}
                </p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => handleEdit(vol)}
                  >
                   Modifier
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(vol.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListeVols;

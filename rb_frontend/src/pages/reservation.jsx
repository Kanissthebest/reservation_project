import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Reservation() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vol, setVol] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    numeroCarte: "",
    expiration: "",
    cvv: "",
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/vols/${id}`)
      .then((res) => res.json())
      .then((data) => setVol(data))
      .catch((err) => {
        console.log(err);
        setMessage("Impossible de charger les infos du vol");
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors({...errors, [e.target.name]: ""})
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let user = null;
  try{
    const stored = localStorage.getItem("connectedUser")
    user = stored ? JSON.parse(stored) : null;
  } catch(err){
    console.error("Erreur lors du parsing", err)
  }
    if (!user) {
      alert("Vous devez être connecté pour réserver");
      return navigate("/login");
    }
 
    const newErrors = {}
    if(!form.nom) newErrors.nom ="Nom requis";

    if(!form.numeroCarte){
      newErrors.numeroCarte = "Numero de carte requis"
    }else if(!/^\d{16}$/.test(form.numeroCarte)){
      newErrors.numeroCarte = "Le numero de carte doit contenir 16 chiffres"
    }
    if(!form.expiration){
      newErrors.expiration = "La date d'expiration est requise";
    }else if(!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiration)){
      newErrors.expiration = "Date d'expiration invalide. format MM/YY requis";
    }
    if(!form.cvv){
      newErrors.cvv ="Le CVV est requis"
    }else if(!/^\d{3,4}$/.test(form.cvv)){
      newErrors.cvv = "CVV invalide. Doit contenir 3 ou 4 chiffres";
    }
    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors)
    }

    if (!vol?.id || !user?.id) {
      setMessage("Information invalide");
      return;
    }
    if (vol.nb_places <= 0) {
      setMessage("Aucune place disponible pour ce vol");
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
         utilisateur_id: user.id,
         vol_id: vol.id,
         nom:form.nom,
         numeroCarte:form.numeroCarte,
         expiration:form.expiration,
         cvv:form.cvv
        }),
    })
      .then(async(res) => {
        const data = await res.json()
        if(!res.ok){
          throw new Error(data.message || 'Erreur')
        }
        return data;
      })
      .then((data) => {
        setMessage(data.message);
        setTimeout(() => navigate("/mes-reservation"), 3000);
        
      })
      .catch((err) => {
        console.error(err);
        setMessage("Erreur lors de la réservation");
      });
  };

  if (!vol)
    return (
      <div className="container my-5">
        <p>Chargement du vol...</p>
      </div>
    );

  return (
    <div className="container my-5" style={{ maxWidth: "500px" }}>
      <h3 className="mb-4">
        Réservation du vol {vol.ville_depart} — {vol.ville_destination}
      </h3>
      <p>
        <strong>Prix :</strong> {vol.prix} €
      </p>
      <p>
        <strong>Nombre de places disponibles :</strong> {vol.nb_places}
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">
            Nom sur la carte
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            className="form-control"
            placeholder="Nom sur la carte"
            value={form.nom}
            onChange={handleChange}
            required
          />
          {errors.nom && <p className="text-danger">{errors.nom}</p> }
        </div>

        <div className="mb-3">
          <label htmlFor="numeroCarte" className="form-label">
            Numéro sur la carte
          </label>
          <input
            type="text"
            id="numeroCarte"
            name="numeroCarte"
            className="form-control"
            placeholder="Numéro sur la carte"
            value={form.numeroCarte}
            onChange={handleChange}
            maxLength={16}
            required
          />
          {errors.numeroCarte && <p className="text-danger">{errors.numeroCarte}</p> }
        </div>

        <div className="row mb-3">
          <div className="col-6">
            <label htmlFor="expiration" className="form-label">
              Date d'expiration (MM/AA)
            </label>
            <input
              type="text"
              id="expiration"
              name="expiration"
              className="form-control"
              placeholder="MM/AA"
              value={form.expiration}
              onChange={handleChange}
              maxLength={5}
              required
            />
            {errors.expiration && <p className="text-danger">{errors.expiration}</p> }
          </div>
          <div className="col-6">
            <label htmlFor="cvv" className="form-label">
              CVV
            </label>
            <input
              type="password"
              id="cvv"
              name="cvv"
              className="form-control"
              placeholder="CVV"
              value={form.cvv}
              onChange={handleChange}
              maxLength={4}
              required
            />
            {errors.cvv && <p className="text-danger">{errors.cvv}</p> }
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Valider la réservation
        </button>
      </form>
      {message && <div className="alert-alert-info mt-3">{message}</div> }
    </div>
  );
}

export default Reservation;

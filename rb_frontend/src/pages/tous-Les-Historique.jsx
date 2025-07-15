import { useEffect, useState } from "react";

function TousLesReservation() {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/les-reservations`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReservations(data);
        } else if (data.message) {
          setMessage(data.message);
        }
      })
      .catch((err) => {
        console.error("Erreur de chargement :", err);
        setMessage("Erreur de chargement des réservations.");
      });
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 text-primary fw-bold">
        <i className="fas fa-history me-2"></i>
        Historique des Réservations
      </h2>

      {message && (
        <div className="alert alert-danger text-center fw-semibold">{message}</div>
      )}

      {reservations.length === 0 ? (
        <p className="text-center text-muted">Aucune réservation enregistrée.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Départ</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Heure</th>
                <th>Compagnie</th>
                <th>Classe</th>
                <th>Prix (€)</th>
                <th>Réservé le</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {reservations.map((res, index) => (
                <tr key={res.reservation_id || index}>
                  <td>{index + 1}</td>
                  <td>{res.nom_utilisateur}</td>
                  <td>{res.prenom_utilisateur}</td>
                  <td>{res.email}</td>
                  <td><i className="fas fa-plane-departure me-1 text-success"></i>{res.ville_depart}</td>
                  <td><i className="fas fa-plane-arrival me-1 text-danger"></i>{res.ville_destination}</td>
                  <td>{res.date_depart}</td>
                  <td>{res.heure_depart}</td>
                  <td>{res.compagnie}</td>
                  <td>
                    <span className={`badge rounded-pill ${res.classe === "business" ? "bg-warning text-dark" : "bg-info text-dark"}`}>
                      {res.classe}
                    </span>
                  </td>
                  <td><strong className="text-success">{res.prix} €</strong></td>
                  <td className="text-secondary">
                    {new Date(res.date_reservations).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TousLesReservation;

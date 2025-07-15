import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [reservationsPerVol, setReservationsPerVol] = useState([]); // ✅ Les données du graphique

  // ✅ Statistiques globales (cartes)
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setMessage("Erreur lors du chargement du dashboard"));
  }, []);

  // ✅ Récupération du nombre de réservations par vol
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/stats-reservations-par-vol`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Données reçues pour le graphique :", data);
        setReservationsPerVol(data);
      })
      .catch(() => console.log("Erreur graphique"));
  }, []);

  if (message) return <p className="alert alert-danger">{message}</p>;
  if (!stats) return <p>Chargement en cours...</p>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Dashboard Administrateur</h2>

      {/* ✅ Les cartes statistiques */}
      <div className="row g-3 mb-5">
        <div className="col-sm-6 col-md-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Total Utilisateurs</h5>
              <p className="card-text display-6">{stats.totalUtilisateurs}</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Total Vols</h5>
              <p className="card-text display-6">{stats.totalVols}</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body">
              <h5 className="card-title">Total Réservations</h5>
              <p className="card-text display-6">{stats.totalReservations}</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card text-white bg-danger h-100">
            <div className="card-body">
              <h5 className="card-title">Places Disponibles</h5>
              <p className="card-text display-6">{stats.placesDisponibles}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Le graphique avec les données correctes */}
      <h4>📊 Nombre de réservations par vol</h4>
      {reservationsPerVol.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reservationsPerVol}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trajet" /> {/* ✅ Utilise bien le nom de ton champ SQL CONCAT */}
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3182ce" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>Aucune donnée pour le graphique.</p>
      )}
    </div>
  );
}

export default Dashboard;

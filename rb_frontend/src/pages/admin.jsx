import { useEffect } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";

function Admin() {
  let user = null;
  try{
    const stored = localStorage.getItem("connectedUser")
    user = stored ? JSON.parse(stored) : null;
  } catch(err){
    console.error("Erreur lors du parsing", err)
  }
  
  const navigate = useNavigate();

  const disconnect = (e) => {
    e.preventDefault();
    localStorage.removeItem("connectedUser");
    navigate("/login");
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      setTimeout(
        () =>
        {
          alert("Contenu réservé uniquement aux admins, veuillez vous connecter !");
          navigate("/login");
        },
        2000
      );
    }
  }, []);
  if (!user || user.role !== "admin"){
    return null
  }

  return (
    <div className="container my-4">
      <div className="row align-items-center mb-3">
        <div className="col-12 col-md-8">
          <h1 className="mb-0">Espace Administrateur</h1>
          <p>
            Bienvenu <strong>{user?.nom}</strong>
          </p>
        </div>
        <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
          <button onClick={disconnect} className="btn btn-danger">
            Déconnexion
          </button>
        </div>
      </div>

      <nav className="d-flex flex-wrap gap-2 mb-4">
        <Link to="/tous-Les-Historique" className="btn btn-outline-primary">
          Historique des réservations
        </Link>
        <Link to="/listeVols" className="btn btn-outline-success">
          Liste des vols
        </Link>
        <Link to="/dashboard" className="btn btn-outline-warning">
          Dashboard
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}

export default Admin;

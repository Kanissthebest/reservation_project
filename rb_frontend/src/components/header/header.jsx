import { Link, useNavigate } from "react-router-dom";

function Header() {
  const user = JSON.parse(localStorage.getItem("connectedUser") || "null");
  const navigate = useNavigate();

  const disconnect = (e) => {
    e.preventDefault();
    localStorage.removeItem("connectedUser");
    navigate("/login");
  };

  return (
    
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Accueil</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/register">S'inscrire</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Connexion</Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/mes-reservation">Mes Réservations</Link>
              </li>
            </>
          )}
        </ul>

        {user && (
          <div className="d-flex align-items-center">
            <span className="text-white me-3">{user.nom} {user.prenom}</span>
            <button onClick={disconnect} className="btn btn-outline-light btn-sm">Déconnexion</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;

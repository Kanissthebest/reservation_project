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
      {/* Logo ou Accueil */}
      <Link className="navbar-brand" to="/">Accueil</Link>

      {/* ✅ Le bouton toggle pour mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* ✅ La div collapse avec un ID qui correspond au data-bs-target */}
      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
            <li className="nav-item">
              <Link className="nav-link" to="/mes-reservation">Mes Réservations</Link>
            </li>
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

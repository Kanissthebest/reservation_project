import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const redirectPath = localStorage.getItem('redirectAfterLogin');
  console.log(redirectPath)
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:9100/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginUser),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.message);
          return;
        }
       
        localStorage.setItem("connectedUser", JSON.stringify(data.user));
        setMessage("Connexion réussie, redirection...");
        setTimeout(() => {
          //modification à ce niveau
          if(redirectPath){
            localStorage.removeItem('redirectAfterLogin');
            return navigate(redirectPath);
          }
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 2000);
      })
      .catch((err) => {
        console.error("Erreur :", err);
        setMessage("Erreur réseau, veuillez réessayer.");
      });
  };

  return (
    <div className="container my-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Connexion</h2>

      {message && (
        <div
          className={`alert ${
            message.includes("réussi") ? "alert-success" : "alert-danger"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Adresse Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            placeholder="Entrez votre email"
            value={loginUser.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            placeholder="Entrez votre mot de passe"
            value={loginUser.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Se connecter
        </button>
      </form>
      <div>Vous n'avez pas de compte ? <Link to='/register'>Inscrivez-vous</Link></div>
    </div>
  );
}

export default Login;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nom: "", prenom: "", email: "", password: "" });
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const registerSchema = Yup.object().shape({
    nom: Yup.string()
      .required("Le nom est requis")
      .min(2, "Le nom doit contenir au moins deux caractères"),
    prenom: Yup.string()
      .required("Le prénom est requis")
      .min(2, "Le prénom doit comporter au moins deux lettres"),
    email: Yup.string()
      .required("L'adresse email est requise")
      .email("L'adresse email est invalide"),
    password: Yup.string()
      .required("Le mot de passe est obligatoire")
      .min(6, "Mot de passe trop court (min. 6 caractères)"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerSchema.validate(user, { abortEarly: false });
      setErrors({});
      const res = await fetch("http://localhost:9100/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (res.ok) {
        setIsRegistered(true);
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setMessage(data.message || "Erreur lors de l'inscription");
      }
    } catch (validationError) {
      const formatedErrors = {};
      if (validationError.inner) {
        validationError.inner.forEach((err) => {
          formatedErrors[err.path] = err.message;
        });
      }
      setErrors(formatedErrors);
    }
  };

  if (isRegistered) {
    return (
      <div className="container my-5">
        <div className="alert alert-success text-center">{message}</div>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Inscription</h2>
      {message && !isRegistered && <div className="alert alert-danger">{message}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="nom" className="form-label">
            Nom
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={user.nom}
            onChange={handleChange}
            className={`form-control ${errors.nom ? "is-invalid" : ""}`}
            placeholder="Entrez votre nom"
            required
          />
          {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="prenom" className="form-label">
            Prénom
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={user.prenom}
            onChange={handleChange}
            className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
            placeholder="Entrez votre prénom"
            required
          />
          {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            placeholder="Entrez votre email"
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Entrez votre mot de passe"
            required
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Register;

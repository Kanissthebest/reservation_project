import { useNavigate } from "react-router-dom";

function BtnReservation({ vol }) {
  const navigate = useNavigate();

  const btnClick = (e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("connectedUser") || "null");
    if (!user) {
      localStorage.setItem('redirectAfterLogin', `/reservation/${vol.id}`);//la ligne que j'ai ajouté
      alert("Veuillez vous connecter pour réserver");
      navigate("/login");
    } else {
      navigate(`/Reservation/${vol.id}`);
    }
  };

  return (
    <div className="d-grid">
      <button
        onClick={btnClick}
        className="btn btn-primary btn-sm text-nowrap"
      >
        Réserver
      </button>
    </div>
  );
}

export default BtnReservation;

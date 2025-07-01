import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Header from "./components/header/header";
import Accueil from "./pages/accueil";
import Admin from "./pages/admin";
import ShowContent from "./pages/showContent";
import Reservation from "./pages/reservation";
import MesReservation from "./pages/mes_Reservations";
import TousLesReservation from "./pages/tous-Les-Historique";
import ListeVols from "./pages/listVols";
import Dashboard from "./pages/dashbord";

// 👇 Déplacement de la logique dans un composant interne
function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin") ||
                      location.pathname.startsWith("/tous-Les-Historique") ||
                      location.pathname.startsWith("/listeVols") ||
                      location.pathname.startsWith("/dashboard") ||
                      location.pathname.startsWith("/login") ||
                      location.pathname.startsWith("/register");
  return (
    <>
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Accueil />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/showContent" element={<ShowContent />} />
        <Route path="/reservation/:id" element={<Reservation />} />
        <Route path="/mes-reservation" element={<MesReservation />} />
        <Route path="/tous-Les-Historique" element={<TousLesReservation />} />
        <Route path="/listeVols" element={<ListeVols />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

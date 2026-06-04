import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Profile() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const roleLabels = {
    admin: "Admin",
    coach: "Trener",
    parent: "Roditelj",
  };

  if (!user) return null;

  return (
    <div className="form-container">
      <h1 className="page-title">Moj profil</h1>
      <div className="form-body">
        <div className="profile-row">
          <span className="profile-label">Ime:</span>
          <span className="profile-value">{user.name}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Prezime:</span>
          <span className="profile-value">{user.last_name}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Korisničko ime:</span>
          <span className="profile-value">{user.username}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Broj telefona:</span>
          <span className="profile-value">{user.phone_number}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Uloga:</span>
          <span className="profile-value">{roleLabels[user.role_as]}</span>
        </div>
        <button
          className="btn-primary btn-full"
          onClick={() => navigate(`/users/edit/${user.id}`)}
        >
          Izmeni profil
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

export default function Locations() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    async function getLocations() {
      const res = await fetch("/api/locations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setLocations(data);
    }

    getLocations();
  }, []);

  async function handleDelete() {
    const res = await fetch(`/api/locations/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setLocations(locations.filter((location) => location.id !== deleteId));
      setDeleteId(null);
      setShowDeleteSuccess(true);
    } else if (res.status === 409) {
      const data = await res.json();
      setDeleteId(null);
      setErrorMessage(data.message);
    }
  }

  return (
    <div className="users-container">
      {deleteId && (
        <Modal
          message="Da li ste sigurni da želite da obrišete ovu lokaciju?"
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
      {errorMessage && (
        <Modal message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {showDeleteSuccess && (
        <Modal
          message="Lokacija je uspešno obrisana!"
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}
      <div className="page-header">
        <h1 className="page-title">Lokacije</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/locations/create")}
        >
          Kreiraj lokaciju
        </button>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Naziv</th>
            <th>Adresa</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location, index) => (
            <tr key={location.id}>
              <td>{index + 1}</td>
              <td>{location.name}</td>
              <td>{location.address}</td>
              <td>
                <button
                  className="btn-primary btn-sm"
                  onClick={() => navigate(`/locations/edit/${location.id}`)}
                >
                  Izmeni
                </button>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => setDeleteId(location.id)}
                >
                  Obriši
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

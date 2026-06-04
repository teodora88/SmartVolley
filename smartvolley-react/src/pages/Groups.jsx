import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

export default function Groups() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const categoryLabels = {
    school: "Školica",
    pioneers: "Pionirke",
    cadets: "Kadetkinje",
    juniors: "Juniorke",
  };

  useEffect(() => {
    async function getGroups() {
      const res = await fetch("/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setGroups(data);
    }

    getGroups();
  }, []);

  async function handleDelete() {
    const res = await fetch(`/api/groups/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setGroups(groups.filter((group) => group.id !== deleteId));
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
          message="Da li ste sigurni da želite da obrišete ovu grupu?"
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
      {showDeleteSuccess && (
        <Modal
          message="Grupa je uspešno obrisana."
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}
      {errorMessage && (
        <Modal message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      <div className="page-header">
        <h1 className="page-title">Grupe</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/groups/create")}
        >
          Kreiraj grupu
        </button>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Naziv</th>
            <th>Kategorija</th>
            <th>Lokacija</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr key={group.id}>
              <td>{index + 1}</td>
              <td>{group.name}</td>
              <td>{categoryLabels[group.category]}</td>
              <td>{group.location ? group.location.name : "-"}</td>
              <td>
                <button
                  className="btn-primary btn-sm"
                  onClick={() => navigate(`/groups/edit/${group.id}`)}
                >
                  Izmeni
                </button>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => setDeleteId(group.id)}
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

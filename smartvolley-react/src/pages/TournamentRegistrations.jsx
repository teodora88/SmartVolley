import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import { formatDate } from "../utils/formatDate";

export default function TournamentRegistrations() {
  const { token } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [activity, setActivity] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  useEffect(() => {
    async function getActivity() {
      const res = await fetch(`/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivity(data);
    }

    async function getRegistrations() {
      const res = await fetch(
        `/api/tournament-registrations?activity_id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setRegistrations(data);
    }

    getActivity();
    getRegistrations();
  }, [id]);

  async function handleDelete() {
    const res = await fetch(`/api/tournament-registrations/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setRegistrations(registrations.filter((r) => r.id !== deleteId));
      setDeleteId(null);
      setShowDeleteSuccess(true);
    }
  }

  return (
    <div className="users-container">
      {deleteId && (
        <Modal
          message="Da li ste sigurni da želite da obrišete ovu prijavu?"
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
      {showDeleteSuccess && (
        <Modal
          message="Prijava je uspešno obrisana."
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}
      <div className="page-header">
        <h1 className="page-title">
          Prijave za turnir
          {activity && ` — ${formatDate(activity.date)}`}
        </h1>
        <button className="btn-primary" onClick={() => navigate("/activities")}>
          Nazad na aktivnosti
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Status prijave</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((reg, index) => (
            <tr key={reg.id}>
              <td>{index + 1}</td>
              <td>{reg.member?.name}</td>
              <td>{reg.member?.last_name}</td>
              <td>
                <span
                  className={`status-badge ${
                    reg.is_registered === null
                      ? "status-postponed"
                      : reg.is_registered
                        ? "status-completed"
                        : "status-canceled"
                  }`}
                >
                  {reg.is_registered === null
                    ? "Čeka odgovor"
                    : reg.is_registered
                      ? "Prijavljen/a"
                      : "Nije prijavljen/a"}
                </span>
              </td>
              <td>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => setDeleteId(reg.id)}
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

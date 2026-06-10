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
  const [members, setMembers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");

  async function getRegistrations() {
    const res = await fetch(`/api/tournament-registrations?activity_id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRegistrations(data);
  }

  useEffect(() => {
    async function getActivity() {
      const res = await fetch(`/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivity(data);
    }

    async function getMembers() {
      const res = await fetch("/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMembers(data);
    }

    getActivity();
    getRegistrations();
    getMembers();
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

  async function handleAddRegistration(e) {
    e.preventDefault();

    const res = await fetch("/api/tournament-registrations", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        activity_id: parseInt(id),
        member_id: parseInt(selectedMember),
        is_registered: null,
      }),
    });

    if (res.ok) {
      await getRegistrations();
      setShowAddModal(false);
      setSelectedMember("");
    }
  }

  const registeredMemberIds = registrations.map((r) => r.member_id);
  const availableMembers = members.filter(
    (m) =>
      !registeredMemberIds.includes(m.id) && m.group_id === activity?.group_id,
  );

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
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p className="modal-message">Dodaj prijavu za člana</p>
            <form onSubmit={handleAddRegistration} className="form-body">
              <select
                className="form-input"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
              >
                <option value="">Izaberi člana</option>
                {availableMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} {member.last_name}
                  </option>
                ))}
              </select>
              <div className="modal-buttons" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowAddModal(false)}
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!selectedMember}
                >
                  Dodaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="page-header">
        <h1 className="page-title">
          Prijave za turnir
          {activity && ` — ${formatDate(activity.date)}`}
        </h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            Dodaj prijavu
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/activities")}
          >
            Nazad na aktivnosti
          </button>
        </div>
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

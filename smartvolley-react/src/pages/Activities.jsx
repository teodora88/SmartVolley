import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import "../styles/Activities.css";

export default function Activities() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [groups, setGroups] = useState([]);
  const [groupFilter, setGroupFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const typeLabels = {
    practice: "Trening",
    game: "Utakmica",
    tournament: "Turnir",
  };

  const statusLabels = {
    scheduled: "Zakazan/a",
    canceled: "Otkazan/a",
    postponed: "Odložen/a",
    completed: "Završen/a",
  };

  useEffect(() => {
    async function getGroups() {
      const res = await fetch("/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGroups(data);
    }
    getGroups();
  }, []);

  useEffect(() => {
    async function getActivities() {
      const params = new URLSearchParams();
      if (groupFilter) params.append("group_id", groupFilter);
      if (typeFilter) params.append("type", typeFilter);
      if (statusFilter) params.append("status", statusFilter);

      const res = await fetch(`/api/activities?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivities(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
    getActivities();
  }, [groupFilter, typeFilter, statusFilter]);

  async function handleDelete() {
    const res = await fetch(`/api/activities/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setActivities(activities.filter((a) => a.id !== deleteId));
      setDeleteId(null);
      setShowDeleteSuccess(true);
    }
  }

  return (
    <div className="users-container">
      {deleteId && (
        <Modal
          message="Da li ste sigurni da želite da obrišete ovu aktivnost?"
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
      {showDeleteSuccess && (
        <Modal
          message="Aktivnost je uspešno obrisana."
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}
      <div className="page-header">
        <h1 className="page-title">Aktivnosti</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/activities/create")}
        >
          Kreiraj aktivnost
        </button>
      </div>
      <div className="users-filters">
        <select
          className="filter-select"
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
        >
          <option value="">Sve grupe</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Svi tipovi</option>
          <option value="practice">Trening</option>
          <option value="game">Utakmica</option>
          <option value="tournament">Turnir</option>
        </select>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Svi statusi</option>
          <option value="scheduled">Zakazan/a</option>
          <option value="canceled">Otkazan/a</option>
          <option value="postponed">Odložen/a</option>
          <option value="completed">Završen/a</option>
        </select>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Datum</th>
            <th>Vreme</th>
            <th>Tip</th>
            <th>Status</th>
            <th>Grupa</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={activity.id}>
              <td>{index + 1}</td>
              <td>{activity.date}</td>
              <td>{activity.time ? activity.time.substring(0, 5) : "-"}</td>
              <td>{typeLabels[activity.type]}</td>
              <td>
                <span className={`status-badge status-${activity.status}`}>
                  {statusLabels[activity.status]}
                </span>
              </td>
              <td>{activity.group ? activity.group.name : "-"}</td>
              <td>
                <button
                  className="btn-primary btn-sm"
                  onClick={() => navigate(`/activities/edit/${activity.id}`)}
                >
                  Izmeni
                </button>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => setDeleteId(activity.id)}
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

import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

export default function Members() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

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
    async function getMembers() {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (groupFilter) params.append("group_id", groupFilter);

      const res = await fetch(`/api/members?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMembers(data);
    }
    getMembers();
  }, [search, groupFilter]);

  async function handleDelete() {
    const res = await fetch(`/api/members/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setMembers(members.filter((member) => member.id !== deleteId));
      setDeleteId(null);
      setShowDeleteSuccess(true);
    }
  }

  return (
    <div className="users-container">
      {deleteId && (
        <Modal
          message="Da li ste sigurni da želite da obrišete ovog člana?"
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
      {showDeleteSuccess && (
        <Modal
          message="Član je uspešno obrisan."
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}
      <div className="page-header">
        <h1 className="page-title">Članovi</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/members/create")}
        >
          Dodaj člana
        </button>
      </div>
      <div className="users-filters">
        <input
          type="text"
          className="filter-input"
          placeholder="Pretraži po imenu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Godište</th>
            <th>Grupa</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member.id}>
              <td>{index + 1}</td>
              <td>{member.name}</td>
              <td>{member.last_name}</td>
              <td>
                {member.birthday
                  ? new Date(member.birthday).getFullYear()
                  : "-"}
              </td>
              <td>{member.group ? member.group.name : "-"}</td>
              <td>
                <button
                  className="btn-primary btn-sm"
                  onClick={() => navigate(`/members/edit/${member.id}`)}
                >
                  Izmeni
                </button>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => setDeleteId(member.id)}
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

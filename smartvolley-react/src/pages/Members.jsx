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
  const [transferMember, setTransferMember] = useState(null);
  const [otherGroups, setOtherGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);

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

  async function openTransferModal(member) {
    const res = await fetch("/api/groups/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const coachGroupIds = groups.map((g) => g.id);
    setOtherGroups(data.filter((g) => !coachGroupIds.includes(g.id)));
    setTransferMember(member);
    setSelectedGroup("");
  }

  async function handleTransfer() {
    const res = await fetch(`/api/members/${transferMember.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ group_id: parseInt(selectedGroup) }),
    });

    if (res.ok) {
      setMembers(members.filter((m) => m.id !== transferMember.id));
      setTransferMember(null);
      setShowTransferSuccess(true);
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
      {showTransferSuccess && (
        <Modal
          message="Član je uspešno premešten u drugu grupu."
          onClose={() => setShowTransferSuccess(false)}
        />
      )}
      {transferMember && (
        <div className="modal-overlay">
          <div className="modal">
            <p className="modal-message">
              Premesti {transferMember.name} {transferMember.last_name} u drugu
              grupu:
            </p>
            <select
              className="form-input"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">Izaberi grupu</option>
              {otherGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <div className="modal-buttons" style={{ marginTop: "16px" }}>
              <button
                className="btn-primary"
                onClick={() => setTransferMember(null)}
              >
                Otkaži
              </button>
              <button
                className="btn-primary"
                onClick={handleTransfer}
                disabled={!selectedGroup}
              >
                Premesti
              </button>
            </div>
          </div>
        </div>
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
            <th>Dodatne akcije</th>
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
                  onClick={() => openTransferModal(member)}
                >
                  Premesti
                </button>
              </td>
              <td>
                <button
                  className="btn-primary btn-sm"
                  onClick={() => navigate(`/members/${member.id}`)}
                >
                  Detalji
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

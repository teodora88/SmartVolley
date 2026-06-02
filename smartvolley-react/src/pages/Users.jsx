import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "../styles/Users.css";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

export default function Users() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function getUsers() {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (roleFilter) params.append("role_as", roleFilter);

      const res = await fetch(`/api/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    }

    getUsers();
  }, [search, roleFilter]);

  async function handleDelete() {
    const res = await fetch(`/api/users/${deleteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setUsers(users.filter((user) => user.id !== deleteId));
      setDeleteId(null);
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
          message="Da li ste sigurni da želite da obrišete ovog korisnika?"
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
      {errorMessage && (
        <Modal message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      <h1 className="page-title">Korisnici</h1>
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Sve uloge</option>
          <option value="admin">Admin</option>
          <option value="coach">Trener</option>
          <option value="parent">Roditelj</option>
        </select>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Korisničko ime</th>
            <th>Broj telefona</th>
            <th>Uloga</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.last_name}</td>
              <td>{user.username}</td>
              <td>{user.phone_number}</td>
              <td>{user.role_as}</td>
              <td>
                <button
                  className="btn-primary btn-sm"
                  onClick={() => navigate(`/users/edit/${user.id}`)}
                >
                  Izmeni
                </button>
                <button
                  className="btn-danger btn-sm"
                  onClick={() => setDeleteId(user.id)}
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

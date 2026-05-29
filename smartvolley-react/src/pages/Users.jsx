import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import "../styles/Users.css";

export default function Users() {
  const { token } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

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

  return (
    <div className="users-container">
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
                <button className="btn-edit">Izmeni</button>
                <button className="btn-delete">Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

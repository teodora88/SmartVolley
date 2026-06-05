import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { formatDate } from "../utils/formatDate";

export default function Attendances() {
  const { token } = useContext(AppContext);
  const [attendances, setAttendances] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [presenceFilter, setPresenceFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

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
    async function getAttendances() {
      const params = new URLSearchParams();
      if (monthFilter) params.append("month", monthFilter);

      const res = await fetch(`/api/attendances?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAttendances(
        data.sort(
          (a, b) => new Date(b.activity?.date) - new Date(a.activity?.date),
        ),
      );
    }
    getAttendances();
  }, [monthFilter]);

  const filtered = attendances
    .filter((a) =>
      search
        ? `${a.member?.name} ${a.member?.last_name}`
            .toLowerCase()
            .includes(search.toLowerCase())
        : true,
    )
    .filter((a) => {
      if (presenceFilter === "present") return a.is_present === true;
      if (presenceFilter === "absent") return a.is_present === false;
      if (presenceFilter === "null") return a.is_present === null;
      return true;
    })
    .filter((a) =>
      groupFilter ? a.member?.group_id === parseInt(groupFilter) : true,
    );

  return (
    <div className="users-container">
      <h1 className="page-title">Evidencija dolazaka</h1>
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
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="">Svi meseci</option>
          <option value="1">Januar</option>
          <option value="2">Februar</option>
          <option value="3">Mart</option>
          <option value="4">April</option>
          <option value="5">Maj</option>
          <option value="6">Jun</option>
          <option value="7">Jul</option>
          <option value="8">Avgust</option>
          <option value="9">Septembar</option>
          <option value="10">Oktobar</option>
          <option value="11">Novembar</option>
          <option value="12">Decembar</option>
        </select>
        <select
          className="filter-select"
          value={presenceFilter}
          onChange={(e) => setPresenceFilter(e.target.value)}
        >
          <option value="">Svi</option>
          <option value="present">Prisutan/na</option>
          <option value="absent">Odsutan/na</option>
          <option value="null">Nije evidentirano</option>
        </select>
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
            <th>Grupa</th>
            <th>Datum treninga</th>
            <th>Prisutan/na</th>
            <th>Opravdanje</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((attendance, index) => (
            <tr key={attendance.id}>
              <td>{index + 1}</td>
              <td>{attendance.member?.name}</td>
              <td>{attendance.member?.last_name}</td>
              <td>{attendance.member?.group?.name ?? "-"}</td>
              <td>{formatDate(attendance.activity?.date)}</td>
              <td>
                {attendance.is_present === null
                  ? "Nije evidentirano"
                  : attendance.is_present
                    ? "Prisutan/na"
                    : "Odsutan/na"}
              </td>
              <td>{attendance.excuse ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

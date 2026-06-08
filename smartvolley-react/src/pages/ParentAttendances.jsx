import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { formatDate } from "../utils/formatDate";

export default function ParentAttendances() {
  const { token } = useContext(AppContext);
  const [attendances, setAttendances] = useState([]);
  const [children, setChildren] = useState([]);
  const [childFilter, setChildFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [presenceFilter, setPresenceFilter] = useState("");
  const [editingExcuse, setEditingExcuse] = useState(null);
  const [excuseText, setExcuseText] = useState("");

  useEffect(() => {
    async function getChildren() {
      const res = await fetch("/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChildren(data);
    }
    getChildren();
  }, []);

  useEffect(() => {
    async function getAttendances() {
      const params = new URLSearchParams();
      if (childFilter) params.append("member_id", childFilter);
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
  }, [childFilter, monthFilter]);

  const filtered = presenceFilter
    ? attendances.filter((a) => {
        if (presenceFilter === "present") return a.is_present === true;
        if (presenceFilter === "absent") return a.is_present === false;
        if (presenceFilter === "null") return a.is_present === null;
        return true;
      })
    : attendances;

  async function handleSaveExcuse(attendanceId) {
    const res = await fetch(`/api/attendances/${attendanceId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ excuse: excuseText }),
    });

    if (res.ok) {
      setAttendances(
        attendances.map((a) =>
          a.id === attendanceId ? { ...a, excuse: excuseText } : a,
        ),
      );
      setEditingExcuse(null);
      setExcuseText("");
    }
  }

  function getChildName(memberId) {
    const child = children.find((c) => c.id === memberId);
    return child ? `${child.name} ${child.last_name}` : "-";
  }

  return (
    <div className="users-container">
      <h1 className="page-title">Prisutnosti</h1>
      <div className="users-filters">
        {children.length > 1 && (
          <select
            className="filter-select"
            value={childFilter}
            onChange={(e) => setChildFilter(e.target.value)}
          >
            <option value="">Sva deca</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} {child.last_name}
              </option>
            ))}
          </select>
        )}
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
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            {children.length > 1 && <th>Dete</th>}
            <th>Datum treninga</th>
            <th>Prisutnost</th>
            <th>Opravdanje</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((attendance, index) => (
            <tr key={attendance.id}>
              <td>{index + 1}</td>
              {children.length > 1 && (
                <td>{getChildName(attendance.member_id)}</td>
              )}
              <td>{formatDate(attendance.activity?.date)}</td>
              <td>
                <span
                  className={`status-badge ${
                    attendance.is_present === null
                      ? "status-postponed"
                      : attendance.is_present
                        ? "status-completed"
                        : "status-canceled"
                  }`}
                >
                  {attendance.is_present === null
                    ? "Nije evidentirano"
                    : attendance.is_present
                      ? "Prisutan/na"
                      : "Odsutan/na"}
                </span>
              </td>
              <td>
                {editingExcuse === attendance.id ? (
                  <input
                    className="form-input"
                    type="text"
                    value={excuseText}
                    onChange={(e) => setExcuseText(e.target.value)}
                  />
                ) : (
                  (attendance.excuse ?? "-")
                )}
              </td>
              <td>
                {editingExcuse === attendance.id ? (
                  <>
                    <button
                      className="btn-primary btn-sm"
                      onClick={() => handleSaveExcuse(attendance.id)}
                    >
                      Sačuvaj
                    </button>
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => {
                        setEditingExcuse(null);
                        setExcuseText("");
                      }}
                    >
                      Otkaži
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => {
                      setEditingExcuse(attendance.id);
                      setExcuseText(attendance.excuse ?? "");
                    }}
                  >
                    {attendance.excuse
                      ? "Izmeni opravdanje"
                      : "Dodaj opravdanje"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

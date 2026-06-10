import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { formatDate } from "../utils/formatDate";

export default function ParentActivities() {
  const { token } = useContext(AppContext);
  const [activities, setActivities] = useState([]);
  const [children, setChildren] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [childFilter, setChildFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");

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
    async function getChildren() {
      const res = await fetch("/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChildren(data);
    }

    async function getRegistrations() {
      const res = await fetch("/api/tournament-registrations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRegistrations(data);
    }

    getChildren();
    getRegistrations();
  }, []);

  useEffect(() => {
    async function getActivities() {
      const params = new URLSearchParams();
      if (typeFilter) params.append("type", typeFilter);
      if (statusFilter) params.append("status", statusFilter);
      if (monthFilter) params.append("month", monthFilter);

      const res = await fetch(`/api/activities?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivities(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
    getActivities();
  }, [typeFilter, statusFilter, monthFilter]);

  const filtered = children
    .flatMap((child) =>
      activities
        .filter((a) => {
          if (a.group_id !== child.group_id) return false;
          if (a.type === "tournament") {
            return registrations.some(
              (r) => r.activity_id === a.id && r.member_id === child.id,
            );
          }
          return new Date(a.date) >= new Date(child.created_at.split("T")[0]);
        })
        .filter((a) => !typeFilter || a.type === typeFilter)
        .filter((a) => !statusFilter || a.status === statusFilter)
        .filter((a) => {
          if (!monthFilter) return true;
          return new Date(a.date).getMonth() + 1 === parseInt(monthFilter);
        })
        .filter(() => !childFilter || child.id === parseInt(childFilter))
        .map((a) => ({
          ...a,
          childName: `${child.name} ${child.last_name}`,
          childId: child.id,
        })),
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  function getRegistration(activityId, childId) {
    return registrations.find(
      (r) => r.activity_id === activityId && r.member_id === childId,
    );
  }

  function isTournamentExpired(date) {
    return new Date(date) < new Date();
  }

  async function handleRegister(registrationId, isRegistered) {
    const res = await fetch(`/api/tournament-registrations/${registrationId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_registered: isRegistered }),
    });

    if (res.ok) {
      setRegistrations(
        registrations.map((r) =>
          r.id === registrationId ? { ...r, is_registered: isRegistered } : r,
        ),
      );
    }
  }

  return (
    <div className="users-container">
      <h1 className="page-title">Aktivnosti</h1>
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
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Dete</th>
            <th>Tip</th>
            <th>Datum</th>
            <th>Vreme</th>
            <th>Lokacija</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((activity, index) => {
            const registration =
              activity.type === "tournament"
                ? getRegistration(activity.id, activity.childId)
                : null;

            const tournamentExpired = isTournamentExpired(activity.date);

            return (
              <tr key={`${activity.id}-${activity.childName}`}>
                <td>{index + 1}</td>
                <td>{activity.childName}</td>
                <td>{typeLabels[activity.type]}</td>
                <td>{formatDate(activity.date)}</td>
                <td>{activity.time ? activity.time.substring(0, 5) : "-"}</td>
                <td>
                  {activity.location
                    ? activity.location.name
                    : (activity.other_location ?? "-")}
                </td>
                <td>
                  <span className={`status-badge status-${activity.status}`}>
                    {statusLabels[activity.status]}
                  </span>
                </td>
                <td>
                  {activity.type === "tournament" &&
                    registration &&
                    (registration.is_registered ? (
                      <button
                        className="btn-danger btn-sm"
                        disabled={tournamentExpired}
                        onClick={() => handleRegister(registration.id, false)}
                      >
                        Odjavi se
                      </button>
                    ) : (
                      <button
                        className="btn-primary btn-sm"
                        disabled={tournamentExpired}
                        onClick={() => handleRegister(registration.id, true)}
                      >
                        Prijavi se
                      </button>
                    ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

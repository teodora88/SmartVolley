import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import { formatDate } from "../utils/formatDate";

export default function ActivityAttendance() {
  const { token } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendances, setAttendances] = useState([]);
  const [activity, setActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function getActivity() {
      const res = await fetch(`/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivity(data);
    }

    async function getAttendances() {
      const res = await fetch(`/api/attendances?activity_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAttendances(data);
    }

    getActivity();
    getAttendances();
  }, [id]);

  async function handleSave() {
    for (const attendance of attendances) {
      await fetch(`/api/attendances/${attendance.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ is_present: attendance.is_present }),
      });
    }
    setShowModal(true);
  }

  function togglePresence(attendanceId, value) {
    setAttendances(
      attendances.map((a) =>
        a.id === attendanceId ? { ...a, is_present: value } : a,
      ),
    );
  }

  return (
    <div className="users-container">
      {showModal && (
        <Modal
          message="Prisutnost je uspešno evidentirana."
          onClose={() => navigate("/activities")}
        />
      )}
      <div className="page-header">
        <h1 className="page-title">
          Evidencija prisutnosti
          {activity &&
            ` - ${formatDate(activity.date)} ${activity.time ? activity.time.substring(0, 5) : ""}`}
        </h1>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Prisutnost</th>
            <th>Opravdanje</th>
          </tr>
        </thead>
        <tbody>
          {attendances.map((attendance, index) => (
            <tr key={attendance.id}>
              <td>{index + 1}</td>
              <td>{attendance.member?.name}</td>
              <td>{attendance.member?.last_name}</td>
              <td>
                <select
                  className="filter-select"
                  value={
                    attendance.is_present === null
                      ? ""
                      : attendance.is_present
                        ? "1"
                        : "0"
                  }
                  onChange={(e) => {
                    const val =
                      e.target.value === "" ? null : e.target.value === "1";
                    togglePresence(attendance.id, val);
                  }}
                >
                  <option value="">Nije evidentirano</option>
                  <option value="1">Prisutan/na</option>
                  <option value="0">Odsutan/na</option>
                </select>
              </td>
              <td>{attendance.excuse ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="btn-primary"
        style={{ marginTop: "16px" }}
        onClick={handleSave}
      >
        Sačuvaj evidenciju
      </button>
    </div>
  );
}

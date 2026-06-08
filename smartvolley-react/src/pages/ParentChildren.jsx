import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import "../styles/Members.css";

export default function ParentEvaluations() {
  const { token } = useContext(AppContext);
  const [children, setChildren] = useState([]);
  const [notes, setNotes] = useState({});
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    async function getChildren() {
      const res = await fetch("/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChildren(data);

      const initialFormData = {};
      const initialOriginalData = {};
      data.forEach((child) => {
        const childData = {
          birthday: child.birthday ?? "",
          height: child.height ?? "",
          weight: child.weight ?? "",
        };
        initialFormData[child.id] = childData;
        initialOriginalData[child.id] = childData;
      });
      setFormData(initialFormData);
      setOriginalData(initialOriginalData);
    }

    async function getNotes() {
      const res = await fetch("/api/member-notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      const notesByMember = {};
      data.forEach((note) => {
        if (!notesByMember[note.member_id]) {
          notesByMember[note.member_id] = [];
        }
        notesByMember[note.member_id].push(note);
      });
      setNotes(notesByMember);
    }

    getChildren();
    getNotes();
  }, []);

  function isChanged(childId) {
    if (!originalData[childId]) return false;
    return (
      JSON.stringify(formData[childId]) !==
      JSON.stringify(originalData[childId])
    );
  }

  async function handleSave(childId) {
    const res = await fetch(`/api/members/${childId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData[childId]),
    });

    if (res.ok) {
      setOriginalData({ ...originalData, [childId]: { ...formData[childId] } });
      setModalMessage("Podaci su uspešno sačuvani.");
      setShowModal(true);
    }
  }

  function updateField(childId, field, value) {
    setFormData({
      ...formData,
      [childId]: { ...formData[childId], [field]: value },
    });
  }

  return (
    <div className="users-container">
      {showModal && (
        <Modal message={modalMessage} onClose={() => setShowModal(false)} />
      )}
      <h1 className="page-title">Profil i evaluacije</h1>
      {children.map((child) => (
        <div key={child.id} style={{ marginBottom: "48px" }}>
          <div className="member-details-container">
            <div className="member-left">
              <h2 className="page-title">
                {child.name} {child.last_name}
              </h2>
              <div className="form-body" style={{ marginTop: "16px" }}>
                <div>
                  <input
                    className="form-input"
                    type="date"
                    value={formData[child.id]?.birthday ?? ""}
                    onChange={(e) =>
                      updateField(child.id, "birthday", e.target.value)
                    }
                  />
                </div>
                <div>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Visina (cm)"
                    value={formData[child.id]?.height ?? ""}
                    onChange={(e) =>
                      updateField(child.id, "height", e.target.value)
                    }
                  />
                </div>
                <div>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="Težina (kg)"
                    value={formData[child.id]?.weight ?? ""}
                    onChange={(e) =>
                      updateField(child.id, "weight", e.target.value)
                    }
                  />
                </div>
                <div>
                  <input
                    className="form-input"
                    type="text"
                    value={child.group?.name ?? "-"}
                    disabled
                  />
                </div>
                <button
                  className="btn-primary btn-full"
                  onClick={() => handleSave(child.id)}
                  disabled={!isChanged(child.id)}
                >
                  Sačuvaj izmene
                </button>
              </div>
            </div>
            <div className="member-right">
              <h2 className="page-title">Evaluacije</h2>
              <div
                className="form-body notes-scroll"
                style={{
                  marginTop: "16px"
                }}
              >
                {!notes[child.id] || notes[child.id].length === 0 ? (
                  <p style={{ color: "#94a3b8", textAlign: "center" }}>
                    Nema evaluacija.
                  </p>
                ) : (
                  notes[child.id].map((note) => (
                    <div key={note.id} className="note-item">
                      <p className="note-body">{note.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

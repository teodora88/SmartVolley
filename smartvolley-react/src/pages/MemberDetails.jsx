import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import MemberForm from "../components/MemberForm";
import "../styles/Members.css";

export default function MemberDetails() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    birthday: "",
    height: "",
    weight: "",
    group_id: "",
    user_id: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [groups, setGroups] = useState([]);
  const [parents, setParents] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showNoteDeleteId, setShowNoteDeleteId] = useState(null);

  const isChanged =
    originalData && JSON.stringify(formData) !== JSON.stringify(originalData);

  useEffect(() => {
    async function getGroups() {
      const res = await fetch("/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGroups(data);
    }

    async function getParents() {
      const res = await fetch("/api/parents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setParents(data);
    }

    async function getMember() {
      const res = await fetch(`/api/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const loaded = {
        name: data.name,
        last_name: data.last_name,
        birthday: data.birthday ?? "",
        height: data.height ?? "",
        weight: data.weight ?? "",
        group_id: data.group_id ?? "",
        user_id: data.user_id ?? "",
      };
      setFormData(loaded);
      setOriginalData(loaded);
    }

    async function getNotes() {
      const res = await fetch(`/api/member-notes?member_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data);
    }

    getGroups();
    getParents();
    getMember();
    getNotes();
  }, [id]);

  async function handleEdit(e) {
    e.preventDefault();
    setErrors({});

    const dataToSend = { ...formData };
    if (!dataToSend.user_id) delete dataToSend.user_id;
    if (!dataToSend.birthday) delete dataToSend.birthday;
    if (!dataToSend.height) delete dataToSend.height;
    if (!dataToSend.weight) delete dataToSend.weight;

    const res = await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();

    if (res.status === 422) {
      setErrors(data.errors);
    } else if (res.ok) {
      setOriginalData({ ...formData });
      setShowModal(true);
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!newNote.trim()) return;

    const res = await fetch("/api/member-notes", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ body: newNote, member_id: parseInt(id) }),
    });

    if (res.ok) {
      const data = await res.json();
      setNotes([...notes, data.memberNote]);
      setNewNote("");
    }
  }

  async function handleDeleteNote() {
    const res = await fetch(`/api/member-notes/${showNoteDeleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setNotes(notes.filter((n) => n.id !== showNoteDeleteId));
      setShowNoteDeleteId(null);
    }
  }

  return (
    <div className="member-details-container">
      {showModal && (
        <Modal
          message="Podaci člana su uspešno izmenjeni."
          onClose={() => navigate("/members")}
        />
      )}
      {showNoteDeleteId && (
        <Modal
          message="Da li ste sigurni da želite da obrišete ovu evaluaciju?"
          onClose={() => setShowNoteDeleteId(null)}
          onConfirm={handleDeleteNote}
        />
      )}
      <div className="member-left">
        <h1 className="page-title">Detalji člana</h1>
        <MemberForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onSubmit={handleEdit}
          submitLabel="Sačuvaj izmene"
          groups={groups}
          parents={parents}
          disabled={!isChanged}
        />
      </div>
      <div className="member-right">
        <h2 className="page-title">Evaluacije</h2>
        <div className="form-body" style={{ marginTop: "16px" }}>
          {notes.length === 0 && (
            <p style={{ color: "#94a3b8", textAlign: "center" }}>
              Nema evaluacija za ovog člana.
            </p>
          )}
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              <p className="note-body">{note.body}</p>
              <button
                className="btn-danger btn-sm"
                onClick={() => setShowNoteDeleteId(note.id)}
              >
                Obriši
              </button>
            </div>
          ))}
          <form onSubmit={handleAddNote} style={{ marginTop: "16px" }}>
            <textarea
              className="form-input"
              placeholder="Dodaj novu evaluaciju..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <button
              className="btn-primary btn-full"
              type="submit"
              style={{ marginTop: "8px" }}
            >
              Dodaj evaluaciju
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import MemberForm from "../components/MemberForm";

export default function CreateMember() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    birthday: "",
    height: "",
    weight: "",
    group_id: "",
    user_id: "",
  });

  const [groups, setGroups] = useState([]);
  const [parents, setParents] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

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

    getGroups();
    getParents();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setErrors({});

    const dataToSend = { ...formData };
    if (!dataToSend.user_id) delete dataToSend.user_id;
    if (!dataToSend.birthday) delete dataToSend.birthday;
    if (!dataToSend.height) delete dataToSend.height;
    if (!dataToSend.weight) delete dataToSend.weight;

    const res = await fetch("/api/members", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();

    if (res.status === 422) {
      setErrors(data.errors);
    } else if (res.ok) {
      setShowModal(true);
    }
  }

  return (
    <div className="form-container">
      {showModal && (
        <Modal
          message="Član je uspešno kreiran."
          onClose={() => navigate("/members")}
        />
      )}
      <h1 className="page-title">Dodaj člana</h1>
      <MemberForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleCreate}
        submitLabel="Dodaj člana"
        groups={groups}
        parents={parents}
      />
    </div>
  );
}

import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import MemberForm from "../components/MemberForm";

export default function EditMember() {
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

    async function getMember() {
      const res = await fetch(`/api/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFormData({
        name: data.name,
        last_name: data.last_name,
        birthday: data.birthday ?? "",
        height: data.height ?? "",
        weight: data.weight ?? "",
        group_id: data.group_id ?? "",
        user_id: data.user_id ?? "",
      });
    }

    getGroups();
    getParents();
    getMember();
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
      setShowModal(true);
    }
  }

  return (
    <div className="form-container">
      {showModal && (
        <Modal
          message="Podaci člana su uspešno izmenjeni."
          onClose={() => navigate("/members")}
        />
      )}
      <h1 className="page-title">Izmeni člana</h1>
      <MemberForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleEdit}
        submitLabel="Sačuvaj izmene"
        groups={groups}
        parents={parents}
      />
    </div>
  );
}

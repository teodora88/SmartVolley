import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import GroupForm from "../components/GroupForm";

export default function EditGroup() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location_id: "",
  });

  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function getLocations() {
      const res = await fetch("/api/locations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setLocations(data);
    }

    async function getGroup() {
      const res = await fetch(`/api/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFormData({
        name: data.name,
        category: data.category,
        location_id: data.location_id ?? "",
      });
    }

    getLocations();
    getGroup();
  }, [id]);

  async function handleEdit(e) {
    e.preventDefault();
    setErrors({});

    const res = await fetch(`/api/groups/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
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
          message="Grupa je uspešno izmenjena."
          onClose={() => navigate("/groups")}
        />
      )}
      <h1 className="page-title">Izmeni grupu</h1>
      <GroupForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleEdit}
        submitLabel="Sačuvaj izmene"
        locations={locations}
      />
    </div>
  );
}

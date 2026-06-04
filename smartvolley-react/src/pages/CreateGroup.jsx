import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import GroupForm from "../components/GroupForm";

export default function CreateGroup() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

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

    getLocations();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setErrors({});

    const res = await fetch("/api/groups", {
      method: "POST",
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
          message="Grupa je uspešno kreirana."
          onClose={() => navigate("/groups")}
        />
      )}
      <h1 className="page-title">Kreiraj grupu</h1>
      <GroupForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleCreate}
        submitLabel="Kreiraj grupu"
        locations={locations}
      />
    </div>
  );
}

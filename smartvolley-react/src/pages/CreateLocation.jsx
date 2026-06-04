import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import LocationForm from "../components/LocationForm";

export default function CreateLocation() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setErrors({});

    const res = await fetch("/api/locations", {
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
          message="Lokacija je uspešno kreirana."
          onClose={() => navigate("/locations")}
        />
      )}
      <h1 className="page-title">Kreiraj lokaciju</h1>
      <LocationForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleCreate}
        submitLabel="Kreiraj lokaciju"
      />
    </div>
  );
}

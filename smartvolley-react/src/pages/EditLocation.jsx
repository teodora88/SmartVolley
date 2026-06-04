import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import LocationForm from "../components/LocationForm";

export default function EditLocation() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function getLocation() {
      const res = await fetch(`/api/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFormData({
        name: data.name,
        address: data.address,
      });
    }

    getLocation();
  }, [id]);

  async function handleEdit(e) {
    e.preventDefault();
    setErrors({});

    const res = await fetch(`/api/locations/${id}`, {
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
          message="Lokacija je uspešno izmenjena."
          onClose={() => navigate("/locations")}
        />
      )}
      <h1 className="page-title">Izmeni lokaciju</h1>
      <LocationForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleEdit}
        submitLabel="Sačuvaj izmene"
      />
    </div>
  );
}

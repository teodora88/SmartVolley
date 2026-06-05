import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import ActivityForm from "../components/ActivityForm";

export default function EditActivity() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    status: "",
    location_id: "",
    other_location: "",
  });

  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function getLocations() {
      const res = await fetch("/api/locations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLocations(data);
    }

    async function getActivity() {
      const res = await fetch(`/api/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFormData({
        date: data.date,
        time: data.time ? data.time.substring(0, 5) : "",
        status: data.status,
        location_id: data.location_id ?? "",
        other_location: data.other_location ?? "",
      });
    }

    getLocations();
    getActivity();
  }, [id]);

  async function handleEdit(e) {
    e.preventDefault();
    setErrors({});

    const dataToSend = { ...formData };

    if (dataToSend.time) dataToSend.time = dataToSend.time + ":00";
    if (!dataToSend.location_id) delete dataToSend.location_id;
    if (!dataToSend.other_location) delete dataToSend.other_location;

    const res = await fetch(`/api/activities/${id}`, {
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
          message="Aktivnost je uspešno izmenjena."
          onClose={() => navigate("/activities")}
        />
      )}
      <h1 className="page-title">Izmeni aktivnost</h1>
      <ActivityForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleEdit}
        submitLabel="Sačuvaj izmene"
        locations={locations}
        groups={[]}
        isEdit={true}
      />
    </div>
  );
}

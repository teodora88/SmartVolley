import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import ActivityForm from "../components/ActivityForm";

export default function CreateActivity() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    type: "",
    group_id: "",
    location_id: "",
    other_location: "",
  });

  const [groups, setGroups] = useState([]);
  const [locations, setLocations] = useState([]);
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

    async function getLocations() {
      const res = await fetch("/api/locations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLocations(data);
    }

    getGroups();
    getLocations();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setErrors({});

    const dataToSend = { ...formData };

    if (dataToSend.time) dataToSend.time = dataToSend.time + ":00";
    if (!dataToSend.location_id) delete dataToSend.location_id;
    if (!dataToSend.other_location) delete dataToSend.other_location;

    const res = await fetch("/api/activities", {
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
          message="Aktivnost je uspešno kreirana."
          onClose={() => navigate("/activities")}
        />
      )}
      <h1 className="page-title">Kreiraj aktivnost</h1>
      <ActivityForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleCreate}
        submitLabel="Kreiraj aktivnost"
        groups={groups}
        locations={locations}
        isEdit={false}
      />
    </div>
  );
}

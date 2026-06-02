import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import UserForm from "../components/UserForm";

export default function CreateUser() {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    username: "",
    password: "",
    phone_number: "",
    role_as: "",
  });

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setErrors({});

    const res = await fetch("/api/users", {
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
          message="Korisnik je uspešno kreiran!"
          onClose={() => navigate("/users")}
        />
      )}
      <h1 className="page-title">Kreiraj korisnika</h1>
      <UserForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleCreate}
        submitLabel="Kreiraj korisnika"
      />
    </div>
  );
}
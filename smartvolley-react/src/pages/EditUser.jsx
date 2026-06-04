import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import UserForm from "../components/UserForm";

export default function EditUser() {
  const { token, user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    async function getUser() {
      const res = await fetch(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setFormData({
        name: data.name,
        last_name: data.last_name,
        username: data.username,
        password: "",
        phone_number: data.phone_number,
        role_as: data.role_as,
      });
    }

    getUser();
  }, [id]);

  async function handleEdit(e) {
    e.preventDefault();
    setErrors({});

    const dataToSend = { ...formData };
    if (!dataToSend.password) delete dataToSend.password;

    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();

    if (res.status === 422) {
      setErrors(data.errors);
    } else if (res.ok) {
      if (user.id === parseInt(id)) {
        setUser(data.user);
      }
      setShowModal(true);
    }
  }

  return (
    <div className="form-container">
      {showModal && (
        <Modal
          message="Podaci su uspešno izmenjeni!"
          onClose={() => user.id === parseInt(id) ? navigate("/profile") : navigate("/users")}
        />
      )}
      <h1 className="page-title">Izmeni korisnika</h1>
      <UserForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onSubmit={handleEdit}
        submitLabel="Sačuvaj izmene"
      />
    </div>
  );
}

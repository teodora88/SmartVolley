import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";

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
      <form onSubmit={handleCreate} className="form-body">
        <div>
          <input
            className="form-input"
            type="text"
            placeholder="Ime"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="error">{errors.name[0]}</p>}
        </div>
        <div>
          <input
            className="form-input"
            type="text"
            placeholder="Prezime"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
          {errors.last_name && <p className="error">{errors.last_name[0]}</p>}
        </div>
        <div>
          <input
            className="form-input"
            type="text"
            placeholder="Korisničko ime"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          {errors.username && <p className="error">{errors.username[0]}</p>}
        </div>
        <div>
          <input
            className="form-input"
            type="password"
            placeholder="Lozinka"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && <p className="error">{errors.password[0]}</p>}
        </div>
        <div>
          <input
            className="form-input"
            type="text"
            placeholder="Broj telefona"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
          {errors.phone_number && (
            <p className="error">{errors.phone_number[0]}</p>
          )}
        </div>
        <div>
          <select
            className="form-input"
            value={formData.role_as}
            onChange={(e) =>
              setFormData({ ...formData, role_as: e.target.value })
            }
          >
            <option value="">Izaberi ulogu</option>
            <option value="admin">Admin</option>
            <option value="coach">Trener</option>
            <option value="parent">Roditelj</option>
          </select>
          {errors.role_as && <p className="error">{errors.role_as[0]}</p>}
        </div>
        <button className="btn-primary  " type="submit">
          Kreiraj korisnika
        </button>
      </form>
    </div>
  );
}

import { useContext, useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Login() {
  const { setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  async function handleLogin(e) {
    e.preventDefault();
    setErrors({});

    const res = await fetch("/api/login", {
      method: "post",
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.status === 422) {
      setErrors(data.errors);
    } else if (res.status === 401) {
      setErrors({ general: data.message });
    } else {
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      
      if (data.user.role_as === "admin") {
        navigate("/users");
      } else if (data.user.role_as === "coach") {
        navigate("/");
      } else {
        navigate("/");
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="title">Prijavite se na svoj nalog</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <input
              className="login-input"
              type="text"
              placeholder="Korisničko ime"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
              }}
            />
            {errors.username && <p className="error">{errors.username[0]}</p>}
          </div>
          <div>
            <input
              className="login-input"
              type="password"
              placeholder="Lozinka"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />
            {errors.password && <p className="error">{errors.password[0]}</p>}
          </div>
          <div>
            {errors.general && <p className="error">{errors.general}</p>}
            <button className="login-button">Prijavi se</button>
          </div>
        </form>
      </div>
    </div>
  );
}

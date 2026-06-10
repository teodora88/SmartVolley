export default function UserForm({
  formData,
  setFormData,
  errors,
  onSubmit,
  submitLabel,
  showRole = true,
}) {
  return (
    <form onSubmit={onSubmit} className="form-body">
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
      {showRole && (
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
      )}
      <button className="btn-primary btn-full" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

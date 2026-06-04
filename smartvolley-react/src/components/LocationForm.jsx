export default function LocationForm({
  formData,
  setFormData,
  errors,
  onSubmit,
  submitLabel,
}) {
  return (
    <form onSubmit={onSubmit} className="form-body">
      <div>
        <input
          className="form-input"
          type="text"
          placeholder="Naziv lokacije"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="error">{errors.name[0]}</p>}
      </div>
      <div>
        <input
          className="form-input"
          type="text"
          placeholder="Adresa"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        {errors.address && <p className="error">{errors.address[0]}</p>}
      </div>
      <button className="btn-primary btn-full" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

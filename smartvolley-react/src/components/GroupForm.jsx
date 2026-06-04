export default function GroupForm({
  formData,
  setFormData,
  errors,
  onSubmit,
  submitLabel,
  locations,
}) {
  return (
    <form onSubmit={onSubmit} className="form-body">
      <div>
        <input
          className="form-input"
          type="text"
          placeholder="Naziv grupe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="error">{errors.name[0]}</p>}
      </div>
      <div>
        <select
          className="form-input"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="">Izaberi kategoriju</option>
          <option value="school">Školica</option>
          <option value="pioneers">Pionirke</option>
          <option value="cadets">Kadetkinje</option>
          <option value="juniors">Juniorke</option>
        </select>
        {errors.category && <p className="error">{errors.category[0]}</p>}
      </div>
      <div>
        <select
          className="form-input"
          value={formData.location_id}
          onChange={(e) =>
            setFormData({ ...formData, location_id: e.target.value })
          }
        >
          <option value="">Izaberi lokaciju</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        {errors.location_id && <p className="error">{errors.location_id[0]}</p>}
      </div>
      <button className="btn-primary btn-full" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

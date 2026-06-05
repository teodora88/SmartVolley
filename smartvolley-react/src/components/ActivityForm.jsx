export default function ActivityForm({
  formData,
  setFormData,
  errors,
  onSubmit,
  submitLabel,
  groups,
  locations,
  isEdit,
}) {
  return (
    <form onSubmit={onSubmit} className="form-body">
      <div>
        <input
          className="form-input"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        {errors.date && <p className="error">{errors.date[0]}</p>}
      </div>
      <div>
        <input
          className="form-input"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />
        {errors.time && <p className="error">{errors.time[0]}</p>}
      </div>
      {!isEdit && (
        <div>
          <select
            className="form-input"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Izaberi tip</option>
            <option value="practice">Trening</option>
            <option value="game">Utakmica</option>
            <option value="tournament">Turnir</option>
          </select>
          {errors.type && <p className="error">{errors.type[0]}</p>}
        </div>
      )}
      {!isEdit && (
        <div>
          <select
            className="form-input"
            value={formData.group_id}
            onChange={(e) =>
              setFormData({ ...formData, group_id: e.target.value })
            }
          >
            <option value="">Izaberi grupu</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          {errors.group_id && <p className="error">{errors.group_id[0]}</p>}
        </div>
      )}
      {isEdit && (
        <div>
          <select
            className="form-input"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="">Izaberi status</option>
            <option value="scheduled">Zakazan/a</option>
            <option value="canceled">Otkazan/a</option>
            <option value="postponed">Odložen/a</option>
            <option value="completed">Završen/a</option>
          </select>
          {errors.status && <p className="error">{errors.status[0]}</p>}
        </div>
      )}
      <div>
        <select
          className="form-input"
          value={formData.location_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              location_id: e.target.value,
              other_location: "",
            })
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
      <div>
        <input
          className="form-input"
          type="text"
          placeholder="Ili unesi drugu lokaciju"
          value={formData.other_location}
          onChange={(e) =>
            setFormData({
              ...formData,
              other_location: e.target.value,
              location_id: "",
            })
          }
        />
        {errors.other_location && (
          <p className="error">{errors.other_location[0]}</p>
        )}
      </div>
      <button className="btn-primary btn-full" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

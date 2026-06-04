export default function MemberForm({
  formData,
  setFormData,
  errors,
  onSubmit,
  submitLabel,
  groups,
  parents,
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
          type="date"
          placeholder="Datum rođenja"
          value={formData.birthday}
          onChange={(e) =>
            setFormData({ ...formData, birthday: e.target.value })
          }
        />
        {errors.birthday && <p className="error">{errors.birthday[0]}</p>}
      </div>
      <div>
        <input
          className="form-input"
          type="number"
          placeholder="Visina (cm)"
          value={formData.height}
          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
        />
        {errors.height && <p className="error">{errors.height[0]}</p>}
      </div>
      <div>
        <input
          className="form-input"
          type="number"
          placeholder="Težina (kg)"
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
        />
        {errors.weight && <p className="error">{errors.weight[0]}</p>}
      </div>
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
      <div>
        <select
          className="form-input"
          value={formData.user_id}
          onChange={(e) =>
            setFormData({ ...formData, user_id: e.target.value })
          }
        >
          <option value="">Izaberi roditelja (opciono)</option>
          {parents.map((parent) => (
            <option key={parent.id} value={parent.id}>
              {parent.name} {parent.last_name}
            </option>
          ))}
        </select>
        {errors.user_id && <p className="error">{errors.user_id[0]}</p>}
      </div>
      <button className="btn-primary btn-full" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import Modal from "../components/Modal";
import { formatDate } from "../utils/formatDate";

export default function Payments() {
  const { token } = useContext(AppContext);
  const [payments, setPayments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [isPaidFilter, setIsPaidFilter] = useState("");
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [monthlyForm, setMonthlyForm] = useState({
    group_id: "",
    month: "",
    price: "",
  });
  const [singleForm, setSingleForm] = useState({
    member_id: "",
    month: "",
    price: "",
  });

  useEffect(() => {
    async function getGroups() {
      const res = await fetch("/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGroups(data);
    }

    async function getMembers() {
      const res = await fetch("/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMembers(data);
    }

    getGroups();
    getMembers();
  }, []);

  async function getPayments() {
    const params = new URLSearchParams();
    if (monthFilter) params.append("month", monthFilter);
    if (isPaidFilter !== "") params.append("is_paid", isPaidFilter);

    const res = await fetch(`/api/payments?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPayments(
      data.sort((a, b) => {
        const [aMonth, aYear] = a.month.split("-");
        const [bMonth, bYear] = b.month.split("-");
        return new Date(`${bYear}-${bMonth}`) - new Date(`${aYear}-${aMonth}`);
      }),
    );
  }

  useEffect(() => {
    getPayments();
  }, [monthFilter, isPaidFilter]);

  const filtered = memberSearch
    ? payments.filter((p) =>
        `${p.member?.name} ${p.member?.last_name}`
          .toLowerCase()
          .includes(memberSearch.toLowerCase()),
      )
    : payments;

  async function handleMarkAsPaid(payment) {
    const today = new Date().toISOString().split("T")[0];

    const res = await fetch(`/api/payments/${payment.id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ is_paid: true, date: today }),
    });

    if (res.ok) {
      setPayments(
        payments.map((p) =>
          p.id === payment.id ? { ...p, is_paid: true, date: today } : p,
        ),
      );
    }
  }

  async function handleDelete() {
    const res = await fetch(`/api/payments/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setPayments(payments.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      setShowDeleteSuccess(true);
    }
  }

  async function handleEditPrice(paymentId) {
    const res = await fetch(`/api/payments/${paymentId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ price: editPrice }),
    });

    if (res.ok) {
      setPayments(
        payments.map((p) =>
          p.id === paymentId ? { ...p, price: editPrice } : p,
        ),
      );
      setEditingPayment(null);
      setEditPrice("");
    }
  }

  async function handleCreateMonthly(e) {
    e.preventDefault();

    const res = await fetch("/api/payments/monthly", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(monthlyForm),
    });

    const data = await res.json();

    if (res.status === 409) {
      setShowMonthlyModal(false);
      setErrorMessage(data.message);
    } else if (res.ok) {
      setShowMonthlyModal(false);
      setSuccessMessage("Mesečne uplate su uspešno kreirane.");
      setShowSuccessModal(true);
      getPayments();
    }
  }

  async function handleCreateSingle(e) {
    e.preventDefault();

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(singleForm),
    });

    if (res.ok) {
      setShowSingleModal(false);
      setSuccessMessage("Uplata je uspešno kreirana.");
      setShowSuccessModal(true);
      getPayments();
    }
  }

  return (
    <div className="users-container">
      {showSuccessModal && (
        <Modal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {errorMessage && (
        <Modal message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {showDeleteSuccess && (
        <Modal
          message="Uplata je uspešno obrisana."
          onClose={() => setShowDeleteSuccess(false)}
        />
      )}
      {deleteId && (
        <Modal
          message="Da li ste sigurni da želite da obrišete ovu uplatu?"
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      )}
      {showMonthlyModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p className="modal-message">Kreiraj mesečne uplate</p>
            <form onSubmit={handleCreateMonthly} className="form-body">
              <select
                className="form-input"
                value={monthlyForm.group_id}
                onChange={(e) =>
                  setMonthlyForm({ ...monthlyForm, group_id: e.target.value })
                }
              >
                <option value="">Izaberi grupu</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <select
                className="form-input"
                value={monthlyForm.month}
                onChange={(e) =>
                  setMonthlyForm({ ...monthlyForm, month: e.target.value })
                }
              >
                <option value="">Izaberi mesec</option>
                <option value="01-2026">Januar 2026</option>
                <option value="02-2026">Februar 2026</option>
                <option value="03-2026">Mart 2026</option>
                <option value="04-2026">April 2026</option>
                <option value="05-2026">Maj 2026</option>
                <option value="06-2026">Jun 2026</option>
                <option value="07-2026">Jul 2026</option>
                <option value="08-2026">Avgust 2026</option>
                <option value="09-2026">Septembar 2026</option>
                <option value="10-2026">Oktobar 2026</option>
                <option value="11-2026">Novembar 2026</option>
                <option value="12-2026">Decembar 2026</option>
              </select>
              <input
                className="form-input"
                type="number"
                placeholder="Iznos (RSD)"
                value={monthlyForm.price}
                onChange={(e) =>
                  setMonthlyForm({ ...monthlyForm, price: e.target.value })
                }
              />
              <div className="modal-buttons" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowMonthlyModal(false)}
                >
                  Otkaži
                </button>
                <button type="submit" className="btn-primary">
                  Kreiraj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSingleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p className="modal-message">Dodaj uplatu</p>
            <form onSubmit={handleCreateSingle} className="form-body">
              <select
                className="form-input"
                value={singleForm.member_id}
                onChange={(e) =>
                  setSingleForm({ ...singleForm, member_id: e.target.value })
                }
              >
                <option value="">Izaberi člana</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} {member.last_name}
                  </option>
                ))}
              </select>
              <select
                className="form-input"
                value={singleForm.month}
                onChange={(e) =>
                  setSingleForm({ ...singleForm, month: e.target.value })
                }
              >
                <option value="">Izaberi mesec</option>
                <option value="01-2026">Januar 2026</option>
                <option value="02-2026">Februar 2026</option>
                <option value="03-2026">Mart 2026</option>
                <option value="04-2026">April 2026</option>
                <option value="05-2026">Maj 2026</option>
                <option value="06-2026">Jun 2026</option>
                <option value="07-2026">Jul 2026</option>
                <option value="08-2026">Avgust 2026</option>
                <option value="09-2026">Septembar 2026</option>
                <option value="10-2026">Oktobar 2026</option>
                <option value="11-2026">Novembar 2026</option>
                <option value="12-2026">Decembar 2026</option>
              </select>
              <input
                className="form-input"
                type="number"
                placeholder="Iznos (RSD)"
                value={singleForm.price}
                onChange={(e) =>
                  setSingleForm({ ...singleForm, price: e.target.value })
                }
              />
              <div className="modal-buttons" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowSingleModal(false)}
                >
                  Otkaži
                </button>
                <button type="submit" className="btn-primary">
                  Dodaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="page-header">
        <h1 className="page-title">Uplate</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn-primary"
            onClick={() => setShowSingleModal(true)}
          >
            Dodaj uplatu
          </button>
          <button
            className="btn-primary"
            onClick={() => setShowMonthlyModal(true)}
          >
            Kreiraj mesečne uplate
          </button>
        </div>
      </div>
      <div className="users-filters">
        <input
          type="text"
          className="filter-input"
          placeholder="Pretraži po imenu člana..."
          value={memberSearch}
          onChange={(e) => setMemberSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="">Svi meseci</option>
          <option value="01-2026">Januar 2026</option>
          <option value="02-2026">Februar 2026</option>
          <option value="03-2026">Mart 2026</option>
          <option value="04-2026">April 2026</option>
          <option value="05-2026">Maj 2026</option>
          <option value="06-2026">Jun 2026</option>
          <option value="07-2026">Jul 2026</option>
          <option value="08-2026">Avgust 2026</option>
          <option value="09-2026">Septembar 2026</option>
          <option value="10-2026">Oktobar 2026</option>
          <option value="11-2026">Novembar 2026</option>
          <option value="12-2026">Decembar 2026</option>
        </select>
        <select
          className="filter-select"
          value={isPaidFilter}
          onChange={(e) => setIsPaidFilter(e.target.value)}
        >
          <option value="">Sve uplate</option>
          <option value="1">Plaćeno</option>
          <option value="0">Nije plaćeno</option>
        </select>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Član</th>
            <th>Mesec</th>
            <th>Iznos</th>
            <th>Status</th>
            <th>Datum uplate</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((payment, index) => (
            <tr key={payment.id}>
              <td>{index + 1}</td>
              <td>
                {payment.member?.name} {payment.member?.last_name}
              </td>
              <td>{payment.month}</td>
              <td>
                {editingPayment === payment.id ? (
                  <input
                    className="form-input"
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                ) : (
                  `${payment.price} RSD`
                )}
              </td>
              <td>
                <span
                  className={`status-badge ${payment.is_paid ? "status-completed" : "status-canceled"}`}
                >
                  {payment.is_paid ? "Plaćeno" : "Nije plaćeno"}
                </span>
              </td>
              <td>{formatDate(payment.date) ?? "-"}</td>
              <td>
                {!payment.is_paid && (
                  <>
                    <button
                      className="btn-primary btn-sm"
                      onClick={() => handleMarkAsPaid(payment)}
                    >
                      Označi kao plaćeno
                    </button>
                    {editingPayment === payment.id ? (
                      <>
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => handleEditPrice(payment.id)}
                        >
                          Sačuvaj
                        </button>
                        <button
                          className="btn-danger btn-sm"
                          onClick={() => {
                            setEditingPayment(null);
                            setEditPrice("");
                          }}
                        >
                          Otkaži
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => {
                          setEditingPayment(payment.id);
                          setEditPrice(payment.price);
                        }}
                      >
                        Izmeni iznos
                      </button>
                    )}
                    <button
                      className="btn-danger btn-sm"
                      onClick={() => setDeleteId(payment.id)}
                    >
                      Obriši
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

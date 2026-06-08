import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function ParentPayments() {
  const { token } = useContext(AppContext);
  const [payments, setPayments] = useState([]);
  const [children, setChildren] = useState([]);
  const [childFilter, setChildFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [isPaidFilter, setIsPaidFilter] = useState("");

  useEffect(() => {
    async function getChildren() {
      const res = await fetch("/api/members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChildren(data);
    }
    getChildren();
  }, []);

  useEffect(() => {
    async function getPayments() {
      const params = new URLSearchParams();
      if (childFilter) params.append("member_id", childFilter);
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
          return (
            new Date(`${bYear}-${bMonth}`) - new Date(`${aYear}-${aMonth}`)
          );
        }),
      );
    }
    getPayments();
  }, [childFilter, monthFilter, isPaidFilter]);

  function getChildName(memberId) {
    const child = children.find((c) => c.id === memberId);
    return child ? `${child.name} ${child.last_name}` : "-";
  }

  return (
    <div className="users-container">
      <h1 className="page-title">Uplate</h1>
      <div className="users-filters">
        {children.length > 1 && (
          <select
            className="filter-select"
            value={childFilter}
            onChange={(e) => setChildFilter(e.target.value)}
          >
            <option value="">Sva deca</option>
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} {child.last_name}
              </option>
            ))}
          </select>
        )}
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
            {children.length > 1 && <th>Dete</th>}
            <th>Mesec</th>
            <th>Iznos</th>
            <th>Status</th>
            <th>Datum uplate</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment.id}>
              <td>{index + 1}</td>
              {children.length > 1 && (
                <td>{getChildName(payment.member_id)}</td>
              )}
              <td>{payment.month}</td>
              <td>{payment.price} RSD</td>
              <td>
                <span
                  className={`status-badge ${payment.is_paid ? "status-completed" : "status-canceled"}`}
                >
                  {payment.is_paid ? "Plaćeno" : "Nije plaćeno"}
                </span>
              </td>
              <td>{payment.date ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

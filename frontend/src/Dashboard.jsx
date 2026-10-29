
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API = "http://localhost:8186/customer";

const emptyForm = {
  name: "",
  age: "",
  email: "",
  phone: "",
  city: "",
  state: "",
};

async function readResponse(response) {
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Request failed: ${response.status}`);
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    } catch {
      return {};
    }
  }, []);

  async function loadCustomers() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/getCustomers`);
      const data = await readResponse(response);

      if (!Array.isArray(data)) {
        throw new Error("The getCustomers endpoint did not return a customer list.");
      }

      setCustomers(data);
    } catch (err) {
      setError(
        `${err.message}. Check Spring Boot, port 8186, and /customer/getCustomers.`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const term = search.trim().toLowerCase();

    if (!term) return true;

    return [
      customer.cid,
      customer.name,
      customer.email,
      customer.age,
      customer.phone,
      customer.city,
      customer.state,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(term)
    );
  });

  const citiesCount = new Set(
    customers.map((customer) => customer.city).filter(Boolean)
  ).size;

  const statesCount = new Set(
    customers.map((customer) => customer.state).filter(Boolean)
  ).size;

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setNotice("");
    setShowForm(true);
  }

  function editCustomer(customer) {
    setEditingId(customer.cid);
    setForm({
      name: customer.name ?? "",
      age: customer.age ?? "",
      email: customer.email ?? "",
      phone: customer.phone ?? customer.phno ?? "",
      city: customer.city ?? "",
      state: customer.state ?? "",
    });
    setNotice("");
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        name: form.name.trim(),
        age: Number(form.age),
        email: form.email.trim(),
        phone: Number(form.phone),
        city: form.city.trim(),
        state: form.state.trim(),
      };

      const url = editingId !== null
        ? `${API}/update/${editingId}`
        : `${API}/create`;

      const response = await fetch(url, {
        method: editingId !== null ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await readResponse(response);

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setNotice(
        editingId !== null
          ? "Customer updated successfully."
          : "Customer added successfully."
      );

      await loadCustomers();
    } catch (err) {
      setError(`Unable to save customer: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function deleteCustomer(customer) {
    const confirmed = window.confirm(
      `Delete ${customer.name || "this customer"}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API}/delete/${customer.cid}`, {
        method: "DELETE",
      });

      await readResponse(response);

      setNotice("Customer deleted successfully.");
      await loadCustomers();
    } catch (err) {
      setError(`Unable to delete customer: ${err.message}`);
    }
  }

  function logout() {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">C</div>
          <div>
            <h2>Customer<span>Hub</span></h2>
            <p>MANAGEMENT PORTAL</p>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          <button className="nav-item active" type="button">
            <span className="nav-icon">▦</span>
            Dashboard
          </button>
          <button
            className="nav-item"
            type="button"
            onClick={() => document.getElementById("customer-table")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="nav-icon">♙</span>
            Customers
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>Need assistance?</strong>
            <p>Manage your customer records with ease.</p>
          </div>
          <button className="nav-item logout-button" onClick={logout} type="button">
            <span className="nav-icon">↪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Dashboard</p>
            <h1>Customer Dashboard</h1>
          </div>

          <div className="profile">
            <div className="profile-avatar">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
            <div className="profile-details">
              <strong>{user.name || "User"}</strong>
              <span>{user.email || "Customer administrator"}</span>
            </div>
          </div>
        </header>

        <section className="welcome-row">
          <div>
            <h2>Welcome back{user.name ? `, ${user.name}` : ""}! 👋</h2>
            <p>Here’s what’s happening with your customer directory today.</p>
          </div>
          <button className="primary-btn" onClick={openAddForm} type="button">
            <span>＋</span> Add Customer
          </button>
        </section>

        {error && <div className="message error-message">{error}</div>}
        {notice && <div className="message success-message">{notice}</div>}

        <section className="stats">
          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon purple-icon">♙</span>
              <span className="stat-caption">DIRECTORY</span>
            </div>
            <p>Total Customers</p>
            <h3>{customers.length}</h3>
            <span className="stat-foot">Registered customer records</span>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon blue-icon">⌖</span>
              <span className="stat-caption">LOCATIONS</span>
            </div>
            <p>Cities</p>
            <h3>{citiesCount}</h3>
            <span className="stat-foot">Cities represented</span>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon green-icon">◎</span>
              <span className="stat-caption">REGIONS</span>
            </div>
            <p>States</p>
            <h3>{statesCount}</h3>
            <span className="stat-foot">States represented</span>
          </article>
        </section>

        {showForm && (
          <section className="panel form-panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">CUSTOMER DETAILS</span>
                <h2>{editingId !== null ? "Edit Customer" : "Add New Customer"}</h2>
                <p>Enter the customer information below.</p>
              </div>
              <button
                className="close-btn"
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="customer-form">
              <label>
                Full Name *
                <input name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" required />
              </label>

              <label>
                Email Address *
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@example.com" required />
              </label>

              <label>
                Age *
                <input name="age" type="number" min="1" max="120" value={form.age} onChange={handleChange} placeholder="Enter age" required />
              </label>

              <label>
                Phone Number *
                <input name="phone" type="tel" inputMode="numeric" pattern="[0-9]{10}" maxLength="10" value={form.phone} onChange={handleChange} placeholder="10-digit phone number" required />
              </label>

              <label>
                City *
                <input name="city" value={form.city} onChange={handleChange} placeholder="Enter city" required />
              </label>

              <label>
                State *
                <input name="state" value={form.state} onChange={handleChange} placeholder="Enter state" required />
              </label>

              <div className="form-actions">
                <button className="secondary-btn" type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}>
                  Cancel
                </button>
                <button className="primary-btn" type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId !== null ? "Save Changes" : "Add Customer"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="panel customer-panel" id="customer-table">
          <div className="panel-heading customer-heading">
            <div>
              <span className="section-kicker">CUSTOMER MANAGEMENT</span>
              <h2>Customer Directory</h2>
              <p>View and manage all registered customers.</p>
            </div>
            <button className="secondary-btn refresh-btn" onClick={loadCustomers} type="button" disabled={loading}>
              ↻ {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone, city..."
                aria-label="Search customers"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>
              )}
            </div>
            <span className="result-count">
              Showing <strong>{filteredCustomers.length}</strong> of {customers.length}
            </span>
          </div>

          <div className="table-wrap">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="empty-state">Loading customers...</td></tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <div className="empty-icon">♙</div>
                      <strong>{search ? "No matching customers" : "No customers yet"}</strong>
                      <p>{search ? "Try a different search term." : "Add your first customer to get started."}</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.cid}>
                      <td><span className="customer-id">#{customer.cid}</span></td>
                      <td>
                        <div className="customer-identity">
                          <div className="customer-avatar">
                            {(customer.name || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <strong>{customer.name || "—"}</strong>
                            <span>{customer.email || "—"}</span>
                          </div>
                        </div>
                      </td>
                      <td>{customer.age ?? "—"}</td>
                      <td>{customer.phone ?? customer.phno ?? "—"}</td>
                      <td>
                        <div className="location-cell">
                          <strong>{customer.city || "—"}</strong>
                          <span>{customer.state || ""}</span>
                        </div>
                      </td>
                      <td>
                        <div className="actions">
                          <button className="icon-btn edit-btn" type="button" onClick={() => editCustomer(customer)} title="Edit customer" aria-label="Edit customer">✎</button>
                          <button className="icon-btn delete-btn" type="button" onClick={() => deleteCustomer(customer)} title="Delete customer" aria-label="Delete customer">⌫</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>CustomerHub · Customer Management System</span>
            <span>{filteredCustomers.length} record(s)</span>
          </div>
        </section>

        <footer className="page-footer">
          <span>© {new Date().getFullYear()} CustomerHub</span>
          <span>Customer Management Portal</span>
        </footer>
      </main>
    </div>
  );
}

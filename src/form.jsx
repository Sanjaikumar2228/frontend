import React, { useState, useEffect } from "react";

function Form() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const API_BASE = "http://127.0.0.1:8000/api/";

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}customers/`); // ✅ Use plural "customers"
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_pic") {
      setFormData({ ...formData, profile_pic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) data.append(key, formData[key]);
    }

    const url = selectedCustomer
      ? `${API_BASE}update-customer/${selectedCustomer.id}/`
      : `${API_BASE}add-customer/`;
    const method = selectedCustomer ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: data });
      const responseData = await res.json();
      if (res.ok) {
        alert(responseData.message || "Success!");
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          profile_pic: null,
        });
        setSelectedCustomer(null);
        fetchCustomers();
      } else {
        alert("Error: " + JSON.stringify(responseData));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Click row → populate form for update
  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      password: "",
      profile_pic: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete customer
  const handleDelete = async () => {
    if (!selectedCustomer) {
      alert("Select a customer to delete!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      const res = await fetch(`${API_BASE}delete-customer/${selectedCustomer.id}/`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Deleted successfully!");
        setSelectedCustomer(null);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          profile_pic: null,
        });
        fetchCustomers();
      } else {
        alert("Error deleting customer!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <h4 className="text-center">{selectedCustomer ? "Update Customer" : "Add Customer"}</h4>

        <div className="row d-flex justify-content-center">
          <div className="col-10">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="first_name"
              className="form-control mb-3"
              value={formData.first_name}
              onChange={handleChange}
              required
            />

            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="last_name"
              className="form-control mb-3"
              value={formData.last_name}
              onChange={handleChange}
              required
            />

            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control mb-3"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control mb-3"
              value={formData.password}
              onChange={handleChange}
            />

            <label className="form-label">Profile Pic</label>
            <input
              type="file"
              name="profile_pic"
              className="form-control mb-3"
              accept="image/*"
              onChange={handleChange}
            />

            <div className="text-center">
              <button type="submit" className="btn btn-success mx-2">
                {selectedCustomer ? "Update" : "Submit"}
              </button>

              {selectedCustomer && (
                <button type="button" className="btn btn-danger mx-2" onClick={handleDelete}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Customer Table */}
      <div className="mt-5">
        <h4 className="text-center">Customer List</h4>
        <table className="table table-bordered mt-3 text-center">
          <thead className="table-light">
            <tr>
              <th>Profile</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Profile Pic</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cust) => (
              <tr
                key={cust.id}
                onClick={() => handleRowClick(cust)}
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedCustomer?.id === cust.id ? "#e0f7fa" : "white",
                }}
              >
                <td>
                  {cust.profile_pic ? (
                    <img
                      src={`http://127.0.0.1:8000${cust.profile_pic}`}
                      alt="profile"
                      width="50"
                      height="50"
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{cust.first_name}</td>
                <td>{cust.last_name}</td>
                <td>{cust.email}</td>
                <td>{"••••••"}</td>
                <td>{cust.profile_pic ? "Uploaded" : "Not Uploaded"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Form;

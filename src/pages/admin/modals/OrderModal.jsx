import React, { useState } from "react";

const OrderModal = ({ order, type, onClose, onSave }) => {
  const [form, setForm] = useState({ ...order });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-1/2 p-6">
        <h3 className="text-lg font-semibold mb-4">
          {type === "view" ? "View Order" : "Edit Order"}
        </h3>

        {type === "view" ? (
          <div>
            <p><strong>Customer:</strong> {order.first_name} {order.last_name}</p>
            <p><strong>Branch:</strong> {order.branch}</p>
            <p><strong>Phone:</strong> {order.phone_number}</p>
            <p><strong>Group:</strong> {order.group_name}</p>
            <p><strong>Credit Officer:</strong> {order.credit_officer}</p>
            <p><strong>Total:</strong> ${order.total}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="border w-full p-2"
              placeholder="First Name"
            />
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="border w-full p-2"
              placeholder="Last Name"
            />
            <input
              type="text"
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="border w-full p-2"
              placeholder="Branch"
            />
            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className="border w-full p-2"
              placeholder="Phone"
            />
            <input
              type="number"
              name="total"
              value={form.total}
              onChange={handleChange}
              className="border w-full p-2"
              placeholder="Total"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderModal;

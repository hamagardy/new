import React, { useState } from "react";
import { Link } from "react-router-dom";

function SavedInvoices({ invoices }) {
  const [filterYear, setFilterYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");

  // Get unique customers from the invoices
  const uniqueCustomers = [
    ...new Set(invoices.map((invoice) => invoice.customerName)),
  ];

  const filteredInvoices = () => {
    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      const invoiceYear = invoiceDate.getFullYear();
      const invoiceMonth = invoiceDate.toLocaleString("default", {
        month: "long",
      });

      // Apply filters based on year, month, and customer
      if (filterYear && invoiceYear !== parseInt(filterYear)) return false;
      if (selectedMonth && invoiceMonth !== selectedMonth) return false;
      if (filterCustomer && invoice.customerName !== filterCustomer)
        return false;
      return true;
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-800">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          {/* Customer Dropdown */}
          <select
            className="mr-4 p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          >
            <option value="">Filter by Customer</option>
            {uniqueCustomers.map((customer) => (
              <option key={customer} value={customer}>
                {customer}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            className="mr-4 p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="">Filter by Year</option>
            {[...Array(11)].map((_, i) => (
              <option key={i} value={2024 + i}>
                {2024 + i}
              </option>
            ))}
          </select>

          {/* Month Dropdown */}
          <select
            className="mr-4 p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Filter by Month</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Display filtered invoices */}
        <table className="min-w-full text-gray-900 dark:text-slate-50">
          <thead>
            <tr className="bg-gray-100 dark:bg-slate-700">
              <th className="p-4 text-left">Invoice ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices().map((invoice) => (
              <tr key={invoice.id}>
                <td className="p-4">{invoice.id}</td>
                <td className="p-4">{invoice.customerName}</td>
                <td className="p-4">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
                <td className="p-4">${invoice.total.toFixed(2)}</td>
                <td className="p-4">
                  <Link
                    to={`/invoice/${invoice.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SavedInvoices;

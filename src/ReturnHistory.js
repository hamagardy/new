import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ReturnHistory() {
  const [returnHistory, setReturnHistory] = useState([]);
  const [filterYear, setFilterYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");

  useEffect(() => {
    const savedHistory = localStorage.getItem("returnHistory");
    if (savedHistory) {
      setReturnHistory(JSON.parse(savedHistory));
    }
  }, []);

  const filteredReturnHistory = () => {
    return returnHistory.filter((record) => {
      const returnDate = new Date(record.date);
      const returnYear = returnDate.getFullYear();
      const returnMonth = returnDate.toLocaleString("default", {
        month: "long",
      });

      if (filterYear && returnYear !== parseInt(filterYear)) return false;
      if (selectedMonth && returnMonth !== selectedMonth) return false;
      if (
        filterCustomer &&
        !record.customerName
          .toLowerCase()
          .includes(filterCustomer.toLowerCase())
      )
        return false;
      return true;
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-800">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50">
            Return History
          </h2>
        </div>

        <div className="mb-4">
          {/* Customer Dropdown */}
          <select
            className="mr-4 p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
          >
            <option value="">Filter by Customer</option>
            {[
              ...new Set(returnHistory.map((record) => record.customerName)),
            ].map((customer) => (
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

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <table className="min-w-full text-gray-900 dark:text-slate-50">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700">
                <th className="p-4 text-left">Return ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturnHistory().length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No returns match your criteria.
                  </td>
                </tr>
              ) : (
                filteredReturnHistory().map((record) => (
                  <tr
                    key={record.id}
                    className="border-b dark:border-slate-700"
                  >
                    <td className="p-4">#{record.id}</td>
                    <td className="p-4">{record.customerName}</td>
                    <td className="p-4">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">${record.total.toFixed(2)}</td>
                    <td className="p-4">{record.items.length} items</td>
                    <td className="p-4">
                      <Link
                        to={`/return-history/${record.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReturnHistory;

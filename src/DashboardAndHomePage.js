// DashboardAndHomePage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

function DashboardAndHomePage({
  inventory,
  invoices,
  returnHistory,
  expiredItems,
}) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMoreLogs, setShowMoreLogs] = useState(false);

  const totalItems = inventory.length;
  const totalStock = inventory.reduce((acc, item) => acc + item.qty, 0);

  // Calculate total stock sold
  const totalStockSold = (invoices || []).reduce((acc, invoice) => {
    if (invoice.type === "sale") {
      (invoice.items || []).forEach((item) => {
        acc += item.orderedQty || 0;
      });
    }
    return acc;
  }, 0);

  // Calculate total returned stock from returnHistory
  const totalReturnedStock = (returnHistory || []).reduce((acc, ret) => {
    if (ret.type === "return") {
      (ret.items || []).forEach((item) => {
        acc += item.returnedQty || 0;
      });
    }
    return acc;
  }, 0);

  // Calculate total expired stock
  const totalExpiredStock = (expiredItems || []).reduce((acc, item) => {
    return acc + item.expiredQty;
  }, 0);

  // Combine invoices, returnHistory, and expiredItems for logs
  const allLogs = [
    ...(invoices || []),
    ...(returnHistory || []),
    ...(expiredItems || []).map((item) => ({
      id: item.id,
      date: item.date,
      type: "expired",
      customerName: "N/A",
      items: [{ name: item.name, expiredQty: item.expiredQty }],
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, most recent first
    .slice(0, 20); // Only keep the last 20 activities

  // Last 5 activities for quick view
  const recentLogs = allLogs.slice(0, 5);

  // Filter function for logs
  const filteredLogs = allLogs.filter((log) => {
    const logDate = new Date(log.date);
    if (selectedYear && selectedMonth) {
      return (
        logDate.getFullYear() === parseInt(selectedYear) &&
        logDate.getMonth() + 1 === parseInt(selectedMonth)
      );
    } else if (selectedYear) {
      return logDate.getFullYear() === parseInt(selectedYear);
    } else if (selectedMonth) {
      return logDate.getMonth() + 1 === parseInt(selectedMonth);
    }
    return true; // If no filter is applied, return all logs
  });

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-50">
        Dashboard & Home
      </h2>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Items",
            value: totalItems,
            textColor: "text-cyan-500 dark:text-cyan-400",
          },
          {
            label: "Total Stock",
            value: totalStock,
            textColor: "text-green-500 dark:text-green-400",
          },
          {
            label: "Total Stock Sold",
            value: totalStockSold,
            textColor: "text-blue-500 dark:text-blue-400",
          },
          {
            label: "Total Returned Stock",
            value: totalReturnedStock,
            textColor: "text-red-500 dark:text-red-400",
          },
          {
            label: "Total Expired Stock",
            value: totalExpiredStock,
            textColor: "text-yellow-500 dark:text-yellow-400",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md"
          >
            <div className="min-w-0 flex-auto space-y-1 font-semibold">
              <p className={stat.textColor}>{stat.label}</p>
              <p className="text-slate-900 dark:text-slate-50 text-lg">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Date Filters */}
      <div className="mt-8 mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 rounded border mr-2"
        >
          <option value="">Select Year</option>
          {/* Assuming you have a list of years from your data or a predefined list */}
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="">Select Month</option>
          {/* Assuming you want to list months 1-12 */}
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Modern Log of recent activities */}
      <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Recent Activity</h3>
          <button
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            onClick={() => setShowMoreLogs(!showMoreLogs)}
          >
            {showMoreLogs ? "Show Less" : "Show More"}
          </button>
        </div>
        <ul className="space-y-2">
          {(showMoreLogs ? filteredLogs : recentLogs).map((log) => (
            <li
              key={log.id}
              className={`p-3 rounded-md shadow-sm ${
                log.type === "return"
                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
                  : log.type === "expired"
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                  : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
              }`}
            >
              {log.type === "return"
                ? `Return Created - ID: ${log.id}, Customer: ${log.customerName}`
                : log.type === "expired"
                ? `Item Expired - ID: ${log.id}, Item: ${log.items[0].name}, Quantity: ${log.items[0].expiredQty}`
                : `Invoice Created - ID: ${log.id}, Customer: ${log.customerName}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardAndHomePage;

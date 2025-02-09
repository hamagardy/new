// ExpiredItems.js
import React from "react";

function ExpiredItems({ expiredItems }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-50">
        Expired Items
      </h2>
      <table className="min-w-full text-gray-900 dark:text-slate-50">
        <thead>
          <tr className="bg-gray-100 dark:bg-slate-700">
            <th className="p-4 text-left">Item Name</th>
            <th className="p-4 text-left">Quantity Expired</th>
          </tr>
        </thead>
        <tbody>
          {expiredItems.length > 0 ? (
            expiredItems.map((item, index) => (
              <tr key={index}>
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.expiredQty}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="p-4 text-center">
                No expired items to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ExpiredItems;

import React from "react";
import { useParams } from "react-router-dom";

function ReturnDetails({ returnHistory }) {
  const { id } = useParams(); // Get the id from the URL
  const returnRecord = returnHistory.find(
    (record) => record.id === parseInt(id)
  );

  if (!returnRecord) {
    return <div>Return record not found!</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-50">
        Return Details
      </h2>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold mb-4">
          Customer: {returnRecord.customerName}
        </h3>
        <p className="mb-4">
          Date: {new Date(returnRecord.date).toLocaleDateString()}
        </p>

        <h4 className="font-semibold">Items Returned:</h4>
        <ul className="list-disc pl-6">
          {returnRecord.items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.returnedQty} x ${item.price} (Bonus:{" "}
              {item.bonusQty})
            </li>
          ))}
        </ul>

        <div className="mt-4 font-semibold">
          <p>Total Refund: ${returnRecord.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default ReturnDetails;

import React from "react";
import { useParams } from "react-router-dom";

function InvoiceDetails({ invoices }) {
  const { id } = useParams();
  const invoice = invoices.find((inv) => inv.id === parseInt(id));

  if (!invoice) {
    return <div>Invoice not found!</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-50">
        Invoice Details
      </h2>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h3 className="font-semibold mb-4">Customer: {invoice.customerName}</h3>
        <p className="mb-4">
          Date: {new Date(invoice.date).toLocaleDateString()}
        </p>

        <h4 className="font-semibold">Items:</h4>
        <ul className="list-disc pl-6">
          {invoice.items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.orderedQty} x ${item.price} (Bonus:{" "}
              {item.bonusQty})
            </li>
          ))}
        </ul>

        <div className="mt-4 font-semibold">
          <p>Total Value: ${invoice.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;

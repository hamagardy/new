import React, { useState } from "react";

function CreateInvoice({ inventory, setInventory, invoices, setInvoices }) {
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    itemId: "",
    qty: "",
    bonusQty: "",
  });
  const [invoiceDate, setInvoiceDate] = useState("");

  const handleAddItem = () => {
    if (currentItem.itemId && currentItem.qty) {
      // Convert itemId to number for comparison
      const itemId = parseInt(currentItem.itemId, 10);
      const item = inventory.find((i) => i.id === itemId);
      const requestedQty =
        parseInt(currentItem.qty) + (parseInt(currentItem.bonusQty) || 0);

      if (!item || item.qty < requestedQty) {
        alert(`Not enough stock. Available: ${item?.qty || 0}`);
        return;
      }

      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          orderedQty: parseInt(currentItem.qty),
          bonusQty: parseInt(currentItem.bonusQty) || 0,
        },
      ]);
      setCurrentItem({ itemId: "", qty: "", bonusQty: "" });
    }
  };

  const handleSaveInvoice = () => {
    if (customerName && selectedItems.length > 0 && invoiceDate) {
      const newInvoice = {
        id: invoices.length + 1,
        customerName,
        date: new Date(invoiceDate).toISOString(),
        items: selectedItems,
        total: selectedItems.reduce(
          (acc, item) => acc + item.orderedQty * item.price,
          0
        ),
        type: "sale", // Add type to distinguish from returns
      };

      const updatedInventory = inventory.map((item) => {
        const orderedItem = selectedItems.find((si) => si.id === item.id);
        if (orderedItem) {
          return {
            ...item,
            qty: item.qty - (orderedItem.orderedQty + orderedItem.bonusQty),
          };
        }
        return item;
      });

      setInvoices([...invoices, newInvoice]);
      setInventory(updatedInventory);
      setCustomerName("");
      setSelectedItems([]);
      setInvoiceDate("");
    } else {
      alert("Please provide a customer name, items, and invoice date.");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-50">
        Create Invoice
      </h2>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <input
          type="text"
          className="mb-4 p-2 w-full"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          type="date"
          className="mb-4 p-2 w-full"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            className="mb-4 p-2 w-full"
            value={currentItem.itemId}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, itemId: e.target.value })
            }
          >
            <option value="">Select Item</option>
            {inventory.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.qty} in stock
              </option>
            ))}
          </select>
          <input
            type="number"
            className="mb-4 p-2 w-full"
            placeholder="Quantity"
            value={currentItem.qty}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, qty: e.target.value })
            }
          />
          <input
            type="number"
            className="mb-4 p-2 w-full"
            placeholder="Bonus Quantity (Optional)"
            value={currentItem.bonusQty}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, bonusQty: e.target.value })
            }
          />
        </div>
        <button
          type="button"
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Item
        </button>

        <div className="mt-6">
          <h3 className="font-semibold">Items</h3>
          <ul className="list-disc pl-6">
            {selectedItems.map((item, index) => (
              <li key={index}>
                {item.name} - {item.orderedQty} x ${item.price} (Bonus:{" "}
                {item.bonusQty})
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={handleSaveInvoice}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Save Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateInvoice;

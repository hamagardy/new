import React, { useState, useEffect } from "react";

function ReturnItems({
  inventory,
  setInventory,
  returnHistory = [],
  setReturnHistory,
}) {
  const [customerName, setCustomerName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    itemId: "",
    qty: "",
    bonusQty: "",
  });
  const [returnDate, setReturnDate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Use inventory directly instead of localInventory
  useEffect(() => {
    setLocalInventory(inventory);
  }, [inventory]);

  const [localInventory, setLocalInventory] = useState(inventory || []);

  const handleAddItem = () => {
    if (currentItem.itemId && currentItem.qty) {
      // Convert itemId to number for comparison
      const itemId = parseInt(currentItem.itemId, 10);
      const item = localInventory.find((i) => i.id === itemId);

      if (!item) {
        alert("Item not found.");
        return;
      }

      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          returnedQty: parseInt(currentItem.qty),
          bonusQty: parseInt(currentItem.bonusQty) || 0,
        },
      ]);
      setCurrentItem({ itemId: "", qty: "", bonusQty: "" });
    }
  };

  const handleSaveReturn = () => {
    if (customerName && selectedItems.length > 0 && returnDate) {
      let newReturnId = 1;
      if (returnHistory.some((record) => record.id === 1)) {
        newReturnId = Math.max(...returnHistory.map((record) => record.id)) + 1;
      }

      const newReturn = {
        id: newReturnId,
        customerName,
        date: new Date(returnDate).toISOString(),
        items: selectedItems,
        total: selectedItems.reduce(
          (acc, item) => acc + item.returnedQty * item.price,
          0
        ),
        type: "return",
      };

      const updatedInventory = localInventory.map((item) => {
        const returnedItem = selectedItems.find((si) => si.id === item.id);
        if (returnedItem) {
          return {
            ...item,
            qty: item.qty + returnedItem.returnedQty + returnedItem.bonusQty,
          };
        }
        return item;
      });

      const updatedReturnHistory = [...returnHistory, newReturn];
      localStorage.setItem(
        "returnHistory",
        JSON.stringify(updatedReturnHistory)
      );

      setReturnHistory(updatedReturnHistory);
      setInventory(updatedInventory);
      setLocalInventory(updatedInventory);
      setCustomerName("");
      setSelectedItems([]);
      setReturnDate("");

      setSuccessMessage("Return created successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      alert("Please provide a customer name, items, and return date.");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-50">
        Create Return
      </h2>
      {successMessage && (
        <div className="bg-green-500 text-white p-4 mb-4 rounded-md">
          {successMessage}
        </div>
      )}
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
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
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
            {localInventory.map((item) => (
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
                {item.name} - {item.returnedQty} x ${item.price} (Bonus:{" "}
                {item.bonusQty})
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={handleSaveReturn}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Save Return
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReturnItems;

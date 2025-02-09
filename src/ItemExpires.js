// ItemExpires.js
import React, { useState, useEffect } from "react";

function ItemExpires({ inventory, setInventory, setExpiredItems }) {
  const [selectedItem, setSelectedItem] = useState({
    itemId: "",
    qty: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [lastPasswordEntry, setLastPasswordEntry] = useState(null);

  // Function to check if the password has been entered recently
  const isPasswordValid = () => {
    if (!lastPasswordEntry) return false;
    const now = new Date();
    const diff = (now - lastPasswordEntry) / (1000 * 60); // difference in minutes
    return diff < 20; // If less than 20 minutes has passed, password is still valid
  };

  useEffect(() => {
    // Check if password needs to be re-entered every time the component mounts or updates
    if (!isPasswordValid()) {
      setPasswordModalOpen(true);
    }
  }, []);

  const handleSaveExpiration = () => {
    if (!isPasswordValid()) {
      setPasswordModalOpen(true);
      return;
    }

    if (selectedItem.itemId && selectedItem.qty) {
      const itemId = parseInt(selectedItem.itemId, 10);
      const itemToExpire = inventory.find((item) => item.id === itemId);

      if (!itemToExpire) {
        alert("Item not found.");
        return;
      }

      const qtyToExpire = parseInt(selectedItem.qty);
      if (qtyToExpire > itemToExpire.qty) {
        alert("You cannot expire more items than are in stock.");
        return;
      }

      // Update inventory
      const updatedInventory = inventory.map((item) => {
        if (item.id === itemId) {
          return { ...item, qty: item.qty - qtyToExpire };
        }
        return item;
      });

      // Update expired items
      const expiredItem = {
        id: Date.now(), // Using timestamp as a unique id
        name: itemToExpire.name,
        expiredQty: qtyToExpire,
        date: new Date().toISOString(),
      };

      setExpiredItems((prevExpiredItems) => [...prevExpiredItems, expiredItem]);
      setInventory(updatedInventory);
      setSelectedItem({ itemId: "", qty: "" });
      setSuccessMessage("Expiration recorded successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } else {
      alert("Please select an item and provide a quantity.");
    }
  };

  const confirmPassword = () => {
    if (password === "gardy1234") {
      setLastPasswordEntry(new Date());
      setPasswordModalOpen(false);
      setPassword("");
      handleSaveExpiration(); // Proceed with the expiration action
    } else {
      alert("Incorrect Password");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-slate-50">
        Manage Expired Items
      </h2>
      {successMessage && (
        <div className="bg-green-500 text-white p-4 mb-4 rounded-md">
          {successMessage}
        </div>
      )}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <select
          className="mb-4 p-2 w-full"
          value={selectedItem.itemId}
          onChange={(e) =>
            setSelectedItem({ ...selectedItem, itemId: e.target.value })
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
          placeholder="Quantity to Expire"
          value={selectedItem.qty}
          onChange={(e) =>
            setSelectedItem({ ...selectedItem, qty: e.target.value })
          }
        />

        <button
          onClick={() => {
            if (!isPasswordValid()) {
              setPasswordModalOpen(true);
            } else {
              handleSaveExpiration();
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Save Expiration
        </button>
      </div>

      {/* Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Enter Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 p-2 w-full border rounded"
            />
            <button
              onClick={confirmPassword}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Submit
            </button>
            <button
              onClick={() => setPasswordModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemExpires;

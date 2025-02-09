import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";

function Total({ inventory, setInventory }) {
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [newItem, setNewItem] = useState({ name: "", qty: "", price: "" });
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [password, setPassword] = useState("");
  const user = auth.currentUser;

  // Load Inventory from Firestore on mount
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // Real-time sync with Firestore
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setInventory(docSnap.data().inventory || []);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Save inventory to Firestore
  const saveInventoryToFirestore = async (updatedInventory) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { inventory: updatedInventory });
  };

  // Verify password before adding an item
  const verifyPasswordAndSaveItem = async () => {
    if (!user || !password) {
      alert("Please enter your password.");
      return;
    }

    try {
      // Re-authenticate user
      await signInWithEmailAndPassword(auth, user.email, password);

      // Proceed with adding the item
      handleSaveNewItem();
      setPassword(""); // Clear password after authentication
    } catch (error) {
      alert("Incorrect password. Please try again.");
    }
  };

  const handleSaveNewItem = async () => {
    if (!newItem.name || newItem.qty <= 0 || newItem.price <= 0) {
      alert("Please fill all fields correctly.");
      return;
    }

    const newInventoryItem = {
      id: Date.now(),
      name: newItem.name,
      qty: parseInt(newItem.qty),
      price: parseFloat(newItem.price),
    };

    const updatedInventory = [...inventory, newInventoryItem];

    setInventory(updatedInventory);
    await saveInventoryToFirestore(updatedInventory);
    setNewItem({ name: "", qty: "", price: "" });
    setIsAddingNewItem(false);
  };

  const handleRemoveItem = async (itemId) => {
    const updatedInventory = inventory.filter((item) => item.id !== itemId);
    setInventory(updatedInventory);
    await saveInventoryToFirestore(updatedInventory);
  };

  return (
    <div>
      <h2>Total Stock Overview</h2>
      <p>Total Items: {inventory.length}</p>
      <p>
        Total Stock Quantity:{" "}
        {inventory.reduce((acc, item) => acc + item.qty, 0)}
      </p>

      <button onClick={() => setIsAddingNewItem(true)}>Add New Item</button>

      {isAddingNewItem && (
        <div>
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newItem.qty}
            onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={verifyPasswordAndSaveItem}>Save Item</button>
          <button onClick={() => setIsAddingNewItem(false)}>Cancel</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>
                <button onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Total;

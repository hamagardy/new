import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import {
  Home,
  Plus,
  Cog,
  FileText,
  Package,
  LogOut,
  AlertCircle,
} from "lucide-react";
import "./styles.css";
import "./index.css";
import "./output.css";
import DashboardAndHomePage from "./DashboardAndHomePage";
import CreateInvoice from "./CreateInvoice";
import SavedInvoices from "./SavedInvoices";
import InvoiceDetails from "./InvoiceDetails";
import Total from "./total";
import ReturnItems from "./ReturnItems";
import ReturnHistory from "./ReturnHistory";
import ReturnDetails from "./ReturnDetails";
import Login from "./Login";
import SignUp from "./signup";
import SettingsComponent from "./Settings";
import ItemExpires from "./ItemExpires";
import ExpiredItems from "./ExpiredItems";

// Firebase imports
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [returnHistory, setReturnHistory] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isLoading, setIsLoading] = useState(true);
  const [unsubscribeSnapshot, setUnsubscribeSnapshot] = useState(null);

  // Listen for authentication changes and manage data subscription
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email });

          // Clean up previous snapshot listener if exists
          if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
          }

          const userDoc = doc(db, "users", firebaseUser.uid);

          // Set up real-time listener for user data
          const unsubscribe = onSnapshot(
            userDoc,
            async (docSnapshot) => {
              try {
                if (docSnapshot.exists()) {
                  const data = docSnapshot.data();
                  setInventory(data.inventory || []);
                  setInvoices(data.invoices || []);
                  setReturnHistory(data.returnHistory || []);
                  setExpiredItems(data.expiredItems || []);
                } else {
                  // Initialize user document if it doesn't exist
                  await setDoc(userDoc, {
                    inventory: [],
                    invoices: [],
                    returnHistory: [],
                    expiredItems: [],
                    email: firebaseUser.email,
                    createdAt: new Date().toISOString(),
                  });
                }
              } catch (error) {
                console.error("Error handling user data:", error);
              } finally {
                setIsLoading(false);
              }
            },
            (error) => {
              console.error("Error in Firestore snapshot:", error);
              setIsLoading(false);
            }
          );

          setUnsubscribeSnapshot(() => unsubscribe);
        } else {
          // User is logged out
          setUser(null);
          if (unsubscribeSnapshot) {
            unsubscribeSnapshot();
            setUnsubscribeSnapshot(null);
          }
          // Don't clear the states here, let the component handle it naturally
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setIsLoading(false);
      }
    });

    // Cleanup auth listener on component unmount
    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
      unsubscribeAuth();
    };
  }, []); // Remove auth dependency

  // Handle data updates to Firestore
  useEffect(() => {
    const updateUserData = async () => {
      if (user?.uid && !isLoading) {
        try {
          const userDoc = doc(db, "users", user.uid);
          await updateDoc(userDoc, {
            inventory,
            invoices,
            returnHistory,
            expiredItems,
            lastUpdated: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      }
    };

    // Debounce the updates to prevent excessive writes
    const timeoutId = setTimeout(updateUserData, 1000);
    return () => clearTimeout(timeoutId);
  }, [inventory, invoices, returnHistory, expiredItems, user, isLoading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The auth state change listener will handle cleanup
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <BrowserRouter>
      {user ? (
        <div className="flex">
          <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
              {isSidebarOpen && <h1>Inventory System</h1>}
            </div>
            <ul className="sidebar-menu">
              <li>
                <Link to="#" onClick={toggleSidebar} className="sidebar-item">
                  ☰ <span>{isSidebarOpen && "Toggle Sidebar"}</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="sidebar-item">
                  <Home /> <span>{isSidebarOpen && "Dashboard"}</span>
                </Link>
              </li>
              <li>
                <Link to="/invoice" className="sidebar-item">
                  <Plus /> <span>{isSidebarOpen && "Create Invoice"}</span>
                </Link>
              </li>
              <li>
                <Link to="/saved-invoices" className="sidebar-item">
                  <FileText /> <span>{isSidebarOpen && "Saved Invoices"}</span>
                </Link>
              </li>
              <li>
                <Link to="/total" className="sidebar-item">
                  <Package /> <span>{isSidebarOpen && "Total Items"}</span>
                </Link>
              </li>
              <li>
                <Link to="/return-items" className="sidebar-item">
                  <Plus /> <span>{isSidebarOpen && "Return Items"}</span>
                </Link>
              </li>
              <li>
                <Link to="/return-history" className="sidebar-item">
                  <FileText /> <span>{isSidebarOpen && "Return History"}</span>
                </Link>
              </li>
              <li>
                <Link to="/item-expires" className="sidebar-item">
                  <AlertCircle />{" "}
                  <span>{isSidebarOpen && "Manage Expired"}</span>
                </Link>
              </li>
              <li>
                <Link to="/expired-items" className="sidebar-item">
                  <AlertCircle />{" "}
                  <span>{isSidebarOpen && "Expired Items"}</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className="sidebar-item">
                  <Cog /> <span>{isSidebarOpen && "Settings"}</span>
                </Link>
              </li>
              <li>
                <Link to="/" onClick={handleLogout} className="sidebar-item">
                  <LogOut /> <span>{isSidebarOpen && "Logout"}</span>
                </Link>
              </li>
            </ul>
          </aside>
          <main className="main-content">
            {isLoading ? (
              <div className="flex items-center justify-center h-screen">
                <p className="text-2xl text-gray-700 dark:text-slate-300">
                  Loading...
                </p>
              </div>
            ) : (
              <Routes>
                <Route
                  path="/"
                  element={
                    <DashboardAndHomePage
                      inventory={inventory}
                      invoices={invoices}
                      returnHistory={returnHistory}
                      expiredItems={expiredItems}
                    />
                  }
                />
                <Route
                  path="/invoice"
                  element={
                    <CreateInvoice
                      inventory={inventory}
                      setInventory={setInventory}
                      invoices={invoices}
                      setInvoices={setInvoices}
                    />
                  }
                />
                <Route
                  path="/saved-invoices"
                  element={<SavedInvoices invoices={invoices} />}
                />
                <Route
                  path="/invoice/:id"
                  element={<InvoiceDetails invoices={invoices} />}
                />
                <Route
                  path="/total"
                  element={
                    <Total inventory={inventory} setInventory={setInventory} />
                  }
                />
                <Route
                  path="/return-items"
                  element={
                    <ReturnItems
                      inventory={inventory}
                      setInventory={setInventory}
                      returnHistory={returnHistory}
                      setReturnHistory={setReturnHistory}
                    />
                  }
                />
                <Route
                  path="/return-history"
                  element={<ReturnHistory returnHistory={returnHistory} />}
                />
                <Route
                  path="/return-history/:id"
                  element={<ReturnDetails returnHistory={returnHistory} />}
                />
                <Route
                  path="/settings"
                  element={<SettingsComponent setUser={setUser} />}
                />
                <Route
                  path="/item-expires"
                  element={
                    <ItemExpires
                      inventory={inventory}
                      setInventory={setInventory}
                      setExpiredItems={setExpiredItems}
                    />
                  }
                />
                <Route
                  path="/expired-items"
                  element={<ExpiredItems expiredItems={expiredItems} />}
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            )}
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;

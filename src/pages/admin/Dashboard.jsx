import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiBox, FiTag, FiUsers, FiShoppingBag, FiAlertCircle } from "react-icons/fi";
import StatCard from "../../components/admin/StatCard";
import { useCatalog } from "../../context/CatalogContext";
import { subscribeAllOrders } from "../../services/orderService";
import { getUserCount } from "../../services/userService";

export default function Dashboard() {
  const { products, categories } = useCatalog();
  const [orders, setOrders] = useState([]);
  const [userCount, setUserCount] = useState(null);

  useEffect(() => {
    const unsub = subscribeAllOrders(setOrders, () => setOrders([]));
    return unsub;
  }, []);

  useEffect(() => {
    getUserCount().then(setUserCount).catch(() => setUserCount(null));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="section-subtitle" style={{ margin: "4px 0 32px", textAlign: "left" }}>
        Overview of your Miss Sunflower store.
      </p>

      {products.length === 0 && (
        <div className="card" style={{ padding: 18, marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
          <FiAlertCircle style={{ color: "var(--color-primary-dark)", fontSize: 22, flexShrink: 0 }} />
          <p style={{ margin: 0 }}>
            No products yet. Go to <Link to="/admin/products" style={{ fontWeight: 700 }}>Products</Link> to seed
            the starter catalog or add your first product.
          </p>
        </div>
      )}

      <div className="grid grid-4">
        <StatCard icon={<FiBox />} label="Total Products" value={products.length} />
        <StatCard icon={<FiTag />} label="Total Categories" value={categories.length} />
        <StatCard icon={<FiUsers />} label="Total Users" value={userCount ?? "—"} loading={userCount === null} />
        <StatCard icon={<FiShoppingBag />} label="Total Orders" value={orders.length} />
      </div>

      <div className="card" style={{ padding: 24, marginTop: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Recent Orders</h3>
        {orders.length === 0 ? (
          <p style={{ margin: 0 }}>No orders yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>{order.customerName}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>${order.total?.toFixed(2)}</td>
                    <td><span className="badge">{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

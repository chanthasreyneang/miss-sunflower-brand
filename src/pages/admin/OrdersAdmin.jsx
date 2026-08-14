import { useEffect, useState } from "react";
import { subscribeAllOrders, updateOrderStatus } from "../../services/orderService";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/common/EmptyState";
import Loading from "../../components/common/Loading";

const STATUSES = ["pending", "processing", "completed", "cancelled"];

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeAllOrders(
      (data) => {
        setOrders(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  async function handleStatusChange(id, status) {
    try {
      await updateOrderStatus(id, status);
      showToast("Order status updated.");
    } catch {
      showToast("Couldn't update order status.", "error");
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h1 style={{ margin: 0 }}>Orders</h1>
      </div>

      {loading ? (
        <Loading label="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Orders placed by customers will show up here." />
      ) : (
        <div className="card" style={{ padding: 8, overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.customerName}<br /><small style={{ color: "var(--color-muted)" }}>{order.address}</small></td>
                  <td>{order.phone}</td>
                  <td>{order.items?.map((i) => `${i.name} x${i.qty}`).join(", ")}</td>
                  <td>${order.total?.toFixed(2)}</td>
                  <td>{order.paymentMethod}</td>
                  <td>
                    <select
                      className="form-control"
                      style={{ padding: "6px 10px", width: "auto" }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

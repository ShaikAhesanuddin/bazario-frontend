import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderService";
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import Loader from "../../components/common/Loader/Loader";
import { toast } from "react-toastify";
import styles from "./Orders.module.scss";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <h2 className={styles.heading}>My Orders</h2>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <p>No orders found</p>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map((order) => (
              <div key={order.orderId} className={styles.card}>


                <img
                  src={order.product?.imageUrl || "/placeholder.png"}
                  alt={order.product?.name || "Product"}
                  className={styles.image}
                />

                <div className={styles.details}>
                  <h3>{order.product?.name || "Unknown Product"}</h3>

                  <p className={styles.meta}>
                    Qty: {order.quantity} • ₹{order.totalAmount}
                  </p>

                  <p className={styles.date}>
                    Ordered on:{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                  <div className={styles.address}>
                    {order.address ? (
                      <>
                        {order.address.street}, {order.address.city}
                      </>
                    ) : (
                      "Address unavailable"
                    )}
                  </div>
                </div>

                <div className={styles.right}>
                  <span
                    className={`${styles.status} ${styles[order.orderStatus.toLowerCase()]
                      }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Orders;
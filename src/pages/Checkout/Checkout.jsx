import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import Loader from "../../components/common/Loader/Loader";
import AddressSection from "../Profile/AddressSection";
import { getProductById } from "../../services/productService";
import { placeOrder } from "../../services/orderService";
import { toast } from "react-toastify";
import styles from "./Checkout.module.scss";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [placing, setPlacing] = useState(false);

  const quantity = state?.quantity || 1;
  const productId = state?.productId;


  useEffect(() => {
    if (!productId) {
      toast.error("Invalid checkout");
      navigate("/");
    }
  }, [productId, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(productId);
        setProduct(res.data);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const price = Number(product?.discountedPrice || product?.price || 0);
  const subtotal = price * quantity;
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;


  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setPlacing(true);

      await placeOrder({
        productId,
        quantity,
        addressId: selectedAddress,
      });

      toast.success("Order placed successfully 🎉");
      navigate("/orders");
    } catch (err) {
      const message =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to place order";

      toast.error(message);
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <h2 className={styles.heading}>Checkout</h2>

        <div className={styles.layout}>


          <div className={styles.left}>


            {product && (
              <div className={styles.card}>
                <img src={product.imageUrl} alt={product.name} />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.brand}</p>
                  <p className={styles.price}>
                    ₹{price} × {quantity}
                  </p>
                </div>
              </div>
            )}

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3>Select Delivery Address</h3>
              </div>

              {selectedAddress && (
                <div className={styles.selectedBanner}>
                  🚚 This order will be delivered to the selected address
                </div>
              )}

              <AddressSection
                selectable
                allowAdd
                onSelect={(id) => setSelectedAddress(id)}
              />
            </div>

            <div className={styles.section}>
              <h3>Payment Method</h3>
              <div className={styles.paymentBox}>
                Cash on Delivery (COD)
              </div>
            </div>
          </div>


          <div className={styles.right}>
            <div className={styles.summaryBox}>
              <h3>Order Summary</h3>

              <div className={styles.row}>
                <span>Subtotal</span>
                <span>₹{Math.round(subtotal)}</span>
              </div>

              <div className={styles.row}>
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
              </div>

              <div className={styles.totalRow}>
                <span>Total</span>
                <span>₹{Math.round(total)}</span>
              </div>

              <button
                className={styles.placeBtn}
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? "Placing..." : "Place Order"}
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;
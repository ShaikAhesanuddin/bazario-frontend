import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  getRelatedProducts,
} from "../../services/productService";

import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import Loader from "../../components/common/Loader/Loader";
import ProductCard from "../../components/product/ProductCard/ProductCard";

import { toast } from "react-toastify";
import styles from "./ProductDetails.module.scss";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); 

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [customQty, setCustomQty] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    setQuantity(1);
    setCustomQty("");
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setProduct(null);

        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setRelated([]);
        const res = await getRelatedProducts(id);
        setRelated(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchRelated();
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p>Product not found</p>;

  const finalQty =
    quantity === "custom" ? Number(customQty) : Number(quantity);

 
  const handleBuy = () => {
    if (!finalQty || finalQty < 1) {
      toast.error("Enter valid quantity");
      return;
    }

    if (finalQty > product.quantity) {
      toast.error("Not enough stock");
      return;
    }

    navigate("/checkout", {
      state: {
        productId: product.id,
        quantity: finalQty,
      },
    });
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
   
        <div className={styles.card}>
          
          <div className={styles.imageWrapper}>
            <img
              src={
                product.imageUrl ||
                "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={product.name}
            />
          </div>

          <div className={styles.details}>
            <h2 className={styles.name}>{product.name}</h2>

            <p className={styles.brand}>{product.brand}</p>

            {/* PRICE */}
            <div className={styles.priceSection}>
              <span className={styles.price}>
                ₹{Number(product.discountedPrice).toLocaleString()}
              </span>

              <span className={styles.original}>
                ₹{Number(product.price).toLocaleString()}
              </span>

              <span className={styles.discount}>
                {product.discountPercentage}% OFF
              </span>
            </div>

            <p className={styles.desc}>{product.description}</p>

            <p
              className={
                product.inStock ? styles.inStock : styles.outOfStock
              }
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>

            <div className={styles.purchaseBox}>
              <div className={styles.quantityWrapper}>
                <label>Quantity:</label>

                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={styles.dropdown}
                >
                  {[1, 2, 3, 4, 5].map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                  <option value="custom">Custom</option>
                </select>

                {quantity === "custom" && (
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={customQty}
                    onChange={(e) => setCustomQty(e.target.value)}
                    className={styles.qtyInput}
                  />
                )}
              </div>

              <button
                className={styles.buyBtn}
                disabled={!product.inStock}
                onClick={handleBuy}
              >
                {product.inStock ? "Buy Now" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.relatedSection}>
          <h3>You may also like</h3>

          {related.length === 0 ? (
            <p className={styles.empty}>No related products</p>
          ) : (
            <div className={styles.grid}>
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetails;
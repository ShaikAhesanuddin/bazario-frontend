import { useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.scss";

function ProductCard({ product }) {
  const navigate = useNavigate();

  if (!product) return null;

  const {
    productId,
    id,
    name = "Unnamed Product",
    price = 0,
    imageUrl,
  } = product;

  const finalId = id || productId; 

  const handleClick = () => {
    if (!finalId) return;
    navigate(`/product/${finalId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleClick();
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.imageWrapper}>
        <img
          src={
            imageUrl ||
            "https://c8.alamy.com/comp/2DAD7JR/unavailable-stamp-unavailable-sign-round-grunge-label-2DAD7JR.jpg"
          }
          alt={name}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.details}>
        <h3 className={styles.name} title={name}>
          {name}
        </h3>

        <p className={styles.price}>
          ₹{Number(price).toLocaleString()}
        </p>
      </div>

      <div className={styles.overlay}>
        <button
          className={styles.viewBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          View Product
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
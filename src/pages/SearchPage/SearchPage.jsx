import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../../services/productService";

import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer/Footer";
import Loader from "../../components/common/Loader/Loader";
import ProductCard from "../../components/product/ProductCard/ProductCard";

import styles from "./SearchPage.module.scss";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await searchProducts(query);
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchProducts();
  }, [query]);

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.container}>
        <h2 className={styles.heading}>
          Results for "{query}"
        </h2>

      
        {loading && (
          <div className={styles.loader}>
            <Loader />
          </div>
        )}

      
        {!loading && products.length === 0 && (
          <div className={styles.empty}>
            <p>No products found</p>
          </div>
        )}

        
        {!loading && products.length > 0 && (
          <div className={styles.grid}>
            {products.map((item) => (
              <ProductCard key={item.productId} product={item} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SearchPage;
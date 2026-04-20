import { useEffect, useState } from "react";
import { searchDefaultProducts } from "../../services/productService";
import ProductCard from "../../components/product/ProductCard/ProductCard";
import Loader from "../../components/common/Loader/Loader";
import Navbar from "../../components/layout/Navbar/Navbar";
import styles from "./Home.module.scss";
import Footer from "../../components/layout/Footer/Footer";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setError(false);
                const res = await searchDefaultProducts();
                setProducts(res.data || []);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className={styles.page}>
            <Navbar />


            {loading && (
                <div className={styles.loaderWrapper}>
                    <Loader />
                </div>
            )}


            {!loading && (error || products.length === 0) && (
                <div className={styles.emptyContainer}>
                    <img
                        src="https://t3.ftcdn.net/jpg/04/87/13/44/360_F_487134400_ZnxMUxATrwBEC8BtctMWZaX9VuQQ6GG0.jpg"
                        alt="No products"
                        className={styles.image}
                    />
                    <h2 className={styles.text}>
                        Products temporarily unavailable
                    </h2>
                </div>
            )}


            {!loading && !error && products.length > 0 && (
                <div className={styles.content}>
                    <h2 className={styles.heading}>Featured Products</h2>

                    <div className={styles.grid}>
                        {products.map((item) => (
                            <ProductCard key={item.productId} product={item} />
                        ))}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Home;
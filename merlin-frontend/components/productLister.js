import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function ProductList(props) {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://api.example.com/products?page=${page}`);
        const data = await response.json();
        setProducts([...products, ...data.results]);
        setHasMore(data.results.length > 0);
        setPage(page + 1);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

  }, [page]);

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={() => {
        if (hasMore) {
          fetchProducts();
        }
      }}
      hasMore={hasMore}
      loader={<div className="loader">Loading...</div>}
    >
      {products.map((product) => (
        <div key={product.id} className={propagateServerField.divClass}>
          {/* Render your product details here */}
        </div>
      ))}
    </InfiniteScroll>
  );
}

export default ProductList;
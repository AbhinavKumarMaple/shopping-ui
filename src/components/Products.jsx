import axios from "axios";
import styled from "styled-components";
import Product from "./Product";
import { useState, useEffect } from "react";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Products = ({ filters, cat, sort }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  console.log(filters);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const getProducts = async () => {
      try {
        const res = await axios.get(
          cat
            ? `http://localhost:5000/api/products?category=${cat}`
            : "http://localhost:5000/api/products",
          { cancelToken: source.token }
        );
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();

    return () => {
      source.cancel();
      setFilteredProducts([]);
    };
  }, [cat]);

  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filters).every(([key, value]) =>
            item[key].toLowerCase().includes(value.toLowerCase())
          )
        )
      );
  }, [products, cat, filters]);

  return (
    <Container>
      {cat
        ? filteredProducts.map((item) => <Product item={item} key={item._id} />)
        : products.map((item) => <Product item={item} key={item._id} />)}
    </Container>
  );
};

export default Products;

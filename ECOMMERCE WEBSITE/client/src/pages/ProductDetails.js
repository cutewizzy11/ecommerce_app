import React, { useState, useEffect, useRef } from "react";
import Layout from "./../components/Layout/Layout.js";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../context/cart";
import "../styles/ProductDetailsStyles.css";
import { useNavigation } from "../hooks/useNavigation";
import TextToSpeechComponent from "../components/TextToSpeechComponent"

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const { handleNavigation } = useNavigation();

  const productDetailsRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [relatedProducts, cart, setCart, params?.slug, product]);

  const handleKeyDown = (e) => {
    if (relatedProducts.length > 0) {
      handleNavigation(e.key, relatedProducts, 0, cart, setCart);
    }
  
    if (e.key === 'v' && relatedProducts.length > 0) {
      navigate(`/product/${relatedProducts[0].slug}`);
    }
  
    if (e.key === 'b' && product._id) {
      addToCart(product);
    }
  
    if (e.key === 'x') {
      navigate('/cart');
    }
  
    // Trigger introduction of focused product on pressing Enter
    if (e.key === 'Enter' && relatedProducts.length > 0) {
      // Introduce the focused product using text-to-speech
      console.log('Enter key pressed. Calling speakProductIntroduction.');
      speakProductIntroduction(relatedProducts[0]);
    }
  };

  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category?._id);

      // Introduce the product details using text-to-speech
      console.log('Introducing the product details');
      speakProductIntroduction(data?.product);
    } catch (error) {
      console.log(error);
    }
  };

  const speakProductIntroduction = (product) => {
    const text = `Product Details. Name: ${product.name}. Description: ${product.description}. Price: £ ${product.price}. Category: ${product?.category?.name}.`;
    return text;
  };

  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    localStorage.setItem("cart", JSON.stringify([...cart, product]));
    toast.success("Item Added to cart");
  };

  return (
    <Layout>
      <div
        className="product-details row container mt-2"
        tabIndex="0"
        ref={productDetailsRef}
      >
        <div className="card col-md-6">
          {product._id && (
            <img
              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
              className="card-img-top"
              alt={product.name}
              height="300"
              width={"350px"}
            />
          )}
        </div>
        <div className="product-details-info col-md-6">
          <h1 className="text-center">Product Details</h1>
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>Price: £{product.price}</h6>
          <h6>Category: {product?.category?.name}</h6>
          <button
            className="btn btn-secondary"
            onClick={() => addToCart(product)}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className=".similar-products row container">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p?._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text"> £ {p.price}</p>
                <button
                  className="btn btn-primary ms-1"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  View This Product
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="similar-products m-2 p-3">
          {relatedProducts && relatedProducts.length > 0 && (
            <button
              className="btn btn-warning"
              onClick={(e) => {
                e.preventDefault();
                // You might want to handle Loadmore logic here
              }}
            >
              {loading ? "Loading ..." : "Loadmore"}
            </button>
          )}
        </div>
      </div>
      <TextToSpeechComponent speakFn={() => speakProductIntroduction(product)} />
    </Layout>
  );
};

export default ProductDetails;

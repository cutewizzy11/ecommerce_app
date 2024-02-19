import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout.js";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CategoryProductStyles.css";
import TextToSpeechComponent from "../components/TextToSpeechComponent";
import { useNavigation } from "../hooks/useNavigation";
import { useCart } from "../context/cart";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null); // Declare intervalId state
  const [cart, setCart] = useState([]);
  const { handleNavigation } = useNavigation();

  const getProductsByCat = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`);
      if (data && data.success) {
        setProducts(data.products || []);
        setCategory(data.category || []);
      } else {
        console.error('API request succeeded, but data format is unexpected:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.slug) {
      getProductsByCat();
    } else {
      // Handle the case where slug is empty or undefined
      // You might want to display an error message or redirect the user
    }
  }, [params?.slug]);

  useEffect(() => {
    // Automatically speak next product every 5 seconds
    const id = setInterval(() => {
      speakNextProduct();
    }, 5000);

    // Store the intervalId in state
    setIntervalId(id);

    // Cleanup the interval on component unmount or when all products have been introduced
    return () => {
      clearInterval(id);
    };
  }, [currentProductIndex, products]);

  const generateSpeechText = () => {
    if (products.length > 0) {
      const currentProduct = products[currentProductIndex];
      return `Introducing ${currentProduct.name}. ${currentProduct.description}. Price: £ ${currentProduct.price}.`;
    }
    return "No products found.";
  };

  const speakNextProduct = () => {
    if (currentProductIndex < products.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
    } else {
      // Stop the introduction when all products have been introduced
      clearInterval(intervalId);
    }
  };
  const handleKeyDown = (e, index) => {
    handleNavigation(e.key, products, index, cart, setCart);
  };

  return (
    <Layout>
      <div className="container mt-3">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h4 className="text-center">Category - {category?.name}</h4>
            <h6 className="text-center">{products?.length} result found </h6>
            <div className="row">
              <div className="col-md-9 offset-1">
                <div className="d-flex flex-wrap">
                  {products?.map((p, index) => (
                    <div
                      className="card m-2"
                      style={{ width: "18rem" }}
                      key={p._id}
                    >
                      <img
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top"
                        alt={p.name}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{p.name}</h5>
                        <p className="card-text">
                          {p.description.substring(0, 30)}...
                        </p>
                        <p className="card-text"> £ {p.price}</p>
                        <button
                          className="btn btn-primary ms-1"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          More Details
                        </button>
                        <button className="btn btn-secondary ms-1">
                          ADD TO CART
                        </button>
                        {index === currentProductIndex && (
                          <TextToSpeechComponent text={generateSpeechText()} />
                        )}
                        {/* Add the onKeyDown event to handle navigation */}
                        <div
                          tabIndex="0"
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onClick={(e) => e.currentTarget.focus({ preventScroll: true })}
                          autoFocus
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
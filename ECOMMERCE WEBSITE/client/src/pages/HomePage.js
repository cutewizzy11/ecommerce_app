import React, { useState, useEffect, useRef } from "react";
import Layout from "./../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import TextToSpeechComponent from "../components/TextToSpeechComponent";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { useNavigation } from "../hooks/useNavigation";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const categoryCheckboxesRef = useRef([]);
  const priceRadiosRef = useRef(null);
  const productCardsRef = useRef([]);

  // Define speak function
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Use useNavigation hook with speak function
  const { handleNavigation, introduceNavigationOptions } = useNavigation(speak);

  useEffect(() => {
    categoryCheckboxesRef.current = categoryCheckboxesRef.current.slice(0, categories.length);
    productCardsRef.current = productCardsRef.current.slice(0, products.length);
  }, [categories, products]);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  useEffect(() => {
    getAllProducts();
    introduceNavigationOptions();  // Introduce navigation options on component mount
  }, []);

  const speakProductIntroduction = (index) => {
    if (products.length > 0 && index >= 0 && index < products.length) {
      const currentProduct = products[index];
      const text = `Introducing ${currentProduct.name}. ${currentProduct.description}. Price: £ ${currentProduct.price}.`;
      speak(text);
    }
  };

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxKeyDown = (e, id, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleFilter(!checked.includes(id), id);
    } else if (e.key === 'ArrowDown' && index < categoryCheckboxesRef.current.length - 1) {
      categoryCheckboxesRef.current[index + 1].focus();
    } else if (e.key === 'ArrowUp' && index > 0) {
      categoryCheckboxesRef.current[index - 1].focus();
    }
  };

  const handleRadioKeyDown = (e, value) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setRadio(value);
    }
  };

  const introduceProduct = (index) => {
    speakProductIntroduction(index);
  };

  const handleProductCardKeyDown = (e, index) => {
    handleNavigation(e.key, products, index, cart, setCart);

    if (e.key === 'ArrowRight' && index < products.length - 1) {
      productCardsRef.current[index + 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      productCardsRef.current[index - 1].focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      introduceProduct(index);  // Introduce the product when Enter or Space is pressed
    }
  };

  const handleLoadMoreKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && products.length < total) {
      setPage(page + 1);
    }
  };

  return (
    <Layout title={"All Products - Best offers"}>
      <div className="filters container-fluid row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c, index) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
                onKeyDown={(e) => handleCheckboxKeyDown(e, c._id, index)}
                ref={(el) => (categoryCheckboxesRef.current[index] = el)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)} ref={(el) => (priceRadiosRef.current = el)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio
                    value={p.array}
                    onKeyDown={(e) => handleRadioKeyDown(e, p.array)}
                  >
                    {p.name}
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="home-page col-md-9 offset-1">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((p, index) => (
              <div
                className="card m-2"
                style={{ width: "18rem" }}
                key={p._id}
                tabIndex="0"
                onKeyDown={(e) => handleProductCardKeyDown(e, index)}
                ref={(el) => (productCardsRef.current[index] = el)}
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
                  <button
                    className="btn btn-secondary ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Item Added to cart");
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
                onKeyDown={handleLoadMoreKeyDown}
                tabIndex="0"
              >
                {loading ? "Loading ..." : <>Loadmore<AiOutlineReload /></>}
              </button>
            )}
          </div>
        </div>
      </div>
      <TextToSpeechComponent speakFn={introduceNavigationOptions} /> {/* Pass the function directly */}
    </Layout>
  );
};

export default HomePage;

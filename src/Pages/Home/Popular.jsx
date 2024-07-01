import React, { useEffect, useState } from "react";
import Api from "../Utills/Api";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function Popular({ refreshCart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [getProduct, setGetProduct] = useState([]);
  const itemsPerPage = 3;
  const [cartItems, setCartItems] = useState({});
  const [stock, setStock] = useState({});
  const uid = localStorage.getItem("user_id");
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([getMostPopular(), getCartItems(), getStock()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getMostPopular = async () => {
    try {
      if (uid) {
        // If uid exists, fetch most-popular/ API
        const response = await Api.get("api/most-popular/");
        setGetProduct(response.data);
      } else {
        const response = await axios.get(
          "https://app.frozenwala.com/base/api/most-popular/"
        );
        setGetProduct(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMostPopular();
  }, []);

  const handleScroll = (direction) => {
    if (direction === "prev") {
      setCurrentSlide((prevSlide) =>
        prevSlide === 0
          ? Math.ceil(getProduct.length / itemsPerPage) - 1
          : prevSlide - 1
      );
    } else {
      setCurrentSlide((prevSlide) =>
        prevSlide === Math.ceil(getProduct.length / itemsPerPage) - 1
          ? 0
          : prevSlide + 1
      );
    }
  };

  const visibleItems = [];
  for (let i = 0; i < getProduct.length; i += itemsPerPage) {
    visibleItems.push(getProduct.slice(i, i + itemsPerPage));
  }

  const getCartItems = async () => {
    try {
      const response = await Api.get(`api/get_cart/?user_id=${uid}`);
      const cartItemsMap = {};
      response.data.forEach((item) => {
        cartItemsMap[item.product_id] = item.quantity;
      });
      setCartItems(cartItemsMap);
    } catch (error) {
      console.log("Error fetching cart items:", error);
    }
  };

  const getStock = async () => {
    try {
      const response = await Api.get(`api/stock/`);
      const stockMap = {};
      response.data.forEach((item) => {
        stockMap[item.item_id] = item.openingstock;
      });
      setStock(stockMap);
    } catch (error) {
      console.log("Error getting stock:", error);
    }
  };

  const onPressAddToCart = async (productId) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const response = await Api.post(`api/add_to_cart/`, {
          product_id: productId,
          u_id: uid,
        });

        console.log("Product added to cart:", response.data);
        setCartItems((prevCartItems) => ({
          ...prevCartItems,
          [productId]: (prevCartItems[productId] || 0) + 1,
        }));
        refreshCart(); // Refresh cart count
      } catch (error) {
        console.log("Error adding product to cart:", error);
      }
    } else {
      navigate("/login");
    }
  };

  const addOne = async (productId) => {
    try {
      if (stock[productId] > cartItems[productId]) {
        const response = await Api.post(`api/increase/main/`, {
          product_id: productId,
          user_id: uid,
        });
        setCartItems((prevCartItems) => ({
          ...prevCartItems,
          [productId]: (prevCartItems[productId] || 0) + 1,
        }));
        refreshCart(); // Refresh cart count

        console.log("Quantity increased:", response.data);
      } else {
        console.log("Only", stock["item_id"], "available. You cannot add more");
      }
    } catch (error) {
      console.log("Error increasing quantity:", error);
    }
  };

  const subOne = async (productId) => {
    try {
      if (cartItems[productId] > 1) {
        const response = await Api.post(`api/decrease/main/`, {
          product_id: productId,
          user_id: uid,
        });
        setCartItems((prevCartItems) => ({
          ...prevCartItems,
          [productId]: prevCartItems[productId] - 1,
        }));
        refreshCart(); // Refresh cart count

        console.log("Quantity decreased:", response.data);
      } else {
        const response = await Api.post(`api/decrease/main/`, {
          product_id: productId,
          user_id: uid,
        });
        setCartItems((prevCartItems) => {
          const updatedCartItems = { ...prevCartItems };
          delete updatedCartItems[productId];
          return updatedCartItems;
        });
        refreshCart(); // Refresh cart count

        console.log("Quantity decreased:", response.data);
      }
    } catch (error) {
      console.log("Error decreasing quantity:", error);
    }
  };

  return (
    <div>
      <section className="py-4 overflow-hidden">
        <div className="container">
          <div className="row h-100">
            <div className="col-lg-7 mx-auto text-center mt-7 mb-5">
              <h5 className="fw-bold fs-3 fs-lg-5 lh-sm">Popular items</h5>
            </div>
            <div className="col-12">
              <div className="carousel slide" id="carouselPopularItems">
                <div className="carousel-inner">
                  {visibleItems.map((slideItems, slideIndex) => (
                    <div
                      key={slideIndex}
                      className={`carousel-item ${slideIndex === currentSlide ? "active" : ""}`}
                    >
                      <div className="row gx-3 h-100 align-items-center justify-content-center">
                        {slideItems.map((item) => (
                          <div className="col-md-4" key={item.id}>
                            <div className="card card-span h-100 rounded-3">
                              <img
                                className="img-fluid rounded-3 h-100"
                                src={`http://app.frozenwala.com/${item.item_photo}`}
                                alt={item.title}
                              />
                              <div className="card-body ps-0">
                                <h5 className="fw-bold text-1000 text-truncate mb-1">
                                  {item.title}
                                </h5>
                                <span className="text-1000 fw-bold">
                                  ${item.item_new_price}
                                </span>
                              </div>
                            </div>
                            <div className="d-grid gap-2">
                              {stock[item.id] === 0 ? (
                                <button
                                  className="badge bg-soft-success p-2"
                                  style={{
                                    borderWidth: 0,
                                    cursor: "not-allowed",
                                  }}
                                  type="button"
                                  disabled
                                >
                                  <span className="fw-bold fs-1 text-success">
                                    Sold Out
                                  </span>
                                </button>
                              ) : (
                                <>
                                  {cartItems[item.id] ? (
                                    <div
                                      className="badge bg-soft-success p-2"
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                      }}
                                    >
                                      <button
                                        onClick={() => subOne(item.id)}
                                        style={{ borderWidth: 0, fontSize: 24 }}
                                      >
                                        -
                                      </button>
                                      <span
                                        style={{ color: "black", fontSize: 18 }}
                                      >
                                        {cartItems[item.id]}
                                      </span>
                                      <button
                                        onClick={() => addOne(item.id)}
                                        style={{ borderWidth: 0, fontSize: 24 }}
                                      >
                                        +
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      style={{ borderWidth: 0 }}
                                      type="button"
                                      onClick={() => onPressAddToCart(item.id)}
                                      className="btn btn-lg btn-danger"
                                    >
                                      Order now
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev carousel-icon"
                  type="button"
                  data-bs-target="#carouselPopularItems"
                  data-bs-slide="prev"
                  onClick={() => handleScroll("prev")}
                >
                  <span
                    className="carousel-control-prev-icon hover-top-shadow"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next carousel-icon"
                  type="button"
                  data-bs-target="#carouselPopularItems"
                  data-bs-slide="next"
                  onClick={() => handleScroll("next")}
                >
                  <span
                    className="carousel-control-next-icon hover-top-shadow"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Popular;

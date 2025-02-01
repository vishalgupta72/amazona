import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyContext from "../MyContext";
import useTitle from "../hooks/title";
import { fetchHeaders } from "../helpers";
import { API_BASE_URL } from "../config";

function Home() {
  useTitle("Home");

  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`, { headers: fetchHeaders() })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProducts((p) => data.entrys);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function addToCart(product) {
    const { ...productData } = product;
    productData.buyQuantity = 1;
    console.log(context.state.cart);
    
    if (context.state.cart.filter((p) => p._id === product._id).length > 0)
      return;

    context.state.cart.push(productData);
    context.dispatchCart((_) => context.state.cart);
  }

  function buyNow(product) {
    context.state.cart = [];
    context.state.cart.push(product);
    context.dispatchCart((_) => context.state.cart);
    navigate("/checkout");
  }

  return (
    <div className="page">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-around gap-2">
          {products &&
            products.map((p) => (
              <div className="product__card card" key={p._id}>
                <img src={p.image} className="card-img-top" alt="..." />
                <div className="card-body">
                  <Link to={"/product/" + p._id}>
                    <h5 className="card-title">{p.name}</h5>
                  </Link>
                  <p className="card-text">₹{p.price}</p>
                  <div className="d-flex justify-content-around">
                    <button
                      to="/product"
                      className="btn btn-warning"
                      onClick={() => {
                        buyNow(p);
                      }}
                    >
                      Buy Now
                    </button>
                    <button
                      to="/cart"
                      className="btn btn-warning"
                      onClick={() => {
                        addToCart(p);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export default Home;

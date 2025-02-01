import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MyContext from "../MyContext";
import { fetchHeaders } from "../helpers";
import Reviews from "../components/Reviews"
// import { API_BASE_URL } from "../config";


function Product() {

    const [product, setProduct] = useState()
    const { id } = useParams()

    const context = useContext(MyContext);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`, { headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.entry) {
                console.log(data.entry);
                setProduct(p => (data.entry))
                document.title = `${data.entry.name} | ${process.env.REACT_APP_NAME}`
            }
        }).catch((error) => {
            console.log(error);
        })
    }, [id])


    function getRating() {
        let rating = 0
        if (!product.reviews)
            return 0;

        product.reviews.forEach((re) => {
            rating += re.rating
        });
        return rating
    }

    function addToCart() {
        let u = localStorage.getItem("token");
        console.log(u);

        if(u ===  null){
            console.log("login please")
        }
        context.state.cart.push(product)
        context.dispatchCart(context.state.cart)
    }

    return (
        <div className="page product__page">
            {product && <div className="container row m-auto mt-5">
                <div className="col-md-6">
                    <img src={product.image} alt="" />
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-sm-6 p-2">
                            <div><strong>Name: </strong>{product.name}</div>
                            <hr />
                            <div><strong>Brand: </strong> {product.brand}</div>
                            <hr />
                            <div><strong>Description: </strong> <p>{product.description}</p></div>
                            <hr />
                            <div className="stars">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span key={i} className={i < getRating() ? 'star filled' : 'star'}>&#9733;</span>
                                ))}
                            </div>
                        </div>
                        <div className="card col-sm-6 p-3">
                            <strong>Seller: </strong>
                            <hr />
                            <span>{product.brand}</span>
                            <hr />
                            <div><strong>Price: </strong> {product.price}</div>
                            <hr />
                            <div><strong>Status: </strong> {product.price ? 'In Stock' : 'Out of Stock'}</div>
                            <hr />
                            <button className="btn btn-warning" onClick={addToCart}>Add To Cart</button>

                        </div>
                    </div>
                </div>
                <div className="col mt-5">
                    {product && <Reviews productId={id} productReviews={product.reviews} />}
                </div>
            </div>}
        </div>
    );
}
export default Product;
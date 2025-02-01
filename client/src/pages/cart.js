import { useContext, useEffect, useState } from "react";
import MyContext from "../MyContext";
import useTitle from "../hooks/title";
import { Link } from "react-router-dom";


function Cart() {

    useTitle("Shopping Cart")

    const context = useContext(MyContext);
    const [products, setProducts] = useState(context.state.cart)
    const [subTotal, setSubTotal] = useState(0)
    const [counts, setCounts] = useState(0)

    useEffect(() => {
        let st = 0
        let cs = 0
        st = products
          .map((p) => p.price * p.buyQuantity)
          .reduce((a, b) => a + b, 0);
        cs = products.map((p) => p.buyQuantity).reduce((a, b) => a + b, 0);
        setSubTotal(st)
        setCounts(cs)

        context.dispatchCart([...products])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [products])

    function updateQuantity(_id, buyQuantity) {
        products.filter(prod => prod._id === _id)[0].buyQuantity = buyQuantity
        setProducts([...products])
    }
    function removeProduct(_id) {
        setProducts([...products.filter(prod => prod._id !== _id)])
    }

    function increment(product) {
        if (product.buyQuantity < product.quantity) ++product.buyQuantity;
        return product.buyQuantity;
    }
    function decrement(product) {
        if (product.buyQuantity > 0) --product.buyQuantity;
        return product.buyQuantity;
    }


    return (
        <div className="page">
            <h2 className="text-center">Cart</h2>
            <div className="container row m-auto">
                <div className="col-lg-8">
                    {products && products.map(product =>
                        <div className="row mb-3 py-2 border" key={product._id}>
                            <div className="col-sm-1">
                                <img src={product.image} alt="" />
                            </div>
                            <div className="col">
                                <Link to={"/product/" + product._id}>{product.name}</Link>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col"><span className="btn btn-secondary" onClick={() => { updateQuantity(product._id, decrement(product)) }}>-</span></div>
                                    <div className="col"><strong>{product.buyQuantity}</strong></div>
                                    <div className="col"><span className="btn btn-secondary" onClick={() => { updateQuantity(product._id, increment(product)) }}>+</span></div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="row">
                                    <div className="col"><strong>${product.price}</strong></div>
                                    <div className="col"><span className="btn btn-danger" onClick={() => { removeProduct(product._id) }}>X</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="col-lg-3 card">
                    <div className="card-body">
                        <strong>Subtotal ({counts} items): ${subTotal}</strong>
                        <Link to={"/checkout"} className="btn btn-warning m-3">Proceed to Checkout</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Cart;
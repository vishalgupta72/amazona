import { useContext, useEffect, useState } from "react";
import MyContext from "../MyContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchHeaders } from "../helpers";
import useTitle from "../hooks/title";
import { API_BASE_URL } from "../config";


function OrderDetails() {

    useTitle("Order")

    const [subTotal, setSubTotal] = useState(0)
    const [doPayment, setDoPayment] = useState(true)

    const [order, setOrder] = useState()
    const { id } = useParams()

    const navigate = useNavigate()
    const context = useContext(MyContext);

    useEffect(() => {
        if (!localStorage.getItem("token"))
            navigate("/signin")

        fetch(`${API_BASE_URL}/orders/${id}`, { headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.entry) {
                setOrder({ ...data.entry })
                setSubTotal(data.entry.cart.products.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0))
            }
        }).catch((error) => {
            console.log(error);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function getTotal() {
        return (subTotal < 100 ? 10 : 0) + (subTotal * 15 / 100) + (subTotal * 15 / 100) + subTotal
    }

    function placeOrder() {
        order.cart.subTotal = subTotal
        order.tax = subTotal * 15 / 100
        order.total = getTotal()
        order.checkout = true
        delete order._id

        setOrder({ ...order })


        console.log(
            JSON.stringify(order)
        );

        fetch(`${API_BASE_URL}/add-order`, { method: "POST", body: JSON.stringify({ order }), headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.status === "success") {
                setOrder({ ...data.entry })
                context.dispatchCart([])
            }
        }).catch((error) => {
            console.log(error);
        })
        setDoPayment(true)
    }
    function afterPayment() {
        fetch(`${API_BASE_URL}/pay-order${order._id}` , { headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.status === "success") {
                setOrder({ ...data.entry })
            }
        }).catch((error) => {
            console.log(error);
        })
        alert("Your order has been placed.")
    }
    function makePaymentUsingPayPal() {
        afterPayment()
    }
    function makePaymentUsingCard() {
        afterPayment()
    }


    if (order)
        return (
            <div className="page">
                <h2 className="text-center m-5">{doPayment ? `Order ${order._id}` : 'Preview Order'}</h2>

                <div className="container m-auto row">
                    <div className="col-md-7">
                        <div className="row">
                            <h5>Shipping</h5>
                            <div>
                                <strong>Name: </strong>
                                <span>{order.shippingDetails.fullName}</span>
                            </div>
                            <div>
                                <strong>Address: </strong>
                                <span>{order.shippingDetails.address}</span>
                            </div>
                            {order.delivered ? <div className="bg-success p-3 rounded text-light">Delivered </div> : <div className="bg-danger p-3 rounded text-light">Not Delivered </div>
                            }
                        </div>
                        <div className="row mt-5">
                            <h5>Payment</h5>
                            <div>
                                <strong>Method: </strong>
                                <span>{order.paymentMode}</span>
                            </div>
                            {order.paid ? <div className="bg-success p-3 rounded text-light">Paid </div> : <div className="bg-danger p-3 rounded text-light">Not Paid </div>
                            }
                        </div>
                        <div className="row mt-5">
                            <h5>Items</h5>
                            <div>
                                {order.cart.products && order.cart.products.map(c =>
                                    <div className="row mb-3 py-2 border" key={c._id}>
                                        <div className="col-sm-1">
                                            <img src={c.image} alt="" />
                                        </div>
                                        <div className="col">
                                            <Link to={"/product/" + c._id}><small>{c.name}</small></Link>
                                        </div>
                                        <div className="col">
                                            <div className="row">
                                                <div className="col"><strong>{c.quantity}</strong></div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="row">
                                                <div className="col"><strong>${c.price}</strong></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {order.paid || (doPayment || <div><Link to={"/cart"} className="btn btn-primary">EDIT</Link></div>)}
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card p-2">
                            <h5>Order Summary</h5>
                            <div className="row my-1">
                                <div className="col">Items</div>
                                <div className="col">${subTotal}</div>
                            </div>
                            <div className="row my-1">
                                <div className="col">Shipping</div>
                                <div className="col">${subTotal < 100 ? 10 : 0}</div>
                            </div>
                            <div className="row my-1">
                                <div className="col">Tax</div>
                                <div className="col">${(subTotal * 15 / 100)}</div>
                            </div>
                            <div className="row my-1">
                                <div className="col fw-bold">Order Total</div>
                                <div className="col fw-bold">${getTotal()}</div>
                            </div>
                            {order.paid || (doPayment
                                ? <div className="row mx-1 my-2">
                                    <button onClick={() => { makePaymentUsingPayPal() }} className="btn btn-warning text-center py-0 my-1"><small>PayPal</small></button>
                                    <button onClick={() => { makePaymentUsingCard() }} className="btn bg-dark text-center text-light py-0 my-1"><small>Debit or Credit Card</small></button>
                                </div>
                                : <div className="row mx-1 my-2"><button onClick={() => { placeOrder() }} className="btn btn-warning text-center">Place Order</button></div>)
                            }

                        </div>
                    </div>
                </div>
            </div>
        );

    else (
        <div className="page">
            <h2>Loading...</h2>
        </div>
    )
}
export default OrderDetails;
import { useContext, useEffect, useState } from "react";
import MyContext from "../MyContext";
import useTitle from "../hooks/title";
import { Link, useNavigate } from "react-router-dom";
import { fetchHeaders } from "../helpers";
// import { API_BASE_URL } from "../config";


function Checkout() {

    useTitle("Checkout")

    const [section, setSection] = useState("signin")
    const [subTotal, setSubTotal] = useState(0)
    const [doPayment, setDoPayment] = useState(false)

    const [order, setOrder] = useState({
        _id: "",
        cart: {},
        shippingDetails: {
            fullName: "",
            address: "",
            city: "",
            pincode: 0,
            phone: 0,
            country: ""

        },
        paymentMode: "paypal",
        paid: false,
        delivered: false,
        checkout: false
    })

    const navigate = useNavigate()
    const context = useContext(MyContext);

    useEffect(() => {
        if (!localStorage.getItem("token"))
            navigate("/signin")
        else
            setSection("shipping")
        updateSubTotal()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function shippingDetails(e) {
        e.preventDefault()
        setSection("payment")
    }
    function updateSubTotal() {
        setSubTotal(context.state.cart.map(p => p.price * p.quantity).reduce((a, b) => a + b, 0))
    }
    function getTotal() {
        return (subTotal < 100 ? 10 : 0) + (subTotal * 15 / 100) + (subTotal * 15 / 100) + subTotal
    }
    function payment(e) {
        e.preventDefault()
        setSection("order")
    }
    function placeOrder() {
        order.cart.products = context.state.cart
        order.cart.subTotal = subTotal
        order.tax = subTotal * 15 / 100
        order.total = getTotal()
        order.checkout = true
        delete order._id

        setOrder({ ...order })


        console.log(
            JSON.stringify(order)
        );

        fetch(`${process.env.REACT_APP_API_BASE_URL}/add-order`, { method: "POST", body: JSON.stringify({ order }), headers: fetchHeaders() }).then((response) => {
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
        fetch(`${process.env.REACT_APP_API_BASE_URL}/pay-order/${order._id}`, { headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.status === "success") {
                setOrder({ ...data.entry })
            }
        }).catch((error) => {
            console.log(error);
        })
        alert("Your order has been placed. from checkout")
    }
    function makePaymentUsingPayPal() {
        afterPayment()
    }
    function makePaymentUsingCard() {
        afterPayment()
    }


    if (section === "shipping")
        return (
            <div className="page">
                <h2 className="text-center m-5">Shipping Address</h2>
                <div className="container m-auto">
                    <form onSubmit={shippingDetails}>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input type="text" className="form-control" id="fullName" name="fullName" value={order.shippingDetails.fullName} onChange={(e) => { order.shippingDetails.fullName = e.target.value; setOrder({ ...order }) }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input type="text" className="form-control" id="address" name="address" value={order.shippingDetails.address} onChange={(e) => { order.shippingDetails.address = e.target.value; setOrder({ ...order }) }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="city" className="form-label">City</label>
                            <input type="text" className="form-control" id="city" name="city" value={order.shippingDetails.city} onChange={(e) => { order.shippingDetails.city = e.target.value; setOrder({ ...order }) }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="postalCode" className="form-label">Postal Code</label>
                            <input type="text" className="form-control" id="postalCode" name="postalCode" value={order.shippingDetails.pincode} onChange={(e) => { order.shippingDetails.pincode = e.target.value; setOrder({ ...order }) }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="country" className="form-label">Country</label>
                            <input type="text" className="form-control" id="country" name="country" value={order.shippingDetails.country} onChange={(e) => { order.shippingDetails.country = e.target.value; setOrder({ ...order }) }} />
                        </div>
                        <div className="row m-1"><button type="submit" className="btn btn-secondary">Submit</button></div>
                    </form>
                </div>
            </div>
        );

    else if (section === "payment")
        return (
            <div className="page">
                <h2 className="text-center m-5">Payment Mode</h2>
                <div className="container m-auto">
                    <form onSubmit={payment}>
                        <small>{order.paymentMode}</small>
                        <div className="mb-3">
                            <label>
                                <input name="paymentMode" type="radio" checked={order.paymentMode === "paypal"} value="paypal" onChange={(e) => { order.paymentMode = e.target.value; setOrder({ ...order }) }} />
                                PayPal
                            </label>
                        </div>
                        <div className="mb-3">
                            <label>
                                <input name="paymentMode" type="radio" checked={order.paymentMode === "stripe"} value="stripe" onChange={(e) => { order.paymentMode = e.target.value; setOrder({ ...order }) }} />
                                Stripe
                            </label>
                        </div>
                        <div className="row m-1"><button type="submit" className="btn btn-secondary">Continue</button></div>
                    </form>
                </div>
            </div>
        );

    else if (section === "order")
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
                            {doPayment
                                ? order.delivered &&<div className="bg-danger p-3 rounded text-light">Not Delivered </div>
                                : <div><button className="btn btn-primary" onClick={() => { setSection("shipping") }}>EDIT</button></div>
                            }
                        </div>
                        <div className="row mt-5">
                            <h5>Payment</h5>
                            <div>
                                <strong>Method: </strong>
                                <span>{order.paymentMode}</span>
                            </div>
                            {doPayment
                                ? order.paid ?<div className="bg-success p-3 rounded text-light">Paid </div>:<div className="bg-danger p-3 rounded text-light">Not Paid </div>
                                : <div><button className="btn btn-primary" onClick={() => { setSection("payment") }}>EDIT</button></div>
                            }
                        </div>
                        <div className="row mt-5">
                            <h5>Items</h5>
                            <div>
                                {context.state.cart && context.state.cart.map(c =>
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
                            {doPayment || <div><Link to={"/cart"} className="btn btn-primary">EDIT</Link></div>}
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
export default Checkout;
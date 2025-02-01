import { useEffect, useState } from "react";
import useTitle from "../hooks/title";
import { fetchHeaders } from "../helpers";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";


function OrderHistory() {

    useTitle("Order History")
    const [orders, setOrders] = useState([])

    useEffect(() => {
        fetch(`${API_BASE_URL}/orders`, { headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            // console.log(data);
            if (data.entrys) {
                setOrders([...data.entrys])
            }
        }).catch((error) => {
            console.log(error);
        })
    }, [])



    return (
        <div className="page">
            <div className="container">
                <h1>Order History</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">DATE</th>
                            <th scope="col">TOTAL</th>
                            <th scope="col">PAID</th>
                            <th scope="col">DELIVERED</th>
                            <th scope="col">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && orders.map(order =>
                            <tr key={order._id}>
                                <th scope="row">{order._id}</th>
                                <td>{order.date.split("T")[0]}</td>
                                <td>{order.total}</td>
                                <td>{order.paid ? "Yes" : "No"}</td>
                                <td>{order.delivered ? "Yes" : "No"}</td>
                                <td><Link to={"/orders/"+order._id}>Details</Link></td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default OrderHistory;
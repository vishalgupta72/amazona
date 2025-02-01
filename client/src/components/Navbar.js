import { Link } from "react-router-dom";
// import Search from "./Search";
import { fetchHeaders } from "../helpers";
import { useEffect, useState } from "react";
import { useContext } from "react";
import MyContext from "../MyContext";
// import { API_BASE_URL } from "../config";

export default function Navbar() {
    const context = useContext(MyContext);

    const [cartLength, setCartLength] = useState(0);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/user`, { headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.user) {
                context.dispatchUser(data.user)
            }
        }).catch((error) => {
            console.log(error);
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
      setCartLength(context.state.cart.length);
    }, [context.state]);



    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bolder" to={"/"}>Amazona</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* <Search /> */}
                    <input className="form-control w-25 mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {context.state.user &&
                            <li className="nav-item dropdown">
                                <strong className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {context.state.user.firstName}
                                </strong>
                                <ul className="dropdown-menu bg-dark" aria-labelledby="navbarDropdown">
                                    <Link className="nav-link" to={"/profile"}>Profile</Link>
                                    <Link className="nav-link" to={"/orders"}>Order History</Link>
                                    <Link className="nav-link" to={"/signout"}>Signout</Link>
                                </ul>
                            </li>}
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to={"/"}>Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to={"/cart"}>Cart <span className="bg-danger rounded px-1">{cartLength}</span></Link>
                        </li>
                        {!context.state.user && <li className="nav-item">
                            <Link className="nav-link" to={"/signin"}>Login</Link>
                        </li>}
                        {/* {!context.state.user && <li className="nav-item">
                            <Link className="nav-link" to={"/signup"}>Signup</Link>
                        </li>} */}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
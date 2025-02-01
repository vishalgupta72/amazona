import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchHeaders, setAuthToken } from "../helpers";
import MyContext from "../MyContext";
// import { API_BASE_URL } from "../config";

function SignIn() {
    const navigate = useNavigate()
    const context = useContext(MyContext);
    const [loading, setLoading] = useState(false);

    function signinHandler(event) {
        event.preventDefault();
        setLoading(true);

        const email = event.target.email.value;
        const password = event.target.password.value;
        fetch(`${process.env.REACT_APP_API_BASE_URL}/signin`, { method: "POST", body: JSON.stringify({ email, password }), headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.token) {
                setLoading(false)
                setAuthToken(data.token);
                context.dispatchUser(data.user)
                navigate(-1)
            }
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }

    return (
        <div className="page">
            <div className="container h-100 mx-auto card p-5">
            { loading? <div className="col-md-12 mt-3 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> :''}
                <form onSubmit={signinHandler}>
                    <h2 className="text-center mb-3">SignIn</h2>
                    <div className="form-group">
                        <label htmlFor="email">Email address:</label>
                        <input type="email" className="form-control" id="email" name="email" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" className="form-control" id="password" name="password" placeholder="Enter password" />
                    </div>
                    <div className="row p-3 my-2">
                        <button type="submit" className="btn btn-secondary">Submit</button>
                    </div>
                    <p>Don't have an account? <Link to={"/signup"}>Sign up</Link></p>
                </form>
            </div>
        </div>
    );
}

export default SignIn;

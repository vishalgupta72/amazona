import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function SignUp() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    function signupHandler(event) {
        event.preventDefault();
        setLoading(true);

        const firstName = event.target.firstName.value;
        const lastName = event.target.lastName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
        fetch("http://localhost:4000/signup", {
            method: "POST", body: JSON.stringify({ firstName, lastName, email, password }), headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.status === "success") {
                navigate(-1)
            }
            // console.log(data);
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }

    return (
        <div className="page">
            <div className="container my-auto">
                <div className="card p-5">
                { loading? <div className="col-md-12 mt-3 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div> :''}
                    <h2 className="text-center mb-3">Sign Up</h2>
                    <form onSubmit={signupHandler}>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input type="text" className="form-control" id="firstName" name="firstName" placeholder="Enter your First name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" className="form-control" id="lastName" name="lastName" placeholder="Enter your Last name" />
                        </div>
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
                    </form>
                    <p>Already have an account? <Link to={"/signin"}>Sign in</Link></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;

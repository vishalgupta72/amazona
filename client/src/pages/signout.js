import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyContext from "../MyContext";

function SignOut() {
    const navigate = useNavigate()
    const context = useContext(MyContext);

    useEffect(() => {
        localStorage.removeItem("token")
        context.dispatchUser({})
        setTimeout(() => {
            navigate("/")
        }, 2000);
    })

    return (
        <div className="page">
            <div className="container h-100 mx-auto card p-5">
                <h2 className="text-center mb-3">SignOut</h2>
                <strong>You Sign out successfully. And you will redirect to home in 2 seconds.</strong>
            </div>
        </div>
    );
}

export default SignOut;

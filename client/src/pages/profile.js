import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyContext from "../MyContext";


function Profile() {
    const navigate = useNavigate()

    useEffect(() => {
        if (!localStorage.getItem("token"))
            navigate("/signin")
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const context = useContext(MyContext);

    return (
        <div className="page product__page">
            {context.state.user && <div className="container row m-auto mt-5">
                <div className="col-sm-6">
                    <div>
                        <strong>First Name: </strong>
                    </div>
                    <hr />
                    <div>
                        <strong>Last Last: </strong>
                    </div>
                    <hr />
                    <div>
                        <strong>Account Type: </strong>
                    </div>
                    <hr />
                    <div>
                        <strong>Email: </strong>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div>
                        <span>{context.state.user.firstName}</span>
                    </div>
                    <hr />
                    <div>
                        <span>{context.state.user.lastName}</span>
                    </div>
                    <hr />
                    <div>
                        <span>{context.state.user.accountType}</span>
                    </div>
                    <hr />
                    <div>
                        <span>{context.state.user.email}</span>
                    </div>
                </div>
            </div>}
        </div>
    );
}
export default Profile;
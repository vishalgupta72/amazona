import { useEffect, useState } from "react";
import { fetchHeaders } from "../helpers";
// import { API_BASE_URL } from "../config";

export default function Reviews({ productId, productReviews }) {
    const [reviews, setReviews] = useState([])

    function addReviewHandler(event) {
        event.preventDefault();

        const comment = event.target.comment.value;
        const rating = event.target.rating.value;
        fetch(`${process.env.REACT_APP_API_BASE_URL}/add-review/${productId}` , { method: "POST", body: JSON.stringify({ comment, rating }), headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.entrys)
                setReviews(r => (data.entrys))
        }).catch((error) => {
            console.log(error);
            setReviews(r => ([]))
        })
    }

    useEffect(() => {
        setReviews(productReviews)
    }, [productReviews])


    return (
        <div>
            <h2>Reviews: -</h2>
            <div>
                <div className="">
                    {reviews.map(r =>
                        <div key={r._id} className="p-2">
                            <strong>{r.name ?? 'anonymous'}</strong>
                            <div className="stars">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span key={i} className={i < r.rating ? 'star filled' : 'star'}>&#9733;</span>
                                ))}
                            </div>
                            <p>{r.comment}</p>
                            <hr />
                        </div>
                    )}
                </div>
            </div>
            <form className="col" onSubmit={addReviewHandler}>
                <h4>Add rating and comment: </h4>
                <label htmlFor="rating" className="my-2">Rating:
                    <select className="form-select" name="rating" id="rating">
                        <option value="1">1 rating</option>
                        <option value="2">2 rating</option>
                        <option value="3">3 rating</option>
                        <option value="4">4 rating</option>
                        <option value="5">5 rating</option>
                    </select>
                </label>

                <input className="form-control my-2" type="text" name="comment" placeholder="comment" />
                <button className="btn btn-outline-success" type="submit">Submit</button>
            </form>
        </div>
    )
}
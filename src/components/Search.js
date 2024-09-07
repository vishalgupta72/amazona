import { useState } from "react";
import { Link } from "react-router-dom";
import { fetchHeaders } from "../helpers";

export default function Search() {
    const [results, setResults] = useState([])

    function searchHandler(event) {
        event.preventDefault();

        const search = event.target.search.value;
        fetch("http://localhost:4000/search?s=" + search, { headers: fetchHeaders() }).then((response) => {
            return response.json();
        }).then((data) => {
            // console.log(data);
            setResults(r => (data.entrys ?? []))
        }).catch((error) => {
            console.log(error);
            setResults(r => ([]))
        })
    }
    return (
        <div>
            <form className="d-flex" onSubmit={searchHandler}>
                <input className="form-control me-2" type="search" name="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-warning" type="submit">Search</button>
            </form>
            <div>
                <ul className="text-light">
                    {results && results.map(r =>
                        <li key={"r._id"} className="p-2"><Link to={"/product/" + r._id} className="text-decoration-none">{r.name}</Link></li>
                    )}
                </ul>
            </div>
        </div>
    )
}
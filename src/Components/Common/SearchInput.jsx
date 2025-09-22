import React, { useEffect, useState } from "react";
import "./style.css";
import { IoIosSearch } from "react-icons/io";

const SearchInput = ({ data, searchKey, placeholder, setSearchData }) => {
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!data) return;
        const filtered = data.filter((item) =>
            item[searchKey]?.toLowerCase().includes(search.toLowerCase())
        );
        setSearchData(filtered);
    }, [search, data, searchKey, setSearchData]);

    return (
        <div className="position-relative w-75 m-auto ">
            <div className="position-absolute" style={{ top: "8px", right: "10px" }}>
                <IoIosSearch size={22} />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className="search-bar d-flex justify-content-center align-items-center m-auto rounded rounded-3 w-100 mb-5 p-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
};

export default SearchInput;

import React from "react";
import {
  FaSearch,
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaChevronDown,
} from "react-icons/fa";
function SearchBox() {
  return (
    <>
      <div className="flex-grow w-full sm:w-auto max-w-xl mx-auto font">
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="flex-grow outline-none"
          />
        </div>
      </div>
    </>
  );
}

export default SearchBox;

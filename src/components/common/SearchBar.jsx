import { FiSearch, FiX } from "react-icons/fi";
import "./SearchBar.css";

export default function SearchBar({ value, onChange, placeholder = "Search products...", autoFocus = false }) {
  return (
    <div className="search-bar">
      <FiSearch className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search products"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")} aria-label="Clear search">
          <FiX />
        </button>
      )}
    </div>
  );
}

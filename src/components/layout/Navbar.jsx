import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiGrid,
  FiHeart,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCatalog } from "../../context/CatalogContext";
import { CategoryIcon } from "../common/categoryIcons";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const accountRef = useRef(null);
  const navigate = useNavigate();

  const { currentUser, profile, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const { categories } = useCatalog();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [navigate]);

  useEffect(() => {
    function onClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submitSearch(e) {
    e.preventDefault();
    navigate(searchValue.trim() ? `/products?q=${encodeURIComponent(searchValue.trim())}` : "/products");
    setSearchOpen(false);
    setSearchValue("");
  }

  function goToCategory(slug) {
    navigate(`/products?category=${slug}`);
    setCategoriesOpen(false);
    setMenuOpen(false);
  }

  async function handleLogout() {
    await logout();
    setAccountOpen(false);
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">
          Miss <span>Sunflower</span>
        </NavLink>

        <nav className={`navbar-links ${menuOpen ? "is-open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link ${isActive ? "is-active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}

          <div
            className="nav-dropdown"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              className="nav-link nav-dropdown-toggle"
              onClick={() => setCategoriesOpen((v) => !v)}
            >
              Categories <FiChevronDown />
            </button>
            {categoriesOpen && (
              <div className="nav-dropdown-menu">
                {categories.length === 0 && <span className="nav-dropdown-empty">No categories yet</span>}
                {categories.map((cat) => (
                  <button key={cat.id} onClick={() => goToCategory(cat.slug)}>
                    <CategoryIcon icon={cat.icon} /> {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile-only auth links inside the slide-down menu */}
          <div className="navbar-mobile-auth">
            {currentUser ? (
              <>
                {isAdmin && <NavLink to="/admin">Admin Dashboard</NavLink>}
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login">Sign In</NavLink>
                <NavLink to="/register">Create Account</NavLink>
              </>
            )}
          </div>
        </nav>

        <div className="navbar-actions">
          <div className={`navbar-search ${searchOpen ? "is-open" : ""}`}>
            <form onSubmit={submitSearch}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
              />
            </form>
          </div>
          <button
            className="icon-btn"
            aria-label="Toggle search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <FiSearch />
          </button>

          <NavLink to="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <FiShoppingBag />
            {count > 0 && <span className="badge-count">{count}</span>}
          </NavLink>

          <div className="account-menu" ref={accountRef}>
            <button
              className="icon-btn"
              aria-label="Account"
              onClick={() => setAccountOpen((v) => !v)}
            >
              <FiUser />
            </button>
            {accountOpen && (
              <div className="account-dropdown">
                {currentUser ? (
                  <>
                    <p className="account-greeting">
                      Hi, {profile?.name || currentUser.email.split("@")[0]}
                    </p>
                    <NavLink to="/cart" onClick={() => setAccountOpen(false)}>
                      <FiShoppingBag /> My Cart
                    </NavLink>
                    <NavLink to="/products" onClick={() => setAccountOpen(false)}>
                      <FiHeart /> Wishlist ({profile?.wishlist?.length || 0})
                    </NavLink>
                    {isAdmin && (
                      <NavLink to="/admin" onClick={() => setAccountOpen(false)}>
                        <FiGrid /> Admin Dashboard
                      </NavLink>
                    )}
                    <button onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" onClick={() => setAccountOpen(false)}>
                      Sign In
                    </NavLink>
                    <NavLink to="/register" onClick={() => setAccountOpen(false)}>
                      Create Account
                    </NavLink>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            className="icon-btn menu-toggle"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
}
